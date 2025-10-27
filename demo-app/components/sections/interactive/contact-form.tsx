'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Mail, User, MessageSquare, Send, CheckCircle2 } from 'lucide-react'

export interface ContactFormProps {
  /** Form title */
  title?: string
  /** Form description */
  description?: string
  /** Submit callback */
  onSubmit?: (data: ContactFormData) => void | Promise<void>
  /** Show success message after submit */
  showSuccessMessage?: boolean
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/**
 * ContactForm - Multi-field contact form with validation
 *
 * @example
 * ```tsx
 * <ContactForm
 *   title="Get in Touch"
 *   description="We'd love to hear from you"
 *   onSubmit={handleSubmit}
 * />
 * ```
 */
export function ContactForm({
  title = 'Contact Us',
  description = 'Fill out the form below and we\'ll get back to you soon.',
  onSubmit,
  showSuccessMessage = true,
}: ContactFormProps) {
  const [formData, setFormData] = React.useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = React.useState<Partial<Record<keyof ContactFormData, string>>>({})
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSuccess, setIsSuccess] = React.useState(false)

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        console.log('Form submitted:', formData)
      }

      if (showSuccessMessage) {
        setIsSuccess(true)
        setFormData({ name: '', email: '', subject: '', message: '' })
        setTimeout(() => setIsSuccess(false), 5000)
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <EnhancedCard tilt={false} glowEffect={false} className="p-12 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-heading">Message Sent!</h3>
          <p className="text-muted-foreground">
            Thank you for contacting us. We'll get back to you as soon as possible.
          </p>
          <button type="button" onClick={() => setIsSuccess(false)} className="btn-mm">
            Send Another Message
          </button>
        </div>
      </EnhancedCard>
    )
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false}>
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-heading">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Name <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Subject Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Subject <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="How can we help?"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            className={errors.subject ? 'border-destructive' : ''}
          />
          {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
        </div>

        {/* Message Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Message <span className="text-destructive">*</span>
          </label>
          <Textarea
            placeholder="Tell us more about your inquiry..."
            value={formData.message}
            onChange={(e) => handleChange('message', e.target.value)}
            className={`min-h-[150px] ${errors.message ? 'border-destructive' : ''}`}
          />
          {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
          <p className="text-xs text-muted-foreground">{formData.message.length} characters</p>
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className="btn-mm w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Sending...
            </>
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </>
          )}
        </button>
      </form>
    </EnhancedCard>
  )
}
