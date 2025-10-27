'use client'

import * as React from 'react'
import { useState } from 'react'
import { ArrowLeft, Settings } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { useToast } from '@/hooks/use-toast'
import {
  GeneralSettings,
  NotificationSettings,
  PrivacySettings,
  AppearanceSettings,
  LanguageRegion,
  AccessibilitySettings,
  IntegrationsList,
  ApiKeyManagement,
  WebhookSettings,
  ExportImport,
} from '@/components/sections'
import type {
  GeneralSettingsData,
  NotificationPreferences,
  PrivacyPreferences,
  ConnectedDevice,
  AppearancePreferences,
  LanguageRegionSettings,
  AccessibilityPreferences,
  Integration,
  ApiKey,
  WebhookData,
  WebhookDelivery,
  ExportRecord,
} from '@/components/sections'

type Tab =
  | 'general'
  | 'notifications'
  | 'privacy'
  | 'appearance'
  | 'localization'
  | 'accessibility'
  | 'integrations'
  | 'api-keys'
  | 'webhooks'
  | 'export-import'

export default function AdminPage() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('general')

  // Sample data
  const [generalSettings] = useState<GeneralSettingsData>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    username: 'johndoe',
    language: 'en',
    timezone: 'America/New_York',
  })

  const [notificationPrefs] = useState<NotificationPreferences>({
    marketing: { email: true, push: false, sms: false },
    productUpdates: { email: true, push: true, sms: false },
    security: { email: true, push: true, sms: true },
    social: { email: false, push: true, sms: false },
    frequency: 'instant',
    pauseAll: false,
  })

  const devices: ConnectedDevice[] = [
    {
      id: '1',
      name: 'MacBook Pro',
      type: 'desktop',
      location: 'San Francisco, CA',
      lastActive: '2 minutes ago',
      isCurrent: true,
    },
    {
      id: '2',
      name: 'iPhone 14 Pro',
      type: 'mobile',
      location: 'San Francisco, CA',
      lastActive: '1 hour ago',
      isCurrent: false,
    },
  ]

  const [privacySettings] = useState<PrivacyPreferences>({
    profileVisibility: 'public',
    showEmail: false,
    showActivity: true,
    searchEngineIndexing: true,
    twoFactorEnabled: true,
    analyticsTracking: true,
  })

  const [appearanceSettings] = useState<AppearancePreferences>({
    theme: 'auto',
    colorScheme: 'ocean',
    fontSize: 'medium',
    viewDensity: 'comfortable',
  })

  const [localeSettings] = useState<LanguageRegionSettings>({
    language: 'en',
    region: 'US',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: 'USD',
    numberFormat: 'US',
  })

  const [accessibilitySettings] = useState<AccessibilityPreferences>({
    screenReaderEnabled: false,
    highContrastMode: false,
    keyboardNavigation: true,
    reduceMotion: false,
    textSize: 'default',
    lineSpacing: 'default',
    focusIndicators: true,
    underlineLinks: false,
  })

  const integrations: Integration[] = [
    {
      id: '1',
      name: 'Slack',
      description: 'Get notifications and updates in your Slack workspace',
      icon: undefined,
      status: 'connected',
      enabled: true,
      lastSynced: new Date(Date.now() - 300000).toISOString(),
      syncFrequency: 'Every 5 minutes',
      scopes: ['read', 'write'],
    },
    {
      id: '2',
      name: 'GitHub',
      description: 'Sync repositories and manage issues',
      icon: undefined,
      status: 'connected',
      enabled: true,
      lastSynced: new Date(Date.now() - 600000).toISOString(),
      syncFrequency: 'Every 10 minutes',
      scopes: ['read'],
    },
    {
      id: '3',
      name: 'Google Drive',
      description: 'Store and sync files with Google Drive',
      icon: undefined,
      status: 'disconnected',
      enabled: false,
    },
    {
      id: '4',
      name: 'Stripe',
      description: 'Process payments and manage subscriptions',
      icon: undefined,
      status: 'error',
      enabled: true,
      lastSynced: new Date(Date.now() - 7200000).toISOString(),
    },
  ]

  const apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production API Key',
      key: 'demo_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      createdAt: '2024-01-15T10:00:00Z',
      lastUsed: '2024-10-17T08:30:00Z',
      expiresAt: '2025-01-15T10:00:00Z',
      scopes: ['read', 'write'],
      usageCount: 15420,
      isActive: true,
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'demo_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
      createdAt: '2024-02-20T14:30:00Z',
      lastUsed: '2024-10-16T18:45:00Z',
      scopes: ['read'],
      usageCount: 3250,
      isActive: true,
    },
  ]

  const webhooks: WebhookData[] = [
    {
      id: '1',
      url: 'https://example.com/webhooks/events',
      events: ['user.created', 'user.updated', 'payment.success'],
      isActive: true,
      createdAt: '2024-03-10T09:00:00Z',
      lastTriggered: '2024-10-17T07:20:00Z',
      successRate: 98.5,
    },
    {
      id: '2',
      url: 'https://api.myapp.com/webhook-receiver',
      events: ['order.created', 'order.shipped'],
      isActive: true,
      createdAt: '2024-04-05T11:30:00Z',
      lastTriggered: '2024-10-16T22:10:00Z',
      successRate: 95.2,
    },
  ]

  const deliveries: WebhookDelivery[] = [
    {
      id: '1',
      webhookId: '1',
      event: 'user.created',
      timestamp: new Date(Date.now() - 120000).toISOString(),
      status: 'success',
      responseCode: 200,
      responseTime: 145,
    },
    {
      id: '2',
      webhookId: '1',
      event: 'payment.success',
      timestamp: new Date(Date.now() - 300000).toISOString(),
      status: 'success',
      responseCode: 200,
      responseTime: 98,
    },
    {
      id: '3',
      webhookId: '2',
      event: 'order.created',
      timestamp: new Date(Date.now() - 600000).toISOString(),
      status: 'failed',
      responseCode: 500,
      responseTime: 1250,
    },
  ]

  const exportHistory: ExportRecord[] = [
    {
      id: '1',
      format: 'json',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      fileSize: 2456789,
      downloadUrl: '#',
      expiresAt: new Date(Date.now() + 6 * 86400000).toISOString(),
    },
    {
      id: '2',
      format: 'csv',
      createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      fileSize: 1234567,
      downloadUrl: '#',
      expiresAt: new Date(Date.now() + 5 * 86400000).toISOString(),
    },
  ]

  const tabs: { id: Tab; label: string }[] = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'appearance', label: 'Appearance' },
    { id: 'localization', label: 'Localization' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'integrations', label: 'Integrations' },
    { id: 'api-keys', label: 'API Keys' },
    { id: 'webhooks', label: 'Webhooks' },
    { id: 'export-import', label: 'Export/Import' },
  ]

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </a>
            <div>
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-primary" />
                <h1 className="text-3xl md:text-4xl font-heading">Admin & Settings</h1>
              </div>
              <p className="text-muted-foreground mt-1">
                Manage your account settings and preferences
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-border overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pb-8">
          {activeTab === 'general' && (
            <GeneralSettings
              data={generalSettings}
              onSave={(data) => {
                toast({
                  variant: 'success',
                  title: 'Settings saved',
                  description: 'Your general settings have been updated.',
                })
              }}
              onChangePassword={() => {
                toast({
                  variant: 'info',
                  title: 'Change password',
                  description: 'Password change dialog would open here.',
                })
              }}
              onDeleteAccount={() => {
                toast({
                  variant: 'warning',
                  title: 'Delete account',
                  description: 'Account deletion confirmation would appear here.',
                })
              }}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationSettings
              preferences={notificationPrefs}
              onSave={(prefs) => {
                toast({
                  variant: 'success',
                  title: 'Preferences saved',
                  description: 'Your notification preferences have been updated.',
                })
              }}
            />
          )}

          {activeTab === 'privacy' && (
            <PrivacySettings
              preferences={privacySettings}
              devices={devices}
              onSave={(prefs) => {
                toast({
                  variant: 'success',
                  title: 'Privacy settings saved',
                  description: 'Your privacy settings have been updated.',
                })
              }}
              onEnable2FA={() => {
                toast({
                  variant: 'info',
                  title: 'Enable 2FA',
                  description: 'Two-factor authentication setup would open here.',
                })
              }}
              onRevokeDevice={(id) => {
                toast({
                  variant: 'success',
                  title: 'Device revoked',
                  description: 'The device has been disconnected from your account.',
                })
              }}
            />
          )}

          {activeTab === 'appearance' && (
            <AppearanceSettings
              preferences={appearanceSettings}
              onSave={(prefs) => {
                toast({
                  variant: 'success',
                  title: 'Appearance saved',
                  description: 'Your appearance settings have been updated.',
                })
              }}
            />
          )}

          {activeTab === 'localization' && (
            <LanguageRegion
              settings={localeSettings}
              onSave={(settings) => {
                toast({
                  variant: 'success',
                  title: 'Localization saved',
                  description: 'Your language and region settings have been updated.',
                })
              }}
            />
          )}

          {activeTab === 'accessibility' && (
            <AccessibilitySettings
              preferences={accessibilitySettings}
              onSave={(prefs) => {
                toast({
                  variant: 'success',
                  title: 'Accessibility saved',
                  description: 'Your accessibility settings have been updated.',
                })
              }}
            />
          )}

          {activeTab === 'integrations' && (
            <IntegrationsList
              integrations={integrations}
              onToggleEnabled={(id, enabled) => {
                toast({
                  variant: 'success',
                  title: enabled ? 'Integration enabled' : 'Integration disabled',
                  description: `The integration has been ${enabled ? 'enabled' : 'disabled'}.`,
                })
              }}
              onConfigure={(id) => {
                toast({
                  variant: 'info',
                  title: 'Configure integration',
                  description: 'Configuration panel would open here.',
                })
              }}
              onConnect={(id) => {
                toast({
                  variant: 'success',
                  title: 'Connecting...',
                  description: 'Opening authorization flow...',
                })
              }}
              onDisconnect={(id) => {
                toast({
                  variant: 'warning',
                  title: 'Integration disconnected',
                  description: 'The integration has been disconnected.',
                })
              }}
              onAddIntegration={() => {
                toast({
                  variant: 'info',
                  title: 'Add integration',
                  description: 'Integration marketplace would open here.',
                })
              }}
            />
          )}

          {activeTab === 'api-keys' && (
            <ApiKeyManagement
              keys={apiKeys}
              onCreateKey={(name, scopes) => {
                toast({
                  variant: 'success',
                  title: 'API key created',
                  description: `"${name}" has been created successfully.`,
                })
              }}
              onRevokeKey={(id) => {
                toast({
                  variant: 'warning',
                  title: 'API key revoked',
                  description: 'The API key has been revoked and is no longer valid.',
                })
              }}
              onRegenerateKey={(id) => {
                toast({
                  variant: 'success',
                  title: 'API key regenerated',
                  description: 'A new key has been generated. Update your applications.',
                })
              }}
              onCopyKey={(key) => {
                navigator.clipboard.writeText(key)
                toast({
                  variant: 'success',
                  title: 'Copied to clipboard',
                  description: 'The API key has been copied.',
                })
              }}
            />
          )}

          {activeTab === 'webhooks' && (
            <WebhookSettings
              webhooks={webhooks}
              deliveries={deliveries}
              onAddWebhook={(url, events) => {
                toast({
                  variant: 'success',
                  title: 'Webhook added',
                  description: `Webhook for ${url} has been configured.`,
                })
              }}
              onUpdateWebhook={(id, data) => {
                toast({
                  variant: 'success',
                  title: 'Webhook updated',
                  description: 'The webhook configuration has been updated.',
                })
              }}
              onDeleteWebhook={(id) => {
                toast({
                  variant: 'warning',
                  title: 'Webhook deleted',
                  description: 'The webhook has been removed.',
                })
              }}
              onTestWebhook={(id) => {
                toast({
                  variant: 'info',
                  title: 'Testing webhook',
                  description: 'Sending test payload...',
                })
              }}
              onRetryDelivery={(id) => {
                toast({
                  variant: 'info',
                  title: 'Retrying delivery',
                  description: 'Attempting to resend webhook...',
                })
              }}
            />
          )}

          {activeTab === 'export-import' && (
            <ExportImport
              exportHistory={exportHistory}
              onExport={(format) => {
                toast({
                  variant: 'success',
                  title: 'Export started',
                  description: `Exporting data as ${format.toUpperCase()}...`,
                })
              }}
              onImport={async (file) => {
                toast({
                  variant: 'info',
                  title: 'Import started',
                  description: `Processing ${file.name}...`,
                })
                // Simulate import
                await new Promise((resolve) => setTimeout(resolve, 2000))
                return {
                  success: true,
                  recordsProcessed: 150,
                  recordsImported: 148,
                  errors: [
                    { line: 25, message: 'Invalid email format' },
                    { line: 78, message: 'Missing required field: name' },
                  ],
                }
              }}
              onDownloadExport={(id) => {
                toast({
                  variant: 'success',
                  title: 'Downloading',
                  description: 'Your export is downloading...',
                })
              }}
              onDeleteExport={(id) => {
                toast({
                  variant: 'success',
                  title: 'Export deleted',
                  description: 'The export file has been removed.',
                })
              }}
            />
          )}
        </div>
      </div>
    </div>
  )
}
