'use client'

import * as React from 'react'
import { MobileBottomNav } from '../ui/mobile-bottom-nav'
import { MobileMenu } from '../ui/mobile-menu'
import { TopNavigation } from '../ui/top-navigation'

export interface MobileLayoutProps {
  children: React.ReactNode
  activeItem?: string
  onItemClick?: (item: string) => void
  showTopNav?: boolean
  userAvatar?: string
  userName?: string
  appLogo?: React.ReactNode
  isDarkMode?: boolean
  onThemeToggle?: () => void
  onProfileClick?: () => void
  onNotificationClick?: () => void
  onCalculatorClick?: () => void
}

const MobileLayout = React.forwardRef<HTMLDivElement, MobileLayoutProps>(
  (
    {
      children,
      activeItem = 'dashboard',
      onItemClick,
      showTopNav = true,
      userAvatar,
      userName,
      appLogo,
      isDarkMode = false,
      onThemeToggle,
      onProfileClick,
      onNotificationClick,
      onCalculatorClick,
    },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const handleItemClick = (item: string) => {
      onItemClick?.(item)
      setIsMobileMenuOpen(false)
    }

    return (
      <div ref={ref} className="min-h-screen bg-background">
        {/* Optional Top Navigation */}
        {showTopNav && (
          <TopNavigation
            activeItem={activeItem}
            onItemClick={handleItemClick}
            onProfileClick={onProfileClick}
            onNotificationClick={onNotificationClick}
            onCalculatorClick={onCalculatorClick}
            isDarkMode={isDarkMode}
            onThemeToggle={onThemeToggle}
            userAvatar={userAvatar}
            userName={userName}
            appLogo={appLogo}
          />
        )}

        {/* Main Content - Padding for top nav and bottom nav */}
        <main className={`${showTopNav ? 'pt-4' : 'pt-0'} px-4 pb-20`}>
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileBottomNav
          activeItem={activeItem}
          onItemClick={handleItemClick}
          onMenuClick={() => setIsMobileMenuOpen(true)}
        />

        {/* Mobile Menu Overlay */}
        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          activeItem={activeItem}
          onItemClick={handleItemClick}
        />
      </div>
    )
  }
)
MobileLayout.displayName = 'MobileLayout'

export { MobileLayout }
