// ===== LUMENIS ACADEMY SERVICE WORKER =====
// PWA functionality for offline access and performance

const CACHE_NAME = 'lumenis-academy-v2.0.0';
const STATIC_CACHE = 'lumenis-static-v2.0.0';
const DYNAMIC_CACHE = 'lumenis-dynamic-v2.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/main.js',
    '/js/data.js',
    '/js/cosmic-avatar.js',
    '/manifest.json',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// API endpoints to cache
const API_ENDPOINTS = [
    '/api/courses',
    '/api/library',
    '/api/forum'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Service Worker: Static files cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Error caching static files', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('Service Worker: Deleting old cache', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker: Activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve cached files or fetch from network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.pathname.startsWith('/api/')) {
        // API requests - network first, cache fallback
        event.respondWith(networkFirstStrategy(request));
    } else if (STATIC_FILES.some(file => url.pathname.endsWith(file))) {
        // Static files - cache first, network fallback
        event.respondWith(cacheFirstStrategy(request));
    } else {
        // Other requests - stale while revalidate
        event.respondWith(staleWhileRevalidateStrategy(request));
    }
});

// Cache strategies
async function cacheFirstStrategy(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return new Response('Offline - Content not available', { status: 503 });
    }
}

async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);
        
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', error);
        
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        return new Response(JSON.stringify({
            error: 'Offline - API not available',
            offline: true
        }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

async function staleWhileRevalidateStrategy(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    const fetchPromise = fetch(request).then((networkResponse) => {
        if (networkResponse.ok) {
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    }).catch(() => {
        // Network failed, return cached version if available
        return cachedResponse;
    });
    
    // Return cached version immediately if available, otherwise wait for network
    return cachedResponse || fetchPromise;
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('Service Worker: Background sync triggered', event.tag);
    
    if (event.tag === 'neural-metrics-sync') {
        event.waitUntil(syncNeuralMetrics());
    } else if (event.tag === 'progress-sync') {
        event.waitUntil(syncProgress());
    }
});

async function syncNeuralMetrics() {
    try {
        // Get stored neural metrics from IndexedDB
        const metrics = await getStoredNeuralMetrics();
        
        if (metrics.length > 0) {
            // Send to API
            const response = await fetch('/api/neural/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${await getStoredToken()}`
                },
                body: JSON.stringify({ metrics })
            });
            
            if (response.ok) {
                // Clear stored metrics after successful sync
                await clearStoredNeuralMetrics();
                console.log('Neural metrics synced successfully');
            }
        }
    } catch (error) {
        console.error('Failed to sync neural metrics:', error);
    }
}

async function syncProgress() {
    try {
        // Get stored progress data
        const progressData = await getStoredProgress();
        
        if (progressData.length > 0) {
            for (const progress of progressData) {
                const response = await fetch('/api/courses/progress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${await getStoredToken()}`
                    },
                    body: JSON.stringify(progress)
                });
                
                if (response.ok) {
                    await removeStoredProgress(progress.id);
                }
            }
            
            console.log('Progress synced successfully');
        }
    } catch (error) {
        console.error('Failed to sync progress:', error);
    }
}

// IndexedDB helpers for offline storage
async function getStoredNeuralMetrics() {
    return new Promise((resolve) => {
        const request = indexedDB.open('LumenisDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['neuralMetrics'], 'readonly');
            const store = transaction.objectStore('neuralMetrics');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };
        };
        
        request.onerror = () => {
            resolve([]);
        };
    });
}

async function getStoredToken() {
    // Get authentication token from localStorage
    return localStorage.getItem('lumenisAuthToken') || '';
}

async function clearStoredNeuralMetrics() {
    return new Promise((resolve) => {
        const request = indexedDB.open('LumenisDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['neuralMetrics'], 'readwrite');
            const store = transaction.objectStore('neuralMetrics');
            store.clear();
            
            transaction.oncomplete = () => {
                resolve();
            };
        };
    });
}

async function getStoredProgress() {
    return new Promise((resolve) => {
        const request = indexedDB.open('LumenisDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['progress'], 'readonly');
            const store = transaction.objectStore('progress');
            const getAllRequest = store.getAll();
            
            getAllRequest.onsuccess = () => {
                resolve(getAllRequest.result);
            };
        };
        
        request.onerror = () => {
            resolve([]);
        };
    });
}

async function removeStoredProgress(progressId) {
    return new Promise((resolve) => {
        const request = indexedDB.open('LumenisDB', 1);
        
        request.onsuccess = (event) => {
            const db = event.target.result;
            const transaction = db.transaction(['progress'], 'readwrite');
            const store = transaction.objectStore('progress');
            store.delete(progressId);
            
            transaction.oncomplete = () => {
                resolve();
            };
        };
    });
}

// Push notifications
self.addEventListener('push', (event) => {
    console.log('Service Worker: Push notification received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nova atualização disponível!',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Explorar',
                icon: '/icons/checkmark.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: '/icons/xmark.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Lumenis Academy', options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('Service Worker: Message received', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_NEURAL_DATA') {
        cacheNeuralData(event.data.payload);
    }
});

async function cacheNeuralData(data) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(data));
        await cache.put('/offline/neural-data', response);
        console.log('Neural data cached for offline use');
    } catch (error) {
        console.error('Failed to cache neural data:', error);
    }
}

// Periodic background tasks
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'neural-analysis') {
        event.waitUntil(performNeuralAnalysis());
    }
});

async function performNeuralAnalysis() {
    try {
        // Perform background neural analysis
        const metrics = await getStoredNeuralMetrics();
        
        if (metrics.length > 0) {
            // Analyze patterns and generate insights
            const insights = analyzeNeuralPatterns(metrics);
            
            // Store insights for when user comes back online
            await storeInsights(insights);
        }
    } catch (error) {
        console.error('Background neural analysis failed:', error);
    }
}

