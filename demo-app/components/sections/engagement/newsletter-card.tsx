'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Input } from '@/components/ui/input'
import { Check, AlertCircle } from 'lucide-react'

export interface NewsletterCardProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** List of benefits */
  benefits?: string[]
  /** Input placeholder */
  placeholder?: string
  /** CTA button text */
  buttonText?: string
  /** Privacy note */
  privacyNote?: string
  /** Submit handler */
  onSubmit?: (email: string) => Promise<void>
}

export function NewsletterCard({
  title = 'Stay in the Loop',
  description = 'Join thousands of subscribers and get the latest news',
  benefits = [
    'Weekly updates',
    'Exclusive content',
    'No spam, ever',
  ],
  placeholder = 'your@email.com',
  buttonText = 'Subscribe',
  privacyNote = 'We respect your privacy. Unsubscribe at any time.',
  onSubmit,
}: NewsletterCardProps) {
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      await onSubmit?.(email)
      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <EnhancedCard className="!p-8 md:!p-12">
          {status === 'success' ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-heading">
                You're all set!
              </h3>
              <p className="text-muted-foreground">
                Check your inbox for a confirmation email.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-heading">
                  {title}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {description}
                </p>
              </div>

              {/* Benefits */}
              {benefits && benefits.length > 0 && (
                <div className="flex flex-wrap justify-center gap-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Form removed - to be reimplemented later */}
              {privacyNote && (
                <p className="text-xs text-center text-muted-foreground">
                  {privacyNote}
                </p>
              )}
            </div>
          )}
        </EnhancedCard>
      </div>
    </section>
  )
}
