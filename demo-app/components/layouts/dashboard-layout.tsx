'use client'

import * as React from 'react'
import { DesktopSidebar } from '../ui/desktop-sidebar'
import { TopNavigation } from '../ui/top-navigation'
import { MobileBottomNav } from '../ui/mobile-bottom-nav'
import { MobileMenu } from '../ui/mobile-menu'

export interface DashboardLayoutProps {
  children: React.ReactNode
  activeItem?: string
  onItemClick?: (item: string) => void
  appName?: string
  appLogo?: React.ReactNode
  userAvatar?: string
  userName?: string
  isDarkMode?: boolean
  onThemeToggle?: () => void
  onProfileClick?: () => void
  onNotificationClick?: () => void
  onCalculatorClick?: () => void
  variant?: 'desktop-sidebar' | 'top-nav-only'
}

const DashboardLayout = React.forwardRef<HTMLDivElement, DashboardLayoutProps>(
  (
    {
      children,
      activeItem = 'dashboard',
      onItemClick,
      appName,
      appLogo,
      userAvatar,
      userName,
      isDarkMode = false,
      onThemeToggle,
      onProfileClick,
      onNotificationClick,
      onCalculatorClick,
      variant = 'desktop-sidebar',
    },
    ref
  ) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

    const handleItemClick = (item: string) => {
      onItemClick?.(item)
      setIsMobileMenuOpen(false)
    }

    if (variant === 'top-nav-only') {
      return (
        <div ref={ref} className="min-h-screen bg-background">
          {/* Top Navigation */}
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

          {/* Main Content */}
          <main className="pt-4 px-4 pb-20 md:pb-4">{children}</main>

          {/* Mobile Bottom Nav */}
          <div className="md:hidden">
            <MobileBottomNav
              activeItem={activeItem}
              onItemClick={handleItemClick}
              onMenuClick={() => setIsMobileMenuOpen(true)}
            />
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
            activeItem={activeItem}
            onItemClick={handleItemClick}
          />
        </div>
      )
    }

    // Default: desktop-sidebar variant
    return (
      <div ref={ref} className="min-h-screen bg-background">
        <div className="flex">
          {/* Desktop Sidebar - Hidden on mobile */}
          <div className="hidden lg:block">
            <DesktopSidebar
              activeItem={activeItem}
              onItemClick={handleItemClick}
              appName={appName}
              appLogo={appLogo}
            />
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-screen">
            {/* Top Navigation - Shown on mobile/tablet */}
            <div className="lg:hidden">
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
            </div>

            {/* Page Content */}
            <main className="flex-1 p-4 lg:p-8 pb-20 lg:pb-8">{children}</main>
          </div>
        </div>

        {/* Mobile Bottom Nav - Hidden on desktop */}
        <div className="lg:hidden">
          <MobileBottomNav
            activeItem={activeItem}
            onItemClick={handleItemClick}
            onMenuClick={() => setIsMobileMenuOpen(true)}
          />
        </div>

        {/* Mobile Menu */}
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
DashboardLayout.displayName = 'DashboardLayout'

export { DashboardLayout }
