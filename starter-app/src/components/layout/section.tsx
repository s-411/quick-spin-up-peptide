/**
 * Section Component
 * Page section with consistent vertical spacing
 */

import { type ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

export interface SectionProps {
  children: ReactNode
  className?: string
  spacing?: 'sm' | 'md' | 'lg' | 'xl'
}

const spacingClasses = {
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-24',
  xl: 'py-24 md:py-32',
}

export function Section({ children, className, spacing = 'md' }: SectionProps) {
  return <section className={cn(spacingClasses[spacing], className)}>{children}</section>
}
