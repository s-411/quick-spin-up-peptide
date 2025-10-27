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

export default function CanvasPage() {
  const { toast } = useToast()

  const handleButtonClick = () => {
    toast({
      title: 'Button Clicked!',
      description: 'This is a demo action from the Canvas layout.',
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
            </div>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-heading text-primary">Canvas Layouts</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Custom layout components that match your design mockups exactly, styled with the MM Design System.
            Upload screenshots and we'll recreate them with the proper fonts, colors, and button styles.
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
