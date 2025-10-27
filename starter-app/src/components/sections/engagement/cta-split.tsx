'use client'

import * as React from 'react'
import { Check } from 'lucide-react'

export interface CtaSplitProps {
  /** Main headline */
  headline: string
  /** Supporting text */
  description?: string
  /** List of benefits/features */
  features?: string[]
  /** Primary CTA text */
  primaryCta: string
  /** Primary CTA click handler */
  onPrimaryClick?: () => void
  /** Secondary CTA text */
  secondaryCta?: string
  /** Secondary CTA click handler */
  onSecondaryClick?: () => void
  /** Image URL */
  image?: string
  /** Image position */
  imagePosition?: 'left' | 'right'
  /** Custom image component */
  imageComponent?: React.ReactNode
}

export function CtaSplit({
  headline,
  description,
  features,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  image,
  imagePosition = 'right',
  imageComponent,
}: CtaSplitProps) {
  const content = (
    <div className="space-y-6">
      {/* Headline */}
      <h2 className="text-4xl md:text-5xl font-heading">
        {headline}
      </h2>

      {/* Description */}
      {description && (
        <p className="text-lg text-muted-foreground">
          {description}
        </p>
      )}

      {/* Features List */}
      {features && features.length > 0 && (
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={onPrimaryClick}
          className="btn-mm"
        >
          {primaryCta}
        </button>
        {secondaryCta && (
          <button
            onClick={onSecondaryClick}
            className="px-6 py-3 rounded-mm border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {secondaryCta}
          </button>
        )}
      </div>
    </div>
  )

  const visual = imageComponent ? (
    <div className="flex items-center justify-center">
      {imageComponent}
    </div>
  ) : image ? (
    <div className="relative h-[400px] md:h-[500px] rounded-card overflow-hidden">
      <img
        src={image}
        alt={headline}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <div className="relative h-[400px] md:h-[500px] rounded-card bg-muted flex items-center justify-center">
      <div className="text-muted-foreground text-lg">Image Placeholder</div>
    </div>
  )

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className={`grid md:grid-cols-2 gap-12 items-center ${
          imagePosition === 'left' ? 'md:flex-row-reverse' : ''
        }`}>
          {imagePosition === 'left' ? (
            <>
              <div className="md:order-2">{content}</div>
              <div className="md:order-1">{visual}</div>
            </>
          ) : (
            <>
              {content}
              {visual}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
