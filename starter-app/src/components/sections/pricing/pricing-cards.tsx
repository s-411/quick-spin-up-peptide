'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Check, Star } from 'lucide-react'

export interface PricingTier {
  name: string
  price: number | string
  period?: string
  description: string
  features: string[]
  cta: string
  onCTAClick: () => void
  popular?: boolean
  badge?: string
}

export interface PricingCardsProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Pricing tiers */
  tiers: PricingTier[]
}

export function PricingCards({
  title = 'Simple, Transparent Pricing',
  description = 'Choose the plan that works best for you',
  tiers,
}: PricingCardsProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tiers.map((tier, index) => (
            <EnhancedCard
              key={index}
              className={`relative p-8 space-y-6 ${
                tier.popular
                  ? 'border-2 border-primary shadow-lg scale-105'
                  : ''
              }`}
            >
              {/* Popular Badge */}
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <div className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {tier.badge || 'Most Popular'}
                  </div>
                </div>
              )}

              {/* Tier Name */}
              <div>
                <h3 className="text-2xl font-heading mb-2">{tier.name}</h3>
                <p className="text-muted-foreground">{tier.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-heading">
                    {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-muted-foreground">/{tier.period}</span>
                  )}
                </div>
              </div>

              {/* CTA Button */}
              <MagneticButton
                variant={tier.popular ? 'primary' : 'secondary'}
                onClick={tier.onCTAClick}
                className="w-full"
              >
                {tier.cta}
              </MagneticButton>

              {/* Features List */}
              <ul className="space-y-3 pt-4">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 p-1 rounded-full bg-success/10">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
