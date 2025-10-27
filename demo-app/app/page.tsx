'use client'

import * as React from 'react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { useState, useEffect } from 'react'
import {
  Home as HomeIcon,
  User,
  Settings,
  Search,
  Bell,
  Mail,
  Heart,
  Star,
  Trash2,
  Edit,
  Plus,
  Download,
  Upload,
  Check,
  X,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  MoreVertical
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Input, Textarea } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuShortcut,
} from '@/components/ui/dropdown-menu'
import { MagneticButton } from '@/components/ui/magnetic-button'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { ScrollReveal } from '@/components/ui/scroll-reveal'
import { CommandPalette, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator, CommandShortcut } from '@/components/ui/command-palette'
import { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText, SkeletonTable } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card'
import { TopNavigation } from '@/components/ui/top-navigation'
import { DesktopSidebar } from '@/components/ui/desktop-sidebar'
import { MobileBottomNav } from '@/components/ui/mobile-bottom-nav'
import { MobileMenu } from '@/components/ui/mobile-menu'
import { Avatar } from '@/components/ui/avatar'
import { DashboardLayout } from '@/components/layouts/dashboard-layout'
import { MobileLayout } from '@/components/layouts/mobile-layout'
import { TopBarLayout } from '@/components/layouts/top-bar-layout'

