/**
 * Theme Configuration Tests
 */

import {
  defaultThemeConfig,
  getThemeCSSVariables,
  applyTheme,
  getSystemTheme,
  resolveTheme,
} from '@/lib/theme/config'

describe('Theme Configuration', () => {
  describe('defaultThemeConfig', () => {
    it('should have default mode set to system', () => {
      expect(defaultThemeConfig.mode).toBe('system')
    })

    it('should have light and dark color schemes', () => {
      expect(defaultThemeConfig.colors.light).toBeDefined()
      expect(defaultThemeConfig.colors.dark).toBeDefined()
    })

    it('should have spacing scale', () => {
      expect(defaultThemeConfig.spacing.xs).toBe('0.25rem')
      expect(defaultThemeConfig.spacing['4xl']).toBe('6rem')
    })

    it('should have typography config', () => {
      expect(defaultThemeConfig.typography.fontFamily.sans).toBeDefined()
      expect(defaultThemeConfig.typography.fontSize.base).toBe('1rem')
    })

    it('should have border radius config', () => {
      expect(defaultThemeConfig.borderRadius.sm).toBe('0.25rem')
      expect(defaultThemeConfig.borderRadius.full).toBe('9999px')
    })
  })

  describe('getThemeCSSVariables', () => {
    it('should convert light theme colors to CSS variables', () => {
      const vars = getThemeCSSVariables('light')

      expect(vars['--primary']).toBe('221.2 83.2% 53.3%')
      expect(vars['--background']).toBe('0 0% 100%')
      expect(vars['--primary-foreground']).toBe('210 40% 98%')
    })

    it('should convert dark theme colors to CSS variables', () => {
      const vars = getThemeCSSVariables('dark')

      expect(vars['--primary']).toBe('217.2 91.2% 59.8%')
      expect(vars['--background']).toBe('222.2 84% 4.9%')
    })

    it('should convert camelCase to kebab-case', () => {
      const vars = getThemeCSSVariables('light')

      expect(vars).toHaveProperty('--primary-foreground')
      expect(vars).toHaveProperty('--secondary-foreground')
      expect(vars).toHaveProperty('--muted-foreground')
    })
  })

  describe('resolveTheme', () => {
    beforeEach(() => {
      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: query === '(prefers-color-scheme: dark)',
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
    })

    it('should return light for light mode', () => {
      expect(resolveTheme('light')).toBe('light')
    })

    it('should return dark for dark mode', () => {
      expect(resolveTheme('dark')).toBe('dark')
    })

    it('should resolve system preference', () => {
      const resolved = resolveTheme('system')
      expect(['light', 'dark']).toContain(resolved)
    })
  })

  describe('applyTheme', () => {
    beforeEach(() => {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.style.cssText = ''

      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        })),
      })
    })

    it('should apply light theme class', () => {
      applyTheme('light')
      expect(document.documentElement.classList.contains('light')).toBe(true)
    })

    it('should apply dark theme class', () => {
      applyTheme('dark')
      expect(document.documentElement.classList.contains('dark')).toBe(true)
    })

    it('should remove previous theme class', () => {
      document.documentElement.classList.add('dark')
      applyTheme('light')

      expect(document.documentElement.classList.contains('light')).toBe(true)
      expect(document.documentElement.classList.contains('dark')).toBe(false)
    })

    it('should apply CSS variables', () => {
      applyTheme('light')
      const style = document.documentElement.style

      expect(style.getPropertyValue('--primary')).toBe('221.2 83.2% 53.3%')
      expect(style.getPropertyValue('--background')).toBe('0 0% 100%')
    })
  })
})
