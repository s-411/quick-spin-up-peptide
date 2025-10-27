'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { PricingPlan } from '@/types'

const plans: PricingPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for individuals and small projects',
    price: 9.99,
    interval: 'month',
    features: [
      'Up to 10 documents',
      '1,000 chat messages/month',
      'Email support',
      'Basic analytics',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_BASIC || '',
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professionals and growing teams',
    price: 29.99,
    interval: 'month',
    features: [
      'Unlimited documents',
      '10,000 chat messages/month',
      'Priority email support',
      'Advanced analytics',
      'Custom integrations',
      'Team collaboration',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO || '',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For large organizations with custom needs',
    price: 99.99,
    interval: 'month',
    features: [
      'Everything in Pro',
      'Unlimited chat messages',
      'Dedicated support',
      'Custom deployment options',
      'SLA guarantee',
      'Advanced security',
      'API access',
    ],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ENTERPRISE || '',
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: PricingPlan) => {
    setLoading(plan.id)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.id,
        }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Subscription error:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="text-lg text-muted-foreground">Choose the plan that's right for you</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map(plan => (
            <div
              key={plan.id}
              className={`relative rounded-lg border p-8 ${
                plan.popular ? 'border-primary bg-primary/5' : 'border-border bg-card'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-semibold text-primary-foreground">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className="text-muted-foreground">/{plan.interval}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="text-green-600">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={loading === plan.id}
                className={`w-full rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'border border-border bg-background hover:bg-accent'
                }`}
              >
                {loading === plan.id ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Need something custom?{' '}
            <Link href="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