export default function Home() {
  const { toast } = useToast()
  const [rating, setRating] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [enhancedInput, setEnhancedInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [loadingInput, setLoadingInput] = useState('')
  const [errorInput, setErrorInput] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [showEmailError, setShowEmailError] = useState(false)
  const [progress1, setProgress1] = useState(0)
  const [progress2, setProgress2] = useState(45)
  const [progress3, setProgress3] = useState(75)
  const [navActiveItem, setNavActiveItem] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Animate progress bars
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress1(prev => (prev >= 100 ? 0 : prev + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-8 border-b border-border">
          <div>
            <h1 className="text-4xl md:text-5xl font-heading mb-2">MM Design System</h1>
            <p className="text-muted-foreground">Your complete design system with light/dark mode</p>
            <div className="flex flex-wrap gap-3 mt-4">
              <a
                href="/sections"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                View Tier 1 Sections
              </a>
              <a
                href="/engagement"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                View Tier 2 Engagement
              </a>
              <a
                href="/content"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Tier 3 Content
              </a>
              <a
                href="/interactive"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                View Tier 4 Interactive
              </a>
              <a
                href="/utility"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                View Tier 5 Utility
              </a>
              <a
                href="/ecommerce"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Tier 6 E-commerce
              </a>
              <a
                href="/admin"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                View Tier 7 Admin
              </a>
              <a
                href="/settings"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                View Tier 8 Settings
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Tier 9 Dashboard
              </a>
              <a
                href="/social"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
                View Tier 10 Social
              </a>
              <a
                href="/canvas"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Canvas Layouts
              </a>
              <a
                href="/test"
                className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Test Page
              </a>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Color Swatches */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Color System</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-mm-primary"></div>
              <p className="text-sm font-medium">Primary</p>
              <p className="text-xs text-muted-foreground">#337def</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-lg bg-mm-secondary"></div>
              <p className="text-sm font-medium">Secondary</p>
              <p className="text-xs text-muted-foreground">#fcc729</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-background border border-border rounded-lg"></div>
              <p className="text-sm font-medium">Background</p>
              <p className="text-xs text-muted-foreground">Adaptive</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-card border border-border rounded-lg"></div>
              <p className="text-sm font-medium">Card</p>
              <p className="text-xs text-muted-foreground">Elevated</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-muted rounded-lg"></div>
              <p className="text-sm font-medium">Muted</p>
              <p className="text-xs text-muted-foreground">Subtle</p>
            </div>
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="mb-2">Heading 1 - National2Condensed</h1>
              <p className="text-sm text-muted-foreground">2.5rem / 40px</p>
            </div>
            <div>
              <h2 className="mb-2">Heading 2 - National2Condensed</h2>
              <p className="text-sm text-muted-foreground">2rem / 32px</p>
            </div>
            <div>
              <h3 className="mb-2">Heading 3 - National2Condensed</h3>
              <p className="text-sm text-muted-foreground">1.5rem / 24px</p>
            </div>
            <div>
              <p className="mb-2">Body text - ESKlarheit. This is your default body font with excellent readability for long-form content.</p>
              <p className="text-sm text-muted-foreground">1rem / 16px</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="btn-mm">
              Primary Button
            </button>
            <button className="btn-mm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              With Icon
            </button>
            <button className="btn-mm" disabled>
              Disabled
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button className="btn-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Notice the signature 100px border radius!</p>
        </section>

        {/* Form Inputs */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Form Inputs</h2>
          <div className="max-w-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <input
                type="text"
                className="input-mm"
                placeholder="Enter your text here..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Select Dropdown</label>
              <select className="select-mm">
                <option>Choose an option...</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <textarea
                className="input-mm min-h-[100px]"
                placeholder="Enter longer text..."
              />
            </div>
          </div>
        </section>

        {/* Cards */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Cards</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card-mm">
              <h3 className="text-xl font-heading mb-3">Standard Card</h3>
              <p className="text-muted-foreground mb-4">
                This is your standard card component with consistent padding, borders, and hover effects.
              </p>
              <button className="btn-mm">Action</button>
            </div>
            <div className="glass-card">
              <h3 className="text-xl font-heading mb-3">Glass Card</h3>
              <p className="text-muted-foreground mb-4">
                This card features a glassmorphism effect with backdrop blur for a modern aesthetic.
              </p>
              <button className="btn-secondary">Learn More</button>
            </div>
          </div>
        </section>

        {/* Rating Tiles (Your Signature Component) */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Rating Tiles</h2>
          <p className="text-muted-foreground mb-6">Your signature hotness rating system</p>
          <div className="space-y-3">
            <div className="grid grid-cols-6 gap-2">
              {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5].map((r) => (
                <button
                  key={r}
                  className={`rating-tile ${rating === r ? 'selected' : ''}`}
                  onClick={() => setRating(r)}
                >
                  {r.toFixed(1)}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[8.0, 8.5, 9.0, 9.5, 10.0].map((r) => (
                <button
                  key={r}
                  className={`rating-tile ${rating === r ? 'selected' : ''}`}
                  onClick={() => setRating(r)}
                >
                  {r.toFixed(1)}
                </button>
              ))}
            </div>
          </div>
          {rating && (
            <p className="mt-4 text-sm">
              Selected rating: <span className="text-primary font-bold">{rating.toFixed(1)}</span>
            </p>
          )}
        </section>

        {/* Table */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Table</h2>
          <div className="overflow-x-auto">
            <table className="table-mm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>John Doe</td>
                  <td>john@example.com</td>
                  <td><span className="text-success">Active</span></td>
                  <td>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Jane Smith</td>
                  <td>jane@example.com</td>
                  <td><span className="text-success">Active</span></td>
                  <td>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td>Bob Johnson</td>
                  <td>bob@example.com</td>
                  <td><span className="text-muted-foreground">Inactive</span></td>
                  <td>
                    <button className="text-primary hover:underline text-sm">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Utilities */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Utilities</h2>
          <div className="space-y-4">
            <div>
              <p className="text-error">This is an error message</p>
            </div>
            <div>
              <p className="text-success">This is a success message</p>
            </div>
            <div className="divider"></div>
            <div className="skeleton h-8 w-48 rounded"></div>
          </div>
        </section>

        {/* Icons */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Lucide Icons</h2>
          <p className="text-muted-foreground mb-6">Common icons from the Lucide library</p>
          <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <HomeIcon className="w-6 h-6" />
              <span className="text-xs text-center">Home</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <User className="w-6 h-6" />
              <span className="text-xs text-center">User</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Settings className="w-6 h-6" />
              <span className="text-xs text-center">Settings</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Search className="w-6 h-6" />
              <span className="text-xs text-center">Search</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Bell className="w-6 h-6" />
              <span className="text-xs text-center">Bell</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Mail className="w-6 h-6" />
              <span className="text-xs text-center">Mail</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Heart className="w-6 h-6" />
              <span className="text-xs text-center">Heart</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Star className="w-6 h-6" />
              <span className="text-xs text-center">Star</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Trash2 className="w-6 h-6" />
              <span className="text-xs text-center">Trash</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Edit className="w-6 h-6" />
              <span className="text-xs text-center">Edit</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Plus className="w-6 h-6" />
              <span className="text-xs text-center">Plus</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Download className="w-6 h-6" />
              <span className="text-xs text-center">Download</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Upload className="w-6 h-6" />
              <span className="text-xs text-center">Upload</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Check className="w-6 h-6" />
              <span className="text-xs text-center">Check</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <X className="w-6 h-6" />
              <span className="text-xs text-center">X</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <AlertCircle className="w-6 h-6" />
              <span className="text-xs text-center">Alert</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Info className="w-6 h-6" />
              <span className="text-xs text-center">Info</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <ChevronRight className="w-6 h-6" />
              <span className="text-xs text-center">Right</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <ChevronLeft className="w-6 h-6" />
              <span className="text-xs text-center">Left</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Calendar className="w-6 h-6" />
              <span className="text-xs text-center">Calendar</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <Clock className="w-6 h-6" />
              <span className="text-xs text-center">Clock</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
              <MapPin className="w-6 h-6" />
              <span className="text-xs text-center">MapPin</span>
            </div>
          </div>
        </section>

        {/* Toast Notifications */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Toast Notifications</h2>
          <p className="text-muted-foreground mb-6">
            User feedback system with auto-dismiss and variants
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              className="btn-mm"
              onClick={() =>
                toast({
                  variant: 'success',
                  title: 'Success!',
                  description: 'Your changes have been saved successfully.',
                })
              }
            >
              Show Success
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                toast({
                  variant: 'error',
                  title: 'Error occurred',
                  description: 'Something went wrong. Please try again.',
                })
              }
            >
              Show Error
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                toast({
                  variant: 'warning',
                  title: 'Warning',
                  description: 'This action cannot be undone.',
                })
              }
            >
              Show Warning
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                toast({
                  variant: 'info',
                  title: 'Information',
                  description: 'Check out our new features.',
                })
              }
            >
              Show Info
            </button>
            <button
              className="btn-secondary"
              onClick={() =>
                toast({
                  title: 'Default notification',
                  description: 'This is a default toast notification.',
                })
              }
            >
              Show Default
            </button>
          </div>
        </section>

        {/* Enhanced Inputs */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Enhanced Input Components</h2>
          <div className="max-w-lg space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Search Input with Icon</label>
              <Input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                startIcon={<Search className="h-4 w-4" />}
                clearable
                onClear={() => setSearchInput('')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email with Validation</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={errorInput}
                onChange={(e) => {
                  setErrorInput(e.target.value)
                  setShowEmailError(e.target.value !== '' && !e.target.value.includes('@'))
                }}
                startIcon={<Mail className="h-4 w-4" />}
                error={showEmailError ? 'Please enter a valid email address' : undefined}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Loading State</label>
              <Input
                type="text"
                placeholder="Processing..."
                value={loadingInput}
                onChange={(e) => setLoadingInput(e.target.value)}
                loading={true}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Input with End Icon</label>
              <Input
                type="text"
                placeholder="Your location"
                value={enhancedInput}
                onChange={(e) => setEnhancedInput(e.target.value)}
                endIcon={<MapPin className="h-4 w-4" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Textarea with Character Count</label>
              <Textarea
                placeholder="Write your message..."
                value={textareaValue}
                onChange={(e) => setTextareaValue(e.target.value)}
                maxLength={200}
                showCount
              />
            </div>
          </div>
        </section>

        {/* Dialogs/Modals */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Dialog / Modal</h2>
          <p className="text-muted-foreground mb-6">
            Accessible modals with backdrop blur and animations
          </p>
          <div className="flex flex-wrap gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <button className="btn-mm">Open Simple Dialog</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Welcome to MM Design System</DialogTitle>
                  <DialogDescription>
                    This is a modal dialog component with backdrop blur and smooth animations.
                    Press ESC or click outside to close.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm">
                    You can put any content here - forms, images, or complex layouts.
                  </p>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="btn-secondary">Close</button>
                  </DialogClose>
                  <button className="btn-mm">Confirm</button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <button className="btn-secondary">Dialog with Form</button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      startIcon={<User className="h-4 w-4" />}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      startIcon={<Mail className="h-4 w-4" />}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <button className="btn-secondary">Cancel</button>
                  </DialogClose>
                  <button
                    className="btn-mm"
                    onClick={() => {
                      toast({
                        variant: 'success',
                        title: 'Profile updated',
                        description: 'Your profile has been updated successfully.',
                      })
                    }}
                  >
                    Save Changes
                  </button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Dropdown Menus */}
        <section>
          <h2 className="text-2xl font-heading mb-6">Dropdown Menus</h2>
          <p className="text-muted-foreground mb-6">
            Context menus and dropdowns with keyboard navigation
          </p>
          <div className="flex flex-wrap gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="btn-mm">
                  Actions
                  <ChevronLeft className="rotate-[-90deg] w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="btn-secondary">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" />
                  <span>Edit</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Star className="mr-2 h-4 w-4" />
                  <span>Favorite</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </section>

        {/* Tier 2: Premium Polish */}
        <section className="border-t border-primary/20 pt-12">
          <ScrollReveal animation="fade" delay={100}>
            <h2 className="text-3xl font-heading mb-2 text-primary">Tier 2: Premium Polish</h2>
            <p className="text-muted-foreground mb-8">
              Micro-interactions that make your system feel polished and premium
            </p>
          </ScrollReveal>
        </section>

        {/* Magnetic Buttons */}
        <ScrollReveal animation="slide-up" delay={200}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Magnetic Buttons</h2>
            <p className="text-muted-foreground mb-6">
              Buttons that follow your cursor with smooth magnetic effects and ripple animations
            </p>
            <div className="flex flex-wrap gap-4">
              <MagneticButton variant="primary">
                Hover Me!
              </MagneticButton>
              <MagneticButton variant="primary" magneticStrength={0.8}>
                <Star className="w-4 h-4" />
                Strong Magnet
              </MagneticButton>
              <MagneticButton variant="secondary">
                <Heart className="w-4 h-4" />
                Secondary Style
              </MagneticButton>
              <MagneticButton variant="primary" ripple={false}>
                No Ripple
              </MagneticButton>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Try moving your mouse around these buttons and clicking them!
            </p>
          </section>
        </ScrollReveal>

        {/* Enhanced Cards */}
        <ScrollReveal animation="slide-up" delay={300}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Enhanced Cards with 3D Effects</h2>
            <p className="text-muted-foreground mb-6">
              Cards with 3D tilt and border glow that follows your cursor
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <EnhancedCard className="group">
                <h3 className="text-xl font-heading mb-3">3D Tilt Card</h3>
                <p className="text-muted-foreground mb-4">
                  Hover over this card to see the 3D tilt effect and the glowing border that follows your mouse.
                  The content lifts up in 3D space!
                </p>
                <MagneticButton variant="primary">
                  Explore
                </MagneticButton>
              </EnhancedCard>

              <EnhancedCard variant="glass" className="group">
                <h3 className="text-xl font-heading mb-3">Glass + 3D Effect</h3>
                <p className="text-muted-foreground mb-4">
                  Combining glassmorphism with 3D tilt creates a stunning premium feel.
                  Notice the subtle depth and the radial glow effect.
                </p>
                <MagneticButton variant="secondary">
                  Learn More
                </MagneticButton>
              </EnhancedCard>

              <EnhancedCard tiltIntensity={0.2} className="group">
                <h3 className="text-xl font-heading mb-3">Intense Tilt</h3>
                <p className="text-muted-foreground mb-4">
                  Increased tilt intensity for a more dramatic 3D effect.
                  Perfect for hero sections or featured content.
                </p>
                <div className="flex gap-2">
                  <MagneticButton variant="primary">
                    <Download className="w-4 h-4" />
                    Download
                  </MagneticButton>
                  <MagneticButton variant="secondary">
                    Share
                  </MagneticButton>
                </div>
              </EnhancedCard>

              <EnhancedCard glowEffect={false} className="group">
                <h3 className="text-xl font-heading mb-3">Tilt Only (No Glow)</h3>
                <p className="text-muted-foreground mb-4">
                  Sometimes subtlety is key. This card has the 3D tilt but no glow effect
                  for a more understated interaction.
                </p>
                <MagneticButton variant="primary">
                  View Details
                </MagneticButton>
              </EnhancedCard>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Move your mouse slowly across these cards to experience the 3D depth!
            </p>
          </section>
        </ScrollReveal>

        {/* Scroll Animations Demo */}
        <ScrollReveal animation="fade" delay={100}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Scroll Animations</h2>
            <p className="text-muted-foreground mb-6">
              Elements that animate into view as you scroll down the page
            </p>
            <div className="space-y-4">
              <ScrollReveal animation="slide-up" delay={0}>
                <div className="card-mm">
                  <h3 className="text-lg font-heading mb-2">Slide Up Animation</h3>
                  <p className="text-muted-foreground">This card slides up and fades in</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slide-left" delay={100}>
                <div className="card-mm">
                  <h3 className="text-lg font-heading mb-2">Slide Left Animation</h3>
                  <p className="text-muted-foreground">This card slides in from the right</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="slide-right" delay={200}>
                <div className="card-mm">
                  <h3 className="text-lg font-heading mb-2">Slide Right Animation</h3>
                  <p className="text-muted-foreground">This card slides in from the left</p>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="scale" delay={300}>
                <div className="card-mm">
                  <h3 className="text-lg font-heading mb-2">Scale Animation</h3>
                  <p className="text-muted-foreground">This card scales up and fades in</p>
                </div>
              </ScrollReveal>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              Scroll up and down to see the animations trigger!
            </p>
          </section>
        </ScrollReveal>

        {/* Tier 3: Delight & Differentiation */}
        <section className="border-t border-primary/20 pt-12">
          <ScrollReveal animation="fade" delay={100}>
            <h2 className="text-3xl font-heading mb-2 text-primary">Tier 3: Delight & Differentiation</h2>
            <p className="text-muted-foreground mb-8">
              The wow factor - advanced components that set your system apart
            </p>
          </ScrollReveal>
        </section>

        {/* Command Palette */}
        <ScrollReveal animation="slide-up" delay={200}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Command Palette (⌘K)</h2>
            <p className="text-muted-foreground mb-6">
              Power user feature - searchable command menu with keyboard shortcuts
            </p>
            <div className="card-mm">
              <p className="text-sm mb-4">
                Press <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">⌘K</kbd> or{' '}
                <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">Ctrl+K</kbd>{' '}
                to open the command palette
              </p>
              <MagneticButton variant="primary" onClick={() => {
                const event = new KeyboardEvent('keydown', { key: 'k', metaKey: true })
                document.dispatchEvent(event)
              }}>
                Open Command Palette
              </MagneticButton>
            </div>

            <CommandPalette>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                  <CommandItem onSelect={() => toast({ title: 'Calendar opened!' })}>
                    <Calendar className="mr-2 h-4 w-4" />
                    <span>Calendar</span>
                  </CommandItem>
                  <CommandItem onSelect={() => toast({ title: 'Search opened!' })}>
                    <Search className="mr-2 h-4 w-4" />
                    <span>Search Emoji</span>
                  </CommandItem>
                  <CommandItem onSelect={() => toast({ title: 'Calculator opened!' })}>
                    <Plus className="mr-2 h-4 w-4" />
                    <span>Calculator</span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                  <CommandItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </CommandPalette>
          </section>
        </ScrollReveal>

        {/* Skeleton Loaders */}
        <ScrollReveal animation="slide-up" delay={300}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Enhanced Skeleton Loaders</h2>
            <p className="text-muted-foreground mb-6">
              Component-specific loading states with shimmer effects
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-heading mb-4">Card Skeleton</h3>
                <SkeletonCard />
              </div>
              <div>
                <h3 className="text-lg font-heading mb-4">Text Skeleton</h3>
                <div className="card-mm">
                  <div className="flex items-center gap-4 mb-4">
                    <SkeletonAvatar size={48} />
                    <div className="flex-1">
                      <Skeleton height={20} width="40%" className="mb-2" />
                      <Skeleton height={16} width="60%" />
                    </div>
                  </div>
                  <SkeletonText lines={4} />
                </div>
              </div>
              <div className="md:col-span-2">
                <h3 className="text-lg font-heading mb-4">Table Skeleton</h3>
                <div className="card-mm">
                  <SkeletonTable rows={5} columns={4} />
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Progress Indicators */}
        <ScrollReveal animation="slide-up" delay={400}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Animated Progress Indicators</h2>
            <p className="text-muted-foreground mb-6">
              Beautiful progress bars and circular indicators with gradient effects
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Linear Progress (Animated)</h3>
                  <Progress value={progress1} color="primary" showLabel />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Success Progress</h3>
                  <Progress value={progress2} color="success" />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Warning Progress with Shimmer</h3>
                  <Progress value={progress3} color="warning" shimmer />
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-3">Error Progress</h3>
                  <Progress value={30} color="error" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex flex-wrap gap-8 justify-center items-center">
                  <div className="text-center">
                    <Progress variant="circular" value={progress1} color="primary" showLabel size={120} />
                    <p className="text-xs text-muted-foreground mt-2">Animated</p>
                  </div>
                  <div className="text-center">
                    <Progress variant="circular" value={65} color="success" showLabel size={100} />
                    <p className="text-xs text-muted-foreground mt-2">Success</p>
                  </div>
                  <div className="text-center">
                    <Progress variant="circular" value={85} color="warning" showLabel shimmer size={100} />
                    <p className="text-xs text-muted-foreground mt-2">With Shimmer</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Hover Cards */}
        <ScrollReveal animation="slide-up" delay={500}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Hover Cards / Rich Tooltips</h2>
            <p className="text-muted-foreground mb-6">
              Contextual information that appears on hover with rich content support
            </p>
            <div className="card-mm space-y-6">
              <p className="text-sm">
                Hover over the{' '}
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span className="underline decoration-dashed cursor-help text-primary">highlighted words</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Hover Cards</h4>
                      <p className="text-xs text-muted-foreground">
                        These are perfect for providing additional context without cluttering the UI.
                        They can contain rich content like images, links, and formatted text.
                      </p>
                      <div className="flex items-center gap-2 pt-2">
                        <Info className="h-4 w-4 text-primary" />
                        <span className="text-xs">Learn more</span>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>{' '}
                to see rich tooltips in action.
              </p>

              <div className="flex gap-4">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="btn-mm">
                      Hover for User Info
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                        JD
                      </div>
                      <div className="space-y-1 flex-1">
                        <h4 className="text-sm font-semibold">John Doe</h4>
                        <p className="text-xs text-muted-foreground">@johndoe</p>
                        <p className="text-xs text-muted-foreground pt-2">
                          Full-stack developer passionate about creating beautiful user experiences.
                        </p>
                        <div className="flex gap-4 pt-2 text-xs">
                          <span><strong>1.2K</strong> followers</span>
                          <span><strong>842</strong> following</span>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>

                <HoverCard>
                  <HoverCardTrigger asChild>
                    <button className="btn-secondary">
                      Hover for Stats
                    </button>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Project Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span>Components</span>
                          <span className="font-semibold">28</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Animations</span>
                          <span className="font-semibold">15</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span>Coverage</span>
                          <span className="font-semibold">94%</span>
                        </div>
                      </div>
                      <Progress value={94} color="success" size={4} />
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Navigation Components */}
        <section className="border-t border-primary/20 pt-12">
          <ScrollReveal animation="fade" delay={100}>
            <h2 className="text-3xl font-heading mb-2 text-primary">Navigation System</h2>
            <p className="text-muted-foreground mb-8">
              Complete navigation components for mobile and desktop applications
            </p>
          </ScrollReveal>
        </section>

        {/* Avatar Component */}
        <ScrollReveal animation="slide-up" delay={200}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Avatar Component</h2>
            <p className="text-muted-foreground mb-6">
              User avatars with fallback to initials or icon
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <div className="text-center">
                <Avatar
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
                  fallback="John Doe"
                  size={64}
                />
                <p className="text-xs text-muted-foreground mt-2">With Image</p>
              </div>
              <div className="text-center">
                <Avatar fallback="Sarah Smith" size={64} />
                <p className="text-xs text-muted-foreground mt-2">Initials Fallback</p>
              </div>
              <div className="text-center">
                <Avatar size={64} />
                <p className="text-xs text-muted-foreground mt-2">No Data</p>
              </div>
              <div className="text-center">
                <Avatar fallback="Michael Chen" size={48} />
                <p className="text-xs text-muted-foreground mt-2">Size: 48px</p>
              </div>
              <div className="text-center">
                <Avatar fallback="Alex Johnson" size={36} />
                <p className="text-xs text-muted-foreground mt-2">Size: 36px</p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Top Navigation */}
        <ScrollReveal animation="slide-up" delay={300}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Top Navigation Bar</h2>
            <p className="text-muted-foreground mb-6">
              Horizontal navigation with logo, menu items, and action buttons
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <TopNavigation
                activeItem={navActiveItem}
                onItemClick={setNavActiveItem}
                onProfileClick={() => toast({ title: 'Profile clicked!' })}
                onNotificationClick={() => toast({ title: '3 new notifications' })}
                onCalculatorClick={() => toast({ title: 'Calculator opened!' })}
                isDarkMode={isDarkMode}
                onThemeToggle={() => setIsDarkMode(!isDarkMode)}
                userName="John Doe"
              />
              <div className="p-8 bg-muted/50 text-center text-sm text-muted-foreground">
                Page content would go here
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Try clicking the navigation items, profile, notifications, and theme toggle
            </p>
          </section>
        </ScrollReveal>

        {/* Mobile Bottom Nav */}
        <ScrollReveal animation="slide-up" delay={400}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Mobile Bottom Navigation</h2>
            <p className="text-muted-foreground mb-6">
              Fixed bottom navigation with elevated + button for quick actions
            </p>
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="h-64 bg-muted/50 flex items-center justify-center text-sm text-muted-foreground">
                Mobile app content
              </div>
              <div className="relative">
                <MobileBottomNav
                  activeItem={navActiveItem}
                  onItemClick={(item) => {
                    setNavActiveItem(item)
                    toast({ title: `Navigated to ${item}` })
                  }}
                  onMenuClick={() => {
                    setIsMobileMenuOpen(true)
                    toast({ title: 'Menu opened!' })
                  }}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Notice the elevated + button in the center with yellow background
            </p>
          </section>
        </ScrollReveal>

        {/* Mobile Menu */}
        <ScrollReveal animation="slide-up" delay={500}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Mobile Menu Overlay</h2>
            <p className="text-muted-foreground mb-6">
              Full-screen slide-in menu for complete navigation
            </p>
            <div className="card-mm">
              <p className="text-sm mb-4">
                Opens when the "Menu" item is tapped in the bottom navigation
              </p>
              <MagneticButton
                variant="primary"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                Open Mobile Menu
              </MagneticButton>
            </div>
            <MobileMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
              activeItem={navActiveItem}
              onItemClick={(item) => {
                setNavActiveItem(item)
                setIsMobileMenuOpen(false)
                toast({ title: `Navigated to ${item}` })
              }}
            />
          </section>
        </ScrollReveal>

        {/* Desktop Sidebar */}
        <ScrollReveal animation="slide-up" delay={600}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Desktop Sidebar</h2>
            <p className="text-muted-foreground mb-6">
              Vertical sidebar navigation for desktop applications
            </p>
            <div className="border border-border rounded-lg overflow-hidden flex h-[500px]">
              <DesktopSidebar
                activeItem={navActiveItem}
                onItemClick={(item) => {
                  setNavActiveItem(item)
                  toast({ title: `Navigated to ${item}` })
                }}
                appName="Cost Per Nut Calculator"
              />
              <div className="flex-1 flex items-center justify-center bg-muted/50 text-sm text-muted-foreground">
                Main content area
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Active items have yellow background matching your design system
            </p>
          </section>
        </ScrollReveal>

        {/* Layout Examples */}
        <ScrollReveal animation="slide-up" delay={700}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Layout Wrappers</h2>
            <p className="text-muted-foreground mb-6">
              Complete layout components combining navigation patterns
            </p>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-heading mb-3">DashboardLayout</h3>
                <div className="card-mm">
                  <p className="text-sm text-muted-foreground mb-4">
                    Desktop: Shows sidebar on left (lg breakpoint)
                    <br />
                    Mobile: Top nav + bottom nav with menu overlay
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {`<DashboardLayout variant="desktop-sidebar">...</DashboardLayout>`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading mb-3">TopBarLayout</h3>
                <div className="card-mm">
                  <p className="text-sm text-muted-foreground mb-4">
                    Clean layout with top navigation bar and centered content
                    <br />
                    Perfect for landing pages and marketing sites
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {`<TopBarLayout maxWidth="2xl">...</TopBarLayout>`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-heading mb-3">MobileLayout</h3>
                <div className="card-mm">
                  <p className="text-sm text-muted-foreground mb-4">
                    Mobile-first layout with optional top nav and fixed bottom navigation
                    <br />
                    Includes hamburger menu overlay
                  </p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {`<MobileLayout showTopNav={true}>...</MobileLayout>`}
                  </code>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* Navigation Code Example */}
        <ScrollReveal animation="fade" delay={800}>
          <section>
            <h2 className="text-2xl font-heading mb-6">Usage Example</h2>
            <div className="card-mm bg-muted/30">
              <pre className="text-xs overflow-x-auto">
                <code>{`// Example: Using DashboardLayout
import { DashboardLayout } from '@/components/layouts/dashboard-layout'

export default function MyApp() {
  const [activeItem, setActiveItem] = useState('dashboard')

  return (
    <DashboardLayout
      activeItem={activeItem}
      onItemClick={setActiveItem}
      appName="Your App Name"
      userName="John Doe"
      isDarkMode={false}
      onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      onProfileClick={() => console.log('Profile')}
      variant="desktop-sidebar" // or "top-nav-only"
    >
      {/* Your page content here */}
      <h1>Dashboard</h1>
    </DashboardLayout>
  )
}`}</code>
              </pre>
            </div>
          </section>
        </ScrollReveal>

        {/* Footer */}
        <footer className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>MM Design System v2.0 - Built with Tailwind CSS 4 + shadcn/ui compatibility</p>
          <p className="mt-2">
            <span className="text-mm-primary">Primary: #337def</span>
            {' • '}
            <span className="text-mm-secondary">Secondary: #fcc729</span>
          </p>
          <p className="mt-4 text-xs">
            All 3 Tiers Complete: Foundation + Premium Polish + Delight + Navigation System 🎉
          </p>
        </footer>

      </div>
    </div>
  )
}
