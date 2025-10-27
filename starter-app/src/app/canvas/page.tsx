'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { ArrowLeft } from 'lucide-react'
import { TextImageSplit } from '@/components/sections/canvas/text-image-split'
import { TextImageSplitWithTagline } from '@/components/sections/canvas/text-image-split-with-tagline'
import { HeroCenteredWithMockup } from '@/components/sections/canvas/hero-centered-with-mockup'
import { EmailSignupSplit } from '@/components/sections/canvas/email-signup-split'
import { ContentSplitBasic } from '@/components/sections/canvas/content-split-basic'
import { ContentSplitDivided } from '@/components/sections/canvas/content-split-divided'
import { ContentTwoColumnCard } from '@/components/sections/canvas/content-two-column-card'
import { ContentWithImages } from '@/components/sections/canvas/content-with-images'
import { ContentImageAbove } from '@/components/sections/canvas/content-image-above'
import { useToast } from '@/hooks/use-toast'
import { HeroCentered } from '@/components/sections/heroes/hero-centered'
import { HeroGradient } from '@/components/sections/heroes/hero-gradient'
import { HeroMinimal } from '@/components/sections/heroes/hero-minimal'
import { HeroSplit } from '@/components/sections/heroes/hero-split'
import { HeroVideo } from '@/components/sections/heroes/hero-video'
import { FeatureGrid } from '@/components/sections/features/feature-grid'
import { FeatureList } from '@/components/sections/features/feature-list'
import { FeatureAlternating } from '@/components/sections/features/feature-alternating'
import { FeatureTabs } from '@/components/sections/features/feature-tabs'
import { StatsGrid } from '@/components/sections/content/stats-grid'
import { TeamGrid } from '@/components/sections/content/team-grid'
import { CtaCentered } from '@/components/sections/engagement/cta-centered'
import { CtaBanner } from '@/components/sections/engagement/cta-banner'
import { CtaSplit } from '@/components/sections/engagement/cta-split'
import { NewsletterCard } from '@/components/sections/engagement/newsletter-card'
import { NewsletterInline } from '@/components/sections/engagement/newsletter-inline'
import { FaqAccordion } from '@/components/sections/engagement/faq-accordion'
import { FaqTabs } from '@/components/sections/engagement/faq-tabs'
import { FaqTwoColumn } from '@/components/sections/engagement/faq-two-column'
import { ContactForm } from '@/components/sections/interactive/contact-form'
import { PricingCards } from '@/components/sections/pricing/pricing-cards'
import { PricingTable } from '@/components/sections/pricing/pricing-table'
import { PricingToggle } from '@/components/sections/pricing/pricing-toggle'
import { Zap, Sparkles, Rocket, Shield, Users, Globe, CheckCircle, Star, Mail, Phone, MapPin } from 'lucide-react'

