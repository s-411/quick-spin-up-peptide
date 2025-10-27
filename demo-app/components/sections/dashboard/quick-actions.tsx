'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'

/**
 * Represents a quick action button
 */
export interface QuickAction {
  /** Unique identifier */
  id: string
  /** Action label */
  label: string
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>
  /** Optional badge count */
  badge?: number
  /** Optional keyboard shortcut */
  shortcut?: string
  /** Click handler */
  onClick: () => void
}

/**
 * Props for the QuickActions component
 */
export interface QuickActionsProps {
  /** Array of quick actions */
  actions: QuickAction[]
  /** Number of columns in grid */
  columns?: 2 | 3 | 4
}

/**
 * QuickActions component displays frequently used actions in a grid.
 * Provides fast access to common operations with keyboard shortcuts.
 */
export function QuickActions({ actions, columns = 4 }: QuickActionsProps) {
  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-4',
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Quick Actions
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Frequently used actions
        </p>
      </div>

      <div className={`grid ${gridCols[columns]} gap-4`}>
        {actions.map((action) => {
          const Icon = action.icon

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className="relative group bg-card border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all text-left"
              aria-label={action.label}
            >
              {/* Badge */}
              {action.badge !== undefined && action.badge > 0 && (
                <div className="absolute top-3 right-3 bg-destructive text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {action.badge > 99 ? '99+' : action.badge}
                </div>
              )}

              {/* Icon */}
              <div className="mb-4 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-6 h-6 text-primary" />
              </div>

              {/* Label */}
              <h3 className="font-semibold text-foreground mb-1">
                {action.label}
              </h3>

              {/* Shortcut */}
              {action.shortcut && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span>Shortcut:</span>
                  <kbd className="px-1.5 py-0.5 bg-muted border border-border rounded font-mono">
                    {action.shortcut}
                  </kbd>
                </div>
              )}
            </button>
          )
        })}
      </div>
    </EnhancedCard>
  )
}
