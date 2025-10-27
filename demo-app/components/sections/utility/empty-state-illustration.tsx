'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import Image from 'next/image'

export interface EmptyStateAction {
  /** Action label */
  label: string
  /** Action callback */
  onClick: () => void
  /** Is this a primary action */
  primary?: boolean
}

export interface EmptyStateIllustrationProps {
  /** Illustration image source or component */
  illustration?: React.ReactNode | string
  /** Main heading */
  title: string
  /** Description text */
  description?: string
  /** Primary action */
  primaryAction?: EmptyStateAction
  /** Secondary action */
  secondaryAction?: EmptyStateAction
  /** Help text below actions */
  helpText?: string
}

/**
 * EmptyStateIllustration - Rich empty state with illustration
 *
 * @example
 * ```tsx
 * <EmptyStateIllustration
 *   illustration="/images/empty-cart.svg"
 *   title="Your cart is empty"
 *   description="Add items to your cart to get started with your purchase"
 *   primaryAction={{ label: "Browse Products", onClick: () => {}, primary: true }}
 *   secondaryAction={{ label: "View Wishlist", onClick: () => {} }}
 *   helpText="Need help? Contact our support team"
 * />
 * ```
 */
export function EmptyStateIllustration({
  illustration,
  title,
  description,
  primaryAction,
  secondaryAction,
  helpText,
}: EmptyStateIllustrationProps) {
  return (
    <EnhancedCard tilt={false} glowEffect={false} className="w-full">
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        {/* Illustration */}
        {illustration && (
          <div className="mb-8 w-full max-w-xs">
            {typeof illustration === 'string' ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={illustration}
                  alt={title}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              illustration
            )}
          </div>
        )}

        {/* Content */}
        <div className="max-w-lg space-y-3 mb-8">
          <h2 className="text-3xl font-heading font-bold">{title}</h2>
          {description && (
            <p className="text-lg text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Actions */}
        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            {primaryAction && (
              <button
                onClick={primaryAction.onClick}
                className={primaryAction.primary ? 'btn-mm' : 'btn-secondary'}
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                onClick={secondaryAction.onClick}
                className={secondaryAction.primary ? 'btn-mm' : 'btn-secondary'}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}

        {/* Help Text */}
        {helpText && (
          <p className="text-sm text-muted-foreground/70">{helpText}</p>
        )}
      </div>
    </EnhancedCard>
  )
}
