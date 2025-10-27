'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase-client'
import Link from 'next/link'

interface Subscription {
  stripe_subscription_id: string
  status: string
  plan_id: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: boolean
}

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    async function loadSubscription() {
      try {
        const supabase = createBrowserClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) return

        const { data } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single()

        setSubscription(data)
      } catch (error) {
        console.error('Failed to load subscription:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscription()
  }, [])

  const openCustomerPortal = async () => {
    setPortalLoading(true)
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal')
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Billing & Subscription</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your subscription and billing information
          </p>
        </div>

        {subscription ? (
          <div className="space-y-6">
            {/* Current Plan */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Current Plan</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span
                    className={`font-medium capitalize ${
                      subscription.status === 'active'
                        ? 'text-green-600'
                        : subscription.status === 'past_due'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`}
                  >
                    {subscription.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Current period ends:</span>
                  <span className="font-medium">
                    {new Date(subscription.current_period_end).toLocaleDateString()}
                  </span>
                </div>
                {subscription.cancel_at_period_end && (
                  <div className="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                    Your subscription will be canceled at the end of the current period.
                  </div>
                )}
              </div>
            </div>

            {/* Manage Subscription */}
            <div className="rounded-lg border border-border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Manage Subscription</h2>
              <p className="mb-4 text-sm text-muted-foreground">
                Update payment method, change plan, or cancel subscription
              </p>
              <button
                onClick={openCustomerPortal}
                disabled={portalLoading}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {portalLoading ? 'Loading...' : 'Open Billing Portal'}
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border bg-card p-8 text-center">
            <h2 className="mb-2 text-xl font-semibold">No Active Subscription</h2>
            <p className="mb-6 text-muted-foreground">Subscribe to a plan to unlock all features</p>
            <Link
              href="/pricing"
              className="inline-block rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Plans
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
