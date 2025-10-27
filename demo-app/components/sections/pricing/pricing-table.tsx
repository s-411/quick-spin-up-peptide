'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Check, X } from 'lucide-react'

export interface PricingFeature {
  name: string
  starter: boolean | string
  pro: boolean | string
  enterprise: boolean | string
}

export interface PricingTableProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Features for comparison */
  features: PricingFeature[]
  /** Tier details */
  tiers?: {
    starter: {
      price: number | string
      cta: string
      onCTAClick: () => void
    }
    pro: {
      price: number | string
      cta: string
      onCTAClick: () => void
    }
    enterprise: {
      price: number | string
      cta: string
      onCTAClick: () => void
    }
  }
}

export function PricingTable({
  title = 'Compare Plans',
  description = 'Find the perfect plan for your needs',
  features,
  tiers,
}: PricingTableProps) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-success mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground mx-auto" />
      )
    }
    return <span className="text-sm">{value}</span>
  }

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

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-heading">Features</th>
                <th className="text-center p-4">
                  <div className="space-y-2">
                    <div className="font-heading text-xl">Starter</div>
                    {tiers && (
                      <>
                        <div className="text-3xl font-heading">
                          {typeof tiers.starter.price === 'number'
                            ? `$${tiers.starter.price}`
                            : tiers.starter.price}
                        </div>
                        <MagneticButton
                          variant="secondary"
                          onClick={tiers.starter.onCTAClick}
                          className="w-full"
                        >
                          {tiers.starter.cta}
                        </MagneticButton>
                      </>
                    )}
                  </div>
                </th>
                <th className="text-center p-4 bg-primary/5">
                  <div className="space-y-2">
                    <div className="font-heading text-xl">Pro</div>
                    {tiers && (
                      <>
                        <div className="text-3xl font-heading">
                          {typeof tiers.pro.price === 'number'
                            ? `$${tiers.pro.price}`
                            : tiers.pro.price}
                        </div>
                        <MagneticButton
                          variant="primary"
                          onClick={tiers.pro.onCTAClick}
                          className="w-full"
                        >
                          {tiers.pro.cta}
                        </MagneticButton>
                      </>
                    )}
                  </div>
                </th>
                <th className="text-center p-4">
                  <div className="space-y-2">
                    <div className="font-heading text-xl">Enterprise</div>
                    {tiers && (
                      <>
                        <div className="text-3xl font-heading">
                          {typeof tiers.enterprise.price === 'number'
                            ? `$${tiers.enterprise.price}`
                            : tiers.enterprise.price}
                        </div>
                        <MagneticButton
                          variant="secondary"
                          onClick={tiers.enterprise.onCTAClick}
                          className="w-full"
                        >
                          {tiers.enterprise.cta}
                        </MagneticButton>
                      </>
                    )}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <tr
                  key={index}
                  className="border-b border-border hover:bg-accent/50 transition-colors"
                >
                  <td className="p-4 font-medium">{feature.name}</td>
                  <td className="p-4 text-center">
                    {renderValue(feature.starter)}
                  </td>
                  <td className="p-4 text-center bg-primary/5">
                    {renderValue(feature.pro)}
                  </td>
                  <td className="p-4 text-center">
                    {renderValue(feature.enterprise)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
