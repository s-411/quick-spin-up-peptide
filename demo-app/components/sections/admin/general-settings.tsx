'use client'

import * as React from 'react'
import { User, Mail, Lock, Globe, Trash2, Save } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface GeneralSettingsData {
  /** User's full name */
  fullName: string
  /** User's email address */
  email: string
  /** User's username */
  username: string
  /** User's language preference */
  language: string
  /** User's timezone */
  timezone: string
}

export interface GeneralSettingsProps {
  /** Initial settings data */
  data: GeneralSettingsData
  /** Save settings callback */
  onSave?: (data: GeneralSettingsData) => void
  /** Change password callback */
  onChangePassword?: () => void
  /** Delete account callback */
  onDeleteAccount?: () => void
  /** Is saving */
  isSaving?: boolean
}

/**
 * GeneralSettings - Basic account settings panel
 *
 * @example
 * ```tsx
 * <GeneralSettings
 *   data={settingsData}
 *   onSave={(data) => saveSettings(data)}
 *   onChangePassword={() => openPasswordModal()}
 *   onDeleteAccount={() => confirmDelete()}
 * />
 * ```
 */
export function GeneralSettings({
  data,
  onSave,
  onChangePassword,
  onDeleteAccount,
  isSaving = false,
}: GeneralSettingsProps) {
  const [formData, setFormData] = React.useState<GeneralSettingsData>(data)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(data)
    setHasChanges(changed)
  }, [formData, data])

  const handleChange = (field: keyof GeneralSettingsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave?.(formData)
    setHasChanges(false)
  }

  const handleReset = () => {
    setFormData(data)
    setHasChanges(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Information */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <User className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Profile Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium mb-2">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
              placeholder="johndoe"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
              placeholder="john@example.com"
            />
          </div>
        </div>
      </EnhancedCard>

      {/* Localization */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Localization</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-2">
              Language
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ja">日本語</option>
            </select>
          </div>

          <div>
            <label htmlFor="timezone" className="block text-sm font-medium mb-2">
              Timezone
            </label>
            <select
              id="timezone"
              value={formData.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="Europe/London">London (GMT)</option>
              <option value="Europe/Paris">Paris (CET)</option>
              <option value="Asia/Tokyo">Tokyo (JST)</option>
            </select>
          </div>
        </div>
      </EnhancedCard>

      {/* Security */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Lock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-heading font-bold">Security</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div>
              <h4 className="font-semibold mb-1">Password</h4>
              <p className="text-sm text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            {onChangePassword && (
              <button onClick={onChangePassword} className="btn-secondary">
                Change Password
              </button>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Danger Zone */}
      <EnhancedCard tilt={false} glowEffect={false} className="border-destructive/50">
        <div className="flex items-center gap-3 mb-6">
          <Trash2 className="w-5 h-5 text-destructive" />
          <h3 className="text-lg font-heading font-bold text-destructive">Danger Zone</h3>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-destructive/10 rounded-lg">
            <h4 className="font-semibold mb-2">Delete Account</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            {onDeleteAccount && (
              <button
                onClick={onDeleteAccount}
                className="px-4 py-2 rounded-full bg-destructive text-white hover:bg-destructive/90 transition-colors text-sm font-medium"
              >
                Delete Account
              </button>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Action Buttons */}
      {hasChanges && (
        <div className="flex items-center justify-end gap-3 sticky bottom-4 p-4 bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg">
          <button onClick={handleReset} className="btn-secondary" disabled={isSaving}>
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
