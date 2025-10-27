'use client'

import * as React from 'react'

export interface CtaBannerProps {
  /** Main headline */
  headline: string
  /** Supporting text */
  description?: string
  /** Primary CTA text */
  primaryCta: string
  /** Primary CTA click handler */
  onPrimaryClick?: () => void
  /** Secondary CTA text */
  secondaryCta?: string
  /** Secondary CTA click handler */
  onSecondaryClick?: () => void
  /** Background variant */
  variant?: 'gradient' | 'solid' | 'image'
  /** Background image URL (when variant is 'image') */
  backgroundImage?: string
}

export function CtaBanner({
  headline,
  description,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  variant = 'gradient',
  backgroundImage,
}: CtaBannerProps) {
  const getBackgroundStyles = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20'
      case 'image':
        return 'relative'
      case 'solid':
      default:
        return 'bg-accent'
    }
  }

  return (
    <section className={`py-20 px-4 relative overflow-hidden ${getBackgroundStyles()}`}>
      {/* Background Image */}
      {variant === 'image' && backgroundImage && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
          <div className="absolute inset-0 bg-background/90 backdrop-blur-sm" />
        </>
      )}

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-heading mb-6">
          {headline}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {description}
          </p>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
    </section>
  )
}
