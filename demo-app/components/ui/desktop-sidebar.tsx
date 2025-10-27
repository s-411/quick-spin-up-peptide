'use client'

import * as React from 'react'
import {
  TrendingUp,
  Users,
  Plus,
  LayoutGrid,
  BarChart3,
  Globe,
  Trophy,
  Share2,
  Settings,
} from 'lucide-react'

export interface DesktopSidebarProps {
  activeItem?: string
  onItemClick?: (item: string) => void
  appName?: string
  appLogo?: React.ReactNode
  className?: string
}

const DesktopSidebar = React.forwardRef<HTMLDivElement, DesktopSidebarProps>(
  (
    {
      activeItem = 'dashboard',
      onItemClick,
      appName = 'Cost Per Nut Calculator',
      appLogo,
      className,
    },
    ref
  ) => {
    const menuItems = [
      { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
      { id: 'profiles', label: 'Profiles', icon: Users },
      { id: 'quick-entry', label: 'Quick Data Entry', icon: Plus },
      { id: 'overview', label: 'Overview', icon: LayoutGrid },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'data-vault', label: 'Data Vault', icon: Globe },
      { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
      { id: 'share', label: 'Share', icon: Share2 },
      { id: 'settings', label: 'Settings', icon: Settings },
    ]

    return (
      <div
        ref={ref}
        className={`w-64 h-screen bg-card border-r border-border flex flex-col ${className || ''}`}
      >
        {/* Logo & App Name */}
        <div className="p-6 border-b border-border">
          {appLogo || (
            <div className="w-16 h-16 bg-mm-secondary rounded-2xl flex items-center justify-center mb-3">
              <span className="text-2xl font-bold text-mm-dark">CPN</span>
            </div>
          )}
          <h2 className="text-sm font-medium text-muted-foreground">{appName}</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            return (
              <button
                key={item.id}
                onClick={() => onItemClick?.(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-mm-secondary text-mm-dark font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-sm">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    )
  }
)
DesktopSidebar.displayName = 'DesktopSidebar'

export { DesktopSidebar }
