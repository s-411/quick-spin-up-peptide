import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types'

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createBrowserClient()

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch profile
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile({
                id: data.id,
                email: data.email,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                firstName: data.first_name,
                lastName: data.last_name,
                avatarUrl: data.avatar_url,
                emailVerified: data.email_verified,
                subscriptionStatus: data.subscription_status,
                subscriptionId: data.subscription_id,
                themePreference: data.theme_preference,
                onboardingCompleted: data.onboarding_completed,
              })
            }
            setLoading(false)
          })
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)

      if (session?.user) {
        // Fetch updated profile
        supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) {
              setProfile({
                id: data.id,
                email: data.email,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                firstName: data.first_name,
                lastName: data.last_name,
                avatarUrl: data.avatar_url,
                emailVerified: data.email_verified,
                subscriptionStatus: data.subscription_status,
                subscriptionId: data.subscription_id,
                themePreference: data.theme_preference,
                onboardingCompleted: data.onboarding_completed,
              })
            }
          })
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
  }
}
