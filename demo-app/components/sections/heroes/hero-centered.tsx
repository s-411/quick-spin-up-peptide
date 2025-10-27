'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ArrowRight, Play } from 'lucide-react'

export interface HeroCenteredProps {
  /** Main headline */
  headline?: string
  /** Subheadline or description */
  subheadline?: string
  /** Primary CTA button text */
  primaryCTA?: string
  /** Secondary CTA button text */
  secondaryCTA?: string
  /** Primary button click handler */
  onPrimaryClick?: () => void
  /** Secondary button click handler */
  onSecondaryClick?: () => void
  /** Show decorative elements */
  showDecorations?: boolean
}

export function HeroCentered({
  headline = 'Build Amazing Apps Faster',
  subheadline = 'The complete design system with pre-built sections, components, and interactions. Ship beautiful products in hours, not weeks.',
  primaryCTA = 'Get Started',
  secondaryCTA = 'Watch Demo',
  onPrimaryClick,
  onSecondaryClick,
  showDecorations = true,
}: HeroCenteredProps) {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background Decorations */}
      {showDecorations && (
        <>
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-heading leading-tight">
          {headline}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <MagneticButton
            variant="primary"
            onClick={onPrimaryClick}
          >
            {primaryCTA}
            <ArrowRight className="w-4 h-4" />
          </MagneticButton>

          <MagneticButton
            variant="secondary"
            onClick={onSecondaryClick}
          >
            <Play className="w-4 h-4" />
            {secondaryCTA}
          </MagneticButton>
        </div>

        {/* Optional: Trust indicators or stats */}
        <div className="pt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>50+ Components</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Fully Responsive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Dark Mode Ready</span>
          </div>
        </div>
      </div>
    </section>
  )
}
