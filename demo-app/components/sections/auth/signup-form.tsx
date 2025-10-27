'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Mail, Lock, User, Check, X } from 'lucide-react'

export interface SignupFormProps {
  /** Form title */
  title?: string
  /** Form subtitle */
  subtitle?: string
  /** Submit handler */
  onSubmit?: (name: string, email: string, password: string) => void
  /** Sign in link handler */
  onSignIn?: () => void
}

export function SignupForm({
  title = 'Create Account',
  subtitle = 'Start your journey with us today',
  onSubmit,
  onSignIn,
}: SignupFormProps) {
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  // Password validation
  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains uppercase letter', test: (p: string) => /[A-Z]/.test(p) },
    { label: 'Contains number', test: (p: string) => /[0-9]/.test(p) },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    setLoading(true)
    try {
      await onSubmit(name, email, password)
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

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              startIcon={<User className="h-4 w-4" />}
              required
            />
          </div>

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
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              startIcon={<Lock className="h-4 w-4" />}
              required
            />

            {/* Password Requirements */}
            {password && (
              <div className="mt-3 space-y-2">
                {passwordRequirements.map((req, i) => {
                  const isValid = req.test(password)
                  return (
                    <div
                      key={i}
                      className={`flex items-center gap-2 text-xs transition-colors ${
                        isValid ? 'text-success' : 'text-muted-foreground'
                      }`}
                    >
                      {isValid ? (
                        <Check className="w-3 h-3" />
                      ) : (
                        <X className="w-3 h-3" />
                      )}
                      <span>{req.label}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <button type="button" className="text-primary hover:underline">
              Terms of Service
            </button>{' '}
            and{' '}
            <button type="button" className="text-primary hover:underline">
              Privacy Policy
            </button>
          </div>

          <MagneticButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </MagneticButton>
        </form>

        {/* Sign In Link */}
        {onSignIn && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <button
              onClick={onSignIn}
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </button>
          </p>
        )}
      </div>
    </section>
  )
}
