'use client'

import * as React from 'react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

// Engagement Section Imports
import { TestimonialGrid } from '@/components/sections/engagement/testimonial-grid'
import { TestimonialCarousel } from '@/components/sections/engagement/testimonial-carousel'
import { TestimonialWall } from '@/components/sections/engagement/testimonial-wall'
import { CtaBanner } from '@/components/sections/engagement/cta-banner'
import { CtaSplit } from '@/components/sections/engagement/cta-split'
import { CtaCentered } from '@/components/sections/engagement/cta-centered'
import { FaqAccordion } from '@/components/sections/engagement/faq-accordion'
import { FaqTwoColumn } from '@/components/sections/engagement/faq-two-column'
import { FaqTabs } from '@/components/sections/engagement/faq-tabs'
import { NewsletterInline } from '@/components/sections/engagement/newsletter-inline'
import { NewsletterCard } from '@/components/sections/engagement/newsletter-card'
import { NewsletterPopup } from '@/components/sections/engagement/newsletter-popup'

// Icons
import { Star, Award, TrendingUp, Zap, Shield, Rocket } from 'lucide-react'

export default function EngagementPage() {
  const { toast } = useToast()

  const handleCTAClick = (action: string) => {
    toast({
      title: action,
      description: 'This is a demo action',
    })
  }

  const handleNewsletterSubmit = async (email: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Newsletter signup:', email)
  }

  // Testimonial data
  const testimonials = [
    {
      quote: 'This design system has completely transformed how our team builds products. The components are beautiful and work flawlessly.',
      name: 'Sarah Chen',
      title: 'Product Designer',
      company: 'TechCorp',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      rating: 5,
    },
    {
      quote: 'The attention to detail and developer experience is outstanding. We shipped our new dashboard in half the time.',
      name: 'Michael Rodriguez',
      title: 'Engineering Lead',
      company: 'StartupXYZ',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      rating: 5,
    },
    {
      quote: 'Best design system I\'ve used. The dark mode support and accessibility features are top-notch.',
      name: 'Emma Wilson',
      title: 'Senior Developer',
      company: 'Digital Agency',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      rating: 5,
    },
    {
      quote: 'Our clients love the polished look and feel. The components are incredibly flexible and easy to customize.',
      name: 'James Liu',
      title: 'Creative Director',
      company: 'Design Studio',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      rating: 5,
      featured: true,
    },
    {
      quote: 'The documentation is excellent and the TypeScript support makes development a breeze.',
      name: 'Olivia Martinez',
      title: 'Full Stack Developer',
      company: 'SaaS Company',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      rating: 5,
    },
    {
      quote: 'Finally, a design system that just works. No fighting with CSS or worrying about browser compatibility.',
      name: 'David Park',
      title: 'Frontend Engineer',
      company: 'E-commerce Platform',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      rating: 5,
    },
  ]

  // CTA features
  const ctaFeatures = [
    { icon: Zap, text: 'Lightning fast' },
    { icon: Shield, text: 'Secure by default' },
    { icon: Rocket, text: 'Easy to deploy' },
  ]

  // FAQ data
  const faqs = [
    {
      question: 'What is the MM Design System?',
      answer: 'The MM Design System is a comprehensive collection of reusable components, design tokens, and patterns that help teams build consistent, accessible, and beautiful user interfaces quickly.',
    },
    {
      question: 'Is it free to use?',
      answer: 'Yes! The MM Design System is completely free and open source. You can use it in personal and commercial projects without any restrictions.',
    },
    {
      question: 'Does it support dark mode?',
      answer: 'Absolutely! Dark mode support is built-in and automatic. All components seamlessly adapt to light and dark themes using our design token system.',
    },
    {
      question: 'Can I customize the components?',
      answer: 'Yes, all components are fully customizable. You can modify design tokens, extend component functionality, or create your own variants while maintaining consistency.',
    },
    {
      question: 'What frameworks are supported?',
      answer: 'Currently, the MM Design System is built with React and Next.js, with full TypeScript support. We\'re exploring support for other frameworks in the future.',
    },
  ]

  const faqCategories = [
    {
      category: 'Getting Started',
      items: [
        {
          question: 'How do I install the design system?',
          answer: 'Simply clone the repository and run npm install. Full installation instructions are available in our documentation.',
        },
        {
          question: 'What are the system requirements?',
          answer: 'You\'ll need Node.js 18+ and npm or yarn. The design system works with Next.js 14+ and React 18+.',
        },
      ],
    },
    {
      category: 'Customization',
      items: [
        {
          question: 'How do I change the primary color?',
          answer: 'Edit the design tokens in globals.css. Update both the @theme layer and @layer base for full support.',
        },
        {
          question: 'Can I use my own fonts?',
          answer: 'Yes! Replace the font imports in your layout file and update the CSS custom properties.',
        },
      ],
    },
  ]

  const faqTabCategories = [
    {
      id: 'general',
      label: 'General',
      faqs: [
        {
          question: 'What makes this design system different?',
          answer: 'Our dual-layer color system, comprehensive TypeScript support, and focus on developer experience set us apart.',
        },
        {
          question: 'Is there a Figma library?',
          answer: 'A Figma library is currently in development and will be released soon.',
        },
      ],
    },
    {
      id: 'technical',
      label: 'Technical',
      faqs: [
        {
          question: 'How does the color system work?',
          answer: 'We use a dual-layer architecture with Tailwind CSS 4 @theme directive and shadcn-compatible @layer base tokens.',
        },
        {
          question: 'Are the components accessible?',
          answer: 'Yes, all components follow WCAG 2.1 guidelines and include proper ARIA labels and keyboard navigation.',
        },
      ],
    },
    {
      id: 'support',
      label: 'Support',
      faqs: [
        {
          question: 'Where can I get help?',
          answer: 'Check our documentation, GitHub issues, or join our community Discord for support.',
        },
        {
          question: 'How do I report bugs?',
          answer: 'Open an issue on our GitHub repository with a detailed description and reproduction steps.',
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Home
            </Link>
            <h1 className="text-2xl font-heading">Engagement Sections</h1>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Page Header */}
      <section className="py-20 px-4 text-center bg-accent/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-heading mb-6">
            Tier 2: Engagement Sections
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Build trust and drive conversions with testimonials, CTAs, FAQs, and newsletter signup components
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span>12 Components</span>
            <span>•</span>
            <span>4 Categories</span>
            <span>•</span>
            <span>Fully Responsive</span>
            <span>•</span>
            <span>Dark Mode Ready</span>
          </div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-8 px-4 bg-muted/30 sticky top-[73px] z-40 border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-6 justify-center text-sm">
            <a href="#testimonials" className="hover:text-primary transition-colors">Testimonials (3)</a>
            <a href="#ctas" className="hover:text-primary transition-colors">Call-to-Actions (3)</a>
            <a href="#faqs" className="hover:text-primary transition-colors">FAQs (3)</a>
            <a href="#newsletters" className="hover:text-primary transition-colors">Newsletters (3)</a>
          </div>
        </div>
      </section>

      {/* Testimonial Sections */}
      <div id="testimonials" className="border-b border-border">
        <div className="py-12 px-4 bg-accent/30">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-heading mb-2">Testimonials</h3>
            <p className="text-muted-foreground">Showcase customer feedback and build social proof</p>
          </div>
        </div>

        {/* Testimonial Grid */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">1. Testimonial Grid</h4>
            <p className="text-sm text-muted-foreground mb-4">Grid layout with customer cards</p>
          </div>
          <TestimonialGrid
            title="What Our Customers Say"
            description="Real feedback from real people"
            testimonials={testimonials.slice(0, 3)}
            columns={3}
          />
        </div>

        {/* Testimonial Carousel */}
        <div className="bg-muted">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">2. Testimonial Carousel</h4>
            <p className="text-sm text-muted-foreground mb-4">Auto-rotating carousel with navigation</p>
          </div>
          <TestimonialCarousel
            title="Customer Stories"
            description="Hear from those who trust us"
            testimonials={testimonials.slice(0, 3)}
            autoAdvance={5000}
          />
        </div>

        {/* Testimonial Wall */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">3. Testimonial Wall</h4>
            <p className="text-sm text-muted-foreground mb-4">Masonry-style testimonial wall</p>
          </div>
          <TestimonialWall
            title="Loved by Thousands"
            description="Join our community of happy customers"
            testimonials={testimonials}
          />
        </div>
      </div>

      {/* CTA Sections */}
      <div id="ctas" className="border-b border-border">
        <div className="py-12 px-4 bg-accent/30">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-heading mb-2">Call-to-Actions</h3>
            <p className="text-muted-foreground">Drive conversions with compelling CTAs</p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">1. CTA Banner</h4>
            <p className="text-sm text-muted-foreground mb-4">Full-width banner with gradient</p>
          </div>
          <CtaBanner
            headline="Ready to Build Something Amazing?"
            description="Join thousands of developers already using our design system"
            primaryCta="Get Started Free"
            secondaryCta="View Documentation"
            onPrimaryClick={() => handleCTAClick('Get Started')}
            onSecondaryClick={() => handleCTAClick('View Docs')}
            variant="gradient"
          />
        </div>

        {/* CTA Split */}
        <div className="bg-muted">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">2. CTA Split</h4>
            <p className="text-sm text-muted-foreground mb-4">Split layout with features</p>
          </div>
          <CtaSplit
            headline="Ship Faster with Pre-Built Components"
            description="Stop reinventing the wheel. Focus on what makes your product unique."
            features={[
              '50+ production-ready components',
              'Full TypeScript support',
              'Automatic dark mode',
              'Accessibility built-in',
            ]}
            primaryCta="Start Building"
            secondaryCta="See Examples"
            onPrimaryClick={() => handleCTAClick('Start Building')}
            onSecondaryClick={() => handleCTAClick('See Examples')}
            imagePosition="right"
          />
        </div>

        {/* CTA Centered */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">3. CTA Centered</h4>
            <p className="text-sm text-muted-foreground mb-4">Centered with feature highlights</p>
          </div>
          <CtaCentered
            headline="Experience the Difference"
            description="Built by developers, for developers"
            features={ctaFeatures}
            primaryCta="Try It Now"
            secondaryCta="Learn More"
            onPrimaryClick={() => handleCTAClick('Try It')}
            onSecondaryClick={() => handleCTAClick('Learn More')}
            trustIndicators={['No credit card required', 'Free forever', '1000+ happy users']}
          />
        </div>
      </div>

      {/* FAQ Sections */}
      <div id="faqs" className="border-b border-border">
        <div className="py-12 px-4 bg-accent/30">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-heading mb-2">FAQs</h3>
            <p className="text-muted-foreground">Answer common questions and reduce support load</p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">1. FAQ Accordion</h4>
            <p className="text-sm text-muted-foreground mb-4">Classic accordion style</p>
          </div>
          <FaqAccordion
            title="Frequently Asked Questions"
            description="Find answers to common questions"
            faqs={faqs}
            allowMultiple={false}
          />
        </div>

        {/* FAQ Two Column */}
        <div className="bg-muted">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">2. FAQ Two Column</h4>
            <p className="text-sm text-muted-foreground mb-4">Two-column grid layout</p>
          </div>
          <FaqTwoColumn
            title="Questions & Answers"
            description="Everything you need to know"
            categories={faqCategories}
          />
        </div>

        {/* FAQ Tabs */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">3. FAQ Tabs</h4>
            <p className="text-sm text-muted-foreground mb-4">Tabbed categories with accordions</p>
          </div>
          <FaqTabs
            title="Help Center"
            description="Browse questions by category"
            categories={faqTabCategories}
          />
        </div>
      </div>

      {/* Newsletter Sections */}
      <div id="newsletters" className="border-b border-border">
        <div className="py-12 px-4 bg-accent/30">
          <div className="max-w-7xl mx-auto">
            <h3 className="text-3xl font-heading mb-2">Newsletters</h3>
            <p className="text-muted-foreground">Grow your email list with beautiful signup forms</p>
          </div>
        </div>

        {/* Newsletter Inline */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">1. Newsletter Inline</h4>
            <p className="text-sm text-muted-foreground mb-4">Simple inline form</p>
          </div>
          <NewsletterInline
            title="Subscribe to Our Newsletter"
            description="Get the latest updates delivered to your inbox"
            placeholder="Enter your email"
            buttonText="Subscribe"
            showTerms={true}
            onSubmit={handleNewsletterSubmit}
          />
        </div>

        {/* Newsletter Card */}
        <div className="bg-muted">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">2. Newsletter Card</h4>
            <p className="text-sm text-muted-foreground mb-4">Featured card with benefits</p>
          </div>
          <NewsletterCard
            title="Stay in the Loop"
            description="Join thousands of subscribers and get the latest news"
            benefits={['Weekly updates', 'Exclusive content', 'No spam, ever']}
            placeholder="your@email.com"
            buttonText="Subscribe"
            onSubmit={handleNewsletterSubmit}
          />
        </div>

        {/* Newsletter Popup Note */}
        <div className="bg-background">
          <div className="max-w-7xl mx-auto py-8 px-4">
            <h4 className="text-xl font-heading mb-2">3. Newsletter Popup</h4>
            <p className="text-sm text-muted-foreground mb-4">Modal popup (disabled for demo - would auto-show after 3s)</p>
            <div className="p-8 rounded-card border border-border text-center">
              <p className="text-muted-foreground">
                The Newsletter Popup component is available but not shown here to avoid interrupting navigation.
                It can be configured to auto-show after a delay.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <section className="py-12 px-4 text-center bg-accent/50">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-heading mb-4">Ready to Use These Components?</h3>
          <p className="text-muted-foreground mb-8">
            All components are production-ready with full TypeScript support and dark mode
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sections"
              className="btn-mm px-8 py-4"
            >
              View Tier 1 Sections
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-mm border border-border hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