export default function CanvasPage() {
  const { toast } = useToast()

  const handleButtonClick = () => {
    toast({
      title: 'Button Clicked!',
      description: 'This is a demo action from the Canvas layout.',
    })
  }

  const sections = [
    { id: 'canvas', label: 'Canvas' },
    { id: 'heroes', label: 'Heroes' },
    { id: 'features', label: 'Features' },
    { id: 'content', label: 'Content' },
    { id: 'cta', label: 'CTA' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'newsletter', label: 'Newsletter' },
    { id: 'faq', label: 'FAQ' },
    { id: 'contact', label: 'Contact' },
    { id: 'pricing', label: 'Pricing' },
  ]

  return (
    <div className="min-h-screen">
      {/* Fixed Header with Navigation */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Back Button */}
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Link>

            {/* Section Navigation */}
            <nav className="flex-1 overflow-x-auto">
              <div className="flex items-center gap-1 md:gap-2 min-w-max">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors whitespace-nowrap"
                  >
                    {section.label}
                  </a>
                ))}
              </div>
            </nav>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading text-primary">Canvas Layouts</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A comprehensive showcase of 50+ section components across all categories: Heroes, Features, Content, Blog, Stats, Teams, CTAs, Testimonials, Newsletter, FAQ, Contact, and Pricing. All styled with the MM Design System.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-t border-border"></div>
      </div>

      {/* Layout Demo Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-12">

          {/* ========== CANVAS SECTION ========== */}
          <div id="canvas" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Canvas Layouts</h2>
              <p className="text-muted-foreground">Original canvas section components</p>
            </div>
          </div>

          {/* Demo 1: hero-1 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-1</h2>
            </div>

            {/* The Component */}
            <TextImageSplit
              heading="Heading to introduce your website offer"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings."
              buttonText="CLICK HERE"
              onButtonClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 2: hero-2 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-2</h2>
            </div>

            {/* The Component */}
            <TextImageSplit
              heading="Heading to introduce your website offer"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings."
              buttonText="CLICK HERE"
              onButtonClick={handleButtonClick}
              imagePosition="left"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 3: hero-3 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-3</h2>
            </div>

            {/* The Component */}
            <TextImageSplitWithTagline
              tagline="Brief Catchy Tagline"
              heading="Heading to introduce your website offer"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings."
              primaryButtonText="CLICK HERE"
              onPrimaryClick={handleButtonClick}
              secondaryButtonText="CLICK HERE"
              onSecondaryClick={handleButtonClick}
              imagePosition="left"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 4: hero-4 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-4</h2>
            </div>

            {/* The Component */}
            <TextImageSplitWithTagline
              tagline="Brief Catchy Tagline"
              heading="Heading to introduce your website offer"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings."
              primaryButtonText="CLICK HERE"
              onPrimaryClick={handleButtonClick}
              secondaryButtonText="CLICK HERE"
              onSecondaryClick={handleButtonClick}
              imagePosition="right"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 5: hero-5 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-5</h2>
            </div>

            {/* The Component */}
            <HeroCenteredWithMockup
              logo="canvas"
              heading="A heading to introduce your website offer"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content."
              primaryButtonText="CLICK HERE"
              onPrimaryClick={handleButtonClick}
              secondaryButtonText="CLICK HERE"
              onSecondaryClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 6: hero-6 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-6</h2>
            </div>

            {/* The Component */}
            <EmailSignupSplit
              heading="A heading to introduce your website offer"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings."
              emailPlaceholder="Email"
              buttonText="SIGN UP"
              onSubmit={(email) => {
                toast({
                  title: 'Signed up!',
                  description: `Email: ${email}`,
                })
              }}
              privacyText="GDPR-compliant, so you can subtly include a link to your"
              privacyLink="Privacy Policy"
              imagePosition="right"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 7: content-1 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-1</h2>
            </div>

            {/* The Component */}
            <ContentSplitBasic
              tagline="Brief Catchy Tagline"
              heading="This can be a longer heading. Your content goes here. Edit or remove this text inline or in the module Content settings."
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.

In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor's magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn't missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making."
              learnMoreText="Learn more"
              onLearnMoreClick={handleButtonClick}
              layout="heading-left"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 8: content-2 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-2</h2>
            </div>

            {/* The Component */}
            <ContentSplitBasic
              tagline="Brief Tagline"
              heading="This can be a longer heading. Your content goes here. Edit or remove this text inline or in the module Content settings."
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.

In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor's magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn't missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making.

Comment and chime in sometimes one. Everyone shortcuts. The a with too. Of as quitting months that in found odd more by learn that have far made and choose a synthesizers he any a versus in effectiveness back multi you'd in of purpose a one me on up and one."
              learnMoreText="Learn more"
              onLearnMoreClick={handleButtonClick}
              layout="heading-right"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 9: content-3 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-3</h2>
            </div>

            {/* The Component */}
            <ContentSplitDivided
              heading="Sample heading to introduce the content"
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.

In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor's magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn't missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making.

Comment and chime in sometimes one. Everyone shortcuts. The a with too. Of as quitting months that in found odd more by learn that have far made and choose a synthesizers he any a versus in effectiveness back multi you'd in of purpose a one me on up and one."
              learnMoreText="Learn more"
              onLearnMoreClick={handleButtonClick}
              layout="heading-left"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 10: content-4 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-4</h2>
            </div>

            {/* The Component */}
            <ContentSplitDivided
              heading=""
              bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.

In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor's magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn't missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making.

