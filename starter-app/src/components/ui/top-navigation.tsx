'use client'

import * as React from 'react'
import {
  TrendingUp,
  Users,
  Plus,
  LayoutGrid,
  BarChart3,
  Bell,
  Calculator,
  Moon,
  Sun,
} from 'lucide-react'
import { Avatar } from './avatar'

export interface TopNavigationProps {
  activeItem?: string
  onItemClick?: (item: string) => void
  onProfileClick?: () => void
  onNotificationClick?: () => void
  onCalculatorClick?: () => void
  isDarkMode?: boolean
  onThemeToggle?: () => void
  userAvatar?: string
  userName?: string
  appLogo?: React.ReactNode
  className?: string
}

const TopNavigation = React.forwardRef<HTMLDivElement, TopNavigationProps>(
  (
    {
      activeItem = 'dashboard',
      onItemClick,
      onProfileClick,
      onNotificationClick,
      onCalculatorClick,
      isDarkMode = false,
      onThemeToggle,
      userAvatar,
      userName,
      appLogo,
      className,
    },
    ref
  ) => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
      { id: 'profiles', label: 'Profiles', icon: Users },
      { id: 'quick-entry', label: 'Quick Entry', icon: Plus },
      { id: 'overview', label: 'Overview', icon: LayoutGrid },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ]

    return (
      <div
        ref={ref}
        className={`w-full bg-card border-b border-border ${className || ''}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            {appLogo || (
              <div className="w-10 h-10 bg-mm-secondary rounded-xl flex items-center justify-center">
                <span className="text-lg font-bold text-mm-dark">CPN</span>
              </div>
            )}
          </div>

          {/* Center Menu Items */}
          <nav className="hidden md:flex items-center gap-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id

              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick?.(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              )
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Notifications */}
            <button
              onClick={onNotificationClick}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Calculator */}
            <button
              onClick={onCalculatorClick}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Calculator"
            >
              <Calculator className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onThemeToggle}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={onProfileClick}
              className="ml-2 rounded-full ring-2 ring-transparent hover:ring-primary/20 transition-all"
              aria-label="Profile"
            >
              <Avatar src={userAvatar} fallback={userName || 'User'} size={36} />
            </button>
          </div>
        </div>
      </div>
    )
  }
)
TopNavigation.displayName = 'TopNavigation'

export { TopNavigation }
