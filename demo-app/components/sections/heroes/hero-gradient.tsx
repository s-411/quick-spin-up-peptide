'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { ArrowRight, Sparkles } from 'lucide-react'

export interface HeroGradientProps {
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
  /** Gradient colors */
  gradientFrom?: string
  gradientTo?: string
}

export function HeroGradient({
  headline = 'Design System Reimagined',
  subheadline = 'Create stunning interfaces with our premium component library and design tokens',
  primaryCTA = 'Explore Components',
  secondaryCTA = 'View Pricing',
  onPrimaryClick,
  onSecondaryClick,
  gradientFrom = 'from-primary',
  gradientTo = 'to-secondary',
}: HeroGradientProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-10`} />

      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-gradient-to-br from-primary/30 to-transparent rounded-full blur-3xl animate-pulse-custom" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-gradient-to-bl from-secondary/30 to-transparent rounded-full blur-3xl animate-pulse-custom" style={{ animationDelay: '1s' }} />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center px-4 space-y-8">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-border">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">New: 50+ Premium Sections</span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading leading-tight bg-gradient-to-r from-primary via-foreground to-secondary bg-clip-text text-transparent">
          {headline}
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          {subheadline}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
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
            {secondaryCTA}
          </MagneticButton>
        </div>

        {/* Social Proof */}
        <div className="pt-12 flex flex-col items-center gap-4">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background flex items-center justify-center text-white text-xs font-bold"
              >
                {i}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Trusted by <span className="font-semibold text-foreground">10,000+</span> developers worldwide
          </p>
        </div>
      </div>
    </section>
  )
}
