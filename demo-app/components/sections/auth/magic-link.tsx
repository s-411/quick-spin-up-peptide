'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Mail, ArrowLeft, Check, Sparkles, Shield, Zap } from 'lucide-react'

export interface MagicLinkProps {
  /** Form title */
  title?: string
  /** Form subtitle */
  subtitle?: string
  /** Submit handler */
  onSubmit?: (email: string) => void
  /** Back to login handler */
  onBackToLogin?: () => void
}

export function MagicLink({
  title = 'Sign in with Magic Link',
  subtitle = 'No password needed. We will email you a secure link.',
  onSubmit,
  onBackToLogin,
}: MagicLinkProps) {
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
            <h2 className="text-2xl font-heading mb-2">Check Your Inbox</h2>
            <p className="text-muted-foreground">
              We sent a magic link to{' '}
              <span className="font-medium text-foreground">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Click the link in your email to sign in instantly. The link expires in 15 minutes.
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
          <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-heading mb-2">
            {title}
          </h1>
          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-8 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Check className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">No password to remember</p>
              <p className="text-sm text-muted-foreground">Sign in with just your email</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">More secure</p>
              <p className="text-sm text-muted-foreground">Unique link for each sign-in</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Zap className="w-4 h-4 text-success" />
            </div>
            <div>
              <p className="font-medium">One-click sign in</p>
              <p className="text-sm text-muted-foreground">Just click the link in your email</p>
            </div>
          </div>
        </div>

        {/* Magic Link Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="magic-email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="magic-email"
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
            {loading ? 'Sending...' : 'Send Magic Link'}
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
