/**
 * Theme-Aware Color Utilities
 * Functions for working with theme colors and CSS custom properties
 */

import type { ThemeColors } from './config'

/**
 * Convert HSL string to RGB values
 */
export function hslToRgb(hsl: string): { r: number; g: number; b: number } {
  // Parse HSL string (e.g., "221.2 83.2% 53.3%")
  const parts = hsl.split(' ')
  const h = parseFloat(parts[0]) / 360
  const s = parseFloat(parts[1]) / 100
  const l = parseFloat(parts[2]) / 100

  let r: number, g: number, b: number

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q

    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  }
}

/**
 * Convert HSL to hex color
 */
export function hslToHex(hsl: string): string {
  const { r, g, b } = hslToRgb(hsl)
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
}

/**
 * Get CSS variable value at runtime
 */
export function getCSSVariable(name: string): string {
  if (typeof window === 'undefined') return ''

  const root = document.documentElement
  return getComputedStyle(root).getPropertyValue(name).trim()
}

/**
 * Set CSS variable value
 */
export function setCSSVariable(name: string, value: string): void {
  if (typeof window === 'undefined') return

  const root = document.documentElement
  root.style.setProperty(name, value)
}

/**
 * Get theme color as HSL string
 */
export function getThemeColor(colorName: keyof ThemeColors): string {
  const cssVarName = colorName.replace(/([A-Z])/g, '-$1').toLowerCase()
  return getCSSVariable(`--${cssVarName}`)
}

/**
 * Get theme color as hex
 */
export function getThemeColorHex(colorName: keyof ThemeColors): string {
  const hsl = getThemeColor(colorName)
  return hsl ? hslToHex(hsl) : ''
}

/**
 * Get theme color as RGB object
 */
export function getThemeColorRgb(colorName: keyof ThemeColors): {
  r: number
  g: number
  b: number
} {
  const hsl = getThemeColor(colorName)
  return hsl ? hslToRgb(hsl) : { r: 0, g: 0, b: 0 }
}

/**
 * Apply opacity to HSL color
 */
export function withOpacity(hsl: string, opacity: number): string {
  const rgb = hslToRgb(hsl)
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`
}

/**
 * Lighten or darken HSL color
 */
export function adjustLightness(hsl: string, amount: number): string {
  const parts = hsl.split(' ')
  const h = parseFloat(parts[0])
  const s = parseFloat(parts[1])
  const l = parseFloat(parts[2])

  const newL = Math.max(0, Math.min(100, l + amount))

  return `${h} ${s}% ${newL}%`
}

/**
 * Get contrasting text color (black or white) for a background color
 */
export function getContrastColor(hsl: string): 'light' | 'dark' {
  const { r, g, b } = hslToRgb(hsl)

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

  return luminance > 0.5 ? 'dark' : 'light'
}

/**
 * Generate color palette from base color
 */
export function generateColorPalette(baseHsl: string): {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
} {
  return {
    50: adjustLightness(baseHsl, 40),
    100: adjustLightness(baseHsl, 35),
    200: adjustLightness(baseHsl, 25),
    300: adjustLightness(baseHsl, 15),
    400: adjustLightness(baseHsl, 5),
    500: baseHsl,
    600: adjustLightness(baseHsl, -5),
    700: adjustLightness(baseHsl, -15),
    800: adjustLightness(baseHsl, -25),
    900: adjustLightness(baseHsl, -35),
  }
}
