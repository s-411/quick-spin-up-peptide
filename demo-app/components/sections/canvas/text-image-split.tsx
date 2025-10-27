'use client'

import * as React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export interface TextImageSplitProps {
  /** Main heading text */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Button text */
  buttonText?: string
  /** Button click handler */
  onButtonClick?: () => void
  /** Show image placeholder */
  showImage?: boolean
  /** Custom image element */
  imageElement?: React.ReactNode
  /** Image position - left or right */
  imagePosition?: 'left' | 'right'
}

/**
 * TextImageSplit Component
 *
 * A layout component with text content and an image/placeholder.
 * Matches the provided screenshot layout but styled with MM Design System.
 *
 * Features:
 * - Configurable layout: text left/right, image left/right
 * - Fully responsive (stacks naturally on mobile - left column on top, right column on bottom)
 * - Light/dark mode support
 * - MM Design System styling (100px button radius, National2Condensed headings, etc.)
 */
export function TextImageSplit({
  heading = 'Heading to introduce your website offer',
  bodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings.',
  buttonText = 'CLICK HERE',
  onButtonClick,
  showImage = true,
  imageElement,
  imagePosition = 'right',
}: TextImageSplitProps) {

  // Text content column
  const textContent = (
    <div className="space-y-6">
      {/* Heading - Using MM Design System font-heading (National2Condensed) */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading leading-tight text-foreground">
        {heading}
      </h2>

      {/* Body Copy - Using MM Design System default font (ESKlarheit) */}
      <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
        {bodyCopy}
      </p>

      {/* CTA Button - Using MM Design System btn-mm class (100px radius, primary color) */}
      <div className="pt-2">
        <button
          className="btn-mm"
          onClick={onButtonClick}
        >
          {buttonText}
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
