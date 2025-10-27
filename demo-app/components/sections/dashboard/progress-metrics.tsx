'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Target, Calendar, TrendingUp } from 'lucide-react'

/**
 * Represents a goal with progress tracking
 */
export interface Goal {
  /** Unique identifier */
  id: string
  /** Goal name */
  name: string
  /** Current progress value */
  current: number
  /** Target value */
  target: number
  /** Unit of measurement */
  unit: string
  /** Optional deadline */
  deadline?: string
  /** Optional color for progress bar */
  color?: string
}

/**
 * Props for the ProgressMetrics component
 */
export interface ProgressMetricsProps {
  /** Array of goals to track */
  goals: Goal[]
  /** Callback when view details is clicked */
  onViewDetails?: (id: string) => void
}

/**
 * ProgressMetrics component displays goal progress with visual indicators.
 * Shows current vs target values with progress bars and deadlines.
 */
export function ProgressMetrics({ goals, onViewDetails }: ProgressMetricsProps) {
  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 100) return 'bg-primary'
    if (percentage >= 75) return 'bg-primary'
    if (percentage >= 50) return 'bg-secondary'
    return 'bg-muted-foreground'
  }

  const getDaysUntilDeadline = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diff = deadlineDate.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Progress Metrics
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Track your goals and targets
          </p>
        </div>
        <div className="bg-primary/10 rounded-lg p-2">
          <Target className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="space-y-6">
        {goals.map((goal) => {
          const percentage = getProgressPercentage(goal.current, goal.target)
          const progressColor = getProgressColor(percentage)
          const daysRemaining = goal.deadline ? getDaysUntilDeadline(goal.deadline) : null

          return (
            <div key={goal.id} className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {goal.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                  </p>
                </div>
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(goal.id)}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    View Details
                  </button>
                )}
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full ${progressColor} rounded-full transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {percentage.toFixed(1)}% complete
                  </span>
                  {goal.deadline && (
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {daysRemaining !== null && (
                        <span>
                          {daysRemaining > 0
                            ? `${daysRemaining} days left`
                            : daysRemaining === 0
                            ? 'Due today'
                            : 'Overdue'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="w-4 h-4" />
                  <span>
                    {((goal.current / goal.target) * 100).toFixed(0)}% achieved
                  </span>
                </div>
                <div className="text-muted-foreground">
                  {(goal.target - goal.current).toLocaleString()} {goal.unit} remaining
                </div>
              </div>

              {/* Achievement Badge */}
              {percentage >= 100 && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 border border-border rounded-full text-sm font-medium text-primary">
                  <Target className="w-4 h-4" />
                  Goal Achieved!
                </div>
              )}
            </div>
          )
        })}
      </div>
    </EnhancedCard>
  )
}
