'use client'

import * as React from 'react'
import { LucideIcon } from 'lucide-react'

export interface Stat {
  /** Stat number (target value) */
  number: number
  /** Stat label */
  label: string
  /** Icon component */
  icon?: LucideIcon
  /** Suffix (e.g., "+", "%", "K") */
  suffix?: string
  /** Prefix (e.g., "$") */
  prefix?: string
}

export interface StatsGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of stats */
  stats: Stat[]
  /** Grid columns */
  columns?: 2 | 3 | 4
}

function useCounterAnimation(end: number, duration: number = 2000) {
  const [count, setCount] = React.useState(0)
  const [hasAnimated, setHasAnimated] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)

          const startTime = Date.now()
          const animate = () => {
            const now = Date.now()
            const progress = Math.min((now - startTime) / duration, 1)

            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            setCount(Math.floor(easeOutQuart * end))

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [end, duration, hasAnimated])

  return { count, ref }
}

export function StatsGrid({
  title = 'By the Numbers',
  description,
  stats,
  columns = 4,
}: StatsGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} />
          ))}
        </div>
      </div>
    </section>
  )
}

function StatCard({ stat }: { stat: Stat }) {
  const { count, ref } = useCounterAnimation(stat.number)
  const Icon = stat.icon

  return (
    <div
      ref={ref}
      className="text-center p-8 rounded-card bg-muted/30 backdrop-blur border border-border"
    >
      {/* Icon */}
      {Icon && (
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      )}

      {/* Number */}
      <div className="text-4xl md:text-5xl font-heading mb-2 text-primary">
        {stat.prefix}
        {count.toLocaleString()}
        {stat.suffix}
      </div>

      {/* Label */}
      <div className="text-sm md:text-base text-muted-foreground font-medium">
        {stat.label}
      </div>
    </div>
  )
}
