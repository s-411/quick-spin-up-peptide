'use client'

import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Check, AlertCircle, X } from 'lucide-react'

export interface NewsletterPopupProps {
  /** Modal title */
  title?: string
  /** Modal description */
  description?: string
  /** Input placeholder */
  placeholder?: string
  /** CTA button text */
  buttonText?: string
  /** Privacy note */
  privacyNote?: string
  /** Delay before showing modal (ms, 0 to disable auto-show) */
  delay?: number
  /** Submit handler */
  onSubmit?: (email: string) => Promise<void>
}

export function NewsletterPopup({
  title = 'Join Our Newsletter',
  description = 'Subscribe to get the latest updates and exclusive content',
  placeholder = 'your@email.com',
  buttonText = 'Subscribe',
  privacyNote = 'We respect your privacy. Unsubscribe anytime.',
  delay = 3000,
  onSubmit,
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState('')

  // Auto-show modal after delay
  React.useEffect(() => {
    if (delay > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

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
      setTimeout(() => {
        setIsOpen(false)
        setStatus('idle')
      }, 2000)
    } catch (error) {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        {status === 'success' ? (
          <div className="text-center space-y-4 py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-heading">
              You're subscribed!
            </DialogTitle>
            <DialogDescription>
              Thank you for subscribing. Check your inbox for confirmation.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-heading">
                {title}
              </DialogTitle>
              <DialogDescription className="text-base">
                {description}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              {/* Email Input */}
              <Input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="px-3 py-3"
                disabled={status === 'loading'}
                autoFocus
              />

              {/* Error Message */}
              {status === 'error' && errorMessage && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className="btn-mm w-full"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? 'Subscribing...' : buttonText}
              </button>

              {/* Privacy Note */}
              {privacyNote && (
                <p className="text-xs text-center text-muted-foreground">
                  {privacyNote}
                </p>
              )}
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
