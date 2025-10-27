'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { useToast } from '@/hooks/use-toast'

// Hero Imports
import { HeroCentered } from '@/components/sections/heroes/hero-centered'
import { HeroSplit } from '@/components/sections/heroes/hero-split'
import { HeroVideo } from '@/components/sections/heroes/hero-video'
import { HeroGradient } from '@/components/sections/heroes/hero-gradient'
import { HeroMinimal } from '@/components/sections/heroes/hero-minimal'

// Feature Imports
import { FeatureGrid } from '@/components/sections/features/feature-grid'
import { FeatureAlternating } from '@/components/sections/features/feature-alternating'
import { FeatureList } from '@/components/sections/features/feature-list'
import { FeatureTabs } from '@/components/sections/features/feature-tabs'

// Pricing Imports
import { PricingCards } from '@/components/sections/pricing/pricing-cards'
import { PricingTable } from '@/components/sections/pricing/pricing-table'
import { PricingToggle } from '@/components/sections/pricing/pricing-toggle'

// Auth Imports
import { LoginForm } from '@/components/sections/auth/login-form'
import { SignupForm } from '@/components/sections/auth/signup-form'
import { PasswordReset } from '@/components/sections/auth/password-reset'
import { MagicLink } from '@/components/sections/auth/magic-link'

// Icons
import { Zap, Shield, Rocket, Heart, Code, Palette, Layout, Layers, Settings, Users, ArrowLeft } from 'lucide-react'

