'use client'

import * as React from 'react'
import { Bell, Mail, Smartphone, MessageSquare, Save } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface NotificationChannel {
  /** Email notifications enabled */
  email: boolean
  /** Push notifications enabled */
  push: boolean
  /** SMS notifications enabled */
  sms: boolean
}

export interface NotificationPreferences {
  /** Marketing notifications */
  marketing: NotificationChannel
  /** Product updates */
  productUpdates: NotificationChannel
  /** Security alerts */
  security: NotificationChannel
  /** Comments and mentions */
  social: NotificationChannel
  /** Frequency: instant, daily, weekly */
  frequency: 'instant' | 'daily' | 'weekly'
  /** Pause all notifications */
  pauseAll: boolean
}

export interface NotificationSettingsProps {
  /** Initial preferences */
  preferences: NotificationPreferences
  /** Save preferences callback */
  onSave?: (preferences: NotificationPreferences) => void
  /** Is saving */
  isSaving?: boolean
}

/**
 * NotificationSettings - Notification preferences panel
 *
 * @example
 * ```tsx
 * <NotificationSettings
 *   preferences={notificationPrefs}
 *   onSave={(prefs) => savePreferences(prefs)}
 * />
 * ```
 */
export function NotificationSettings({
  preferences,
  onSave,
  isSaving = false,
}: NotificationSettingsProps) {
  const [prefs, setPrefs] = React.useState<NotificationPreferences>(preferences)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    const changed = JSON.stringify(prefs) !== JSON.stringify(preferences)
    setHasChanges(changed)
  }, [prefs, preferences])

  const handleChannelToggle = (
    category: keyof Omit<NotificationPreferences, 'frequency' | 'pauseAll'>,
    channel: keyof NotificationChannel
  ) => {
    setPrefs((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [channel]: !prev[category][channel],
      },
    }))
  }

  const handleSave = () => {
    onSave?.(prefs)
    setHasChanges(false)
  }

  const notificationCategories = [
    {
      key: 'marketing' as const,
      icon: Mail,
      title: 'Marketing & Promotions',
      description: 'Receive updates about new features, offers, and news',
    },
    {
      key: 'productUpdates' as const,
      icon: Bell,
      title: 'Product Updates',
      description: 'Get notified about product changes and improvements',
    },
    {
      key: 'security' as const,
      icon: Smartphone,
      title: 'Security Alerts',
      description: 'Important security notifications about your account',
    },
    {
      key: 'social' as const,
      icon: MessageSquare,
      title: 'Comments & Mentions',
      description: 'When someone comments or mentions you',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Pause All Notifications */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-heading font-bold mb-1">Pause All Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Temporarily disable all notifications
            </p>
          </div>
          <button
            onClick={() => setPrefs((prev) => ({ ...prev, pauseAll: !prev.pauseAll }))}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors
              ${prefs.pauseAll ? 'bg-primary' : 'bg-muted'}
            `}
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${prefs.pauseAll ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </EnhancedCard>

      {/* Notification Frequency */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <h3 className="text-lg font-heading font-bold mb-4">Notification Frequency</h3>
        <div className="grid grid-cols-3 gap-3">
          {(['instant', 'daily', 'weekly'] as const).map((freq) => (
            <button
              key={freq}
              onClick={() => setPrefs((prev) => ({ ...prev, frequency: freq }))}
              className={`
                p-4 rounded-lg border-2 transition-all text-center
                ${
                  prefs.frequency === freq
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="font-semibold capitalize">{freq}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {freq === 'instant' && 'Real-time'}
                {freq === 'daily' && 'Once per day'}
                {freq === 'weekly' && 'Once per week'}
              </div>
            </button>
          ))}
        </div>
      </EnhancedCard>

      {/* Notification Categories */}
      <div className="space-y-4">
        {notificationCategories.map(({ key, icon: Icon, title, description }) => (
          <EnhancedCard key={key} tilt={false} glowEffect={false}>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{description}</p>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs[key].email}
                      onChange={() => handleChannelToggle(key, 'email')}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Email</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs[key].push}
                      onChange={() => handleChannelToggle(key, 'push')}
                      className="rounded border-border"
                    />
                    <span className="text-sm">Push</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={prefs[key].sms}
                      onChange={() => handleChannelToggle(key, 'sms')}
                      className="rounded border-border"
                    />
                    <span className="text-sm">SMS</span>
                  </label>
                </div>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end gap-3 sticky bottom-4 p-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg">
          <button
            onClick={() => setPrefs(preferences)}
            className="btn-secondary"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-mm flex items-center gap-2"
            disabled={isSaving}
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      )}
    </div>
  )
}