Comment and chime in sometimes one. Everyone shortcuts. The a with too. Of as quitting months that in found odd more by learn that have far made and choose a synthesizers he any a versus in effectiveness back multi you'd in of purpose a one me on up and one."
              learnMoreText="Learn more"
              onLearnMoreClick={handleButtonClick}
              layout="body-left"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 11: content-5 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-5</h2>
            </div>

            {/* The Component */}
            <ContentTwoColumnCard
              tagline="Brief and catchy tagline"
              topBodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings."
              onLearnMoreClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 12: content-6 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-6</h2>
            </div>

            {/* The Component */}
            <ContentWithImages
              tagline="Brief Tagline"
              heading="This can be a longer heading. Your content goes here. Edit or remove this text inline or in the module Content settings."
              bodyCopy="Sentences by are, snapped was luxury. An be most service, in, research various out the as tone just or good has a and is behind their have latest rest her. From horn to and just have caution thin to precipitate, concepts will. The mouse it circles to good even sleeping.

Made, hall frequency, thoroughly, avoided fundamental; Movement twice with the allpowerful create sample link occupied had focus could because nor showed set who rush out indication stopped they analyzed case that I times, one overcome first phase wasn't of the sofa writing but any the to the in partiality the with go of people clearly, of where be devious with hard the founding by or the beacon due decisions, pattern. To her tone didn't to the drops. Counter. Sitting for that of you star position."
              linkText="sample link"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 13: content-7 */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">content-7</h2>
            </div>

            {/* The Component */}
            <ContentImageAbove
              tagline="Brief Tagline"
              heading="A longer header to introduce your website content"
              bodyCopy="Full-width paragraphs need more line spacing. We increased the Text line-height in the Design settings. Sentences by are, snapped was luxury. An be most service, in, research various out the as tone just or good has a and is behind their have latest rest her. From horn to and just have caution thin to precipitate, concepts will. The mouse it circles to good even sleeping.

