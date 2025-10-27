# Section Library - Tier 1

A comprehensive collection of pre-built, production-ready sections for your next project.

## 📦 What's Included

### Hero Sections (5 variants)
- **HeroCentered** - Classic centered hero with CTAs and trust indicators
- **HeroSplit** - Split layout with content and image
- **HeroVideo** - Immersive video background with overlay
- **HeroGradient** - Modern gradient with animated orbs
- **HeroMinimal** - Clean, text-focused minimal hero

### Feature Sections (4 variants)
- **FeatureGrid** - 3-column grid with icons
- **FeatureAlternating** - Alternating image/content rows
- **FeatureList** - Vertical list with icons
- **FeatureTabs** - Interactive tabbed features

### Pricing Sections (3 variants)
- **PricingCards** - Card-based with popular highlight
- **PricingTable** - Full comparison table
- **PricingToggle** - Monthly/Annual toggle with savings

### Auth Sections (4 variants)
- **LoginForm** - Full-featured login with social auth
- **SignupForm** - Registration with real-time validation
- **PasswordReset** - Password reset flow
- **MagicLink** - Passwordless authentication

## 🚀 Usage

### Import Individual Sections

```tsx
import { HeroCentered } from '@/components/sections/heroes/hero-centered'
import { FeatureGrid } from '@/components/sections/features/feature-grid'
import { PricingCards } from '@/components/sections/pricing/pricing-cards'
```

### Or Use the Index

```tsx
import {
  HeroCentered,
  FeatureGrid,
  PricingCards,
  LoginForm
} from '@/components/sections'
```

## 💡 Example: Hero Section

```tsx
import { HeroCentered } from '@/components/sections'

export default function HomePage() {
  return (
    <HeroCentered
      headline="Build Amazing Apps Faster"
      subheadline="Your complete design system"
      primaryCTA="Get Started"
      secondaryCTA="Watch Demo"
      onPrimaryClick={() => console.log('Primary clicked')}
      onSecondaryClick={() => console.log('Secondary clicked')}
    />
  )
}
```

## 💡 Example: Feature Grid

```tsx
import { FeatureGrid } from '@/components/sections'
import { Zap, Shield, Rocket } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized for performance'
  },
  {
    icon: Shield,
    title: 'Secure',
    description: 'Built-in security'
  },
  {
    icon: Rocket,
    title: 'Scalable',
    description: 'Grows with you'
  }
]

export default function FeaturesPage() {
  return (
    <FeatureGrid
      title="Why Choose Us"
      features={features}
      columns={3}
    />
  )
}
```

## 💡 Example: Pricing Cards

```tsx
import { PricingCards } from '@/components/sections'

const tiers = [
  {
    name: 'Starter',
    price: 0,
    period: 'month',
    description: 'For individuals',
    features: ['Feature 1', 'Feature 2'],
    cta: 'Get Started',
    onCTAClick: () => console.log('Starter clicked')
  },
  {
    name: 'Pro',
    price: 49,
    period: 'month',
    description: 'For professionals',
    features: ['All Starter features', 'Feature 3', 'Feature 4'],
    cta: 'Start Trial',
    onCTAClick: () => console.log('Pro clicked'),
    popular: true
  }
]

export default function PricingPage() {
  return <PricingCards tiers={tiers} />
}
```

## 🎨 Customization

All sections:
- ✅ Fully typed with TypeScript
- ✅ Responsive (mobile → desktop)
- ✅ Theme-aware (light/dark mode)
- ✅ Use your design tokens
- ✅ Customizable props

## 📱 Responsive

All sections are built mobile-first and adapt beautifully across:
- Mobile (< 640px)
- Tablet (640px - 1024px)
- Desktop (> 1024px)

## 🌙 Dark Mode

All sections automatically adapt to your theme using the MM Design System color tokens.

## 🔗 Demo

Visit `/sections` in your app to see all sections in action with live examples and props.

## 📝 TypeScript

All sections export their prop types:

```tsx
import type { HeroCenteredProps, FeatureGridProps } from '@/components/sections'
```

---

**Built with MM Design System** | Tier 1 Complete ✨
