'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { HeroCentered } from '@/components/sections/heroes/hero-centered'
import { TextImageSplit } from '@/components/sections/canvas/text-image-split'
import { FeatureGrid } from '@/components/sections/features/feature-grid'
import { FeatureAlternating } from '@/components/sections/features/feature-alternating'
import { TestimonialGrid } from '@/components/sections/engagement/testimonial-grid'
import { PricingToggle } from '@/components/sections/pricing/pricing-toggle'
import { CtaCentered } from '@/components/sections/engagement/cta-centered'
import {
  Calendar,
  Calculator,
  Syringe,
  LineChart,
  Clock,
  Database,
  CheckCircle2,
  Target,
  TrendingUp,
  Shield,
  Sparkles,
  ArrowRight
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()
  const pricingRef = React.useRef<HTMLDivElement>(null)

  const scrollToPricing = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Feature data for the grid
  const features = [
    {
      icon: Target,
      title: 'Smart Protocol Builder',
      description: 'Create flexible injection schedules with cycle management, automatic reminders, and intelligent dose tracking.',
    },
    {
      icon: Syringe,
      title: 'One-Tap Logging',
      description: 'Log injections instantly with automatic site rotation, vial tracking, and dose adjustments. Never forget which side you used.',
    },
    {
      icon: Calculator,
      title: 'Advanced Calculator',
      description: 'Convert between mg/mL, IU, and syringe units. Calculate doses, volumes, and remaining vial capacity with precision.',
    },
    {
      icon: LineChart,
      title: 'Analytics Dashboard',
      description: 'Visualize adherence timelines, track measurements, and monitor progress with beautiful charts and insights.',
    },
    {
      icon: Database,
      title: 'Backup & Export',
      description: 'Local-first storage with cloud sync. Export to CSV/PDF for your records or doctor appointments. Your data, your control.',
    },
    {
      icon: Sparkles,
      title: 'AI Coach (Coming Soon)',
      description: 'Get personalized insights, conversational guidance, and auto-generated doctor reports powered by AI.',
    },
  ]

  // Alternating feature deep dives
  const deepDiveFeatures = [
    {
      title: 'Medication & Vial Management Made Simple',
      description: 'Add your medications with flexible unit systems (mg, IU, mcg), set concentrations, and let the app auto-calculate everything. Track expiration dates, monitor remaining doses, and never waste another vial.',
      benefits: [
        'Auto-calculate vial volumes and remaining doses',
        'Track multiple medications and vials simultaneously',
        'Expiration date reminders',
        'Support for all unit types (mg, IU, mcg, units)',
      ],
      image: (
        <div className="aspect-video rounded-card bg-gradient-to-br from-primary/20 via-primary/10 to-secondary/20 flex items-center justify-center border border-border p-8">
          <div className="text-center space-y-4">
            <Database className="w-16 h-16 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Medication Management UI</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Calendar View & Smart Scheduling',
      description: 'See your entire injection schedule at a glance. The calendar view shows completed doses, upcoming injections, and adherence patterns. Never miss a dose with automated reminders and next-dose previews.',
      benefits: [
        'Visual calendar with adherence tracking',
        'Flexible scheduling (every X days, weekly, custom)',
        'Cycle management with automatic off-weeks',
        'Push notifications for upcoming doses',
      ],
      image: (
        <div className="aspect-video rounded-card bg-gradient-to-br from-secondary/20 via-primary/10 to-primary/20 flex items-center justify-center border border-border p-8">
          <div className="text-center space-y-4">
            <Calendar className="w-16 h-16 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Calendar & Schedule UI</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Analytics That Actually Help',
      description: 'Track your progress with visual analytics. See adherence rates, monitor body measurements (weight, blood pressure), and identify trends over time. Export reports for your healthcare provider.',
      benefits: [
        'Adherence timeline (completed vs. scheduled)',
        'Measurements graphs (weight, BP, custom metrics)',
        'Remaining doses per vial calculations',
        'CSV/PDF export for doctor visits',
      ],
      image: (
        <div className="aspect-video rounded-card bg-gradient-to-br from-primary/20 via-secondary/10 to-primary/20 flex items-center justify-center border border-border p-8">
          <div className="text-center space-y-4">
            <TrendingUp className="w-16 h-16 mx-auto text-primary" />
            <p className="text-sm text-muted-foreground">Analytics Dashboard UI</p>
          </div>
        </div>
      ),
    },
  ]

  // Testimonials
  const testimonials = [
    {
      quote: 'I used to have a spreadsheet nightmare tracking my TRT protocol. This app calculated everything automatically and saved me hours every month.',
      name: 'Michael Chen',
      title: 'TRT Patient',
      company: '2 Years',
      rating: 5,
    },
    {
      quote: 'The vial calculator alone is worth it. I was constantly overthinking my doses and wasting peptides. Now I just trust the math.',
      name: 'Sarah Rodriguez',
      title: 'Peptide User',
      company: '18 Months',
      rating: 5,
    },
    {
      quote: 'As someone managing both GLP-1s and peptides, the multi-medication tracking is a game-changer. Everything in one place, always accurate.',
      name: 'David Park',
      title: 'Multi-Protocol',
      company: '1 Year',
      rating: 5,
    },
  ]

  // Pricing plans
  const pricingPlans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Perfect for getting started',
      features: [
        '1 medication tracking',
        'Simple reminders',
        'Manual injection logs',
        'Basic calculator',
        'CSV export',
      ],
      cta: 'Start Free',
      onCTAClick: (isAnnual: boolean) => router.push('/signup'),
    },
    {
      name: 'Pro',
      monthlyPrice: 9,
      annualPrice: 84,
      description: 'For serious trackers',
      features: [
        'Unlimited medications',
        'Advanced calculators',
        'Flexible protocols',
        'Analytics & charts',
        'Cloud backup & sync',
        'PDF export',
        'Priority support',
      ],
      cta: 'Upgrade to Pro',
      onCTAClick: (isAnnual: boolean) => router.push('/signup?plan=pro'),
      popular: true,
    },
    {
      name: 'AI Coach',
      monthlyPrice: 19,
      annualPrice: 180,
      description: 'Coming soon',
      features: [
        'Everything in Pro',
        'AI chat insights',
        'Auto summaries',
        'Doctor report generation',
        'Personalized recommendations',
        'Pattern detection',
      ],
      cta: 'Join Waitlist',
      onCTAClick: (isAnnual: boolean) => router.push('/waitlist'),
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Theme Toggle - Fixed Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <HeroCentered
        headline="Never miss a dose, never miscalculate a vial"
        subheadline="Clinical-grade tracking for your injection protocols. Track TRT, peptides, GLP-1s, and hormones with precision. Always know exactly what's next."
        primaryCTA="Start Free"
        secondaryCTA="View Demo"
        onPrimaryClick={() => router.push('/signup')}
        onSecondaryClick={() => router.push('/dashboard')}
        showDecorations={true}
      />

      {/* Problem/Solution Section */}
      <TextImageSplit
        heading="Stop guessing. Start tracking with confidence."
        bodyCopy="Managing self-administered protocols shouldn't require a spreadsheet degree. Missed doses, manual calculations, and vial waste add up to confusion and lost progress. We built the tool we wished existed: simple, accurate, and always there when you need it."
        buttonText="See How It Works"
        onButtonClick={() => router.push('/dashboard')}
        imagePosition="right"
        imageElement={
          <div className="relative aspect-video rounded-card bg-gradient-to-br from-primary/30 via-primary/20 to-secondary/30 border-2 border-border flex items-center justify-center p-12">
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-card/80 backdrop-blur rounded-card p-4 space-y-2 border border-border">
                <CheckCircle2 className="w-8 h-8 text-success" />
                <p className="text-sm font-heading">Auto-Calculate</p>
              </div>
              <div className="bg-card/80 backdrop-blur rounded-card p-4 space-y-2 border border-border">
                <Clock className="w-8 h-8 text-primary" />
                <p className="text-sm font-heading">Smart Reminders</p>
              </div>
              <div className="bg-card/80 backdrop-blur rounded-card p-4 space-y-2 border border-border">
                <Calendar className="w-8 h-8 text-secondary" />
                <p className="text-sm font-heading">Visual Timeline</p>
              </div>
              <div className="bg-card/80 backdrop-blur rounded-card p-4 space-y-2 border border-border">
                <Shield className="w-8 h-8 text-success" />
                <p className="text-sm font-heading">Backup & Export</p>
              </div>
            </div>
          </div>
        }
      />

      {/* Key Features Grid */}
      <FeatureGrid
        title="Everything you need to track smarter"
        description="All the tools to manage your protocols with clinical precision"
        features={features}
        columns={3}
      />

      {/* Feature Deep Dive */}
      <FeatureAlternating features={deepDiveFeatures} />

      {/* Testimonials */}
      <TestimonialGrid
        title="Trusted by thousands of users"
        description="Real feedback from people managing their protocols"
        testimonials={testimonials}
        columns={3}
      />

      {/* Pricing */}
      <div ref={pricingRef}>
        <PricingToggle
          title="Choose your plan"
          description="Start free, upgrade when you need more power"
          plans={pricingPlans}
          annualDiscount={20}
        />
      </div>

      {/* Final CTA */}
      <CtaCentered
        headline="Start tracking smarter today"
        description="Join thousands of users who never miss a dose"
        features={[
          { icon: CheckCircle2, text: 'Free to start' },
          { icon: Shield, text: 'Your data, your control' },
          { icon: Sparkles, text: 'AI insights coming soon' },
        ]}
        primaryCta="Get Started Free"
        secondaryCta="View Pricing"
        onPrimaryClick={() => router.push('/signup')}
        onSecondaryClick={scrollToPricing}
        trustIndicators={[
          '10,000+ active users',
          'HIPAA-compliant storage',
          'Export anytime',
        ]}
      />
    </div>
  )
}
