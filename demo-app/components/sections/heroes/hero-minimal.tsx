'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ArrowRight } from 'lucide-react'

export interface HeroMinimalProps {
  /** Main headline */
  headline?: string
  /** Optional subheadline */
  subheadline?: string
  /** Primary CTA button text */
  primaryCTA?: string
  /** Show secondary link */
  secondaryLink?: string
  /** Primary button click handler */
  onPrimaryClick?: () => void
  /** Secondary link click handler */
  onSecondaryClick?: () => void
}

export function HeroMinimal({
  headline = 'Simple. Powerful. Elegant.',
  subheadline,
  primaryCTA = 'Get Started',
  secondaryLink = 'Learn More',
  onPrimaryClick,
  onSecondaryClick,
}: HeroMinimalProps) {
  return (
    <section className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center space-y-12">
        {/* Headline */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading leading-tight tracking-tight">
          {headline}
        </h1>

        {/* Optional Subheadline */}
        {subheadline && (
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
          <MagneticButton
            variant="primary"
            onClick={onPrimaryClick}
          >
            {primaryCTA}
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          {secondaryLink && (
            <button
              onClick={onSecondaryClick}
              className="group text-foreground hover:text-primary transition-colors font-medium flex items-center gap-2"
            >
              {secondaryLink}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>

        {/* Minimal decorative line */}
        <div className="pt-20 flex justify-center">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-border to-transparent" />
        </div>
      </div>
    </section>
  )
}
