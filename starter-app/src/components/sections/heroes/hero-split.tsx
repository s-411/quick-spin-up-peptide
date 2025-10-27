'use client'

import * as React from 'react'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { ArrowRight, Check } from 'lucide-react'
import Image from 'next/image'

export interface HeroSplitProps {
  /** Main headline */
  headline?: string
  /** Subheadline or description */
  subheadline?: string
  /** Feature list */
  features?: string[]
  /** Primary CTA button text */
  primaryCTA?: string
  /** Primary button click handler */
  onPrimaryClick?: () => void
  /** Image URL or component */
  image?: string | React.ReactNode
  /** Image position */
  imagePosition?: 'left' | 'right'
}

export function HeroSplit({
  headline = 'Transform Your Workflow',
  subheadline = 'Streamline your development process with our comprehensive design system. Build faster, ship sooner.',
  features = [
    'Pre-built sections and components',
    'Responsive and accessible',
    'Light and dark mode support',
    'Fully customizable design tokens',
  ],
  primaryCTA = 'Start Building',
  onPrimaryClick,
  image,
  imagePosition = 'right',
}: HeroSplitProps) {
  const contentOrder = imagePosition === 'left' ? 'order-2' : 'order-1'
  const imageOrder = imagePosition === 'left' ? 'order-1' : 'order-2'

  const renderImage = () => {
    if (!image) {
      // Default placeholder
      return (
        <EnhancedCard className="w-full h-full min-h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
          <div className="text-center p-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-muted-foreground">Image Placeholder</p>
          </div>
        </EnhancedCard>
      )
    }

    if (typeof image === 'string') {
      return (
        <div className="relative w-full h-full min-h-[400px] rounded-card overflow-hidden">
          <Image
            src={image}
            alt={headline}
            fill
            className="object-cover"
          />
        </div>
      )
    }

    return image
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className={`space-y-6 ${contentOrder}`}>
            <h1 className="text-4xl md:text-6xl font-heading leading-tight">
              {headline}
            </h1>

            <p className="text-lg text-muted-foreground">
              {subheadline}
            </p>

            {/* Features List */}
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 p-1 rounded-full bg-primary/10">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <MagneticButton
                variant="primary"
                onClick={onPrimaryClick}
              >
                {primaryCTA}
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          {/* Image */}
          <div className={imageOrder}>
            {renderImage()}
          </div>
        </div>
      </div>
    </section>
  )
}
