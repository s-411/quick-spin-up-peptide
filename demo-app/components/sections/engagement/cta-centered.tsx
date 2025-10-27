'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'

export interface CtaFeature {
  /** Feature icon */
  icon: LucideIcon
  /** Feature text */
  text: string
}

export interface CtaCenteredProps {
  /** Main headline */
  headline: string
  /** Supporting text */
  description?: string
  /** List of feature highlights */
  features?: CtaFeature[]
  /** Primary CTA text */
  primaryCta: string
  /** Primary CTA click handler */
  onPrimaryClick?: () => void
  /** Secondary CTA text */
  secondaryCta?: string
  /** Secondary CTA click handler */
  onSecondaryClick?: () => void
  /** Trust indicators/stats */
  trustIndicators?: string[]
}

export function CtaCentered({
  headline,
  description,
  features,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
  trustIndicators,
}: CtaCenteredProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Headline */}
        <h2 className="text-4xl md:text-6xl font-heading mb-6">
          {headline}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            {description}
          </p>
        )}

        {/* Features */}
        {features && features.length > 0 && (
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-foreground">{feature.text}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
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

        {/* Trust Indicators */}
        {trustIndicators && trustIndicators.length > 0 && (
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {trustIndicators.map((indicator, index) => (
              <React.Fragment key={index}>
                <span>{indicator}</span>
                {index < trustIndicators.length - 1 && (
                  <span className="hidden sm:inline">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
