// ===== MAIN APPLICATION CONTROLLER =====
class LumenisAcademy {
    constructor() {
        this.currentSection = 'home';
        this.isLoggedIn = false;
        this.userData = null;
        this.loadingScreen = document.getElementById('loadingScreen');
        this.currentOdsCard = 0;
        this.isInitialized = false;
        
        this.init();
    }

    async init() {
        try {
            await this.showLoadingScreen();
            this.setupEventListeners();
            this.initializeComponents();
            this.createQuantumParticles();
            this.setupAnimations();
            this.loadCourses();
            this.setupOdsFlashcards();
            this.initializeCharts();
            this.checkUserSession();
            this.hideLoadingScreen();
            this.isInitialized = true;
        } catch (error) {
            console.error('Initialization error:', error);
            this.hideLoadingScreen();
        }
    }

    showLoadingScreen() {
        return new Promise((resolve) => {
            let progress = 0;
            const progressBar = document.querySelector('.loading-progress');
            const loadingText = document.querySelector('.loading-text');
            
            const messages = [
                'Inicializando IA Cósmica...',
                'Carregando Neurociência Avançada...',
                'Conectando Dispositivos IoT...',
                'Ativando Gamificação Neural...',
                'Preparando Experiência Personalizada...',
                'Quase pronto para transcender!'
            ];
            
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress > 100) progress = 100;
                
                progressBar.style.width = `${progress}%`;
                
                const messageIndex = Math.floor((progress / 100) * messages.length);
                if (messageIndex < messages.length) {
                    loadingText.textContent = messages[messageIndex];
                }
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(resolve, 500);
                }
            }, 200);
        });
    }

    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 500);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Login/Register
        document.getElementById('loginBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('startNowBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('startNowHeroBtn')?.addEventListener('click', () => this.showLoginModal());
        document.getElementById('exploreCoursesBtn')?.addEventListener('click', () => this.navigateToSection('courses'));

        // Modal controls
        document.getElementById('closeModal')?.addEventListener('click', () => this.hideModal('loginModal'));
        document.getElementById('closePaymentModal')?.addEventListener('click', () => this.hideModal('paymentModal'));
        
        // Forms
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('paymentForm')?.addEventListener('submit', (e) => this.handlePayment(e));

        // Course categories
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.filterCourses(e.target.dataset.category));
        });

        // Resource cards
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', (e) => this.handleResourceClick(e));
        });

        // Payment plans
        document.querySelectorAll('.plan-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handlePlanSelection(e));
        });

        // ODS Flashcards
        document.getElementById('prevOds')?.addEventListener('click', () => this.previousOdsCard());
        document.getElementById('nextOds')?.addEventListener('click', () => this.nextOdsCard());

        // Mascot interaction
        document.getElementById('cosmicMascote')?.addEventListener('click', () => this.interactWithMascot());

        // Window events
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('resize', () => this.handleResize());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    initializeComponents() {
        // Initialize neural chart if dashboard is visible
        if (document.getElementById('neuralChart')) {
            this.initializeNeuralChart();
        }

        // Initialize IoT device simulation
        this.simulateIoTDevices();

        // Setup user progress tracking
        this.initializeProgressTracking();

        // Initialize search functionality
        this.initializeSearch();
    }

    createQuantumParticles() {
        const container = document.getElementById('quantum-particles');
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('quantum-particle');
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const opacity = Math.random() * 0.6 + 0.2;
            const duration = Math.random() * 20 + 15;
            const delay = Math.random() * 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.opacity = opacity;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            // Random colors
            const colors = [
                'rgba(124, 58, 237, 0.8)',
                'rgba(219, 39, 119, 0.8)',
                'rgba(6, 182, 212, 0.8)',
                'rgba(245, 158, 11, 0.8)'
            ];
            particle.style.background = colors[Math.floor(Math.random() * colors.length)];
            
            container.appendChild(particle);
        }
    }

    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.animate').forEach(el => {
            observer.observe(el);
        });
    }

    loadCourses() {
        const courseGrid = document.getElementById('courseGrid');
        if (!courseGrid) return;

        // Load featured courses by default
        this.renderCourses('featured');
    }

    renderCourses(category) {
        const courseGrid = document.getElementById('courseGrid');
        const courses = window.LumenisData?.courses[category] || [];
        
        courseGrid.innerHTML = '';
        
        courses.forEach(course => {
            const courseCard = this.createCourseCard(course);
            courseGrid.appendChild(courseCard);
        });
    }

    createCourseCard(course) {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.dataset.courseId = course.id;
        
        const premiumBadge = course.premium ? '<span class="premium-badge"><i class="fas fa-crown"></i></span>' : '';
        
        card.innerHTML = `
            <div class="course-image" style="background-image: url('${course.image}')">
                <div class="course-tag">${this.getCategoryName(course.category)}</div>
                ${premiumBadge}
            </div>
            <div class="course-content">
                <h3>${course.title}</h3>
                <p>${course.description}</p>
                <div class="course-meta">
                    <div class="course-stats">
                        <span><i class="fas fa-star"></i> ${course.rating}</span>
                        <span><i class="fas fa-users"></i> ${course.students}</span>
                        <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    </div>
                    <div class="course-actions">
                        ${course.premium ? 
                            `<button class="btn btn-solid premium-btn" data-course="${course.id}">
                                R$ ${course.price} <i class="fas fa-crown"></i>
                            </button>` :
                            `<button class="btn btn-outline course-btn" data-course="${course.id}">
                                Acessar Grátis
                            </button>`
                        }
                    </div>
                </div>
            </div>
        `;
        
        // Add event listeners
        card.querySelector('.course-btn, .premium-btn')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (course.premium) {
                this.showPaymentModal(course);
            } else {
                this.accessCourse(course);
            }
        });
        
        card.addEventListener('click', () => this.showCourseDetail(course));
        
        return card;
    }

    getCategoryName(category) {
        const names = {
            'featured': 'Destaque',
            'fundamental': 'Fundamental',
            'medio': 'Médio',
            'enem': 'ENEM',
            'eja': 'EJA',
            'technology': 'Tecnologia',
            'autodidata': 'Autodidata'
        };
        return names[category] || category;
    }

    filterCourses(category) {
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Render courses
        this.renderCourses(category);
        
        // Animate course cards
        setTimeout(() => {
            document.querySelectorAll('.course-card').forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }, 50);
    }

    setupOdsFlashcards() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        
        flashcards.forEach((card, index) => {
            card.addEventListener('click', () => {
                card.classList.toggle('flipped');
            });
            
            // Position cards
            if (index !== this.currentOdsCard) {
                card.classList.remove('active');
            }
        });
        
        this.updateOdsCards();
    }

    nextOdsCard() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        this.currentOdsCard = (this.currentOdsCard + 1) % flashcards.length;
        this.updateOdsCards();
    }

    previousOdsCard() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        this.currentOdsCard = this.currentOdsCard === 0 ? flashcards.length - 1 : this.currentOdsCard - 1;
        this.updateOdsCards();
    }

    updateOdsCards() {
        const flashcards = document.querySelectorAll('.ods-flashcard');
        
        flashcards.forEach((card, index) => {
            card.classList.remove('active');
            if (index === this.currentOdsCard) {
                card.classList.add('active');
            }
        });
    }

    initializeCharts() {
        // Neural development chart
        const ctx = document.getElementById('neuralChart');
        if (ctx) {
            this.neuralChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
                    datasets: [{
                        label: 'Plasticidade Cerebral',
                        data: [65, 70, 75, 80, 82, 85, 87, 85],
                        borderColor: '#7C3AED',
                        backgroundColor: 'rgba(124, 58, 237, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Dopamina',
                        data: [60, 65, 68, 72, 75, 78, 80, 78],
                        borderColor: '#DB2777',
                        backgroundColor: 'rgba(219, 39, 119, 0.1)',
                        tension: 0.4,
                        fill: true
                    }, {
                        label: 'Acetilcolina',
                        data: [70, 75, 80, 85, 88, 90, 92, 92],
                        borderColor: '#06B6D4',
                        backgroundColor: 'rgba(6, 182, 212, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: '#E2E8F0'
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                color: '#E2E8F0'
                            },
                            grid: {
                                color: 'rgba(124, 58, 237, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#E2E8F0'
                            },
                            grid: {
                                color: 'rgba(124, 58, 237, 0.1)'
                            }
                        }
                    }
                }
            });
        }
    }

    simulateIoTDevices() {
        // Simulate real-time IoT data updates
        setInterval(() => {
            this.updateIoTMetrics();
        }, 5000);
    }

    updateIoTMetrics() {
        const devices = document.querySelectorAll('.iot-device');
        
        devices.forEach(device => {
            const stats = device.querySelectorAll('.stat');
            stats.forEach(stat => {
                const currentValue = stat.textContent;
                const numericValue = parseFloat(currentValue.replace(/[^\d.-]/g, ''));
                
                if (!isNaN(numericValue)) {
                    const variation = (Math.random() - 0.5) * 2; // -1 to 1
                    const newValue = Math.max(0, Math.min(100, numericValue + variation));
                    
                    if (currentValue.includes('%')) {
                        stat.textContent = `${stat.textContent.split(':')[0]}: ${newValue.toFixed(0)}%`;
                    } else if (currentValue.includes('h')) {
                        stat.textContent = `${stat.textContent.split(':')[0]}: ${newValue.toFixed(1)}h`;
                    } else if (currentValue.includes('k')) {
                        stat.textContent = `${stat.textContent.split(':')[0]}: ${(newValue/1000).toFixed(1)}k`;
                    }
                }
            });
        });
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.target.dataset.section;
        if (section) {
            this.navigateToSection(section);
        }
    }

    navigateToSection(section) {
        // Hide all sections
        document.querySelectorAll('main > section').forEach(s => {
            s.style.display = 'none';
        });
        
        // Show target section
        const targetSection = document.getElementById(section);
        if (targetSection) {
            targetSection.style.display = 'block';
            this.currentSection = section;
            
            // Update URL
            window.history.pushState({}, '', `#${section}`);
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Trigger section-specific actions
            this.onSectionChange(section);
        }
    }

    onSectionChange(section) {
        switch(section) {
            case 'dashboard':
                this.loadDashboardData();
                break;
            case 'courses':
                this.loadCourses();
                break;
            case 'resources':
                this.loadResourcesData();
                break;
        }
    }

    showLoginModal() {
        this.showModal('loginModal');
    }

    showPaymentModal(course) {
        const modal = document.getElementById('paymentModal');
        const selectedPlan = document.getElementById('selectedPlan');
        
        if (course) {
            selectedPlan.innerHTML = `
                <h4>${course.title}</h4>
                <div class="plan-price">
                    <span class="currency">R$</span>
                    <span class="amount">${course.price}</span>
                    <span class="period">vitalício</span>
                </div>
            `;
        }
        
        this.showModal('paymentModal');
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Add animation
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        }
    }

    handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        // Simulate login process
        this.showLoadingInButton(e.target.querySelector('button[type="submit"]'));
        
        setTimeout(() => {
            this.isLoggedIn = true;
            this.userData = {
                email: email,
                name: email.split('@')[0],
                avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=40'
            };
            
            this.updateUserInterface();
            this.hideModal('loginModal');
            this.navigateToSection('dashboard');
            
            // Show welcome message
            if (window.cosmicAvatar) {
                window.cosmicAvatar.showMessage(
                    `🎉 Bem-vindo de volta, ${this.userData.name}! Seus neurônios estão brilhando intensamente hoje!`,
                    5000
                );
            }
        }, 2000);
    }

    handlePayment(e) {
        e.preventDefault();
        
        // Simulate payment processing
        const submitBtn = e.target.querySelector('button[type="submit"]');
        this.showLoadingInButton(submitBtn);
        
        setTimeout(() => {
            // Simulate successful payment
            this.hideModal('paymentModal');
            this.showSuccessMessage('Pagamento processado com sucesso! Acesso premium ativado!');
            
            // Update user status
            if (this.userData) {
                this.userData.premium = true;
            }
            
            this.updateUserInterface();
        }, 3000);
    }

    showLoadingInButton(button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
        button.disabled = true;
        
        // Store original text for restoration
        button.dataset.originalText = originalText;
    }

    restoreButton(button) {
        button.innerHTML = button.dataset.originalText;
        button.disabled = false;
    }

    updateUserInterface() {
        if (this.isLoggedIn && this.userData) {
            // Hide login button, show user menu
            document.getElementById('loginBtn').style.display = 'none';
            const userMenu = document.getElementById('userMenu');
            userMenu.style.display = 'block';
            
            // Update user avatar
            const userAvatarImg = document.getElementById('userAvatarImg');
            userAvatarImg.src = this.userData.avatar;
            userAvatarImg.alt = this.userData.name;
            
            // Update premium features
            if (this.userData.premium) {
                document.querySelectorAll('.premium').forEach(el => {
                    el.classList.add('unlocked');
                });
            }
        }
    }

    handleResourceClick(e) {
        const resourceType = e.currentTarget.dataset.resource;
        
        switch(resourceType) {
            case 'library':
                this.showLibrary();
                break;
            case 'forum':
                this.showForum();
                break;
            case 'tutoring':
                this.showTutoring();
                break;
            case 'articles':
                this.showArticles();
                break;
        }
    }

    showLibrary() {
        this.navigateToSection('libraryPage');
        this.loadLibraryContent();
    }

    loadLibraryContent() {
        const libraryGrid = document.getElementById('libraryGrid');
        if (!libraryGrid) return;
        
        const libraryData = window.LumenisData?.library || {};
        libraryGrid.innerHTML = '';
        
        Object.keys(libraryData).forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'library-category-card';
            
            categoryCard.innerHTML = `
                <h3>${this.getCategoryDisplayName(category)}</h3>
                <div class="library-items">
                    ${libraryData[category].map(item => `
                        <div class="library-item">
                            <div class="item-icon">
                                <i class="fas fa-file-pdf"></i>
                            </div>
                            <div class="item-info">
                                <h4>${item.title}</h4>
                                <p>Por ${item.author}</p>
                                <span class="item-meta">${item.pages} páginas • ${item.type}</span>
                            </div>
                            <button class="btn btn-outline btn-sm">Acessar</button>
                        </div>
                    `).join('')}
                </div>
            `;
            
            libraryGrid.appendChild(categoryCard);
        });
    }

    getCategoryDisplayName(category) {
        const names = {
            'math': 'Matemática',
            'science': 'Ciências',
            'tech': 'Tecnologia',
            'humanities': 'Humanidades'
        };
        return names[category] || category;
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            successDiv.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(successDiv);
            }, 300);
        }, 4000);
    }

    handleScroll() {
        const header = document.getElementById('mainHeader');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update progress indicators
        this.updateScrollProgress();
    }

    updateScrollProgress() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        document.documentElement.style.setProperty('--scroll-progress', `${scrolled}%`);
    }

    handleResize() {
        // Responsive adjustments
        if (window.innerWidth < 768) {
            this.enableMobileMode();
        } else {
            this.disableMobileMode();
        }
    }

    enableMobileMode() {
        document.body.classList.add('mobile-mode');
    }

    disableMobileMode() {
        document.body.classList.remove('mobile-mode');
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.openSearch();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            this.closeAllModals();
        }
    }

    openSearch() {
        // Implement global search functionality
        console.log('Search opened');
    }

    closeAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'flex') {
                this.hideModal(modal.id);
            }
        });
    }

    interactWithMascot() {
        const mascot = document.getElementById('cosmicMascote');
        mascot.classList.add('dancing');
        
        setTimeout(() => {
            mascot.classList.remove('dancing');
        }, 2000);
        
        // Trigger avatar interaction
        if (window.cosmicAvatar) {
            window.cosmicAvatar.showMessage(
                "🎉 Que energia fantástica! Vejo que você está pronto para uma jornada cósmica de aprendizado!",
                4000
            );
        }
    }

    initializeProgressTracking() {
        // Track user interactions for analytics
        this.trackingData = {
            sessionStart: Date.now(),
            interactions: [],
            sectionsVisited: [],
            coursesViewed: []
        };
        
        // Save session data periodically
        setInterval(() => {
            this.saveSessionData();
        }, 30000);
    }

    trackInteraction(type, data) {
        this.trackingData.interactions.push({
            type,
            data,
            timestamp: Date.now()
        });
    }

    saveSessionData() {
        localStorage.setItem('lumenisSession', JSON.stringify(this.trackingData));
    }

    initializeSearch() {
        // Global search functionality
        const searchInput = document.getElementById('librarySearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.performSearch(e.target.value);
            });
        }
    }

    performSearch(query) {
        if (query.length < 2) return;
        
        // Search through courses, library, articles
        const results = this.searchContent(query);
        this.displaySearchResults(results);
    }

    searchContent(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        // Search courses
        Object.values(window.LumenisData?.courses || {}).flat().forEach(course => {
            if (course.title.toLowerCase().includes(lowerQuery) || 
                course.description.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'course',
                    item: course,
                    relevance: this.calculateRelevance(course, lowerQuery)
                });
            }
        });
        
        // Search library
        Object.values(window.LumenisData?.library || {}).flat().forEach(item => {
            if (item.title.toLowerCase().includes(lowerQuery) || 
                item.author.toLowerCase().includes(lowerQuery)) {
                results.push({
                    type: 'library',
                    item: item,
                    relevance: this.calculateRelevance(item, lowerQuery)
                });
            }
        });
        
        return results.sort((a, b) => b.relevance - a.relevance);
    }

    calculateRelevance(item, query) {
        let relevance = 0;
        const title = item.title.toLowerCase();
        const description = (item.description || '').toLowerCase();
        
        if (title.includes(query)) relevance += 10;
        if (description.includes(query)) relevance += 5;
        if (title.startsWith(query)) relevance += 5;
        
        return relevance;
    }

    displaySearchResults(results) {
        // Display search results in UI
        console.log('Search results:', results);
    }

    checkUserSession() {
        // Check for existing user session
        const savedSession = localStorage.getItem('lumenisUserSession');
        if (savedSession) {
            try {
                const sessionData = JSON.parse(savedSession);
                if (sessionData.expiresAt > Date.now()) {
                    this.isLoggedIn = true;
                    this.userData = sessionData.userData;
                    this.updateUserInterface();
                }
            } catch (error) {
                console.error('Error loading user session:', error);
            }
        }
    }

    saveUserSession() {
        if (this.isLoggedIn && this.userData) {
            const sessionData = {
                userData: this.userData,
                expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
            };
            localStorage.setItem('lumenisUserSession', JSON.stringify(sessionData));
        }
    }

    // Advanced features
    enableDarkMode() {
        document.body.classList.add('dark-mode');
        localStorage.setItem('lumenisTheme', 'dark');
    }

    enableLightMode() {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('lumenisTheme', 'light');
    }

    // Accessibility features
    enableHighContrast() {
        document.body.classList.add('high-contrast');
    }

    enableReducedMotion() {
        document.body.classList.add('reduced-motion');
    }

    // Performance monitoring
    measurePerformance() {
        if ('performance' in window) {
            const navigation = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', navigation.loadEventEnd - navigation.loadEventStart);
        }
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.lumenisApp = new LumenisAcademy();
});

