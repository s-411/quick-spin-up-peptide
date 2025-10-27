'use client'

import * as React from 'react'
import { TopNavigation } from '../ui/top-navigation'

export interface TopBarLayoutProps {
  children: React.ReactNode
  activeItem?: string
  onItemClick?: (item: string) => void
  userAvatar?: string
  userName?: string
  appLogo?: React.ReactNode
  isDarkMode?: boolean
  onThemeToggle?: () => void
  onProfileClick?: () => void
  onNotificationClick?: () => void
  onCalculatorClick?: () => void
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const TopBarLayout = React.forwardRef<HTMLDivElement, TopBarLayoutProps>(
  (
    {
      children,
      activeItem = 'dashboard',
      onItemClick,
      userAvatar,
      userName,
      appLogo,
      isDarkMode = false,
      onThemeToggle,
      onProfileClick,
      onNotificationClick,
      onCalculatorClick,
      maxWidth = '2xl',
    },
    ref
  ) => {
    const maxWidthClasses = {
      sm: 'max-w-screen-sm',
      md: 'max-w-screen-md',
      lg: 'max-w-screen-lg',
      xl: 'max-w-screen-xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full',
    }

    return (
      <div ref={ref} className="min-h-screen bg-background">
        {/* Top Navigation */}
        <TopNavigation
          activeItem={activeItem}
          onItemClick={onItemClick}
          onProfileClick={onProfileClick}
          onNotificationClick={onNotificationClick}
          onCalculatorClick={onCalculatorClick}
          isDarkMode={isDarkMode}
          onThemeToggle={onThemeToggle}
          userAvatar={userAvatar}
          userName={userName}
          appLogo={appLogo}
        />

        {/* Main Content - Centered with max-width */}
        <main className={`${maxWidthClasses[maxWidth]} mx-auto px-4 py-8`}>
          {children}
        </main>
      </div>
    )
  }
)
TopBarLayout.displayName = 'TopBarLayout'

export { TopBarLayout }
