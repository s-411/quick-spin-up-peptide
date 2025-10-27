'use client'

import * as React from 'react'
import { TrendingUp, Users, Plus, BarChart3, Menu } from 'lucide-react'

export interface MobileBottomNavProps {
  activeItem?: string
  onItemClick?: (item: string) => void
  onMenuClick?: () => void
  className?: string
}

const MobileBottomNav = React.forwardRef<HTMLDivElement, MobileBottomNavProps>(
  ({ activeItem = 'dashboard', onItemClick, onMenuClick, className }, ref) => {
    const navItems = [
      { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
      { id: 'profiles', label: 'Profiles', icon: Users },
      { id: 'add', label: '', icon: Plus, isSpecial: true },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'menu', label: 'Menu', icon: Menu },
    ]

    const handleClick = (itemId: string) => {
      if (itemId === 'menu') {
        onMenuClick?.()
      } else {
        onItemClick?.(itemId)
      }
    }

    return (
      <div
        ref={ref}
        className={`fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border ${className || ''}`}
      >
        <nav className="flex items-center justify-around px-2 py-2 max-w-screen-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeItem === item.id

            if (item.isSpecial) {
              return (
                <button
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className="flex flex-col items-center justify-center -mt-8 transition-transform active:scale-95"
                  aria-label="Add new entry"
                >
                  <div className="bg-mm-secondary w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <Icon className="w-7 h-7 text-mm-dark" strokeWidth={2.5} />
                  </div>
                </button>
              )
            }

            return (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 min-w-[60px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    )
  }
)
MobileBottomNav.displayName = 'MobileBottomNav'

export { MobileBottomNav }