// Service Worker registration for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Add custom CSS for dynamic features
const dynamicStyles = `
    .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--success-green), var(--neural-cyan));
        color: var(--pure-white);
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: var(--shadow-cosmic);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    }
    
    .success-message.show {
        transform: translateX(0);
    }
    
    .success-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .success-content i {
        font-size: 1.2rem;
    }
    
    .library-category-card {
        background: rgba(15, 23, 42, 0.8);
        border: 1px solid rgba(124, 58, 237, 0.3);
        border-radius: 20px;
        padding: 2rem;
        margin-bottom: 2rem;
    }
    
    .library-category-card h3 {
        color: var(--neon-accent);
        margin-bottom: 1.5rem;
        font-size: 1.5rem;
    }
    
    .library-item {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background: rgba(124, 58, 237, 0.1);
        border-radius: 10px;
        margin-bottom: 1rem;
        transition: var(--transition-smooth);
    }
    
    .library-item:hover {
        background: rgba(124, 58, 237, 0.2);
        transform: translateX(5px);
    }
    
    .item-icon {
        width: 50px;
        height: 50px;
        background: var(--neon-accent);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--pure-white);
        font-size: 1.2rem;
    }
    
    .item-info {
        flex: 1;
    }
    
    .item-info h4 {
        color: var(--pure-white);
        margin-bottom: 0.25rem;
        font-size: 1.1rem;
    }
    
    .item-info p {
        opacity: 0.8;
        margin-bottom: 0.25rem;
    }
    
    .item-meta {
        font-size: 0.8rem;
        opacity: 0.6;
    }
    
    .btn-sm {
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
    }
    
    .premium-badge {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: var(--cosmic-gold);
        color: var(--void-black);
        padding: 0.25rem 0.5rem;
        border-radius: 50px;
        font-size: 0.7rem;
        font-weight: 600;
        z-index: 2;
    }
    
    .course-stats {
        display: flex;
        gap: 1rem;
        margin-bottom: 1rem;
        font-size: 0.8rem;
        opacity: 0.8;
    }
    
    .course-stats span {
        display: flex;
        align-items: center;
        gap: 0.25rem;
    }
    
    .course-actions {
        display: flex;
        justify-content: flex-end;
    }
    
    .premium-btn {
        background: linear-gradient(135deg, var(--cosmic-gold), var(--warning-yellow));
        color: var(--void-black);
        font-weight: 600;
    }
    
    .premium-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
    }
    
    .dancing {
        animation: mascotDance 2s infinite;
    }
    
    @keyframes mascotDance {
        0%, 100% { transform: rotate(0deg) scale(1); }
        25% { transform: rotate(-5deg) scale(1.05); }
        50% { transform: rotate(0deg) scale(1.1); }
        75% { transform: rotate(5deg) scale(1.05); }
    }
    
    .scrolled {
        background: rgba(15, 23, 42, 0.98) !important;
        backdrop-filter: blur(20px);
    }
    
    @media (max-width: 768px) {
        .mobile-mode .course-grid {
            grid-template-columns: 1fr;
        }
        
        .mobile-mode .features-grid {
            grid-template-columns: 1fr;
        }
        
        .mobile-mode .hero {
            flex-direction: column;
            text-align: center;
        }
        
        .mobile-mode .hero-content {
            max-width: 100%;
        }
    }
`;

// Inject dynamic styles
const styleSheet = document.createElement('style');
styleSheet.textContent = dynamicStyles;
document.head.appendChild(styleSheet);