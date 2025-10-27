'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Check, AlertCircle } from 'lucide-react'

export interface NewsletterInlineProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Input placeholder */
  placeholder?: string
  /** CTA button text */
  buttonText?: string
  /** Show terms checkbox */
  showTerms?: boolean
  /** Terms text */
  termsText?: string
  /** Submit handler */
  onSubmit?: (email: string) => Promise<void>
}

export function NewsletterInline({
  title = 'Subscribe to Our Newsletter',
  description = 'Get the latest updates delivered to your inbox',
  placeholder = 'Enter your email',
  buttonText = 'Subscribe',
  showTerms = false,
  termsText = 'I agree to receive marketing emails',
  onSubmit,
}: NewsletterInlineProps) {
  const [email, setEmail] = React.useState('')
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !email.includes('@')) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address')
      return
    }

    if (showTerms && !termsAccepted) {
      setStatus('error')
      setErrorMessage('Please accept the terms')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      await onSubmit?.(email)
      setStatus('success')
      setEmail('')
      setTermsAccepted(false)
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-heading mb-4">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          {description}
        </p>

        {/* Form removed - to be reimplemented later */}
      </div>
    </section>
  )
}
