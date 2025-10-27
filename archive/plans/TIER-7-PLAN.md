# Tier 7: Admin & Settings Sections (Part 1) - Implementation Plan

## Overview
Tier 7 focuses on user preferences, account settings, and basic configuration components. This tier contains 10 components organized into 3 categories.

**Status**: 3 components completed, 7 remaining

---

## Component Status

### ✅ COMPLETED COMPONENTS (3)

#### 1. GeneralSettings ✅
**File**: `components/sections/admin/general-settings.tsx`
**Status**: COMPLETE

**Interface**:
```typescript
interface GeneralSettingsData {
  fullName: string
  email: string
  username: string
  language: string
  timezone: string
}

interface GeneralSettingsProps {
  data: GeneralSettingsData
  onSave?: (data: GeneralSettingsData) => void
  onChangePassword?: () => void
  onDeleteAccount?: () => void
  isSaving?: boolean
}
```

**Features Implemented**:
- Profile information form (name, username, email)
- Localization settings (language, timezone)
- Change password button
- Danger zone with delete account
- Save/cancel with change detection
- Sticky action bar at bottom

---

#### 2. NotificationSettings ✅
**File**: `components/sections/admin/notification-settings.tsx`
**Status**: COMPLETE

**Interface**:
```typescript
interface NotificationChannel {
  email: boolean
  push: boolean
  sms: boolean
}

interface NotificationPreferences {
  marketing: NotificationChannel
  productUpdates: NotificationChannel
  security: NotificationChannel
  social: NotificationChannel
  frequency: 'instant' | 'daily' | 'weekly'
  pauseAll: boolean
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences
  onSave?: (preferences: NotificationPreferences) => void
  isSaving?: boolean
}
```

**Features Implemented**:
- Pause all notifications toggle
- Frequency selector (instant/daily/weekly)
- 4 notification categories with channel toggles:
  - Marketing & Promotions
  - Product Updates
  - Security Alerts
  - Comments & Mentions
- Each category has email/push/SMS checkboxes
- Save/cancel with change detection

---

#### 3. PrivacySettings ✅
**File**: `components/sections/admin/privacy-settings.tsx`
**Status**: COMPLETE

**Interface**:
```typescript
interface PrivacyPreferences {
  profileVisibility: 'public' | 'private' | 'friends'
  showEmail: boolean
  showActivity: boolean
  searchEngineIndexing: boolean
  twoFactorEnabled: boolean
  analyticsTracking: boolean
}

interface ConnectedDevice {
  id: string
  name: string
  type: 'desktop' | 'mobile' | 'tablet'
  location: string
  lastActive: string
  isCurrent: boolean
}

interface PrivacySettingsProps {
  preferences: PrivacyPreferences
  devices?: ConnectedDevice[]
  onSave?: (preferences: PrivacyPreferences) => void
  onEnable2FA?: () => void
  onRevokeDevice?: (deviceId: string) => void
  isSaving?: boolean
}
```

**Features Implemented**:
- Profile visibility selector (public/private/friends)
- Privacy toggles:
  - Show email address
  - Show activity status
  - Search engine indexing
  - Analytics tracking
- Two-factor authentication section
- Connected devices list with revoke action
- Save/cancel with change detection

---

## 🚧 PENDING COMPONENTS (7)

### Category: Appearance & Personalization

#### 4. AppearanceSettings 🚧
**File**: `components/sections/admin/appearance-settings.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface AppearancePreferences {
  theme: 'light' | 'dark' | 'auto'
  colorScheme?: string
  fontSize: 'small' | 'medium' | 'large'
  viewDensity: 'compact' | 'comfortable'
  accentColor?: string
}

interface AppearanceSettingsProps {
  preferences: AppearancePreferences
  onSave?: (preferences: AppearancePreferences) => void
  availableColorSchemes?: Array<{ id: string; name: string; colors: string[] }>
  isSaving?: boolean
}
```

**Features to Implement**:
- Theme selector with 3 options (light/dark/auto)
- Color scheme picker with preview swatches
- Font size radio buttons (small/medium/large)
- View density toggle (compact/comfortable)
- Accent color picker (optional)
- Live preview panel showing changes
- Reset to defaults button
- Save/cancel with change detection

**Key Components**:
- Radio buttons for theme selection
- Color swatches for scheme selection
- Preview card showing current settings
- Font size examples

---

