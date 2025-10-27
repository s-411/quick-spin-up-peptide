'use client'

import { useTheme } from '@/hooks/use-theme'
import { SunIcon, MoonIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils/cn'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-lg',
        'border border-border bg-background',
        'transition-colors hover:bg-accent hover:text-accent-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
      )}
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
      {resolvedTheme === 'dark' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </button>
  )
}