function analyzeNeuralPatterns(metrics) {
    // Advanced pattern analysis
    const patterns = {
        focusPatterns: analyzeFocusPatterns(metrics),
        learningVelocity: calculateLearningVelocity(metrics),
        optimalStudyTimes: findOptimalStudyTimes(metrics),
        cognitiveLoad: assessCognitiveLoad(metrics)
    };
    
    return {
        patterns,
        recommendations: generateOfflineRecommendations(patterns),
        timestamp: Date.now()
    };
}

function analyzeFocusPatterns(metrics) {
    const focusMetrics = metrics.filter(m => m.type === 'focus');
    
    if (focusMetrics.length < 5) return null;
    
    // Find patterns in focus levels
    const hourlyFocus = {};
    
    focusMetrics.forEach(metric => {
        const hour = new Date(metric.timestamp).getHours();
        if (!hourlyFocus[hour]) {
            hourlyFocus[hour] = [];
        }
        hourlyFocus[hour].push(metric.value);
    });
    
    // Calculate average focus by hour
    const avgFocusByHour = {};
    Object.keys(hourlyFocus).forEach(hour => {
        const values = hourlyFocus[hour];
        avgFocusByHour[hour] = values.reduce((a, b) => a + b, 0) / values.length;
    });
    
    return avgFocusByHour;
}

function calculateLearningVelocity(metrics) {
    // Calculate how quickly user progresses through content
    const progressMetrics = metrics.filter(m => m.type === 'progress');
    
    if (progressMetrics.length < 3) return null;
    
    const velocities = [];
    for (let i = 1; i < progressMetrics.length; i++) {
        const timeDiff = progressMetrics[i].timestamp - progressMetrics[i-1].timestamp;
        const progressDiff = progressMetrics[i].value - progressMetrics[i-1].value;
        
        if (timeDiff > 0) {
            velocities.push(progressDiff / (timeDiff / 1000 / 60)); // progress per minute
        }
    }
    
    return velocities.length > 0 ? velocities.reduce((a, b) => a + b, 0) / velocities.length : 0;
}

function findOptimalStudyTimes(metrics) {
    // Analyze when user performs best
    const performanceByHour = {};
    
    metrics.forEach(metric => {
        const hour = new Date(metric.timestamp).getHours();
        if (!performanceByHour[hour]) {
            performanceByHour[hour] = [];
        }
        performanceByHour[hour].push(metric.value);
    });
    
    // Find hours with highest average performance
    const avgPerformanceByHour = {};
    Object.keys(performanceByHour).forEach(hour => {
        const values = performanceByHour[hour];
        avgPerformanceByHour[hour] = values.reduce((a, b) => a + b, 0) / values.length;
    });
    
    // Sort by performance
    const sortedHours = Object.entries(avgPerformanceByHour)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));
    
    return sortedHours;
}

function assessCognitiveLoad(metrics) {
    // Assess cognitive load based on performance patterns
    const recentMetrics = metrics.filter(m => 
        Date.now() - m.timestamp < 24 * 60 * 60 * 1000 // Last 24 hours
    );
    
    if (recentMetrics.length === 0) return null;
    
    const avgPerformance = recentMetrics.reduce((sum, m) => sum + m.value, 0) / recentMetrics.length;
    const variance = recentMetrics.reduce((sum, m) => sum + Math.pow(m.value - avgPerformance, 2), 0) / recentMetrics.length;
    
    return {
        average: avgPerformance,
        stability: Math.sqrt(variance),
        load: avgPerformance < 60 ? 'high' : avgPerformance > 80 ? 'low' : 'moderate'
    };
}

function generateOfflineRecommendations(patterns) {
    const recommendations = [];
    
    if (patterns.focusPatterns) {
        const bestHours = Object.entries(patterns.focusPatterns)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([hour]) => hour);
        
        recommendations.push({
            type: 'schedule',
            title: 'Horários Ótimos de Estudo',
            message: `Seus melhores horários de foco são ${bestHours.join('h e ')}h. Considere estudar nesses períodos!`
        });
    }
    
    if (patterns.cognitiveLoad && patterns.cognitiveLoad.load === 'high') {
        recommendations.push({
            type: 'rest',
            title: 'Descanso Recomendado',
            message: 'Detectei alta carga cognitiva. Considere fazer uma pausa ou atividades mais leves.'
        });
    }
    
    if (patterns.learningVelocity && patterns.learningVelocity > 0.5) {
        recommendations.push({
            type: 'acceleration',
            title: 'Acelerar Aprendizado',
            message: 'Sua velocidade de aprendizado está excelente! Você pode tentar conteúdos mais avançados.'
        });
    }
    
    return recommendations;
}

async function storeInsights(insights) {
    try {
        const cache = await caches.open(DYNAMIC_CACHE);
        const response = new Response(JSON.stringify(insights));
        await cache.put('/offline/insights', response);
    } catch (error) {
        console.error('Failed to store insights:', error);
    }
}

// Error handling
self.addEventListener('error', (event) => {
    console.error('Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
    console.error('Service Worker unhandled rejection:', event.reason);
});

// Update notification
self.addEventListener('updatefound', () => {
    console.log('Service Worker: Update found');
    
    const newWorker = self.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New version available
            self.registration.showNotification('Lumenis Academy', {
                body: 'Nova versão disponível! Recarregue a página para atualizar.',
                icon: '/icons/icon-192x192.png',
                actions: [
                    { action: 'update', title: 'Atualizar' },
                    { action: 'dismiss', title: 'Depois' }
                ]
            });
        }
    });
});

console.log('Service Worker: Loaded successfully');