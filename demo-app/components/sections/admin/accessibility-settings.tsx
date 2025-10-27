'use client'

import * as React from 'react'
import { Eye, Contrast, Keyboard, Zap, Type, AlignLeft, Focus, Link } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface AccessibilityPreferences {
  /** Screen reader support enabled */
  screenReaderEnabled: boolean
  /** High contrast mode */
  highContrastMode: boolean
  /** Enhanced keyboard navigation */
  keyboardNavigation: boolean
  /** Reduce motion/animations */
  reduceMotion: boolean
  /** Text size preference */
  textSize: 'default' | 'large' | 'extra-large'
  /** Line spacing preference */
  lineSpacing: 'default' | 'relaxed' | 'loose'
  /** Enhanced focus indicators */
  focusIndicators: boolean
  /** Underline all links */
  underlineLinks: boolean
}

export interface AccessibilitySettingsProps {
  /** Initial accessibility preferences */
  preferences: AccessibilityPreferences
  /** Save preferences callback */
  onSave?: (preferences: AccessibilityPreferences) => void
  /** Is saving */
  isSaving?: boolean
}

/**
 * AccessibilitySettings - Accessibility and usability options
 *
 * @example
 * ```tsx
 * <AccessibilitySettings
 *   preferences={a11ySettings}
 *   onSave={(data) => saveAccessibility(data)}
 * />
 * ```
 */
