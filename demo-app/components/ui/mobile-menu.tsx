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
  LogOut,
  X,
} from 'lucide-react'

export interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  activeItem?: string
  onItemClick?: (item: string) => void
}

const MobileMenu = React.forwardRef<HTMLDivElement, MobileMenuProps>(
  ({ isOpen, onClose, activeItem = 'dashboard', onItemClick }, ref) => {
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

    React.useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
      return () => {
        document.body.style.overflow = ''
      }
    }, [isOpen])

    const handleItemClick = (itemId: string) => {
      onItemClick?.(itemId)
      onClose()
    }

    if (!isOpen) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-background/95 backdrop-blur-sm z-[60] animate-in fade-in duration-200"
          onClick={onClose}
        />

        {/* Menu */}
        <div
          ref={ref}
          className="fixed inset-0 z-[70] animate-in slide-in-from-right duration-300"
        >
          <div className="flex flex-col h-full bg-card p-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-2xl font-heading font-bold">Menu</h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-accent transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground">Navigate to any page</p>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 space-y-1 overflow-y-auto">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    <span className="text-base font-medium">{item.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Sign Out */}
            <button
              onClick={() => handleItemClick('signout')}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-foreground hover:bg-accent transition-colors mt-4"
            >
              <LogOut className="w-5 h-5" strokeWidth={2} />
              <span className="text-base font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </>
    )
  }
)
MobileMenu.displayName = 'MobileMenu'

export { MobileMenu }
