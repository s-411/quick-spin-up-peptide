/**
 * Theme Color Utilities Tests
 */

import {
  hslToRgb,
  hslToHex,
  withOpacity,
  adjustLightness,
  getContrastColor,
  generateColorPalette,
} from '@/lib/theme/colors'

describe('Theme Color Utilities', () => {
  describe('hslToRgb', () => {
    it('should convert HSL to RGB', () => {
      const rgb = hslToRgb('221.2 83.2% 53.3%')

      expect(rgb.r).toBe(37)
      expect(rgb.g).toBe(99)
      expect(rgb.b).toBe(235)
    })

    it('should handle grayscale colors', () => {
      const rgb = hslToRgb('0 0% 50%')

      expect(rgb.r).toBe(128)
      expect(rgb.g).toBe(128)
      expect(rgb.b).toBe(128)
    })

    it('should handle pure white', () => {
      const rgb = hslToRgb('0 0% 100%')

      expect(rgb.r).toBe(255)
      expect(rgb.g).toBe(255)
      expect(rgb.b).toBe(255)
    })

    it('should handle pure black', () => {
      const rgb = hslToRgb('0 0% 0%')

      expect(rgb.r).toBe(0)
      expect(rgb.g).toBe(0)
      expect(rgb.b).toBe(0)
    })
  })

  describe('hslToHex', () => {
    it('should convert HSL to hex color', () => {
      const hex = hslToHex('0 0% 100%')
      expect(hex).toBe('#ffffff')
    })

    it('should handle dark colors', () => {
      const hex = hslToHex('0 0% 0%')
      expect(hex).toBe('#000000')
    })

    it('should produce valid 6-digit hex codes', () => {
      const hex = hslToHex('221.2 83.2% 53.3%')
      expect(hex).toMatch(/^#[0-9a-f]{6}$/)
    })
  })

  describe('withOpacity', () => {
    it('should apply opacity to HSL color', () => {
      const rgba = withOpacity('221.2 83.2% 53.3%', 0.5)
      expect(rgba).toMatch(/^rgba\(\d+, \d+, \d+, 0\.5\)$/)
    })

    it('should handle full opacity', () => {
      const rgba = withOpacity('0 0% 100%', 1)
      expect(rgba).toBe('rgba(255, 255, 255, 1)')
    })

    it('should handle zero opacity', () => {
      const rgba = withOpacity('0 0% 0%', 0)
      expect(rgba).toBe('rgba(0, 0, 0, 0)')
    })
  })

  describe('adjustLightness', () => {
    it('should lighten color', () => {
      const adjusted = adjustLightness('0 0% 50%', 10)
      expect(adjusted).toBe('0 0% 60%')
    })

    it('should darken color', () => {
      const adjusted = adjustLightness('0 0% 50%', -10)
      expect(adjusted).toBe('0 0% 40%')
    })

    it('should clamp to 0%', () => {
      const adjusted = adjustLightness('0 0% 10%', -20)
      expect(adjusted).toBe('0 0% 0%')
    })

    it('should clamp to 100%', () => {
      const adjusted = adjustLightness('0 0% 90%', 20)
      expect(adjusted).toBe('0 0% 100%')
    })

    it('should preserve hue and saturation', () => {
      const adjusted = adjustLightness('221.2 83.2% 50%', 10)
      expect(adjusted).toBe('221.2 83.2% 60%')
    })
  })

  describe('getContrastColor', () => {
    it('should return dark for light backgrounds', () => {
      const contrast = getContrastColor('0 0% 100%')
      expect(contrast).toBe('dark')
    })

    it('should return light for dark backgrounds', () => {
      const contrast = getContrastColor('0 0% 0%')
      expect(contrast).toBe('light')
    })

    it('should handle mid-tone colors', () => {
      const contrast = getContrastColor('0 0% 50%')
      expect(['light', 'dark']).toContain(contrast)
    })
  })

  describe('generateColorPalette', () => {
    it('should generate 10 color shades', () => {
      const palette = generateColorPalette('221.2 83.2% 53.3%')

      expect(Object.keys(palette)).toHaveLength(10)
      expect(palette).toHaveProperty('50')
      expect(palette).toHaveProperty('500')
      expect(palette).toHaveProperty('900')
    })

    it('should have lightest color at 50', () => {
      const palette = generateColorPalette('0 0% 50%')
      const lightness50 = parseFloat(palette[50].split(' ')[2])
      const lightness900 = parseFloat(palette[900].split(' ')[2])

      expect(lightness50).toBeGreaterThan(lightness900)
    })

    it('should preserve hue and saturation', () => {
      const palette = generateColorPalette('221.2 83.2% 53.3%')

      Object.values(palette).forEach(color => {
        expect(color).toMatch(/^221\.2 83\.2%/)
      })
    })
  })
})
