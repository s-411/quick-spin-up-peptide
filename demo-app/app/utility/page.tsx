'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, Inbox, ShoppingCart, Search, FileText, Users, Mail, Package } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import {
  EmptyStateSimple,
  EmptyStateIllustration,
  EmptyStateSearch,
  LoadingSpinner,
  LoadingSkeleton,
  LoadingProgress,
  ToastNotification,
  NotificationBanner,
  NotificationCenter,
  type Notification,
  type ProgressStage,
} from '@/components/sections'

export default function UtilityPage() {
  // Toast states
  const [toasts, setToasts] = React.useState({
    success: false,
    error: false,
    warning: false,
    info: false,
  })

  // Banner states
  const [banners, setBanners] = React.useState({
    info: true,
    warning: true,
  })

  // Loading states
  const [loadingProgress, setLoadingProgress] = React.useState(0)
  const [currentStage, setCurrentStage] = React.useState(0)

  // Notification center state
  const [notifications, setNotifications] = React.useState<Notification[]>([
    {
      id: '1',
      title: 'Welcome to the platform!',
      message: 'Get started by exploring our features and documentation',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      read: false,
      type: 'info',
    },
    {
      id: '2',
      title: 'Your profile is 80% complete',
      message: 'Add a profile picture and bio to complete your profile',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      read: false,
      type: 'warning',
    },
    {
      id: '3',
      title: 'New feature available',
      message: 'Check out our new dark mode feature in settings',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      read: true,
      type: 'success',
    },
    {
      id: '4',
      title: 'System maintenance scheduled',
      message: 'We will perform maintenance on Sunday at 2 AM EST',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      read: true,
      type: 'info',
    },
  ])

  // Simulate loading progress
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 100) return 0
        return prev + 1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (loadingProgress >= 33 && currentStage === 0) setCurrentStage(1)
    if (loadingProgress >= 66 && currentStage === 1) setCurrentStage(2)
    if (loadingProgress === 0) setCurrentStage(0)
  }, [loadingProgress, currentStage])

  const progressStages: ProgressStage[] = [
    { label: 'Uploading', description: 'Uploading your files...' },
    { label: 'Processing', description: 'Processing your data...' },
    { label: 'Complete', description: 'All done!' },
  ]

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
  }

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleClearAll = () => {
    setNotifications([])
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-heading font-bold">Tier 5: Utility Sections</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Notification Banners */}
      {banners.info && (
        <NotificationBanner
          variant="info"
          title="Documentation Available"
          message="View the source code and documentation for each component below"
          actions={[
            { label: 'View Docs', onClick: () => console.log('docs') },
          ]}
          dismissible
          onDismiss={() => setBanners({ ...banners, info: false })}
          visible
        />
      )}

      {banners.warning && (
        <NotificationBanner
          variant="warning"
          title="Interactive Demo"
          message="Click the buttons below to trigger toast notifications"
          dismissible
          onDismiss={() => setBanners({ ...banners, warning: false })}
          visible
        />
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-20">
          {/* Section: Empty States */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Empty States</h2>
              <p className="text-muted-foreground">
                Communicate when there's no data to display
              </p>
            </div>

            <div className="space-y-12">
              {/* Empty State Simple */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Simple Empty State</h3>
                <EmptyStateSimple
                  icon={Inbox}
                  title="No messages yet"
                  description="When you receive messages, they'll appear here"
                  actionLabel="Compose Message"
                  onAction={() => alert('Compose message')}
                  secondaryLabel="Learn more"
                  onSecondary={() => alert('Learn more')}
                />
              </div>

              {/* Empty State Illustration */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Illustration Empty State</h3>
                <EmptyStateIllustration
                  illustration={
                    <div className="flex items-center justify-center w-full h-48 bg-muted/30 rounded-lg">
                      <ShoppingCart className="w-24 h-24 text-muted-foreground/40" />
                    </div>
                  }
                  title="Your cart is empty"
                  description="Add items to your cart to get started with your purchase"
                  primaryAction={{
                    label: 'Browse Products',
                    onClick: () => alert('Browse products'),
                    primary: true,
                  }}
                  secondaryAction={{
                    label: 'View Wishlist',
                    onClick: () => alert('View wishlist'),
                  }}
                  helpText="Need help? Contact our support team"
                />
              </div>

              {/* Empty State Search */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Search Empty State</h3>
                <EmptyStateSearch
                  query="react native"
                  suggestions={[
                    { label: 'React', value: 'react' },
                    { label: 'Next.js', value: 'nextjs' },
                    { label: 'TypeScript', value: 'typescript' },
                    { label: 'Tailwind CSS', value: 'tailwind' },
                  ]}
                  onClearSearch={() => alert('Clear search')}
                  onSuggestionClick={(s) => alert(`Search: ${s.value}`)}
                  showSuggestions
                />
              </div>
            </div>
          </section>

          {/* Section: Loading States */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Loading States</h2>
              <p className="text-muted-foreground">
                Show progress and loading indicators
              </p>
            </div>

            <div className="space-y-12">
              {/* Loading Spinner */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Loading Spinner</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <LoadingSpinner
                    message="Loading your data..."
                    size="md"
                  />
                  <LoadingSpinner
                    message="Processing..."
                    progress={loadingProgress}
                    showProgress
                    size="lg"
                  />
                </div>
              </div>

              {/* Loading Skeleton */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Loading Skeleton</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-3">Card Skeleton</h4>
                    <LoadingSkeleton variant="card" count={2} showImage />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3">List Skeleton</h4>
                    <LoadingSkeleton variant="list" count={3} showAvatar />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-3">Table Skeleton</h4>
                    <LoadingSkeleton variant="table" count={5} />
                  </div>
                </div>
              </div>

              {/* Loading Progress */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Progress Indicator</h3>
                <LoadingProgress
                  stages={progressStages}
                  currentStage={currentStage}
                  percentage={loadingProgress}
                  showLabels
                />
              </div>
            </div>
          </section>

          {/* Section: Notifications */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Notifications</h2>
              <p className="text-muted-foreground">
                Alert users with toast notifications and notification center
              </p>
            </div>

            <div className="space-y-12">
              {/* Toast Notifications */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Toast Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Click the buttons to trigger toast notifications
                </p>
                <div className="flex flex-wrap gap-3 mb-8">
                  <button
                    onClick={() => setToasts({ ...toasts, success: true })}
                    className="btn-mm"
                  >
                    Show Success
                  </button>
                  <button
                    onClick={() => setToasts({ ...toasts, error: true })}
                    className="btn-secondary"
                  >
                    Show Error
                  </button>
                  <button
                    onClick={() => setToasts({ ...toasts, warning: true })}
                    className="btn-secondary"
                  >
                    Show Warning
                  </button>
                  <button
                    onClick={() => setToasts({ ...toasts, info: true })}
                    className="btn-secondary"
                  >
                    Show Info
                  </button>
                </div>

                {/* Toast Container */}
                <div className="fixed top-4 right-4 z-50 space-y-3">
                  <ToastNotification
                    type="success"
                    title="Changes saved"
                    message="Your settings have been updated successfully"
                    duration={5000}
                    onClose={() => setToasts({ ...toasts, success: false })}
                    showProgress
                    visible={toasts.success}
                  />
                  <ToastNotification
                    type="error"
                    title="Error occurred"
                    message="Failed to save your changes. Please try again"
                    duration={5000}
                    onClose={() => setToasts({ ...toasts, error: false })}
                    action={{ label: 'Retry', onClick: () => alert('Retry') }}
                    visible={toasts.error}
                  />
                  <ToastNotification
                    type="warning"
                    title="Warning"
                    message="Your session will expire in 5 minutes"
                    duration={5000}
                    onClose={() => setToasts({ ...toasts, warning: false })}
                    visible={toasts.warning}
                  />
                  <ToastNotification
                    type="info"
                    title="New update available"
                    message="Version 2.0 is now available for download"
                    duration={5000}
                    onClose={() => setToasts({ ...toasts, info: false })}
                    action={{ label: 'Update', onClick: () => alert('Update') }}
                    visible={toasts.info}
                  />
                </div>
              </div>

              {/* Notification Center */}
              <div>
                <h3 className="text-xl font-heading font-semibold mb-4">Notification Center</h3>
                <NotificationCenter
                  notifications={notifications}
                  onMarkAsRead={handleMarkAsRead}
                  onMarkAllAsRead={handleMarkAllAsRead}
                  onDelete={handleDeleteNotification}
                  onClearAll={handleClearAll}
                />
              </div>
            </div>
          </section>

          {/* Summary Stats */}
          <section className="border-t border-border pt-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-4xl font-bold mb-2">9</div>
                <div className="text-sm text-muted-foreground">Total Components</div>
              </div>
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-4xl font-bold mb-2">3</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground">TypeScript Coverage</div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
