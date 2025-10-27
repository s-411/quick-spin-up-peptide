'use client'

import * as React from 'react'
import { Globe, Calendar, Clock, DollarSign } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface LanguageRegionSettings {
  /** Selected language code */
  language: string
  /** Selected region/country code */
  region: string
  /** Timezone */
  timezone: string
  /** Date format preference */
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD'
  /** Time format preference */
  timeFormat: '12h' | '24h'
  /** Currency code */
  currency: string
  /** Number format style */
  numberFormat: 'US' | 'EU'
}

export interface Language {
  code: string
  name: string
  nativeName: string
}

export interface Region {
  code: string
  name: string
}

export interface Currency {
  code: string
  name: string
  symbol: string
}

export interface LanguageRegionProps {
  /** Initial settings */
  settings: LanguageRegionSettings
  /** Save settings callback */
  onSave?: (settings: LanguageRegionSettings) => void
  /** Available languages */
  availableLanguages?: Language[]
  /** Available regions */
  availableRegions?: Region[]
  /** Available currencies */
  availableCurrencies?: Currency[]
  /** Is saving */
  isSaving?: boolean
}

/**
 * LanguageRegion - Language, region, and format settings
 *
 * @example
 * ```tsx
 * <LanguageRegion
 *   settings={localeSettings}
 *   onSave={(data) => saveLocale(data)}
 *   availableLanguages={languages}
 * />
 * ```
 */
export function LanguageRegion({
  settings,
  onSave,
  availableLanguages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
  ],
  availableRegions = [
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'CA', name: 'Canada' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'JP', name: 'Japan' },
    { code: 'CN', name: 'China' },
  ],
  availableCurrencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
  ],
  isSaving = false,
}: LanguageRegionProps) {
  const [formData, setFormData] = React.useState<LanguageRegionSettings>(settings)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(settings)
    setHasChanges(changed)
  }, [formData, settings])

  const handleChange = (field: keyof LanguageRegionSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave?.(formData)
    setHasChanges(false)
  }

  const handleReset = () => {
    setFormData(settings)
    setHasChanges(false)
  }

  // Format preview examples
  const now = new Date()
  const previewDate = () => {
    switch (formData.dateFormat) {
      case 'MM/DD/YYYY':
        return `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()}`
      case 'DD/MM/YYYY':
        return `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`
      case 'YYYY-MM-DD':
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    }
  }

  const previewTime = () => {
    if (formData.timeFormat === '12h') {
      const hours = now.getHours() % 12 || 12
      const minutes = String(now.getMinutes()).padStart(2, '0')
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM'
      return `${hours}:${minutes} ${ampm}`
    } else {
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    }
  }

  const previewNumber = () => {
    const num = 1234.56
    return formData.numberFormat === 'US' ? '1,234.56' : '1.234,56'
  }

  const previewCurrency = () => {
    const currency = availableCurrencies.find((c) => c.code === formData.currency)
    const num = formData.numberFormat === 'US' ? '1,234.56' : '1.234,56'
    return `${currency?.symbol}${num}`
  }

  return (
    <div className="space-y-6">
      {/* Language & Region */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Globe className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Language & Region</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium mb-2">
              Language
            </label>
            <select
              id="language"
              value={formData.language}
              onChange={(e) => handleChange('language', e.target.value)}
              className="select-mm w-full"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium mb-2">
              Region
            </label>
            <select
              id="region"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
              className="select-mm w-full"
            >
              {availableRegions.map((region) => (
                <option key={region.code} value={region.code}>
                  {region.name}
                </option>
              ))}
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
              className="select-mm w-full"
            >
              <option value="America/New_York">Eastern Time (UTC-5)</option>
              <option value="America/Chicago">Central Time (UTC-6)</option>
              <option value="America/Denver">Mountain Time (UTC-7)</option>
              <option value="America/Los_Angeles">Pacific Time (UTC-8)</option>
              <option value="Europe/London">London (UTC+0)</option>
              <option value="Europe/Paris">Paris (UTC+1)</option>
              <option value="Europe/Berlin">Berlin (UTC+1)</option>
              <option value="Asia/Tokyo">Tokyo (UTC+9)</option>
              <option value="Asia/Shanghai">Shanghai (UTC+8)</option>
              <option value="Australia/Sydney">Sydney (UTC+11)</option>
            </select>
          </div>
        </div>
      </EnhancedCard>

      {/* Date Format */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Date Format</h3>
        </div>

        <div className="space-y-3">
          {(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD'] as const).map((format) => (
            <label
              key={format}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.dateFormat === format
                  ? 'border-primary bg-primary/10 dark:bg-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="dateFormat"
                  checked={formData.dateFormat === format}
                  onChange={() => handleChange('dateFormat', format)}
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium">{format}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format === formData.dateFormat && previewDate()}
              </span>
            </label>
          ))}
        </div>
      </EnhancedCard>

      {/* Time Format */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Clock className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Time Format</h3>
        </div>

        <div className="space-y-3">
          {(['12h', '24h'] as const).map((format) => (
            <label
              key={format}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.timeFormat === format
                  ? 'border-primary bg-primary/10 dark:bg-primary/20'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="timeFormat"
                  checked={formData.timeFormat === format}
                  onChange={() => handleChange('timeFormat', format)}
                  className="w-4 h-4 text-primary"
                />
                <span className="font-medium">{format === '12h' ? '12-hour' : '24-hour'}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {format === formData.timeFormat && previewTime()}
              </span>
            </label>
          ))}
        </div>
      </EnhancedCard>

      {/* Currency & Numbers */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <DollarSign className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Currency & Numbers</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="currency" className="block text-sm font-medium mb-2">
              Currency
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              className="select-mm w-full"
            >
              {availableCurrencies.map((curr) => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Number Format</label>
            <div className="space-y-3">
              {(['US', 'EU'] as const).map((format) => (
                <label
                  key={format}
                  className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.numberFormat === format
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="numberFormat"
                      checked={formData.numberFormat === format}
                      onChange={() => handleChange('numberFormat', format)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="font-medium">
                      {format === 'US' ? 'US Style (1,234.56)' : 'EU Style (1.234,56)'}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {format === formData.numberFormat && previewNumber()}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </EnhancedCard>

      {/* Preview Examples */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <h3 className="text-lg font-heading font-bold mb-6">Format Preview</h3>

        <div className="space-y-4 p-6 rounded-lg bg-muted/30">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Today's Date:</span>
            <span className="font-medium">{previewDate()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Current Time:</span>
            <span className="font-medium">{previewTime()}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-sm text-muted-foreground">Sample Number:</span>
            <span className="font-medium">{previewNumber()}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-sm text-muted-foreground">Sample Currency:</span>
            <span className="font-medium">{previewCurrency()}</span>
          </div>
        </div>
      </EnhancedCard>

      {/* Sticky Action Bar */}
      {hasChanges && (
        <div className="sticky bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border p-4 flex justify-end gap-3">
          <button onClick={handleReset} className="btn-secondary" disabled={isSaving}>
            Cancel
          </button>
          <button onClick={handleSave} className="btn-mm" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      )}
    </div>
  )
}
