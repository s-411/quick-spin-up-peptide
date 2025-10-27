/**
 * Grid Component
 * Responsive grid layout with configurable columns
 */

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface GridProps {
  children: ReactNode
  className?: string
  cols?: {
    default?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  gap?: number
}

export function Grid({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 },
  gap = 6,
}: GridProps) {
  const gridColsClasses = [
    cols.default && `grid-cols-${cols.default}`,
    cols.sm && `sm:grid-cols-${cols.sm}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
  ].filter(Boolean)

  return <div className={cn('grid', `gap-${gap}`, ...gridColsClasses, className)}>{children}</div>
}
