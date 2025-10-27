# Theme Customization Guide

This guide explains how to customize the theme and design system in your starter app.

## Table of Contents

- [Overview](#overview)
- [Theme Configuration](#theme-configuration)
- [Customizing Colors](#customizing-colors)
- [Customizing Spacing](#customizing-spacing)
- [Customizing Typography](#customizing-typography)
- [Customizing Border Radius](#customizing-border-radius)
- [Using the Theme Hook](#using-the-theme-hook)
- [Creating Custom Components](#creating-custom-components)
- [Responsive Design](#responsive-design)
- [Advanced Customization](#advanced-customization)

## Overview

The starter app uses a comprehensive theme system built on:

- **CSS Custom Properties**: Theme tokens are stored as CSS variables for runtime access
- **TypeScript Configuration**: Type-safe theme configuration in `src/lib/theme/config.ts`
- **localStorage Persistence**: User theme preferences are saved and synced across tabs
- **System Preference Detection**: Automatic detection of OS-level dark/light mode
- **Tailwind CSS Integration**: Seamless integration with Tailwind's utility classes

## Theme Configuration

The default theme configuration is located at `starter-app/src/lib/theme/config.ts`.

### Theme Structure

```typescript
export interface ThemeConfig {
  mode: ThemeMode // 'light' | 'dark' | 'system'
  colors: {
    light: ThemeColors
    dark: ThemeColors
  }
  spacing: ThemeSpacing
  typography: ThemeTypography
  borderRadius: ThemeBorderRadius
}
```

## Customizing Colors

### Modifying Existing Colors

Colors are defined in HSL format (Hue Saturation Lightness) for easy manipulation:

```typescript
// In src/lib/theme/config.ts
export const defaultThemeConfig: ThemeConfig = {
  // ...
  colors: {
    light: {
      primary: '221.2 83.2% 53.3%', // Blue
      background: '0 0% 100%',      // White
      foreground: '222.2 84% 4.9%', // Near black
      // ... other colors
    },
    dark: {
      primary: '217.2 91.2% 59.8%', // Lighter blue
      background: '222.2 84% 4.9%', // Dark gray
      foreground: '210 40% 98%',    // Near white
      // ... other colors
    }
  }
}
```

### Adding New Colors

1. Add the color to the `ThemeColors` interface:

```typescript
export interface ThemeColors {
  // ... existing colors
  tertiary: string
  tertiaryForeground: string
}
```

2. Define the color for both light and dark modes:

```typescript
colors: {
  light: {
    // ... existing colors
    tertiary: '150 80% 50%',
    tertiaryForeground: '0 0% 100%',
  },
  dark: {
    // ... existing colors
    tertiary: '150 70% 60%',
    tertiaryForeground: '0 0% 0%',
  }
}
```

3. The color will automatically be available as `--tertiary` CSS variable

### Using Colors in Components

```tsx
// Using Tailwind classes (requires Tailwind config update)
<button className="bg-primary text-primary-foreground">
  Click me
</button>

// Using inline styles with CSS variables
<div style={{ color: 'hsl(var(--primary))' }}>
  Primary colored text
</div>

// Using the color utilities
import { getThemeColorHex } from '@/lib/theme/colors'

const primaryColor = getThemeColorHex('primary')
```

## Customizing Spacing

The spacing scale follows a consistent progression:

```typescript
spacing: {
  xs: '0.25rem',  // 4px
  sm: '0.5rem',   // 8px
  md: '1rem',     // 16px
  lg: '1.5rem',   // 24px
  xl: '2rem',     // 32px
  '2xl': '3rem',  // 48px
  '3xl': '4rem',  // 64px
  '4xl': '6rem',  // 96px
}
```

To customize, modify the values in `defaultThemeConfig.spacing`.

## Customizing Typography

### Font Families

```typescript
typography: {
  fontFamily: {
    sans: 'var(--font-sans, ui-sans-serif, system-ui, sans-serif)',
    mono: 'var(--font-mono, ui-monospace, monospace)',
  },
  // ...
}
```

To use custom fonts with Next.js:

```typescript
// In app/layout.tsx
import { Inter, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

// Add to className
<body className={`${inter.variable} ${jetbrains.variable}`}>
```

### Font Sizes

```typescript
fontSize: {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',    // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem',  // 36px
}
```

## Customizing Border Radius

```typescript
borderRadius: {
  none: '0',
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  full: '9999px',  // Fully rounded
}
```

## Using the Theme Hook

The `useTheme` hook provides theme state and controls:

```tsx
'use client'

import { useTheme } from '@/hooks/use-theme'

export function MyComponent() {
  const { theme, resolvedTheme, setTheme, systemTheme } = useTheme()

  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <p>System preference: {systemTheme}</p>

      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  )
}
```

### Hook API

- `theme`: Current theme setting ('light', 'dark', or 'system')
- `resolvedTheme`: Actual applied theme ('light' or 'dark')
- `setTheme(mode)`: Change the theme
- `systemTheme`: OS-level preference

## Creating Custom Components

### Using Layout Components

```tsx
import { Container, Stack, Grid, Section } from '@/components/layout'

export function MyPage() {
  return (
    <Section spacing="lg">
      <Container size="xl">
        <Stack spacing={6} direction="vertical">
          <h1>My Page</h1>

          <Grid cols={{ default: 1, md: 2, lg: 3 }} gap={6}>
            <Card>Item 1</Card>
            <Card>Item 2</Card>
            <Card>Item 3</Card>
          </Grid>
        </Stack>
      </Container>
    </Section>
  )
}
```

### Using Color Utilities

```tsx
import {
  hslToHex,
  withOpacity,
  adjustLightness,
  getContrastColor
} from '@/lib/theme/colors'

// Convert theme color to hex
const primaryHex = hslToHex('221.2 83.2% 53.3%')

// Apply opacity
const semiTransparent = withOpacity('221.2 83.2% 53.3%', 0.5)

// Lighten/darken
const lighter = adjustLightness('221.2 83.2% 53.3%', 10)
const darker = adjustLightness('221.2 83.2% 53.3%', -10)

// Get contrasting text color
const textColor = getContrastColor('221.2 83.2% 53.3%') // 'light' or 'dark'
```

## Responsive Design

### Using the Breakpoint Hook

```tsx
'use client'

import { useBreakpoint } from '@/hooks/use-breakpoint'

export function ResponsiveComponent() {
  const { breakpoint, isAbove, isBelow, width } = useBreakpoint()

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      <p>Window width: {width}px</p>

      {isAbove('md') && <div>Visible on medium screens and up</div>}
      {isBelow('md') && <div>Visible on small screens only</div>}
    </div>
  )
}
```

### Tailwind Breakpoints

The theme system aligns with Tailwind's default breakpoints:

- `xs`: 0px (default)
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

### Using Media Queries

```tsx
import { useMediaQuery } from '@/hooks/use-breakpoint'

export function MyComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  )
}
```

## Advanced Customization

### Creating a Custom Theme

You can create entirely custom themes by extending the default configuration:

```typescript
// src/lib/theme/custom-theme.ts
import { defaultThemeConfig, type ThemeConfig } from './config'

export const myCustomTheme: ThemeConfig = {
  ...defaultThemeConfig,
  colors: {
    light: {
      ...defaultThemeConfig.colors.light,
      primary: '280 90% 60%',  // Purple
      secondary: '340 80% 55%', // Pink
    },
    dark: {
      ...defaultThemeConfig.colors.dark,
      primary: '280 80% 70%',
      secondary: '340 70% 65%',
    }
  }
}
```

### Programmatic Theme Application

```typescript
import { applyTheme, getThemeCSSVariables, setCSSVariable } from '@/lib/theme'

// Apply a theme mode
applyTheme('dark')

// Get all CSS variables for a theme
const darkVars = getThemeCSSVariables('dark')

// Set individual CSS variables
setCSSVariable('--primary', '280 90% 60%')
```

### Generating Color Palettes

```typescript
import { generateColorPalette } from '@/lib/theme/colors'

const brandColor = '221.2 83.2% 53.3%'
const palette = generateColorPalette(brandColor)

// Returns:
// {
//   50: 'lighter...',
//   100: '...',
//   ...
//   900: 'darker...'
// }
```

### Theme Persistence

Theme preferences are automatically saved to localStorage with the key `app-theme-mode`. To customize:

```typescript
// src/lib/theme/storage.ts
const THEME_STORAGE_KEY = 'my-custom-theme-key'
```

### Cross-Tab Synchronization

Theme changes automatically sync across browser tabs. To subscribe to changes:

```typescript
import { subscribeToThemeChanges } from '@/lib/theme/storage'

const unsubscribe = subscribeToThemeChanges((newTheme) => {
  console.log('Theme changed in another tab:', newTheme)
})

// Later...
unsubscribe()
```

## Best Practices

1. **Use HSL for Colors**: HSL makes it easier to create color variations (lighter/darker)

2. **Respect User Preferences**: Always provide a 'system' theme option that respects OS settings

3. **Test Both Themes**: Ensure all components work well in both light and dark modes

4. **Use Semantic Color Names**: Use `primary`, `secondary`, `destructive` instead of specific colors like `blue`, `red`

5. **Maintain Contrast**: Ensure text has sufficient contrast against backgrounds (WCAG AA: 4.5:1)

6. **Use Theme Tokens**: Reference theme tokens (`--primary`) instead of hard-coding colors

7. **Responsive First**: Design for mobile first, then enhance for larger screens

8. **Consistent Spacing**: Use the spacing scale consistently throughout your app

## Troubleshooting

### Theme Not Applying

1. Check that `applyTheme()` is being called in your root layout
2. Verify CSS variables are defined in `globals.css`
3. Ensure theme mode is saved to localStorage correctly

### Colors Not Updating

1. Check that CSS custom properties use the correct format: `hsl(var(--primary))`
2. Verify Tailwind config includes theme colors
3. Clear browser cache and rebuild

### Theme Flickering on Load

Add this script to prevent flash of incorrect theme:

```tsx
// In app/layout.tsx before hydration
<script
  dangerouslySetInnerHTML={{
    __html: `
      try {
        const theme = localStorage.getItem('app-theme-mode') || 'system'
        const resolved = theme === 'system'
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme
        document.documentElement.classList.add(resolved)
      } catch {}
    `
  }}
/>
```

## Resources

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties (MDN)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [HSL Color Model](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
