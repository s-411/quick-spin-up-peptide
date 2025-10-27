'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface ProgressStage {
  /** Stage label */
  label: string
  /** Stage description */
  description?: string
}

export interface LoadingProgressProps {
  /** Progress stages */
  stages: ProgressStage[]
  /** Current stage index (0-based) */
  currentStage: number
  /** Overall percentage (0-100) */
  percentage?: number
  /** Show stage labels */
  showLabels?: boolean
  /** Show in card container */
  showCard?: boolean
}

/**
 * LoadingProgress - Progress bar with stages
 *
 * @example
 * ```tsx
 * <LoadingProgress
 *   stages={[
 *     { label: 'Uploading', description: 'Uploading files...' },
 *     { label: 'Processing', description: 'Processing data...' },
 *     { label: 'Complete', description: 'All done!' }
 *   ]}
 *   currentStage={1}
 *   percentage={60}
 *   showLabels
 * />
 * ```
 */
export function LoadingProgress({
  stages,
  currentStage,
  percentage,
  showLabels = true,
  showCard = true,
}: LoadingProgressProps) {
  const content = (
    <div className="py-8 px-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-heading font-bold">
            {stages[currentStage]?.label || 'Processing...'}
          </h3>
          {percentage !== undefined && (
            <span className="text-sm font-medium text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
        {stages[currentStage]?.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {stages[currentStage].description}
          </p>
        )}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div
            className="bg-primary h-full transition-all duration-500 ease-out"
            style={{
              width: `${
                percentage !== undefined
                  ? Math.min(100, Math.max(0, percentage))
                  : ((currentStage + 1) / stages.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Stage Indicators */}
      {showLabels && (
        <div className="flex items-center justify-between relative">
          {/* Connection Line */}
          <div className="absolute top-5 left-0 right-0 h-0.5 bg-muted" />

          {stages.map((stage, idx) => {
            const isComplete = idx < currentStage
            const isCurrent = idx === currentStage
            const isUpcoming = idx > currentStage

            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2 relative z-10"
                style={{ flex: 1 }}
              >
                {/* Circle Indicator */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                    ${
                      isComplete
                        ? 'bg-primary border-primary text-primary-foreground'
                        : isCurrent
                        ? 'bg-primary/10 border-primary text-primary animate-pulse'
                        : 'bg-background border-muted text-muted-foreground'
                    }
                  `}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{idx + 1}</span>
                  )}
                </div>

                {/* Label */}
                <div className="text-center max-w-[100px]">
                  <p
                    className={`text-xs font-medium ${
                      isCurrent
                        ? 'text-foreground'
                        : isComplete
                        ? 'text-muted-foreground'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    {stage.label}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  if (!showCard) {
    return <div className="w-full">{content}</div>
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="w-full">
      {content}
    </EnhancedCard>
  )
}
