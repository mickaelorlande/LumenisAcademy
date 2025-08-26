// ===== SUPABASE CLIENT CONFIGURATION =====
import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database helper functions
export class LumenisDatabase {
  constructor() {
    this.client = supabase
  }

  // User management
  async registerUser(userData) {
    try {
      const { data, error } = await this.client.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName
          }
        }
      })

      if (error) throw error

      // Create user profile
      if (data.user) {
        await this.createUserProfile(data.user.id, userData)
      }

      return { success: true, user: data.user }
    } catch (error) {
      console.error('Registration error:', error)
      return { success: false, error: error.message }
    }
  }

  async loginUser(email, password) {
    try {
      const { data, error } = await this.client.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: error.message }
    }
  }

  async logoutUser() {
    try {
      const { error } = await this.client.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  async createUserProfile(userId, userData) {
    const { data, error } = await this.client
      .from('user_profiles')
      .insert([
        {
          user_id: userId,
          first_name: userData.firstName,
          last_name: userData.lastName,
          neural_profile: {
            plasticidade: 50,
            dopamina: 50,
            acetilcolina: 50,
            serotonina: 50
          },
          learning_preferences: {
            learning_style: 'visual',
            difficulty_preference: 'adaptive',
            session_duration: 30,
            notifications_enabled: true
          }
        }
      ])

    if (error) {
      console.error('Error creating user profile:', error)
      throw error
    }

    return data
  }

  // Course management
  async getCourses(category = 'all', limit = 20, offset = 0) {
    try {
      let query = this.client
        .from('courses')
        .select(`
          *,
          instructor:user_profiles(first_name, last_name, avatar_url)
        `)
        .eq('is_published', true)
        .order('rating', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category !== 'all') {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) throw error

      return { success: true, courses: data }
    } catch (error) {
      console.error('Error fetching courses:', error)
      return { success: false, error: error.message }
    }
  }

  async enrollInCourse(userId, courseId) {
    try {
      const { data, error } = await this.client
        .from('user_enrollments')
        .insert([
          {
            user_id: userId,
            course_id: courseId,
            enrollment_date: new Date().toISOString()
          }
        ])

      if (error) throw error

      return { success: true, enrollment: data }
    } catch (error) {
      console.error('Error enrolling in course:', error)
      return { success: false, error: error.message }
    }
  }

  // Neural metrics
  async recordNeuralMetrics(userId, metrics) {
    try {
      const records = metrics.map(metric => ({
        user_id: userId,
        session_id: metric.sessionId || this.generateSessionId(),
        metric_type: metric.type,
        value: metric.value,
        context: metric.context || {},
        device_id: metric.deviceId || 'web_browser',
        recorded_at: new Date().toISOString()
      }))

      const { data, error } = await this.client
        .from('neural_metrics')
        .insert(records)

      if (error) throw error

      return { success: true, metrics: data }
    } catch (error) {
      console.error('Error recording neural metrics:', error)
      return { success: false, error: error.message }
    }
  }

  async getNeuralDashboard(userId) {
    try {
      // Get recent neural metrics
      const { data: metrics, error: metricsError } = await this.client
        .from('neural_metrics')
        .select('*')
        .eq('user_id', userId)
        .gte('recorded_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('recorded_at', { ascending: false })
        .limit(100)

      if (metricsError) throw metricsError

      // Get user achievements
      const { data: achievements, error: achievementsError } = await this.client
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', userId)

      if (achievementsError) throw achievementsError

      return {
        success: true,
        dashboard: {
          metrics,
          achievements,
          insights: this.generateInsights(metrics)
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      return { success: false, error: error.message }
    }
  }

  generateInsights(metrics) {
    // Generate AI insights based on neural metrics
    const insights = []

    if (metrics.length === 0) {
      return [{
        type: 'welcome',
        message: 'Bem-vindo! Comece a estudar para ver suas métricas neurais!'
      }]
    }

    // Analyze focus patterns
    const focusMetrics = metrics.filter(m => m.metric_type === 'focus')
    if (focusMetrics.length > 0) {
      const avgFocus = focusMetrics.reduce((sum, m) => sum + m.value, 0) / focusMetrics.length
      
      if (avgFocus > 80) {
        insights.push({
          type: 'positive',
          message: 'Excelente! Seus níveis de foco estão acima da média. Continue assim!'
        })
      } else if (avgFocus < 60) {
        insights.push({
          type: 'suggestion',
          message: 'Seus níveis de foco podem melhorar. Tente estudar em horários mais tranquilos.'
        })
      }
    }

    return insights
  }

  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
  }

  // Real-time subscriptions
  subscribeToUserProgress(userId, callback) {
    return this.client
      .channel('user_progress')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'user_enrollments',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }

  subscribeToNeuralMetrics(userId, callback) {
    return this.client
      .channel('neural_metrics')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'neural_metrics',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  }
}

// Export singleton instance
export const lumenisDB = new LumenisDatabase()

// Initialize Supabase integration
export function initializeSupabase() {
  console.log('Supabase client initialized for Lumenis Academy')
  
  // Listen for auth changes
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state changed:', event, session)
    
    if (event === 'SIGNED_IN') {
      // User signed in
      window.dispatchEvent(new CustomEvent('userSignedIn', { detail: session }))
    } else if (event === 'SIGNED_OUT') {
      // User signed out
      window.dispatchEvent(new CustomEvent('userSignedOut'))
    }
  })
}