#### 5. LanguageRegion 🚧
**File**: `components/sections/admin/language-region.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface LanguageRegionSettings {
  language: string
  region: string
  timezone: string
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  timeFormat: '12h' | '24h'
  currency: string
  numberFormat: 'US' | 'EU'
}

interface LanguageRegionProps {
  settings: LanguageRegionSettings
  onSave?: (settings: LanguageRegionSettings) => void
  availableLanguages?: Array<{ code: string; name: string; nativeName: string }>
  availableRegions?: Array<{ code: string; name: string }>
  availableCurrencies?: Array<{ code: string; name: string; symbol: string }>
  isSaving?: boolean
}
```

**Features to Implement**:
- Language selector dropdown with native names
- Region/country picker
- Timezone selector with UTC offsets
- Date format radio buttons with examples
- Time format toggle (12h/24h)
- Currency selector with symbols
- Number format selector (1,234.56 vs 1.234,56)
- Preview examples of each format
- Save/cancel with change detection

**Preview Examples**:
- Show current date in selected format
- Show current time in selected format
- Show sample number in selected format
- Show sample currency amount

---

#### 6. AccessibilitySettings 🚧
**File**: `components/sections/admin/accessibility-settings.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface AccessibilityPreferences {
  screenReaderEnabled: boolean
  highContrastMode: boolean
  keyboardNavigation: boolean
  reduceMotion: boolean
  textSize: 'default' | 'large' | 'extra-large'
  lineSpacing: 'default' | 'relaxed' | 'loose'
  focusIndicators: boolean
  underlineLinks: boolean
}

interface AccessibilitySettingsProps {
  preferences: AccessibilityPreferences
  onSave?: (preferences: AccessibilityPreferences) => void
  isSaving?: boolean
}
```

**Features to Implement**:
- Screen reader support toggle with description
- High contrast mode toggle
- Keyboard navigation enhancements toggle
- Reduce motion toggle (affects animations)
- Text size selector (default/large/extra-large)
- Line spacing selector (default/relaxed/loose)
- Enhanced focus indicators toggle
- Underline all links toggle
- Preview area showing current settings
- Save/cancel with change detection

**Accessibility Features**:
- All toggles must have proper ARIA labels
- Preview text with adjustable size/spacing
- Keyboard-accessible controls
- Clear visual indicators

---

### Category: Integration & Advanced

#### 7. IntegrationsList 🚧
**File**: `components/sections/admin/integrations-list.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface Integration {
  id: string
  name: string
  description: string
  icon?: string
  status: 'connected' | 'disconnected' | 'error'
  enabled: boolean
  lastSynced?: string
  syncFrequency?: string
  scopes?: string[]
}

interface IntegrationsListProps {
  integrations: Integration[]
  onToggleEnabled?: (id: string, enabled: boolean) => void
  onConfigure?: (id: string) => void
  onConnect?: (id: string) => void
  onDisconnect?: (id: string) => void
  onAddIntegration?: () => void
  isLoading?: boolean
}
```

**Features to Implement**:
- Grid/list of integration cards
- Each card shows:
  - Integration icon/logo
  - Name and description
  - Connection status badge
  - Enable/disable toggle
  - Last synced timestamp
  - Configure button
  - Connect/disconnect button
- Status indicators (connected/disconnected/error)
- Filter by status (all/connected/disconnected)
- Search integrations
- "Add New Integration" CTA button
- Loading states
- Empty state when no integrations

**Status Colors**:
- Connected: green badge
- Disconnected: gray badge
- Error: red badge

---

#### 8. ApiKeyManagement 🚧
**File**: `components/sections/admin/api-key-management.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface ApiKey {
  id: string
  name: string
  key: string
  createdAt: string
  lastUsed?: string
  expiresAt?: string
  scopes: string[]
  usageCount?: number
  isActive: boolean
}

interface ApiKeyManagementProps {
  keys: ApiKey[]
  onCreateKey?: (name: string, scopes: string[]) => void
  onRevokeKey?: (id: string) => void
  onRegenerateKey?: (id: string) => void
  onCopyKey?: (key: string) => void
  availableScopes?: Array<{ id: string; name: string; description: string }>
  isCreating?: boolean
}
```

**Features to Implement**:
- "Create New API Key" button (opens modal/form)
- Create key form:
  - Name input
  - Scope selection (checkboxes)
  - Expiration date picker (optional)
  - Generate button