export function AccessibilitySettings({
  preferences,
  onSave,
  isSaving = false,
}: AccessibilitySettingsProps) {
  const [formData, setFormData] = React.useState<AccessibilityPreferences>(preferences)
  const [hasChanges, setHasChanges] = React.useState(false)

  React.useEffect(() => {
    const changed = JSON.stringify(formData) !== JSON.stringify(preferences)
    setHasChanges(changed)
  }, [formData, preferences])

  const handleToggle = (field: keyof AccessibilityPreferences) => {
    if (typeof formData[field] === 'boolean') {
      setFormData((prev) => ({ ...prev, [field]: !prev[field] }))
    }
  }

  const handleChange = (field: keyof AccessibilityPreferences, value: any) => {
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

  return (
    <div className="space-y-6">
      {/* Vision */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Vision</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label htmlFor="screenReader" className="block text-sm font-medium mb-1">
                Screen Reader Support
              </label>
              <p className="text-sm text-muted-foreground">
                Optimize the interface for screen reader users with enhanced ARIA labels and
                announcements
              </p>
            </div>
            <button
              id="screenReader"
              onClick={() => handleToggle('screenReaderEnabled')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.screenReaderEnabled ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={formData.screenReaderEnabled}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.screenReaderEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label htmlFor="highContrast" className="block text-sm font-medium mb-1">
                High Contrast Mode
              </label>
              <p className="text-sm text-muted-foreground">
                Increase color contrast for better visibility and readability
              </p>
            </div>
            <button
              id="highContrast"
              onClick={() => handleToggle('highContrastMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.highContrastMode ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={formData.highContrastMode}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.highContrastMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </EnhancedCard>

      {/* Interaction */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Keyboard className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Interaction</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label htmlFor="keyboardNav" className="block text-sm font-medium mb-1">
                Enhanced Keyboard Navigation
              </label>
              <p className="text-sm text-muted-foreground">
                Enable advanced keyboard shortcuts and improved focus management
              </p>
            </div>
            <button
              id="keyboardNav"
              onClick={() => handleToggle('keyboardNavigation')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.keyboardNavigation ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={formData.keyboardNavigation}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.keyboardNavigation ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label htmlFor="reduceMotion" className="block text-sm font-medium mb-1">
                Reduce Motion
              </label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions that may cause discomfort
              </p>
            </div>
            <button
              id="reduceMotion"
              onClick={() => handleToggle('reduceMotion')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.reduceMotion ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={formData.reduceMotion}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.reduceMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <label htmlFor="focusIndicators" className="block text-sm font-medium mb-1">
                Enhanced Focus Indicators
              </label>
              <p className="text-sm text-muted-foreground">
                Show prominent visual indicators for focused elements
              </p>
            </div>
            <button
              id="focusIndicators"
              onClick={() => handleToggle('focusIndicators')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.focusIndicators ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={formData.focusIndicators}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.focusIndicators ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </EnhancedCard>

      {/* Text & Typography */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Type className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Text & Typography</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">Text Size</label>
            <div className="space-y-2">
              {(['default', 'large', 'extra-large'] as const).map((size) => (
                <label
                  key={size}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.textSize === size
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="textSize"
                    checked={formData.textSize === size}
                    onChange={() => handleChange('textSize', size)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium capitalize mb-1">{size.replace('-', ' ')}</p>
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontSize:
                          size === 'default' ? '1rem' : size === 'large' ? '1.125rem' : '1.25rem',
                      }}
                    >
                      Sample text preview
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-3">Line Spacing</label>
            <div className="space-y-2">
              {(['default', 'relaxed', 'loose'] as const).map((spacing) => (
                <label
                  key={spacing}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    formData.lineSpacing === spacing
                      ? 'border-primary bg-primary/10 dark:bg-primary/20'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <input
                    type="radio"
                    name="lineSpacing"
                    checked={formData.lineSpacing === spacing}
                    onChange={() => handleChange('lineSpacing', spacing)}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium capitalize mb-1">{spacing}</p>
                    <div
                      className="text-sm text-muted-foreground"
                      style={{
                        lineHeight:
                          spacing === 'default' ? '1.5' : spacing === 'relaxed' ? '1.75' : '2',
                      }}
                    >
                      <p>Line one of sample text</p>
                      <p>Line two of sample text</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-start justify-between pt-4 border-t border-border">
            <div className="flex-1">
              <label htmlFor="underlineLinks" className="block text-sm font-medium mb-1">
                Underline All Links
              </label>
              <p className="text-sm text-muted-foreground">
                Always show underlines on links to make them easier to identify
              </p>
            </div>
            <button
              id="underlineLinks"
              onClick={() => handleToggle('underlineLinks')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.underlineLinks ? 'bg-primary' : 'bg-muted'
              }`}
              role="switch"
              aria-checked={formData.underlineLinks}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.underlineLinks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </EnhancedCard>

      {/* Preview */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center gap-3 mb-6">
          <Eye className="w-5 h-5 text-primary dark:text-primary/80" />
          <h3 className="text-lg font-heading font-bold">Preview</h3>
        </div>

        <div
          className={`p-6 rounded-lg bg-muted/30 space-y-4 ${
            formData.highContrastMode ? 'bg-black text-white' : ''
          }`}
          style={{
            fontSize:
              formData.textSize === 'default'
                ? '1rem'
                : formData.textSize === 'large'
                ? '1.125rem'
                : '1.25rem',
            lineHeight:
              formData.lineSpacing === 'default'
                ? '1.5'
                : formData.lineSpacing === 'relaxed'
                ? '1.75'
                : '2',
          }}
        >
          <h4 className="font-heading font-bold">Sample Heading</h4>
          <p className={formData.highContrastMode ? 'text-white' : 'text-muted-foreground'}>
            This is a preview of how your text will appear with the current accessibility settings.
            You can adjust text size, line spacing, and other options to improve readability.
          </p>
          <p>
            This paragraph contains a{' '}
            <a
              href="#"
              className={`text-primary ${formData.underlineLinks ? 'underline' : ''} ${
                formData.focusIndicators ? 'focus:ring-2 focus:ring-primary focus:ring-offset-2' : ''
              }`}
            >
              sample link
            </a>{' '}
            to demonstrate link styling.
          </p>
          <button
            className={`btn-mm ${
              formData.focusIndicators ? 'focus:ring-4 focus:ring-primary focus:ring-offset-2' : ''
            }`}
          >
            Sample Button
          </button>
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
