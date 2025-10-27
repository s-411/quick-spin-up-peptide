'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Check } from 'lucide-react'

export interface PricingPlan {
  name: string
  monthlyPrice: number
  annualPrice: number
  description: string
  features: string[]
  cta: string
  onCTAClick: (isAnnual: boolean) => void
  popular?: boolean
}

export interface PricingToggleProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Pricing plans */
  plans: PricingPlan[]
  /** Annual discount percentage */
  annualDiscount?: number
}

export function PricingToggle({
  title = 'Flexible Pricing',
  description = 'Save up to 20% with annual billing',
  plans,
  annualDiscount = 20,
}: PricingToggleProps) {
  const [isAnnual, setIsAnnual] = React.useState(false)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {description}
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 p-1 rounded-full bg-muted">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full transition-all ${
                !isAnnual
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full transition-all flex items-center gap-2 ${
                isAnnual
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:text-primary'
              }`}
            >
              Annual
              <span className="px-2 py-0.5 rounded-full bg-success text-success-foreground text-xs font-medium">
                Save {annualDiscount}%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const price = isAnnual ? plan.annualPrice : plan.monthlyPrice
            const savings = isAnnual
              ? ((plan.monthlyPrice * 12 - plan.annualPrice) / (plan.monthlyPrice * 12)) * 100
              : 0

            return (
              <EnhancedCard
                key={index}
                className={`relative p-8 space-y-6 ${
                  plan.popular
                    ? 'border-2 border-primary shadow-lg'
                    : ''
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-4 py-1 rounded-full bg-primary text-primary-foreground text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Plan Name */}
                <div>
                  <h3 className="text-2xl font-heading mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-heading">${price}</span>
                    <span className="text-muted-foreground">
                      /{isAnnual ? 'year' : 'month'}
                    </span>
                  </div>
                  {isAnnual && savings > 0 && (
                    <p className="text-sm text-success mt-2">
                      Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(0)} per year
                    </p>
                  )}
                </div>

                {/* CTA Button */}
                <MagneticButton
                  variant={plan.popular ? 'primary' : 'secondary'}
                  onClick={() => plan.onCTAClick(isAnnual)}
                  className="w-full"
                >
                  {plan.cta}
                </MagneticButton>

                {/* Features List */}
                <ul className="space-y-3 pt-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-success/10">
                        <Check className="w-3 h-3 text-success" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </EnhancedCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
