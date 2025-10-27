'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Mail, ArrowLeft, Check } from 'lucide-react'

export interface PasswordResetProps {
  /** Form title */
  title?: string
  /** Form subtitle */
  subtitle?: string
  /** Submit handler */
  onSubmit?: (email: string) => void
  /** Back to login handler */
  onBackToLogin?: () => void
}

export function PasswordReset({
  title = 'Reset Password',
  subtitle = 'Enter your email to receive reset instructions',
  onSubmit,
  onBackToLogin,
}: PasswordResetProps) {
  const [email, setEmail] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [submitted, setSubmitted] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) return

    setLoading(true)
    try {
      await onSubmit(email)
      setSubmitted(true)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Success State */}
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-success/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h2 className="text-2xl font-heading mb-2">Check Your Email</h2>
            <p className="text-muted-foreground">
              We've sent password reset instructions to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <MagneticButton
              variant="secondary"
              onClick={() => setSubmitted(false)}
              className="w-full"
            >
              Try Another Email
            </MagneticButton>

            {onBackToLogin && (
              <button
                onClick={onBackToLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </button>
            )}
          </div>
        </div>
      </section>
    )
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

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="reset-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              startIcon={<Mail className="h-4 w-4" />}
              required
            />
          </div>

          <MagneticButton
            type="submit"
            variant="primary"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </MagneticButton>
        </form>

        {/* Back to Login Link */}
        {onBackToLogin && (
          <button
            onClick={onBackToLogin}
            className="w-full mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>
        )}
      </div>
    </section>
  )
}
