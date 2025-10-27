'use client'

import * as React from 'react'
import { Palette, Type, Layout, RotateCcw } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface AppearancePreferences {
  /** Theme mode: light, dark, or auto */
  theme: 'light' | 'dark' | 'auto'
  /** Selected color scheme ID */
  colorScheme?: string
  /** Font size preference */
  fontSize: 'small' | 'medium' | 'large'
  /** View density preference */
  viewDensity: 'compact' | 'comfortable'
  /** Custom accent color */
  accentColor?: string
}

export interface ColorScheme {
  id: string
  name: string
  colors: string[]
}

export interface AppearanceSettingsProps {
  /** Initial appearance preferences */
  preferences: AppearancePreferences
  /** Save preferences callback */
  onSave?: (preferences: AppearancePreferences) => void
  /** Available color schemes */
  availableColorSchemes?: ColorScheme[]
  /** Is saving */
  isSaving?: boolean
}

const defaultColorSchemes: ColorScheme[] = [
  {
    id: 'ocean',
    name: 'Ocean Blue',
    colors: ['hsl(var(--primary))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))'],
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: ['hsl(var(--chart-4))', 'hsl(var(--chart-1))', 'hsl(var(--chart-5))'],
  },
  {
    id: 'forest',
    name: 'Forest Canopy',
    colors: ['hsl(var(--chart-3))', 'hsl(var(--chart-2))', 'hsl(var(--chart-1))'],
  },
  {
    id: 'midnight',
    name: 'Midnight Violet',
    colors: ['hsl(var(--chart-5))', 'hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
  },
]

/**
 * AppearanceSettings - Theme and appearance customization
 *
 * @example
 * ```tsx
 * <AppearanceSettings
 *   preferences={appearanceData}
 *   onSave={(data) => saveAppearance(data)}
 *   availableColorSchemes={colorSchemes}
 * />
 * ```
 */
export function AppearanceSettings({
  preferences,
  onSave,
  availableColorSchemes = defaultColorSchemes,
  isSaving = false,
}: AppearanceSettingsProps) {
  const [formData, setFormData] = React.useState<AppearancePreferences>(preferences)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(preferences)
    setHasChanges(changed)
  }, [formData, preferences])

  const handleChange = (field: keyof AppearancePreferences, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave?.(formData)
    setHasChanges(false)
  }

  const handleReset = () => {
    setFormData(preferences)
    setHasChanges(false)
  }

  const handleResetDefaults = () => {
    const defaults: AppearancePreferences = {
      theme: 'auto',
      colorScheme: 'ocean',
      fontSize: 'medium',
      viewDensity: 'comfortable',
    }
    setFormData(defaults)
  }

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Theme</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choose how the interface looks to you
          </p>

          <div className="grid grid-cols-3 gap-4">
            {(['light', 'dark', 'auto'] as const).map((theme) => (
              <button
                key={theme}
                onClick={() => handleChange('theme', theme)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.theme === theme
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    {theme === 'light' && (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                        />
                      </svg>
                    )}
                    {theme === 'dark' && (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                        />
                      </svg>
                    )}
                    {theme === 'auto' && (
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm font-medium capitalize">{theme}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </EnhancedCard>

      {/* Color Scheme */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Color Scheme</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Select your preferred color palette
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {availableColorSchemes.map((scheme) => (
              <button
                key={scheme.id}
                onClick={() => handleChange('colorScheme', scheme.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.colorScheme === scheme.id
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex gap-2 justify-center">
                    {scheme.colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="w-8 h-8 rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-medium text-center">{scheme.name}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </EnhancedCard>

      {/* Font Size */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Type className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Font Size</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Adjust the text size throughout the app
          </p>

          <div className="space-y-3">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <label
                key={size}
                className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  formData.fontSize === size
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="fontSize"
                  checked={formData.fontSize === size}
                  onChange={() => handleChange('fontSize', size)}
                  className="w-4 h-4 text-primary"
                />
                <div className="flex-1">
                  <p className="font-medium capitalize">{size}</p>
                  <p
                    className="text-muted-foreground"
                    style={{
                      fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
                    }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      </EnhancedCard>

      {/* View Density */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Layout className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">View Density</h3>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Control spacing and information density
          </p>

          <div className="grid grid-cols-2 gap-4">
            {(['compact', 'comfortable'] as const).map((density) => (
              <button
                key={density}
                onClick={() => handleChange('viewDensity', density)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.viewDensity === density
                    ? 'border-primary bg-primary/10 dark:bg-primary/20'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <div className="text-center">
                  <p className="text-sm font-medium capitalize mb-2">{density}</p>
                  <div className="space-y-1">
                    <div
                      className={`h-2 bg-muted rounded ${
                        density === 'compact' ? 'w-full' : 'w-3/4 mx-auto'
                      }`}
                    />
                    <div
                      className={`h-2 bg-muted rounded ${
                        density === 'compact' ? 'w-full' : 'w-3/4 mx-auto'
                      }`}
                    />
                    <div
                      className={`h-2 bg-muted rounded ${
                        density === 'compact' ? 'w-full' : 'w-3/4 mx-auto'
                      }`}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </EnhancedCard>

      {/* Preview Panel */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-bold">Preview</h3>
          <button
            onClick={handleResetDefaults}
            className="text-sm text-muted-foreground hover:text-primary flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
        </div>

        <div className="p-6 rounded-lg bg-muted/30 space-y-4">
          <div
            className={`space-y-2 ${
              formData.fontSize === 'small'
                ? 'text-sm'
                : formData.fontSize === 'large'
                ? 'text-lg'
                : 'text-base'
            } ${formData.viewDensity === 'compact' ? 'space-y-1' : 'space-y-3'}`}
          >
            <h4 className="font-heading font-bold">Sample Heading</h4>
            <p className="text-muted-foreground">
              This is how your text will look with the current settings. You can adjust the font
              size, theme, and view density to match your preferences.
            </p>
            <button className="btn-mm mt-2">Sample Button</button>
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
