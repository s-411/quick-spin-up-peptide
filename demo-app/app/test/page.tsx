'use client'

import * as React from 'react'
import Link from 'next/link'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import { ArrowLeft } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Import Canvas Components
import { HeroCenteredWithMockup } from '@/components/sections/canvas/hero-centered-with-mockup'
import { TextImageSplit } from '@/components/sections/canvas/text-image-split'
import { ContentSplitBasic } from '@/components/sections/canvas/content-split-basic'
import { ContentSplitDivided } from '@/components/sections/canvas/content-split-divided'
import { TextImageSplitWithTagline } from '@/components/sections/canvas/text-image-split-with-tagline'

export default function TestPage() {
  const { toast } = useToast()

  const handleButtonClick = () => {
    toast({
      title: 'Button Clicked!',
      description: 'This is a demo action from the test page.',
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <span className="text-sm text-muted-foreground">•</span>
              <h1 className="text-lg font-heading text-foreground">Test Page</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Stacked Canvas Components - No labels, no dividers */}

      {/* Section 1: hero-5 */}
      <HeroCenteredWithMockup
        logo="canvas"
        heading="A heading to introduce your website offer"
        bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content."
        primaryButtonText="CLICK HERE"
        onPrimaryClick={handleButtonClick}
        secondaryButtonText="CLICK HERE"
        onSecondaryClick={handleButtonClick}
      />

      {/* Section 2: hero-2 */}
      <TextImageSplit
        heading="Heading to introduce your website offer"
        bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings."
        buttonText="CLICK HERE"
        onButtonClick={handleButtonClick}
        imagePosition="left"
      />

      {/* Section 3: content-1 */}
      <ContentSplitBasic
        tagline="Brief Catchy Tagline"
        heading="This can be a longer heading. Your content goes here. Edit or remove this text inline or in the module Content settings."
        bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.

In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor's magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn't missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making."
        learnMoreText="Learn more"
        onLearnMoreClick={handleButtonClick}
        layout="heading-left"
      />

      {/* Section 4: content-3 */}
      <ContentSplitDivided
        heading="Sample heading to introduce the content"
        bodyCopy="Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.

In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor's magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn't missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making.

Comment and chime in sometimes one. Everyone shortcuts. The a with too. Of as quitting months that in found odd more by learn that have far made and choose a synthesizers he any a versus in effectiveness back multi you'd in of purpose a one me on up and one."
        learnMoreText="Learn more"
        onLearnMoreClick={handleButtonClick}
        layout="heading-left"
      />

      {/* Section 5: hero-3 */}
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

      {/* Footer Info */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center space-y-4 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Test Page - Powered by MM Design System
          </div>
          <p className="text-sm text-muted-foreground">
            Clean canvas layouts stacked without labels or dividers.
          </p>
        </div>
      </div>
    </div>
  )
}
