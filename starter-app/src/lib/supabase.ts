// Re-export server functions (ONLY use in Server Components)
export { createServerSupabaseClient } from './supabase-server'

// Re-export client functions (safe to use anywhere)
export { createBrowserClient, createAdminClient } from './supabase-client'

// Type exports for database schema
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          avatar_url: string | null
          email_verified: boolean
          subscription_status: 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
          subscription_id: string | null
          theme_preference: 'light' | 'dark' | 'system'
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          email: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          subscription_status?: 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
          subscription_id?: string | null
          theme_preference?: 'light' | 'dark' | 'system'
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          avatar_url?: string | null
          email_verified?: boolean
          subscription_status?: 'free' | 'active' | 'past_due' | 'canceled' | 'trialing'
          subscription_id?: string | null
          theme_preference?: 'light' | 'dark' | 'system'
          onboarding_completed?: boolean
        }
      }
    }
  }
}
