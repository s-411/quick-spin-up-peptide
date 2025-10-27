'use client'

import * as React from 'react'
import { Shield, Eye, Lock, Smartphone, Save } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface PrivacyPreferences {
  /** Profile visibility */
  profileVisibility: 'public' | 'private' | 'friends'
  /** Show email to others */
  showEmail: boolean
  /** Show activity status */
  showActivity: boolean
  /** Allow search engine indexing */
  searchEngineIndexing: boolean
  /** Two-factor authentication enabled */
  twoFactorEnabled: boolean
  /** Allow data collection for analytics */
  analyticsTracking: boolean
}

export interface ConnectedDevice {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  location: string
  lastActive: string
  isCurrent: boolean
}

export interface PrivacySettingsProps {
  /** Privacy preferences */
  preferences: PrivacyPreferences
  /** Connected devices */
  devices?: ConnectedDevice[]
  /** Save preferences callback */
  onSave?: (preferences: PrivacyPreferences) => void
  /** Enable 2FA callback */
  onEnable2FA?: () => void
  /** Revoke device callback */
  onRevokeDevice?: (deviceId: string) => void
  /** Is saving */
  isSaving?: boolean
}

/**
 * PrivacySettings - Privacy and security controls
 *
 * @example
 * ```tsx
 * <PrivacySettings
 *   preferences={privacyPrefs}
 *   devices={connectedDevices}
 *   onSave={(prefs) => savePrivacy(prefs)}
 *   onEnable2FA={() => open2FASetup()}
 * />
 * ```
 */
export function PrivacySettings({
  preferences,
  devices = [],
  onSave,
  onEnable2FA,
  onRevokeDevice,
  isSaving = false,
}: PrivacySettingsProps) {
  const [prefs, setPrefs] = React.useState<PrivacyPreferences>(preferences)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    const changed = JSON.stringify(prefs) !== JSON.stringify(preferences)
    setHasChanges(changed)
  }, [prefs, preferences])

  const handleToggle = (key: keyof PrivacyPreferences) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleVisibilityChange = (visibility: PrivacyPreferences['profileVisibility']) => {
    setPrefs((prev) => ({ ...prev, profileVisibility: visibility }))
  }

  const handleSave = () => {
    onSave?.(prefs)
    setHasChanges(false)
  }

  const getDeviceIcon = (type: ConnectedDevice['type']) => {
    switch (type) {
      case 'mobile':
      case 'tablet':
        return Smartphone
      default:
        return Lock
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Profile Visibility</h3>
        </div>

        <div className="space-y-3">
          {(['public', 'private', 'friends'] as const).map((visibility) => (
            <label
              key={visibility}
              className={`
                flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                ${
                  prefs.profileVisibility === visibility
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }
              `}
            >
              <input
                type="radio"
                name="visibility"
                checked={prefs.profileVisibility === visibility}
                onChange={() => handleVisibilityChange(visibility)}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="font-semibold capitalize mb-1">{visibility}</div>
                <div className="text-sm text-muted-foreground">
                  {visibility === 'public' && 'Anyone can see your profile'}
                  {visibility === 'private' && 'Only you can see your profile'}
                  {visibility === 'friends' && 'Only your connections can see your profile'}
                </div>
              </div>
            </label>
          ))}
        </div>
      </EnhancedCard>

      {/* Privacy Controls */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Privacy Controls</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-semibold mb-1">Show Email Address</h4>
              <p className="text-sm text-muted-foreground">
                Display your email on your public profile
              </p>
            </div>
            <button
              onClick={() => handleToggle('showEmail')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${prefs.showEmail ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${prefs.showEmail ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-semibold mb-1">Show Activity Status</h4>
              <p className="text-sm text-muted-foreground">
                Let others see when you're online
              </p>
            </div>
            <button
              onClick={() => handleToggle('showActivity')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${prefs.showActivity ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${prefs.showActivity ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-semibold mb-1">Search Engine Indexing</h4>
              <p className="text-sm text-muted-foreground">
                Allow search engines to index your profile
              </p>
            </div>
            <button
              onClick={() => handleToggle('searchEngineIndexing')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${prefs.searchEngineIndexing ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${prefs.searchEngineIndexing ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-semibold mb-1">Analytics Tracking</h4>
              <p className="text-sm text-muted-foreground">
                Help us improve by sharing usage data
              </p>
            </div>
            <button
              onClick={() => handleToggle('analyticsTracking')}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${prefs.analyticsTracking ? 'bg-primary' : 'bg-muted'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${prefs.analyticsTracking ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </EnhancedCard>

      {/* Two-Factor Authentication */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Two-Factor Authentication</h3>
        </div>

        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="font-semibold mb-1">
                {prefs.twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {prefs.twoFactorEnabled
                  ? 'Your account is protected with 2FA'
                  : 'Add an extra layer of security to your account'}
              </p>
            </div>
            {onEnable2FA && (
              <button
                onClick={onEnable2FA}
                className={prefs.twoFactorEnabled ? 'btn-secondary' : 'btn-mm'}
              >
                {prefs.twoFactorEnabled ? 'Manage' : 'Enable'}
              </button>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Connected Devices */}
      {devices.length > 0 && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="flex items-center gap-3 mb-6">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-heading font-bold">Connected Devices</h3>
          </div>

          <div className="space-y-3">
            {devices.map((device) => {
              const DeviceIcon = getDeviceIcon(device.type)
              return (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <DeviceIcon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{device.name}</h4>
                        {device.isCurrent && (
                          <span className="text-xs px-2 py-0.5 bg-primary/20 text-primary rounded-full">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {device.location} • Last active {device.lastActive}
                      </p>
                    </div>
                  </div>
                  {!device.isCurrent && onRevokeDevice && (
                    <button
                      onClick={() => onRevokeDevice(device.id)}
                      className="text-sm text-destructive hover:text-destructive/80 transition-colors"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </EnhancedCard>
      )}

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
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}
