/**
 * useTheme Hook
 * Manages theme state with persistence and system preference detection
 */

'use client'

import { useEffect, useState } from 'react'
import type { ThemeMode } from '@/lib/theme/config'
import { applyTheme, resolveTheme, getSystemTheme } from '@/lib/theme/config'
import {
  loadThemePreference,
  saveThemePreference,
  subscribeToThemeChanges,
} from '@/lib/theme/storage'

export interface UseThemeReturn {
  theme: ThemeMode
  resolvedTheme: 'light' | 'dark'
  setTheme: (theme: ThemeMode) => void
  systemTheme: 'light' | 'dark'
}

/**
 * Hook for managing theme state
 */
export function useTheme(): UseThemeReturn {
  const [theme, setThemeState] = useState<ThemeMode>('system')
  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true)

    // Load saved preference or default to system
    const savedTheme = loadThemePreference()
    const initialTheme = savedTheme || 'system'
    setThemeState(initialTheme)

    // Get system theme
    const currentSystemTheme = getSystemTheme()
    setSystemTheme(currentSystemTheme)

    // Apply theme
    applyTheme(initialTheme)

    // Subscribe to system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? 'dark' : 'light'
      setSystemTheme(newSystemTheme)

      // If theme is set to system, reapply
      setThemeState(current => {
        if (current === 'system') {
          applyTheme('system')
        }
        return current
      })
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    // Subscribe to localStorage changes (cross-tab sync)
    const unsubscribe = subscribeToThemeChanges(newTheme => {
      setThemeState(newTheme)
      applyTheme(newTheme)
    })

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
      unsubscribe()
    }
  }, [])

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme)
    saveThemePreference(newTheme)
    applyTheme(newTheme)
  }

  // Return default values during SSR
  if (!mounted) {
    return {
      theme: 'system',
      resolvedTheme: 'light',
      setTheme: () => {},
      systemTheme: 'light',
    }
  }

  return {
    theme,
    resolvedTheme: resolveTheme(theme),
    setTheme,
    systemTheme,
  }
}
