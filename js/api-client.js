// ===== API CLIENT FOR LUMENIS ACADEMY =====
import { CONFIG } from './config.js'
import { supabase, lumenisDB } from './supabase-client.js'

class APIClient {
  constructor() {
    this.baseURL = CONFIG.api.baseURL
    this.timeout = CONFIG.api.timeout
    this.useSupabase = CONFIG.supabase.enabled
    this.authToken = null
    
    this.init()
  }

  init() {
    // Load auth token from localStorage
    this.authToken = localStorage.getItem('lumenisAuthToken')
    
    // Set up request interceptors
    this.setupInterceptors()
  }

  setupInterceptors() {
    // Add auth header to all requests
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }

    if (this.authToken) {
      this.defaultHeaders['Authorization'] = `Bearer ${this.authToken}`
    }
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`
    
    const config = {
      method: 'GET',
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    }

    // Add timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)
    config.signal = controller.signal

    try {
      const response = await fetch(url, config)
      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return await response.text()
    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      
      console.error('API Request failed:', error)
      throw error
    }
  }

  // Authentication methods
  async login(email, password) {
    if (this.useSupabase) {
      return await lumenisDB.loginUser(email, password)
    }

    try {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })

      if (response.success && response.token) {
        this.setAuthToken(response.token)
        return { success: true, user: response.user }
      }

      return { success: false, error: response.error || 'Login failed' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async register(userData) {
    if (this.useSupabase) {
      return await lumenisDB.registerUser(userData)
    }

    try {
      const response = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      })

      if (response.success && response.token) {
        this.setAuthToken(response.token)
        return { success: true, user: response.user }
      }

      return { success: false, error: response.error || 'Registration failed' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async logout() {
    if (this.useSupabase) {
      const result = await lumenisDB.logoutUser()
      if (result.success) {
        this.clearAuthToken()
      }
      return result
    }

    try {
      await this.request('/auth/logout', { method: 'POST' })
      this.clearAuthToken()
      return { success: true }
    } catch (error) {
      // Clear token even if request fails
      this.clearAuthToken()
      return { success: false, error: error.message }
    }
  }

  // Course methods
  async getCourses(category = 'all', limit = 20, offset = 0) {
    if (this.useSupabase) {
      return await lumenisDB.getCourses(category, limit, offset)
    }

    try {
      const params = new URLSearchParams({ category, limit, offset })
      const response = await this.request(`/courses?${params}`)
      return { success: true, courses: response.courses || [] }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async getCourse(courseId) {
    try {
      const response = await this.request(`/courses/${courseId}`)
      return { success: true, course: response.course }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async enrollInCourse(courseId) {
    if (this.useSupabase) {
      const user = await supabase.auth.getUser()
      if (user.data.user) {
        return await lumenisDB.enrollInCourse(user.data.user.id, courseId)
      }
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const response = await this.request('/courses/enroll', {
        method: 'POST',
        body: JSON.stringify({ courseId })
      })
      return response
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Neural metrics methods
  async recordNeuralMetrics(metrics) {
    if (this.useSupabase) {
      const user = await supabase.auth.getUser()
      if (user.data.user) {
        return await lumenisDB.recordNeuralMetrics(user.data.user.id, metrics)
      }
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const response = await this.request('/neural/metrics', {
        method: 'POST',
        body: JSON.stringify({ metrics })
      })
      return response
    } catch (error) {
      // Store metrics locally for offline sync
      this.storeMetricsOffline(metrics)
      return { success: false, error: error.message, offline: true }
    }
  }

  async getNeuralDashboard() {
    if (this.useSupabase) {
      const user = await supabase.auth.getUser()
      if (user.data.user) {
        return await lumenisDB.getNeuralDashboard(user.data.user.id)
      }
      return { success: false, error: 'User not authenticated' }
    }

    try {
      const response = await this.request('/neural/dashboard')
      return response
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Payment methods
  async createPaymentIntent(planType) {
    try {
      const response = await this.request('/payments/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({ planType })
      })
      return response
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  async confirmPayment(paymentId, paymentIntentId) {
    try {
      const response = await this.request('/payments/confirm-payment', {
        method: 'POST',
        body: JSON.stringify({ paymentId, paymentIntentId })
      })
      return response
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // Utility methods
  setAuthToken(token) {
    this.authToken = token
    localStorage.setItem('lumenisAuthToken', token)
    this.defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  clearAuthToken() {
    this.authToken = null
    localStorage.removeItem('lumenisAuthToken')
    delete this.defaultHeaders['Authorization']
  }

  async storeMetricsOffline(metrics) {
    try {
      const stored = JSON.parse(localStorage.getItem('offlineNeuralMetrics') || '[]')
      stored.push(...metrics.map(m => ({ ...m, timestamp: Date.now() })))
      localStorage.setItem('offlineNeuralMetrics', JSON.stringify(stored.slice(-100)))
    } catch (error) {
      console.error('Failed to store metrics offline:', error)
    }
  }

  async syncOfflineData() {
    try {
      const offlineMetrics = JSON.parse(localStorage.getItem('offlineNeuralMetrics') || '[]')
      
      if (offlineMetrics.length > 0) {
        const result = await this.recordNeuralMetrics(offlineMetrics)
        
        if (result.success) {
          localStorage.removeItem('offlineNeuralMetrics')
          console.log('Offline metrics synced successfully')
        }
      }
    } catch (error) {
      console.error('Failed to sync offline data:', error)
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await this.request('/health')
      return { success: true, status: response }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

// Export singleton instance
export const apiClient = new APIClient()

// Auto-sync offline data when online
window.addEventListener('online', () => {
  console.log('Connection restored - syncing offline data')
  apiClient.syncOfflineData()
})

// Export for global use
if (typeof window !== 'undefined') {
  window.LumenisAPI = apiClient
}