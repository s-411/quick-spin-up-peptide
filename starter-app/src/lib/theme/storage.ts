/**
 * Theme Storage
 * Handles theme persistence using localStorage
 */

import type { ThemeMode } from './config'

const THEME_STORAGE_KEY = 'app-theme-mode'

/**
 * Save theme preference to localStorage
 */
export function saveThemePreference(mode: ThemeMode): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode)
  } catch (error) {
    console.warn('Failed to save theme preference:', error)
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadThemePreference(): ThemeMode | null {
  if (typeof window === 'undefined') return null

  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored && isValidThemeMode(stored)) {
      return stored as ThemeMode
    }
  } catch (error) {
    console.warn('Failed to load theme preference:', error)
  }

  return null
}

/**
 * Clear theme preference from localStorage
 */
export function clearThemePreference(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(THEME_STORAGE_KEY)
  } catch (error) {
    console.warn('Failed to clear theme preference:', error)
  }
}

/**
 * Type guard for theme mode
 */
function isValidThemeMode(value: string): value is ThemeMode {
  return ['light', 'dark', 'system'].includes(value)
}

/**
 * Subscribe to localStorage changes (for cross-tab sync)
 */
export function subscribeToThemeChanges(callback: (mode: ThemeMode) => void): () => void {
  if (typeof window === 'undefined') return () => {}

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY && event.newValue && isValidThemeMode(event.newValue)) {
      callback(event.newValue as ThemeMode)
    }
  }

  window.addEventListener('storage', handleStorageChange)

  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}
