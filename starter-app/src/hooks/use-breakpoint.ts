/**
 * useBreakpoint Hook
 * Detects current responsive breakpoint based on Tailwind CSS defaults
 */

'use client'

import { useEffect, useState } from 'react'

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

export interface BreakpointConfig {
  xs: number
  sm: number
  md: number
  lg: number
  xl: number
  '2xl': number
}

/**
 * Default Tailwind CSS breakpoints (in pixels)
 */
export const defaultBreakpoints: BreakpointConfig = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
}

/**
 * Get current breakpoint based on window width
 */
function getCurrentBreakpoint(width: number, breakpoints: BreakpointConfig): Breakpoint {
  if (width >= breakpoints['2xl']) return '2xl'
  if (width >= breakpoints.xl) return 'xl'
  if (width >= breakpoints.lg) return 'lg'
  if (width >= breakpoints.md) return 'md'
  if (width >= breakpoints.sm) return 'sm'
  return 'xs'
}

export interface UseBreakpointReturn {
  breakpoint: Breakpoint
  width: number
  isXs: boolean
  isSm: boolean
  isMd: boolean
  isLg: boolean
  isXl: boolean
  is2xl: boolean
  isAbove: (bp: Breakpoint) => boolean
  isBelow: (bp: Breakpoint) => boolean
}

/**
 * Hook for detecting current responsive breakpoint
 */
export function useBreakpoint(customBreakpoints?: Partial<BreakpointConfig>): UseBreakpointReturn {
  const breakpoints = { ...defaultBreakpoints, ...customBreakpoints }

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== 'undefined' ? window.innerWidth : 0
  )
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    getCurrentBreakpoint(windowWidth, breakpoints)
  )

  useEffect(() => {
    // Update on mount
    const currentWidth = window.innerWidth
    setWindowWidth(currentWidth)
    setBreakpoint(getCurrentBreakpoint(currentWidth, breakpoints))

    // Create resize handler with debounce
    let timeoutId: NodeJS.Timeout

    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const newWidth = window.innerWidth
        setWindowWidth(newWidth)
        setBreakpoint(getCurrentBreakpoint(newWidth, breakpoints))
      }, 150) // 150ms debounce
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearTimeout(timeoutId)
    }
  }, []) // Only run on mount/unmount

  const isAbove = (bp: Breakpoint): boolean => {
    return windowWidth >= breakpoints[bp]
  }

  const isBelow = (bp: Breakpoint): boolean => {
    return windowWidth < breakpoints[bp]
  }

  return {
    breakpoint,
    width: windowWidth,
    isXs: breakpoint === 'xs',
    isSm: breakpoint === 'sm',
    isMd: breakpoint === 'md',
    isLg: breakpoint === 'lg',
    isXl: breakpoint === 'xl',
    is2xl: breakpoint === '2xl',
    isAbove,
    isBelow,
  }
}

/**
 * Hook for checking if viewport matches a media query
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    // Set initial value
    setMatches(mediaQuery.matches)

    // Create listener
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    // Add listener
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [query])

  return matches
}
