'use client'

import * as React from 'react'

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
}: NewsletterInlineProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-heading mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground mb-8">{description}</p>

        {/* Form removed - to be reimplemented later */}
      </div>
    </section>
  )
}