- List of existing keys:
  - Masked key with copy button
  - Key name
  - Creation date
  - Last used date
  - Expiration date
  - Usage stats (API calls)
  - Active/inactive status
  - Scopes display
  - Revoke button
  - Regenerate button
- Copy to clipboard with toast notification
- Confirmation dialog for revoke/regenerate
- Empty state when no keys

**Security Features**:
- Show only last 4 characters of key
- Copy button shows full key temporarily
- Confirmation required for dangerous actions

---

#### 9. WebhookSettings 🚧
**File**: `components/sections/admin/webhook-settings.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface Webhook {
  id: string
  url: string
  events: string[]
  secret?: string
  isActive: boolean
  createdAt: string
  lastTriggered?: string
  successRate?: number
}

interface WebhookDelivery {
  id: string
  webhookId: string
  event: string
  timestamp: string
  status: 'success' | 'failed' | 'pending'
  responseCode?: number
  responseTime?: number
}

interface WebhookSettingsProps {
  webhooks: Webhook[]
  deliveries?: WebhookDelivery[]
  availableEvents?: Array<{ id: string; name: string; description: string }>
  onAddWebhook?: (url: string, events: string[]) => void
  onUpdateWebhook?: (id: string, data: Partial<Webhook>) => void
  onDeleteWebhook?: (id: string) => void
  onTestWebhook?: (id: string) => void
  isAdding?: boolean
}
```

**Features to Implement**:
- "Add Webhook" button (opens form)
- Add webhook form:
  - URL input with validation
  - Event type checkboxes (grouped by category)
  - Secret input (optional)
  - Add button
- List of active webhooks:
  - URL display
  - Events list (truncated with expand)
  - Active/inactive toggle
  - Success rate indicator
  - Last triggered timestamp
  - Test webhook button
  - Edit button
  - Delete button
- Webhook delivery logs:
  - Recent deliveries list
  - Status badges (success/failed/pending)
  - Response code
  - Response time
  - Retry button for failed deliveries
- Empty state when no webhooks

**Validation**:
- URL must be https://
- At least one event must be selected
- Show event descriptions on hover

---

#### 10. ExportImport 🚧
**File**: `components/sections/admin/export-import.tsx`
**Status**: NOT STARTED

**Required Interface**:
```typescript
interface ExportRecord {
  id: string
  format: 'json' | 'csv' | 'xml'
  createdAt: string
  fileSize: number
  downloadUrl: string
  expiresAt: string
}

interface ImportResult {
  success: boolean
  recordsProcessed: number
  recordsImported: number
  errors?: Array<{ line: number; message: string }>
}

interface ExportImportProps {
  exportHistory?: ExportRecord[]
  onExport?: (format: 'json' | 'csv' | 'xml', options?: any) => void
  onImport?: (file: File) => Promise<ImportResult>
  onDownloadExport?: (id: string) => void
  isExporting?: boolean
  isImporting?: boolean
}
```

**Features to Implement**:
- **Export Section**:
  - Format selector buttons (JSON/CSV/XML)
  - Export options (date range, data types to include)
  - Export button
  - Progress indicator during export
  - Export history list:
    - Format badge
    - Creation date
    - File size
    - Expiration date
    - Download button
    - Delete button
- **Import Section**:
  - File picker/drag-drop zone
  - Supported format info
  - Data preview table (first 10 rows)
  - Validation warnings
  - Import button
  - Progress indicator during import
  - Results summary:
    - Records processed
    - Records imported
    - Errors list (if any)
- Confirmation dialogs for import
- Error handling with clear messages

**File Support**:
- Accept: .json, .csv, .xml
- Max file size: 10MB
- Show file info before import

---

## Directory Structure

```
demo-app/
└── components/
    └── sections/
        └── admin/
            ├── general-settings.tsx          ✅ COMPLETE
            ├── notification-settings.tsx     ✅ COMPLETE
            ├── privacy-settings.tsx          ✅ COMPLETE
            ├── appearance-settings.tsx       🚧 TODO
            ├── language-region.tsx           🚧 TODO
            ├── accessibility-settings.tsx    🚧 TODO
            ├── integrations-list.tsx         🚧 TODO
            ├── api-key-management.tsx        🚧 TODO
            ├── webhook-settings.tsx          🚧 TODO
            └── export-import.tsx             🚧 TODO
```

---

## Demo Page Requirements

**File**: `app/admin/page.tsx`
**Status**: NOT STARTED

