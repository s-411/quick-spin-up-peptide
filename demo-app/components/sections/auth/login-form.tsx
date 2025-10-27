'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Mail, Lock, Github, Chrome } from 'lucide-react'

export interface LoginFormProps {
  /** Form title */
  title?: string
  /** Form subtitle */
  subtitle?: string
  /** Show social login options */
  showSocialLogin?: boolean
  /** Submit handler */
  onSubmit?: (email: string, password: string) => void
  /** Social login handlers */
  onGoogleLogin?: () => void
  onGithubLogin?: () => void
  /** Link handlers */
  onForgotPassword?: () => void
  onSignUp?: () => void
}

export function LoginForm({
  title = 'Welcome Back',
  subtitle = 'Sign in to your account to continue',
  showSocialLogin = true,
  onSubmit,
  onGoogleLogin,
  onGithubLogin,
  onForgotPassword,
  onSignUp,
}: LoginFormProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    setLoading(true)
    try {
      await onSubmit(email, password)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-heading mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Social Login */}
        {showSocialLogin && (
          <div className="space-y-3 mb-6">
            <button
              onClick={onGoogleLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-input hover:border-primary transition-colors"
            >
              <Chrome className="w-5 h-5" />
              <span>Continue with Google</span>
            </button>
            <button
              onClick={onGithubLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-border rounded-input hover:border-primary transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>Continue with GitHub</span>
            </button>
          </div>
        )}

        {/* Divider */}
        {showSocialLogin && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-background text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startIcon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              {onForgotPassword && (
                <button
                  type="button"
                  onClick={onForgotPassword}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startIcon={<Lock className="h-4 w-4" />}
              required
            />
          </div>

          <MagneticButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </MagneticButton>
        </form>

        {/* Sign Up Link */}
        {onSignUp && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{' '}
            <button
              onClick={onSignUp}
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
