// ===== LUMENIS ACADEMY CONFIGURATION =====

// Environment detection
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// API Configuration
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || (isDevelopment ? 'http://localhost:3000/api' : '/api'),
  timeout: 10000,
  retries: 3
}

// Supabase Configuration
export const SUPABASE_CONFIG = {
  url: import.meta.env.VITE_SUPABASE_URL,
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  enabled: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
}

// Feature Flags
export const FEATURES = {
  iotIntegration: import.meta.env.VITE_ENABLE_IOT === 'true',
  aiTutor: import.meta.env.VITE_ENABLE_AI_TUTOR === 'true',
  neuralTracking: import.meta.env.VITE_ENABLE_NEURAL_TRACKING === 'true',
  payments: import.meta.env.VITE_STRIPE_PUBLIC_KEY ? true : false,
  offlineMode: 'serviceWorker' in navigator
}

// Application Configuration
export const APP_CONFIG = {
  name: 'Lumenis Academy',
  version: '2.0.0',
  description: 'O Portal do Conhecimento Autodidata',
  author: 'Lumenis Academy Team',
  environment: import.meta.env.MODE,
  debug: isDevelopment
}

// Neural Tracking Configuration
export const NEURAL_CONFIG = {
  metricsInterval: 10000, // 10 seconds
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxStoredMetrics: 1000,
  enableRealTimeTracking: true
}

// Gamification Configuration
export const GAMIFICATION_CONFIG = {
  pointsPerLesson: 100,
  pointsPerCourse: 1000,
  streakMultiplier: 1.5,
  achievementNotifications: true
}

// UI Configuration
export const UI_CONFIG = {
  theme: 'cosmic', // cosmic, light, dark
  animations: true,
  particleEffects: true,
  avatarEnabled: true,
  soundEffects: false // Disabled by default
}

// Payment Configuration
export const PAYMENT_CONFIG = {
  currency: 'BRL',
  plans: {
    technology: {
      name: 'Tecnologia Premium',
      price: 297,
      features: ['Todos os cursos de Tecnologia', 'Certificados', 'Projetos práticos', 'Mentoria']
    },
    autodidata: {
      name: 'Autodidata Premium', 
      price: 497,
      features: ['Todos os cursos Autodidatas', 'IA Tutor', 'Biblioteca premium', 'Comunidade']
    },
    ultimate: {
      name: 'Lumenis Ultimate',
      price: 697,
      features: ['Acesso completo', 'IoT Kit', 'Consultoria 1:1', 'Acesso antecipado']
    }
  }
}

// Social Links
export const SOCIAL_CONFIG = {
  instagram: 'https://www.instagram.com/lumenis_academy/',
  youtube: '#',
  linkedin: '#',
  twitter: '#',
  github: 'https://github.com/seu-usuario/lumenis-academy'
}

// Development helpers
export const DEV_CONFIG = {
  mockAPI: isDevelopment && !SUPABASE_CONFIG.enabled,
  showDebugInfo: isDevelopment,
  enableHotReload: isDevelopment,
  skipAnimations: false
}

// Export configuration object
export const CONFIG = {
  api: API_CONFIG,
  supabase: SUPABASE_CONFIG,
  features: FEATURES,
  app: APP_CONFIG,
  neural: NEURAL_CONFIG,
  gamification: GAMIFICATION_CONFIG,
  ui: UI_CONFIG,
  payment: PAYMENT_CONFIG,
  social: SOCIAL_CONFIG,
  dev: DEV_CONFIG
}

// Configuration validation
export function validateConfig() {
  const errors = []
  
  if (FEATURES.payments && !import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    errors.push('Stripe public key is required for payments')
  }
  
  if (SUPABASE_CONFIG.enabled && (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey)) {
    errors.push('Supabase URL and anon key are required')
  }
  
  if (errors.length > 0) {
    console.warn('Configuration warnings:', errors)
  }
  
  return errors.length === 0
}

// Initialize configuration
export function initializeConfig() {
  console.log('🚀 Lumenis Academy Configuration Loaded')
  console.log('Environment:', APP_CONFIG.environment)
  console.log('Features enabled:', Object.entries(FEATURES).filter(([, enabled]) => enabled).map(([feature]) => feature))
  
  if (!validateConfig()) {
    console.warn('⚠️ Configuration validation failed - some features may not work properly')
  }
  
  return CONFIG
}