### Features Needed:
- Back button to home
- Theme toggle in header
- Tabbed navigation for component categories:
  - General Settings
  - Notifications
  - Privacy & Security
  - Appearance
  - Localization
  - Accessibility
  - Integrations
  - Developer Tools
- Sample data for all components
- Toast notifications for actions
- Loading states
- Error states

### Sample Data Required:
- User settings data
- Notification preferences
- Privacy preferences
- Connected devices list
- Integration list
- API keys list
- Webhooks list
- Export history

---

## Index Export Updates

**File**: `components/sections/index.ts`
**Status**: PARTIALLY UPDATED

### Exports to Add:
```typescript
// Admin Sections (Tier 7)
export { GeneralSettings } from './admin/general-settings'
export { NotificationSettings } from './admin/notification-settings'
export { PrivacySettings } from './admin/privacy-settings'
export { AppearanceSettings } from './admin/appearance-settings'
export { LanguageRegion } from './admin/language-region'
export { AccessibilitySettings } from './admin/accessibility-settings'
export { IntegrationsList } from './admin/integrations-list'
export { ApiKeyManagement } from './admin/api-key-management'
export { WebhookSettings } from './admin/webhook-settings'
export { ExportImport } from './admin/export-import'

// Type exports
export type { GeneralSettingsData, GeneralSettingsProps } from './admin/general-settings'
export type { NotificationChannel, NotificationPreferences, NotificationSettingsProps } from './admin/notification-settings'
export type { PrivacyPreferences, ConnectedDevice, PrivacySettingsProps } from './admin/privacy-settings'
export type { AppearancePreferences, AppearanceSettingsProps } from './admin/appearance-settings'
export type { LanguageRegionSettings, LanguageRegionProps } from './admin/language-region'
export type { AccessibilityPreferences, AccessibilitySettingsProps } from './admin/accessibility-settings'
export type { Integration, IntegrationsListProps } from './admin/integrations-list'
export type { ApiKey, ApiKeyManagementProps } from './admin/api-key-management'
export type { Webhook, WebhookDelivery, WebhookSettingsProps } from './admin/webhook-settings'
export type { ExportRecord, ImportResult, ExportImportProps } from './admin/export-import'
```

---

## Home Page Update

**File**: `app/page.tsx`
**Status**: NOT STARTED

### Add Tier 7 Button:
```tsx
<a
  href="/admin"
  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
>
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
  View Tier 7 Admin
</a>
```

---

## Implementation Checklist

### For Each Remaining Component:
- [ ] Create TypeScript interfaces with JSDoc
- [ ] Use `'use client'` directive
- [ ] Import icons from lucide-react
- [ ] Use EnhancedCard with `tilt={false} glowEffect={false}`
- [ ] Use `btn-mm` and `btn-secondary` classes
- [ ] Implement dark mode with vibrant colors (500 shades)
- [ ] Add responsive design (mobile-first)
- [ ] Include loading states
- [ ] Include error states
- [ ] Add proper ARIA labels
- [ ] Test keyboard navigation
- [ ] Add change detection
- [ ] Add save/cancel functionality
- [ ] Add confirmation dialogs where needed

### Overall Tasks:
- [ ] Complete 7 remaining components
- [ ] Create demo page with all components
- [ ] Update sections index.ts
- [ ] Add Tier 7 button to home page
- [ ] Test all components in light mode
- [ ] Test all components in dark mode
- [ ] Test responsive behavior
- [ ] Test keyboard navigation
- [ ] Test with sample data

---

## Design Patterns to Follow

Based on completed components, maintain these patterns:

1. **Change Detection**: Track when form data changes from initial values
2. **Sticky Action Bar**: Show save/cancel buttons at bottom when changes detected
3. **Sections with Icons**: Each section has an icon and title
4. **Toggle Switches**: Use custom toggle component (not native checkbox)
5. **Card Spacing**: Use `space-y-6` for card spacing
6. **Form Spacing**: Use `space-y-4` for form fields
7. **Muted Backgrounds**: Use `bg-muted/30` for sub-sections
8. **Loading States**: Disable buttons and show "Saving..." text
9. **Descriptions**: Include helpful descriptions under section titles

---

## Estimated Time

- **Appearance & Personalization** (3 components): 2-3 hours
- **Integration & Advanced** (4 components): 3-4 hours
- **Demo Page**: 1-2 hours
- **Testing & Polish**: 1 hour

**Total**: 7-10 hours for Tier 7 completion

---

**End of Tier 7 Plan**
