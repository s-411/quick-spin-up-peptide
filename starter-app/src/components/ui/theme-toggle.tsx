'use client'

import { useTheme } from '@/hooks/use-theme'
import { SunIcon, MoonIcon, DesktopIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { cn } from '@/lib/utils/cn'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'inline-flex h-10 w-10 items-center justify-center rounded-lg',
          'border border-border bg-background',
          'transition-colors hover:bg-accent hover:text-accent-foreground',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
        )}
        aria-label="Toggle theme"
        aria-expanded={isOpen}
        data-testid="theme-toggle"
      >
        {resolvedTheme === 'dark' ? (
          <MoonIcon className="h-5 w-5" />
        ) : (
          <SunIcon className="h-5 w-5" />
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-40 rounded-lg border border-border bg-background shadow-lg">
            <div className="p-1">
              <button
                onClick={() => {
                  setTheme('light')
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent hover:text-accent-foreground',
                  theme === 'light' && 'bg-accent text-accent-foreground'
                )}
              >
                <SunIcon className="h-4 w-4" />
                Light
              </button>
              <button
                onClick={() => {
                  setTheme('dark')
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent hover:text-accent-foreground',
                  theme === 'dark' && 'bg-accent text-accent-foreground'
                )}
              >
                <MoonIcon className="h-4 w-4" />
                Dark
              </button>
              <button
                onClick={() => {
                  setTheme('system')
                  setIsOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm',
                  'transition-colors hover:bg-accent hover:text-accent-foreground',
                  theme === 'system' && 'bg-accent text-accent-foreground'
                )}
              >
                <DesktopIcon className="h-4 w-4" />
                System
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
