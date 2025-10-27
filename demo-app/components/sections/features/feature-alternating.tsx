'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { Check, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export interface AlternatingFeature {
  title: string
  description: string
  benefits: string[]
  image?: string | React.ReactNode
  cta?: {
    text: string
    onClick: () => void
  }
}

export interface FeatureAlternatingProps {
  /** Array of features (will alternate left/right) */
  features: AlternatingFeature[]
}

export function FeatureAlternating({ features }: FeatureAlternatingProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-32">
        {features.map((feature, index) => {
          const isEven = index % 2 === 0
          const contentOrder = isEven ? 'lg:order-1' : 'lg:order-2'
          const imageOrder = isEven ? 'lg:order-2' : 'lg:order-1'

          return (
            <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className={`space-y-6 ${contentOrder}`}>
                <h2 className="text-3xl md:text-4xl font-heading">
                  {feature.title}
                </h2>

                <p className="text-lg text-muted-foreground">
                  {feature.description}
                </p>

                {/* Benefits */}
                <ul className="space-y-3">
                  {feature.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 p-1 rounded-full bg-success/10">
                        <Check className="w-4 h-4 text-success" />
                      </div>
                      <span className="text-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Optional CTA */}
                {feature.cta && (
                  <div className="pt-4">
                    <MagneticButton
                      variant="primary"
                      onClick={feature.cta.onClick}
                    >
                      {feature.cta.text}
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </div>
                )}
              </div>

              {/* Image */}
              <div className={imageOrder}>
                {typeof feature.image === 'string' ? (
                  <div className="relative aspect-video rounded-card overflow-hidden border border-border">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : feature.image ? (
                  feature.image
                ) : (
                  // Placeholder
                  <div className="aspect-video rounded-card bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border">
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/20 flex items-center justify-center">
                        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <p className="text-sm text-muted-foreground">Image Placeholder</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
