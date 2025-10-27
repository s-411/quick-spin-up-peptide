/**
 * Theme Storage Tests
 */

import {
  saveThemePreference,
  loadThemePreference,
  clearThemePreference,
  subscribeToThemeChanges,
} from '@/lib/theme/storage'

describe('Theme Storage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  describe('saveThemePreference', () => {
    it('should save theme to localStorage', () => {
      saveThemePreference('dark')
      expect(localStorage.getItem('app-theme-mode')).toBe('dark')
    })

    it('should update existing preference', () => {
      saveThemePreference('light')
      saveThemePreference('dark')
      expect(localStorage.getItem('app-theme-mode')).toBe('dark')
    })

    it('should save system preference', () => {
      saveThemePreference('system')
      expect(localStorage.getItem('app-theme-mode')).toBe('system')
    })
  })

  describe('loadThemePreference', () => {
    it('should load saved preference', () => {
      localStorage.setItem('app-theme-mode', 'dark')
      expect(loadThemePreference()).toBe('dark')
    })

    it('should return null if no preference saved', () => {
      expect(loadThemePreference()).toBeNull()
    })

    it('should return null for invalid values', () => {
      localStorage.setItem('app-theme-mode', 'invalid')
      expect(loadThemePreference()).toBeNull()
    })
  })

  describe('clearThemePreference', () => {
    it('should remove preference from localStorage', () => {
      localStorage.setItem('app-theme-mode', 'dark')
      clearThemePreference()
      expect(localStorage.getItem('app-theme-mode')).toBeNull()
    })

    it('should not error if no preference exists', () => {
      expect(() => clearThemePreference()).not.toThrow()
    })
  })

  describe('subscribeToThemeChanges', () => {
    it('should call callback on storage change', () => {
      const callback = jest.fn()
      subscribeToThemeChanges(callback)

      // Simulate storage event
      const event = new StorageEvent('storage', {
        key: 'app-theme-mode',
        newValue: 'dark',
      })
      window.dispatchEvent(event)

      expect(callback).toHaveBeenCalledWith('dark')
    })

    it('should not call callback for other keys', () => {
      const callback = jest.fn()
      subscribeToThemeChanges(callback)

      const event = new StorageEvent('storage', {
        key: 'other-key',
        newValue: 'value',
      })
      window.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })

    it('should return unsubscribe function', () => {
      const callback = jest.fn()
      const unsubscribe = subscribeToThemeChanges(callback)

      unsubscribe()

      const event = new StorageEvent('storage', {
        key: 'app-theme-mode',
        newValue: 'dark',
      })
      window.dispatchEvent(event)

      expect(callback).not.toHaveBeenCalled()
    })
  })
})
