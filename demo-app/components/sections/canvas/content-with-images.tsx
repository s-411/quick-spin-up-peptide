'use client'

import * as React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export interface ContentWithImagesProps {
  /** Tagline text (appears in primary color) */
  tagline?: string
  /** Heading text */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Show image placeholders */
  showImages?: boolean
  /** Custom top image element */
  topImageElement?: React.ReactNode
  /** Custom bottom image element */
  bottomImageElement?: React.ReactNode
  /** Link text in body (optional) */
  linkText?: string
}

/**
 * ContentWithImages Component
 *
 * Two stacked image placeholders on the left, content on the right.
 * Used for content-6 layout.
 *
 * Features:
 * - Two vertically stacked images on left
 * - Tagline, heading, and body on right
 * - Inline link in body text
 * - Fully responsive (images on top when stacked)
 * - MM Design System styling
 */
export function ContentWithImages({
  tagline = 'Brief Tagline',
  heading = 'This can be a longer heading. Your content goes here. Edit or remove this text inline or in the module Content settings.',
  bodyCopy = 'Sentences by are, snapped was luxury. An be most service, in, research various out the as tone just or good has a and is behind their have latest rest her. From horn to and just have caution thin to precipitate, concepts will. The mouse it circles to good even sleeping.\n\nMade, hall frequency, thoroughly, avoided fundamental; Movement twice with the allpowerful create sample link occupied had focus could because nor showed set who rush out indication stopped they analyzed case that I times, one overcome first phase wasn\'t of the sofa writing but any the to the in partiality the with go of people clearly, of where be devious with hard the founding by or the beacon due decisions, pattern. To her tone didn\'t to the drops. Counter. Sitting for that of you star position.',
  showImages = true,
  topImageElement,
  bottomImageElement,
  linkText = 'sample link',
}: ContentWithImagesProps) {

  const renderPlaceholder = () => (
    <div className="relative w-full aspect-[4/3] rounded-card bg-muted/50 dark:bg-muted/30 flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-muted-foreground/40">
        <div className="w-12 h-12 md:w-16 md:h-16 mb-2 rounded-lg bg-muted/60 dark:bg-muted/40 flex items-center justify-center">
          <ImageIcon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Column - Stacked Images */}
          {showImages && (
            <div className="space-y-6">
              {topImageElement || renderPlaceholder()}
              {bottomImageElement || renderPlaceholder()}
            </div>
          )}

          {/* Right Column - Content */}
          <div className="space-y-4">
            {tagline && (
              <p className="text-primary text-sm md:text-base font-bold uppercase tracking-wide">
                {tagline}
              </p>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading leading-tight text-foreground">
              {heading}
            </h2>
            <div className="text-base text-muted-foreground leading-relaxed space-y-4">
              {bodyCopy.split('\n\n').map((paragraph, index) => (
                <p key={index}>
                  {paragraph.includes(linkText) ? (
                    <>
                      {paragraph.split(linkText)[0]}
                      <a href="#" className="text-foreground font-semibold underline hover:text-primary transition-colors">
                        {linkText}
                      </a>
                      {paragraph.split(linkText)[1]}
                    </>
                  ) : (
                    paragraph
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
