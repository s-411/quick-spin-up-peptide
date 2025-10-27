'use client'

import * as React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export interface EmailSignupSplitProps {
  /** Main heading text */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Email placeholder text */
  emailPlaceholder?: string
  /** Button text */
  buttonText?: string
  /** Form submit handler */
  onSubmit?: (email: string) => void
  /** Privacy policy text */
  privacyText?: string
  /** Privacy policy link */
  privacyLink?: string
  /** Show image placeholder */
  showImage?: boolean
  /** Custom image element */
  imageElement?: React.ReactNode
  /** Image position - left or right */
  imagePosition?: 'left' | 'right'
}

/**
 * EmailSignupSplit Component
 *
 * A layout component with email signup form and image/placeholder.
 * Matches hero-6 layout but styled with MM Design System.
 *
 * Features:
 * - Email input with signup button
 * - GDPR-compliant privacy policy link
 * - Configurable layout: form left/right, image left/right
 * - Fully responsive (stacks naturally on mobile)
 * - Light/dark mode support
 * - MM Design System styling
 */
export function EmailSignupSplit({
  heading = 'A heading to introduce your website offer',
  bodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings.',
  emailPlaceholder = 'Email',
  buttonText = 'SIGN UP',
  onSubmit,
  privacyText = 'GDPR-compliant, so you can subtly include a link to your',
  privacyLink = 'Privacy Policy',
  showImage = true,
  imageElement,
  imagePosition = 'right',
}: EmailSignupSplitProps) {
  const [email, setEmail] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(email)
    }
  }

  // Form content column
  const formContent = (
    <div className="space-y-6">
      {/* Heading - Using MM Design System font-heading (National2Condensed) */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading leading-tight text-foreground">
        {heading}
      </h2>

      {/* Body Copy - Using MM Design System default font (ESKlarheit) */}
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        {bodyCopy}
      </p>

      {/* Email Signup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder={emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-mm flex-1"
            required
          />
          <button
            type="submit"
            className="btn-mm whitespace-nowrap"
          >
            {buttonText}
          </button>
        </div>

        {/* Privacy Policy Text */}
        <p className="text-sm text-muted-foreground">
          {privacyText}{' '}
          <a href="#" className="underline hover:text-foreground transition-colors">
            {privacyLink}
          </a>
        </p>
      </form>
    </div>
  )

  // Image placeholder column
  const imageContent = showImage && (
    <div>
      {imageElement || (
        <div className="relative w-full aspect-[4/3] rounded-card bg-muted/50 dark:bg-muted/30 flex items-center justify-center">
          {/* Placeholder Icon */}
          <div className="flex flex-col items-center justify-center text-muted-foreground/40">
            <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-lg bg-muted/60 dark:bg-muted/40 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground/50">Image Placeholder</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Render columns in order based on imagePosition */}
          {imagePosition === 'left' ? (
            <>
              {imageContent}
              {formContent}
            </>
          ) : (
            <>
              {formContent}
              {imageContent}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
