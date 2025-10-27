'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { CreditCard, TrendingUp, Calendar, Check, ArrowUpRight } from 'lucide-react'

/**
 * Represents a subscription plan
 */
export interface Plan {
  /** Plan name */
  name: string
  /** Price in dollars */
  price: number
  /** Billing cycle */
  billingCycle: 'monthly' | 'annual'
  /** List of features included */
  features: string[]
}

/**
 * Represents usage of a resource
 */
export interface Usage {
  /** Resource name */
  resource: string
  /** Current usage amount */
  current: number
  /** Maximum allowed amount */
  limit: number
  /** Unit of measurement */
  unit: string
}

/**
 * Props for the BillingOverview component
 */
export interface BillingOverviewProps {
  /** Current subscription plan */
  currentPlan: Plan
  /** Usage metrics for various resources */
  usage: Usage[]
  /** Date of next billing */
  nextBillingDate: string
  /** Callback when upgrade is clicked */
  onUpgrade?: () => void
  /** Callback when downgrade is clicked */
  onDowngrade?: () => void
}

/**
 * BillingOverview component displays subscription plan and usage information.
 * Shows current plan, usage metrics, billing info, and upgrade options.
 */
export function BillingOverview({
  currentPlan,
  usage,
  nextBillingDate,
  onUpgrade,
  onDowngrade,
}: BillingOverviewProps) {
  const getUsagePercentage = (current: number, limit: number) => {
    return Math.min((current / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-destructive'
    if (percentage >= 75) return 'text-secondary'
    return 'text-primary'
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Billing Overview
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your subscription and billing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Plan */}
        <div className="bg-primary rounded-xl p-6 text-primary-foreground">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-sm opacity-90 mb-1">Current Plan</p>
              <h3 className="text-3xl font-bold">{currentPlan.name}</h3>
            </div>
            <div className="bg-white/20 rounded-lg p-2">
              <CreditCard className="w-6 h-6" />
            </div>
          </div>

          <div className="mb-6">
            <div className="text-4xl font-bold mb-1">
              ${currentPlan.price}
              <span className="text-lg font-normal opacity-90">
                /{currentPlan.billingCycle === 'monthly' ? 'mo' : 'yr'}
              </span>
            </div>
            <p className="text-sm opacity-90">
              Billed {currentPlan.billingCycle}
            </p>
          </div>

          <div className="space-y-2 mb-6">
            {currentPlan.features.slice(0, 4).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
            {currentPlan.features.length > 4 && (
              <p className="text-sm opacity-75">
                +{currentPlan.features.length - 4} more features
              </p>
            )}
          </div>

          <div className="flex gap-2">
            {onUpgrade && (
              <button
                onClick={onUpgrade}
                className="flex-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-lg font-semibold hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                Upgrade
                <ArrowUpRight className="w-4 h-4" />
              </button>
            )}
            {onDowngrade && (
              <button
                onClick={onDowngrade}
                className="bg-white/20 text-white py-2 px-4 rounded-lg font-semibold hover:bg-white/30 transition-colors"
              >
                Change Plan
              </button>
            )}
          </div>
        </div>

        {/* Billing Info & Next Payment */}
        <div className="space-y-6">
          {/* Next Billing */}
          <div className="bg-card border border-border rounded-lg p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-primary/10 rounded-lg p-2">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Next Billing Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {new Date(nextBillingDate).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-border">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Amount Due</span>
                <span className="font-semibold text-foreground">
                  ${currentPlan.price.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Total Spend</p>
              </div>
              <p className="text-2xl font-bold text-foreground">
                ${(currentPlan.price * 6).toFixed(0)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Last 6 months</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Check className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">Status</p>
              </div>
              <p className="text-2xl font-bold text-primary">Active</p>
              <p className="text-xs text-muted-foreground mt-1">Auto-renewal on</p>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Section */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Usage This Period
        </h3>
        <div className="space-y-4">
          {usage.map((item) => {
            const percentage = getUsagePercentage(item.current, item.limit)
            const colorClass = getUsageColor(percentage)

            return (
              <div key={item.resource} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {item.resource}
                  </span>
                  <span className={`font-semibold ${colorClass}`}>
                    {item.current.toLocaleString()} / {item.limit.toLocaleString()} {item.unit}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full rounded-full transition-all ${
                      percentage >= 90
                        ? 'bg-destructive'
                        : percentage >= 75
                        ? 'bg-secondary'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {percentage.toFixed(1)}% used
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </EnhancedCard>
  )
}
