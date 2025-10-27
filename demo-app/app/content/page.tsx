'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, TrendingUp, Users, Briefcase, Code } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { BlogGrid } from '@/components/sections/content/blog-grid'
import { BlogList } from '@/components/sections/content/blog-list'
import { BlogFeatured } from '@/components/sections/content/blog-featured'
import { PortfolioGrid } from '@/components/sections/content/portfolio-grid'
import { PortfolioShowcase } from '@/components/sections/content/portfolio-showcase'
import { PortfolioCarousel } from '@/components/sections/content/portfolio-carousel'
import { StatsGrid } from '@/components/sections/content/stats-grid'
import { StatsHighlight } from '@/components/sections/content/stats-highlight'
import { StatsTimeline } from '@/components/sections/content/stats-timeline'
import { TeamGrid } from '@/components/sections/content/team-grid'
import { TeamCards } from '@/components/sections/content/team-cards'
import { TeamLeadership } from '@/components/sections/content/team-leadership'

export default function ContentPage() {
  // Sample blog posts data
  const blogPosts = [
    {
      title: 'Getting Started with Next.js 14',
      excerpt: 'Learn how to build modern web applications with the latest version of Next.js and React.',
      author: 'Jane Smith',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      category: 'Development',
      readTime: 8,
      date: 'Mar 15, 2024',
      href: '#',
    },
    {
      title: 'Mastering TypeScript Types',
      excerpt: 'Deep dive into advanced TypeScript patterns and best practices for type-safe code.',
      author: 'John Doe',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
      thumbnail: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=600&fit=crop',
      category: 'TypeScript',
      readTime: 12,
      date: 'Mar 12, 2024',
      href: '#',
    },
    {
      title: 'Design Systems 101',
      excerpt: 'Building scalable and maintainable design systems for modern applications.',
      author: 'Sarah Johnson',
      authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop',
      category: 'Design',
      readTime: 10,
      date: 'Mar 10, 2024',
      href: '#',
    },
  ]

  // Sample portfolio projects data
  const portfolioProjects = [
    {
      title: 'E-Commerce Platform',
      description: 'A modern e-commerce platform built with Next.js, featuring real-time inventory, payment processing, and admin dashboard.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      category: 'Web App',
      tags: ['Next.js', 'Stripe', 'PostgreSQL'],
      href: '#',
      client: 'Retail Co.',
    },
    {
      title: 'Mobile Banking App',
      description: 'Secure and intuitive mobile banking application with biometric authentication and instant transfers.',
      thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=600&fit=crop',
      category: 'Mobile',
      tags: ['React Native', 'Node.js', 'AWS'],
      href: '#',
      client: 'Finance Bank',
    },
    {
      title: 'SaaS Dashboard',
      description: 'Analytics dashboard for SaaS companies with real-time metrics, custom reports, and team collaboration features.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
      category: 'Dashboard',
      tags: ['React', 'D3.js', 'Firebase'],
      href: '#',
      client: 'Analytics Inc.',
    },
  ]

  // Sample stats data
  const stats = [
    { number: 500, label: 'Happy Clients', icon: Users, suffix: '+' },
    { number: 1200, label: 'Projects Completed', icon: Briefcase, suffix: '+' },
    { number: 50, label: 'Team Members', icon: TrendingUp },
    { number: 10, label: 'Years Experience', icon: Code },
  ]

  // Sample highlight stats
  const highlightStats = [
    { label: 'Customer Satisfaction', value: 487, max: 500, growth: 12.5, comparison: 'vs last quarter' },
    { label: 'Active Projects', value: 24, max: 30, growth: 8.2, comparison: 'vs last month' },
    { label: 'Team Productivity', value: 92, max: 100, growth: -2.1, comparison: 'vs previous sprint' },
  ]

  // Sample timeline milestones
  const milestones = [
    {
      year: '2020',
      stat: 'Company Founded',
      description: 'Started our journey with a vision to transform digital experiences',
      label: 'Milestone',
    },
    {
      year: '2021',
      stat: '100+ Clients',
      description: 'Reached our first major milestone serving clients worldwide',
      label: 'Achievement',
    },
    {
      year: '2022',
      stat: '$10M Revenue',
      description: 'Achieved significant revenue growth and expanded our team',
      label: 'Financial',
    },
    {
      year: '2024',
      stat: 'Industry Leader',
      description: 'Recognized as a leading provider in our space with 500+ clients',
      label: 'Recognition',
    },
  ]

  // Sample team members
  const teamMembers = [
    {
      name: 'Alex Rivera',
      title: 'CEO & Founder',
      bio: 'Visionary leader with 15+ years in tech, passionate about building products that make a difference.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      linkedin: '#',
      twitter: '#',
      email: 'alex@example.com',
      skills: ['Strategy', 'Leadership', 'Product Vision'],
    },
    {
      name: 'Sarah Chen',
      title: 'CTO',
      bio: 'Technical expert specializing in scalable architecture and modern web technologies.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      linkedin: '#',
      github: '#',
      email: 'sarah@example.com',
      skills: ['Architecture', 'Cloud', 'DevOps'],
    },
    {
      name: 'Marcus Thompson',
      title: 'Head of Design',
      bio: 'Award-winning designer focused on creating beautiful and functional user experiences.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
      linkedin: '#',
      twitter: '#',
      email: 'marcus@example.com',
      skills: ['UI/UX', 'Design Systems', 'Branding'],
    },
  ]

  // Sample leadership
  const leaders = [
    {
      name: 'Jennifer Martinez',
      title: 'Chief Executive Officer',
      bio: 'Jennifer brings over 20 years of experience in technology and business strategy. Under her leadership, the company has grown from a startup to an industry leader, serving Fortune 500 companies worldwide.',
      photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer',
      achievements: [
        'Led company to 300% revenue growth in 3 years',
        'Named "Tech Leader of the Year" by Industry Magazine',
        'Built and scaled teams across 5 countries',
      ],
      linkedin: '#',
      twitter: '#',
      email: 'jennifer@example.com',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-heading mb-2">Tier 3: Content Sections</h1>
          <p className="text-muted-foreground">
            Blog grids, portfolios, stats, and team sections
          </p>
        </div>
      </div>

      {/* Blog Sections */}
      <div className="bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Blog Sections</h2>
          <p className="text-muted-foreground mb-8">
            Three variants: Grid, List, and Featured layouts
          </p>
        </div>
      </div>

      <BlogGrid posts={blogPosts} />
      <BlogList posts={blogPosts.slice(0, 2)} />
      <BlogFeatured featuredPost={blogPosts[0]} recentPosts={blogPosts.slice(1)} />

      {/* Portfolio Sections */}
      <div className="bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Portfolio Sections</h2>
          <p className="text-muted-foreground mb-8">
            Three variants: Grid with filters, Showcase, and Carousel
          </p>
        </div>
      </div>

      <PortfolioGrid projects={portfolioProjects} />
      <PortfolioShowcase projects={portfolioProjects} />
      <PortfolioCarousel projects={portfolioProjects} autoPlay={true} />

      {/* Stats Sections */}
      <div className="bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Stats Sections</h2>
          <p className="text-muted-foreground mb-8">
            Three variants: Grid with counters, Highlight with progress, and Timeline
          </p>
        </div>
      </div>

      <StatsGrid stats={stats} />
      <StatsHighlight stats={highlightStats} />
      <StatsTimeline milestones={milestones} />

      {/* Team Sections */}
      <div className="bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-3xl font-heading mb-2 text-primary">Team Sections</h2>
          <p className="text-muted-foreground mb-8">
            Three variants: Grid, Interactive Cards, and Leadership profiles
          </p>
        </div>
      </div>

      <TeamGrid members={teamMembers} />
      <TeamCards members={teamMembers} />
      <TeamLeadership leaders={leaders} />

      {/* Footer */}
      <div className="border-t border-border mt-20">
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground mb-4">
            Tier 3 Complete: 12 Content Section Components
          </p>
          <Link href="/" className="btn-mm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
