/**
 * Stack Component
 * Vertical or horizontal stack layout with consistent spacing
 */

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface StackProps {
  children: ReactNode
  className?: string
  direction?: 'vertical' | 'horizontal'
  spacing?: number
  align?: 'start' | 'center' | 'end' | 'stretch'
  justify?: 'start' | 'center' | 'end' | 'between' | 'around'
}

export function Stack({
  children,
  className,
  direction = 'vertical',
  spacing = 4,
  align = 'stretch',
  justify = 'start',
}: StackProps) {
  const directionClasses = direction === 'vertical' ? 'flex-col' : 'flex-row'
  const spacingClass = direction === 'vertical' ? `space-y-${spacing}` : `space-x-${spacing}`

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  }

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  }

  return (
    <div
      className={cn(
        'flex',
        directionClasses,
        spacingClass,
        alignClasses[align],
        justifyClasses[justify],
        className
      )}
    >
      {children}
    </div>
  )
}
