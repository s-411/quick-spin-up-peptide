'use client'

import * as React from 'react'
import { LucideIcon, Inbox } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface EmptyStateSimpleProps {
  /** Icon component to display */
  icon?: LucideIcon
  /** Main heading */
  title: string
  /** Description text */
  description?: string
  /** Primary action button label */
  actionLabel?: string
  /** Primary action callback */
  onAction?: () => void
  /** Secondary action link label */
  secondaryLabel?: string
  /** Secondary action callback */
  onSecondary?: () => void
  /** Icon size */
  iconSize?: 'sm' | 'md' | 'lg'
}

/**
 * EmptyStateSimple - Basic empty state with icon and message
 *
 * @example
 * ```tsx
 * <EmptyStateSimple
 *   icon={Inbox}
 *   title="No messages yet"
 *   description="When you receive messages, they'll appear here"
 *   actionLabel="Compose Message"
 *   onAction={() => console.log('compose')}
 *   secondaryLabel="Learn more"
 *   onSecondary={() => console.log('learn more')}
 * />
 * ```
 */
export function EmptyStateSimple({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  iconSize = 'md',
}: EmptyStateSimpleProps) {
  const iconSizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="w-full">
      <div className="flex flex-col items-center justify-center text-center py-12 px-6">
        {/* Icon */}
        <div className="mb-6 text-muted-foreground/40">
          <Icon className={iconSizes[iconSize]} strokeWidth={1.5} />
        </div>

        {/* Content */}
        <div className="max-w-md space-y-2 mb-6">
          <h3 className="text-2xl font-heading font-bold">{title}</h3>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>

        {/* Actions */}
        {(actionLabel || secondaryLabel) && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {actionLabel && onAction && (
              <button
                onClick={onAction}
                className="btn-mm"
              >
                {actionLabel}
              </button>
            )}
            {secondaryLabel && onSecondary && (
              <button
                onClick={onSecondary}
                className="text-sm font-medium text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
              >
                {secondaryLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </EnhancedCard>
  )
}