export default function SectionsPage() {
  const { toast } = useToast()
  const [activeDemo, setActiveDemo] = React.useState<string | null>(null)

  const handleCTAClick = (action: string) => {
    toast({
      title: action,
      description: 'This is a demo action',
    })
  }

  // Sample data for sections
  const gridFeatures = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized performance for the best user experience',
    },
    {
      icon: Shield,
      title: 'Secure by Default',
      description: 'Built-in security best practices and data protection',
    },
    {
      icon: Rocket,
      title: 'Easy to Deploy',
      description: 'Deploy anywhere with our flexible infrastructure',
    },
    {
      icon: Heart,
      title: 'Developer Friendly',
      description: 'Clean APIs and comprehensive documentation',
    },
    {
      icon: Code,
      title: 'Type Safe',
      description: 'Full TypeScript support out of the box',
    },
    {
      icon: Palette,
      title: 'Customizable',
      description: 'Adapt the design system to match your brand',
    },
  ]

  const alternatingFeatures = [
    {
      title: 'Beautiful Component Library',
      description: 'Access a comprehensive library of pre-built, customizable components designed for modern web applications.',
      benefits: [
        '50+ production-ready components',
        'Fully responsive across all devices',
        'Accessibility built-in',
        'Dark mode support',
      ],
      cta: {
        text: 'Explore Components',
        onClick: () => handleCTAClick('Explore Components'),
      },
    },
    {
      title: 'Design Token System',
      description: 'Maintain consistent design across your entire application with our powerful design token system.',
      benefits: [
        'Single source of truth for design',
        'Easy theme customization',
        'Automatic dark mode generation',
        'CSS variables for maximum flexibility',
      ],
      cta: {
        text: 'View Tokens',
        onClick: () => handleCTAClick('View Tokens'),
      },
    },
  ]

  const tabFeatures = [
    {
      id: 'components',
      icon: Layout,
      label: 'Components',
      title: 'Rich Component Library',
      description: 'Access dozens of pre-built components that work seamlessly together.',
      features: [
        'Buttons, forms, and inputs',
        'Navigation and layout components',
        'Data display components',
        'Feedback and overlay components',
      ],
    },
    {
      id: 'theming',
      icon: Palette,
      label: 'Theming',
      title: 'Powerful Theming System',
      description: 'Customize every aspect of your design with our flexible theming engine.',
      features: [
        'Design tokens and CSS variables',
        'Automatic dark mode',
        'Brand color customization',
        'Typography and spacing control',
      ],
    },
    {
      id: 'patterns',
      icon: Layers,
      label: 'Patterns',
      title: 'Design Patterns',
      description: 'Build faster with proven UI patterns and best practices.',
      features: [
        'Authentication flows',
        'Dashboard layouts',
        'E-commerce patterns',
        'Data visualization',
      ],
    },
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      price: 0,
      period: 'month',
      description: 'Perfect for side projects',
      features: [
        'All core components',
        'Basic documentation',
        'Community support',
        'MIT License',
      ],
      cta: 'Get Started',
      onCTAClick: () => handleCTAClick('Starter Plan'),
    },
    {
      name: 'Pro',
      price: 49,
      period: 'month',
      description: 'For professional developers',
      features: [
        'Everything in Starter',
        'Advanced components',
        'Priority support',
        'Figma design files',
        'Premium templates',
      ],
      cta: 'Start Free Trial',
      onCTAClick: () => handleCTAClick('Pro Plan'),
      popular: true,
    },
    {
      name: 'Team',
      price: 199,
      period: 'month',
      description: 'For growing teams',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom components',
        'Dedicated support',
        'Training sessions',
      ],
      cta: 'Contact Sales',
      onCTAClick: () => handleCTAClick('Team Plan'),
    },
  ]

  const pricingFeatures = [
    { name: 'Core Components', starter: true, pro: true, enterprise: true },
    { name: 'Advanced Components', starter: false, pro: true, enterprise: true },
    { name: 'Team Members', starter: '1', pro: '5', enterprise: 'Unlimited' },
    { name: 'Support', starter: 'Community', pro: 'Email', enterprise: 'Phone & Email' },
    { name: 'Updates', starter: true, pro: true, enterprise: true },
    { name: 'Custom Components', starter: false, pro: false, enterprise: true },
  ]

  const pricingPlans = [
    {
      name: 'Basic',
      monthlyPrice: 29,
      annualPrice: 290,
      description: 'Essential features for individuals',
      features: [
        'Core component library',
        'Basic templates',
        'Email support',
        'Regular updates',
      ],
      cta: 'Get Started',
      onCTAClick: (isAnnual: boolean) => handleCTAClick(`Basic Plan (${isAnnual ? 'Annual' : 'Monthly'})`),
    },
    {
      name: 'Professional',
      monthlyPrice: 79,
      annualPrice: 790,
      description: 'Advanced features for pros',
      features: [
        'Everything in Basic',
        'Premium components',
        'Priority support',
        'Figma files',
        'Early access to features',
      ],
      cta: 'Start Trial',
      onCTAClick: (isAnnual: boolean) => handleCTAClick(`Pro Plan (${isAnnual ? 'Annual' : 'Monthly'})`),
      popular: true,
    },
    {
      name: 'Enterprise',
      monthlyPrice: 299,
      annualPrice: 2990,
      description: 'Complete solution for teams',
      features: [
        'Everything in Professional',
        'Custom development',
        'Dedicated support',
        'Team training',
        'SLA guarantee',
      ],
      cta: 'Contact Us',
      onCTAClick: (isAnnual: boolean) => handleCTAClick(`Enterprise Plan (${isAnnual ? 'Annual' : 'Monthly'})`),
    },
  ]

  const renderSection = (title: string, description: string, component: React.ReactNode, id: string) => (
    <div className="py-20 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 mb-12">
        <h2 className="text-3xl font-heading mb-2">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {component}
    </div>
  )

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-heading">Section Library</h1>
                <p className="text-sm text-muted-foreground">Tier 1: Essential Sections</p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="bg-accent/50 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="flex flex-wrap gap-4 text-sm">
            <a href="#heroes" className="text-primary hover:underline">Heroes (5)</a>
            <a href="#features" className="text-primary hover:underline">Features (4)</a>
            <a href="#pricing" className="text-primary hover:underline">Pricing (3)</a>
            <a href="#auth" className="text-primary hover:underline">Auth (4)</a>
          </nav>
        </div>
      </div>

      {/* Hero Sections */}
      <div id="heroes" className="border-b-4 border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-4xl font-heading mb-2">Hero Sections</h2>
          <p className="text-lg text-muted-foreground mb-8">5 hero section variants for any use case</p>
        </div>

        {renderSection(
          '1. Centered Hero',
          'Classic centered hero with CTA buttons and trust indicators',
          <HeroCentered onPrimaryClick={() => handleCTAClick('Primary CTA')} />,
          'hero-centered'
        )}

        {renderSection(
          '2. Split Hero',
          'Split layout with content and image/visual',
          <HeroSplit
            imagePosition="right"
            onPrimaryClick={() => handleCTAClick('Split Hero CTA')}
          />,
          'hero-split'
        )}

        {renderSection(
          '3. Video Background Hero',
          'Immersive video background with overlay',
          <HeroVideo onPrimaryClick={() => handleCTAClick('Video Hero CTA')} />,
          'hero-video'
        )}

        {renderSection(
          '4. Gradient Hero',
          'Modern gradient background with animated orbs',
          <HeroGradient
            onPrimaryClick={() => handleCTAClick('Gradient Hero Primary')}
            onSecondaryClick={() => handleCTAClick('Gradient Hero Secondary')}
          />,
          'hero-gradient'
        )}

        {renderSection(
          '5. Minimal Hero',
          'Clean, text-focused hero for minimal designs',
          <HeroMinimal onPrimaryClick={() => handleCTAClick('Minimal Hero CTA')} />,
          'hero-minimal'
        )}
      </div>

      {/* Feature Sections */}
      <div id="features" className="border-b-4 border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-4xl font-heading mb-2">Feature Sections</h2>
          <p className="text-lg text-muted-foreground mb-8">4 ways to showcase your features</p>
        </div>

        {renderSection(
          '1. Feature Grid',
          '3-column grid with icons and descriptions',
          <FeatureGrid features={gridFeatures} columns={3} />,
          'feature-grid'
        )}

        {renderSection(
          '2. Alternating Features',
          'Image and content alternating layout',
          <FeatureAlternating features={alternatingFeatures} />,
          'feature-alternating'
        )}

        {renderSection(
          '3. Feature List',
          'Vertical list with icons',
          <FeatureList features={gridFeatures.slice(0, 4)} columns={2} />,
          'feature-list'
        )}

        {renderSection(
          '4. Tabbed Features',
          'Interactive tabs with content switching',
          <FeatureTabs tabs={tabFeatures} />,
          'feature-tabs'
        )}
      </div>

      {/* Pricing Sections */}
      <div id="pricing" className="border-b-4 border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-4xl font-heading mb-2">Pricing Sections</h2>
          <p className="text-lg text-muted-foreground mb-8">3 pricing layouts to choose from</p>
        </div>

        {renderSection(
          '1. Pricing Cards',
          'Card-based pricing with popular highlight',
          <PricingCards tiers={pricingTiers} />,
          'pricing-cards'
        )}

        {renderSection(
          '2. Pricing Table',
          'Comparison table layout',
          <PricingTable
            features={pricingFeatures}
            tiers={{
              starter: { price: 0, cta: 'Start Free', onCTAClick: () => handleCTAClick('Starter') },
              pro: { price: 49, cta: 'Start Trial', onCTAClick: () => handleCTAClick('Pro') },
              enterprise: { price: 'Custom', cta: 'Contact Us', onCTAClick: () => handleCTAClick('Enterprise') },
            }}
          />,
          'pricing-table'
        )}

        {renderSection(
          '3. Toggle Pricing',
          'Monthly/Annual toggle with savings display',
          <PricingToggle plans={pricingPlans} annualDiscount={20} />,
          'pricing-toggle'
        )}
      </div>

      {/* Auth Sections */}
      <div id="auth" className="border-b-4 border-primary/20">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-4xl font-heading mb-2">Authentication Sections</h2>
          <p className="text-lg text-muted-foreground mb-8">4 auth flows ready to use</p>
        </div>

        {renderSection(
          '1. Login Form',
          'Full-featured login with social auth',
          <LoginForm
            onSubmit={(email, password) => handleCTAClick(`Login: ${email}`)}
            onGoogleLogin={() => handleCTAClick('Google Login')}
            onGithubLogin={() => handleCTAClick('GitHub Login')}
          />,
          'login-form'
        )}

        {renderSection(
          '2. Signup Form',
          'Registration with real-time validation',
          <SignupForm
            onSubmit={(name, email, password) => handleCTAClick(`Signup: ${name}`)}
          />,
          'signup-form'
        )}

        {renderSection(
          '3. Password Reset',
          'Password reset flow with success state',
          <PasswordReset
            onSubmit={(email) => handleCTAClick(`Reset: ${email}`)}
          />,
          'password-reset'
        )}

        {renderSection(
          '4. Magic Link',
          'Passwordless authentication',
          <MagicLink
            onSubmit={(email) => handleCTAClick(`Magic Link: ${email}`)}
          />,
          'magic-link'
        )}
      </div>

      {/* Footer */}
      <footer className="py-12 bg-accent/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            All sections are fully responsive, theme-aware, and ready to copy-paste into your projects.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Built with MM Design System • Tier 1 Complete ✨
          </p>
        </div>
      </footer>
    </div>
  )
}