Made, hall frequency, thoroughly, avoided fundamental; Movement twice with the allpowerful create sample link occupied had focus could because nor showed set who rush out indication stopped they analyzed case that I times, one overcome first phase wasn't of the sofa writing but any the to the in partiality the with go of people clearly, of where be devious with hard the founding by or the beacon due decisions, pattern. To her tone didn't to the drops. Counter. Sitting for that of you star position."
              linkText="sample link"
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== HEROES SECTION ========== */}
          <div id="heroes" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Heroes</h2>
              <p className="text-muted-foreground">Full-width hero sections with various layouts</p>
            </div>
          </div>

          {/* Demo 14: hero-centered */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-centered</h2>
            </div>
            <HeroCentered
              onPrimaryClick={handleButtonClick}
              onSecondaryClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 15: hero-gradient */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-gradient</h2>
            </div>
            <HeroGradient
              onPrimaryClick={handleButtonClick}
              onSecondaryClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 16: hero-minimal */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-minimal</h2>
            </div>
            <HeroMinimal
              onPrimaryClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 17: hero-split */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-split</h2>
            </div>
            <HeroSplit
              onPrimaryClick={handleButtonClick}
              onSecondaryClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 18: hero-video */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">hero-video</h2>
            </div>
            <HeroVideo
              onPrimaryClick={handleButtonClick}
              onSecondaryClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== FEATURES SECTION ========== */}
          <div id="features" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Features</h2>
              <p className="text-muted-foreground">Showcase your product features and benefits</p>
            </div>
          </div>

          {/* Demo 19: feature-grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">feature-grid</h2>
            </div>
            <FeatureGrid
              features={[
                { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed and performance' },
                { icon: Shield, title: 'Secure by Default', description: 'Enterprise-grade security built in' },
                { icon: Users, title: 'Team Collaboration', description: 'Work together seamlessly' },
                { icon: Rocket, title: 'Deploy Anywhere', description: 'Cloud, on-premise, or hybrid' },
                { icon: Globe, title: 'Global Scale', description: 'Scale to millions of users' },
                { icon: Sparkles, title: 'Beautiful UI', description: 'Stunning design out of the box' },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 20: feature-list */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">feature-list</h2>
            </div>
            <FeatureList
              features={[
                { icon: CheckCircle, title: 'Easy Setup', description: 'Get started in minutes, not hours' },
                { icon: CheckCircle, title: 'No Code Required', description: 'Visual editor for everyone' },
                { icon: CheckCircle, title: '24/7 Support', description: 'We are here to help anytime' },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 21: feature-alternating */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">feature-alternating</h2>
            </div>
            <FeatureAlternating
              features={[
                { title: 'Lightning Fast Performance', description: 'Built for speed with modern optimization techniques', benefits: ['Optimized rendering', 'Lazy loading', 'Code splitting', 'CDN delivery'] },
                { title: 'Enterprise Security', description: 'Bank-level security protecting your data', benefits: ['End-to-end encryption', 'SOC 2 compliant', 'Regular audits', '24/7 monitoring'] },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 22: feature-tabs */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">feature-tabs</h2>
            </div>
            <FeatureTabs
              tabs={[
                { id: 'design', label: 'Design', icon: Sparkles, title: 'Beautiful Design', description: 'Stunning UI components', features: ['Modern aesthetics', 'Customizable themes', 'Responsive layouts'] },
                { id: 'dev', label: 'Development', icon: Rocket, title: 'Developer Tools', description: 'Everything you need to build', features: ['TypeScript support', 'Hot reload', 'CLI tools'] },
                { id: 'deploy', label: 'Deployment', icon: Globe, title: 'Easy Deployment', description: 'Ship with confidence', features: ['One-click deploy', 'Auto scaling', 'Zero downtime'] },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== CONTENT SECTION ========== */}
          <div id="content" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Blog & Content</h2>
              <p className="text-muted-foreground">Display blog posts, portfolios, and team members</p>
            </div>
          </div>

          {/* Demo 23: blog/content sections - Coming Soon */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">blog-featured, blog-grid, blog-list</h2>
              <p className="text-muted-foreground text-sm">These components require image assets and more complex data structures.</p>
            </div>
            <div className="py-20 px-4">
              <div className="max-w-3xl mx-auto text-center space-y-4">
                <h3 className="text-2xl font-heading">Blog Components Available</h3>
                <p className="text-muted-foreground">BlogFeatured, BlogGrid, and BlogList components are included in your project at [starter-app/src/components/sections/content/](starter-app/src/components/sections/content/)</p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 25: stats-grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">stats-grid</h2>
            </div>
            <StatsGrid
              stats={[
                { value: '10K+', label: 'Active Users' },
                { value: '99.9%', label: 'Uptime' },
                { value: '24/7', label: 'Support' },
                { value: '150+', label: 'Countries' },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 26: team-grid */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">team-grid</h2>
            </div>
            <TeamGrid
              members={[
                { name: 'Sarah Johnson', role: 'CEO & Founder', bio: 'Passionate about building great products' },
                { name: 'Mike Chen', role: 'CTO', bio: 'Tech enthusiast and problem solver' },
                { name: 'Emily Davis', role: 'Head of Design', bio: 'Creating beautiful experiences' },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== CTA SECTION ========== */}
          <div id="cta" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Call to Action</h2>
              <p className="text-muted-foreground">Drive conversions with compelling CTAs</p>
            </div>
          </div>

          {/* Demo 27: cta-centered */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">cta-centered</h2>
            </div>
            <CtaCentered
              headline="Ready to Get Started?"
              description="Join thousands of teams already building with our platform"
              primaryCta="Start Free Trial"
              secondaryCta="Schedule Demo"
              onPrimaryClick={handleButtonClick}
              onSecondaryClick={handleButtonClick}
              trustIndicators={['No credit card required', 'Cancel anytime', '14-day free trial']}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 28: cta-banner */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">cta-banner</h2>
            </div>
            <CtaBanner
              message="Limited Time Offer: Get 50% off annual plans"
              ctaText="Claim Offer"
              onCtaClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 29: cta-split */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">cta-split</h2>
            </div>
            <CtaSplit
              headline="Transform Your Workflow Today"
              description="Everything you need to build modern applications"
              ctaText="Get Started"
              onCtaClick={handleButtonClick}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== TESTIMONIALS SECTION ========== */}
          <div id="testimonials" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Testimonials</h2>
              <p className="text-muted-foreground">Social proof from happy customers - TestimonialGrid, TestimonialCarousel, and TestimonialWall components are available at [starter-app/src/components/sections/engagement/](starter-app/src/components/sections/engagement/)</p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== NEWSLETTER SECTION ========== */}
          <div id="newsletter" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Newsletter</h2>
              <p className="text-muted-foreground">Capture email signups</p>
            </div>
          </div>

          {/* Demo 31: newsletter-card */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">newsletter-card</h2>
            </div>
            <NewsletterCard
              headline="Stay Updated"
              description="Get the latest news and updates delivered to your inbox"
              onSubmit={(email) => {
                toast({
                  title: 'Subscribed!',
                  description: `Email: ${email}`,
                })
              }}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 32: newsletter-inline */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">newsletter-inline</h2>
            </div>
            <NewsletterInline
              placeholder="Enter your email"
              onSubmit={(email) => {
                toast({
                  title: 'Subscribed!',
                  description: `Email: ${email}`,
                })
              }}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== FAQ SECTION ========== */}
          <div id="faq" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">FAQ</h2>
              <p className="text-muted-foreground">Answer common questions</p>
            </div>
          </div>

          {/* Demo 33: faq-accordion */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">faq-accordion</h2>
            </div>
            <FaqAccordion
              faqs={[
                { question: 'How do I get started?', answer: 'Simply sign up for a free account and follow our onboarding guide.' },
                { question: 'What payment methods do you accept?', answer: 'We accept all major credit cards, PayPal, and wire transfers.' },
                { question: 'Can I cancel anytime?', answer: 'Yes, you can cancel your subscription at any time with no penalties.' },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== CONTACT SECTION ========== */}
          <div id="contact" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Contact</h2>
              <p className="text-muted-foreground">Let users reach out</p>
            </div>
          </div>

          {/* Demo 34: contact-form */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">contact-form</h2>
            </div>
            <ContactForm
              onSubmit={(data) => {
                toast({
                  title: 'Message Sent!',
                  description: `We'll get back to you soon.`,
                })
              }}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* ========== PRICING SECTION ========== */}
          <div id="pricing" className="scroll-mt-20">
            <div className="mb-6">
              <h2 className="text-3xl font-heading mb-2 text-primary">Pricing</h2>
              <p className="text-muted-foreground">Show your pricing plans</p>
            </div>
          </div>

          {/* Demo 35: pricing-cards */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">pricing-cards</h2>
            </div>
            <PricingCards
              tiers={[
                { name: 'Starter', price: '$9', period: '/month', description: 'Perfect for getting started', features: ['5 Projects', '10GB Storage', 'Basic Support'], cta: 'Start Free', onCTAClick: handleButtonClick },
                { name: 'Pro', price: '$29', period: '/month', description: 'Best for growing teams', features: ['Unlimited Projects', '100GB Storage', 'Priority Support', 'Advanced Analytics'], cta: 'Get Started', onCTAClick: handleButtonClick, popular: true },
                { name: 'Enterprise', price: '$99', period: '/month', description: 'For large organizations', features: ['Unlimited Everything', 'Dedicated Support', 'Custom Integrations', 'SLA'], cta: 'Contact Sales', onCTAClick: handleButtonClick },
              ]}
            />
          </div>

          {/* Divider */}
          <div className="border-t border-border"></div>

          {/* Demo 36: pricing-toggle */}
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-heading mb-2">pricing-toggle</h2>
            </div>
            <PricingToggle
              plans={[
                { name: 'Basic', monthlyPrice: 10, annualPrice: 100, description: 'Essential features', features: ['Feature 1', 'Feature 2'], cta: 'Choose Plan', onCTAClick: () => handleButtonClick() },
                { name: 'Pro', monthlyPrice: 30, annualPrice: 300, description: 'Advanced features', features: ['Everything in Basic', 'Feature 3', 'Feature 4'], cta: 'Choose Plan', onCTAClick: () => handleButtonClick(), popular: true },
              ]}
            />
          </div>

        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Powered by MM Design System
          </div>
          <p className="text-sm text-muted-foreground">
            All layouts automatically inherit your design system's fonts, colors, spacing, and dark mode support.
          </p>
        </div>
      </div>
    </div>
  )
}
