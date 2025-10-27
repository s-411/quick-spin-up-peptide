'use client'

import * as React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export interface TextImageSplitWithTaglineProps {
  /** Tagline text (appears above heading in primary color) */
  tagline?: string
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
  /** Show image placeholder */
  showImage?: boolean
  /** Custom image element */
  imageElement?: React.ReactNode
  /** Image position - left or right */
  imagePosition?: 'left' | 'right'
}

/**
 * TextImageSplitWithTagline Component
 *
 * A layout component with tagline, text content, two buttons, and an image/placeholder.
 * Matches hero-3 and hero-4 layouts but styled with MM Design System.
 *
 * Features:
 * - Tagline above heading (in primary color)
 * - Two buttons (primary and secondary)
 * - Configurable layout: text left/right, image left/right
 * - Fully responsive (stacks naturally on mobile)
 * - Light/dark mode support
 * - MM Design System styling
 */
export function TextImageSplitWithTagline({
  tagline = 'Brief Catchy Tagline',
  heading = 'Heading to introduce your website offer',
  bodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings.',
  primaryButtonText = 'CLICK HERE',
  onPrimaryClick,
  secondaryButtonText = 'CLICK HERE',
  onSecondaryClick,
  showImage = true,
  imageElement,
  imagePosition = 'right',
}: TextImageSplitWithTaglineProps) {

  // Text content column
  const textContent = (
    <div className="space-y-6">
      {/* Tagline - Using MM Design System primary color */}
      <p className="text-primary text-sm md:text-base font-bold uppercase tracking-wide">
        {tagline}
      </p>

      {/* Heading - Using MM Design System font-heading (National2Condensed) */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading leading-tight text-foreground">
        {heading}
      </h2>

      {/* Body Copy - Using MM Design System default font (ESKlarheit) */}
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        {bodyCopy}
      </p>

      {/* CTA Buttons - Primary and Secondary */}
      <div className="pt-2 flex flex-wrap gap-4">
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
  )

  // Image placeholder column
  const imageContent = showImage && (
    <div>
      {imageElement || (
        <div className="relative w-full aspect-[4/3] rounded-card bg-muted/50 dark:bg-muted/30 flex items-center justify-center">
          {/* Placeholder Icon */}
          <div className="flex flex-col items-center justify-center text-muted-foreground/40">
            <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-lg bg-muted/60 dark:bg-muted/40 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-muted-foreground/50">Image Placeholder</p>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Render columns in order based on imagePosition */}
          {imagePosition === 'left' ? (
            <>
              {imageContent}
              {textContent}
            </>
          ) : (
            <>
              {textContent}
              {imageContent}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
