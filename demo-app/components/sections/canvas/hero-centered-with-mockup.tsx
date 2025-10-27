'use client'

import * as React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export interface HeroCenteredWithMockupProps {
  /** Logo text or element */
  logo?: string | React.ReactNode
  /** Main heading text */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Primary button text */
  primaryButtonText?: string
  /** Primary button click handler */
  onPrimaryClick?: () => void
  /** Secondary button text */
  secondaryButtonText?: string
  /** Secondary button click handler */
  onSecondaryClick?: () => void
  /** Show browser mockup */
  showMockup?: boolean
  /** Custom mockup element */
  mockupElement?: React.ReactNode
}

/**
 * HeroCenteredWithMockup Component
 *
 * A centered hero layout with logo, heading, text, two buttons, and browser mockup below.
 * Matches hero-5 layout but styled with MM Design System.
 *
 * Features:
 * - Centered content
 * - Logo/brand element at top
 * - Browser mockup/screenshot below content
 * - Two buttons (primary and secondary)
 * - Fully responsive
 * - Light/dark mode support
 * - MM Design System styling
 */
export function HeroCenteredWithMockup({
  logo = 'canvas',
  heading = 'A heading to introduce your website offer',
  bodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content.',
  primaryButtonText = 'CLICK HERE',
  onPrimaryClick,
  secondaryButtonText = 'CLICK HERE',
  onSecondaryClick,
  showMockup = true,
  mockupElement,
}: HeroCenteredWithMockupProps) {

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Centered Content */}
        <div className="text-center space-y-8 mb-12 md:mb-16">
          {/* Logo */}
          <div className="flex justify-center">
            {typeof logo === 'string' ? (
              <div className="px-6 py-3 border-2 border-muted/30 rounded-lg text-muted-foreground/30 text-4xl md:text-5xl font-light">
                {logo}
              </div>
            ) : (
              logo
            )}
          </div>

          {/* Heading - Using MM Design System font-heading (National2Condensed) */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading leading-tight text-foreground max-w-3xl mx-auto">
            {heading}
          </h1>

          {/* Body Copy - Using MM Design System default font (ESKlarheit) */}
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {bodyCopy}
          </p>

          {/* CTA Buttons - Primary and Secondary */}
          <div className="pt-2 flex flex-wrap gap-4 justify-center">
            <button
              className="btn-mm"
              onClick={onPrimaryClick}
            >
              {primaryButtonText}
            </button>
            <button
              className="btn-secondary"
              onClick={onSecondaryClick}
            >
              {secondaryButtonText}
            </button>
          </div>
        </div>

        {/* Browser Mockup */}
        {showMockup && (
          <div>
            {mockupElement || (
              <div className="relative w-full rounded-card bg-muted/50 dark:bg-muted/30 overflow-hidden">
                {/* Browser chrome */}
                <div className="bg-muted/60 dark:bg-muted/40 px-4 py-3 flex items-center gap-2 border-b border-border/50">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/20"></div>
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="h-6 bg-background/50 rounded px-3 flex items-center">
                      <div className="w-full h-2 bg-muted-foreground/10 rounded"></div>
                    </div>
                  </div>
                </div>
                {/* Browser content area */}
                <div className="aspect-[16/9] flex items-center justify-center bg-muted/30 dark:bg-muted/20">
                  <div className="flex flex-col items-center justify-center text-muted-foreground/40">
                    <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-lg bg-muted/60 dark:bg-muted/40 flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm text-muted-foreground/50">Browser Mockup</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
