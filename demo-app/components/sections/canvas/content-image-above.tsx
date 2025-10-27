'use client'

import * as React from 'react'
import { Image as ImageIcon } from 'lucide-react'

export interface ContentImageAboveProps {
  /** Tagline text (appears in primary color) */
  tagline?: string
  /** Heading text */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Show image placeholder */
  showImage?: boolean
  /** Custom image element */
  imageElement?: React.ReactNode
  /** Link text in body (optional) */
  linkText?: string
}

/**
 * ContentImageAbove Component
 *
 * Large image on top, full-width tagline + heading + body below.
 * Used for content-7 layout.
 *
 * Features:
 * - Large image spanning partial width at top
 * - Content below spans full width
 * - Inline link in body text
 * - Fully responsive
 * - MM Design System styling
 */
export function ContentImageAbove({
  tagline = 'Brief Tagline',
  heading = 'A longer header to introduce your website content',
  bodyCopy = 'Full-width paragraphs need more line spacing. We increased the Text line-height in the Design settings. Sentences by are, snapped was luxury. An be most service, in, research various out the as tone just or good has a and is behind their have latest rest her. From horn to and just have caution thin to precipitate, concepts will. The mouse it circles to good even sleeping.\n\nMade, hall frequency, thoroughly, avoided fundamental; Movement twice with the allpowerful create sample link occupied had focus could because nor showed set who rush out indication stopped they analyzed case that I times, one overcome first phase wasn\'t of the sofa writing but any the to the in partiality the with go of people clearly, of where be devious with hard the founding by or the beacon due decisions, pattern. To her tone didn\'t to the drops. Counter. Sitting for that of you star position.',
  showImage = true,
  imageElement,
  linkText = 'sample link',
}: ContentImageAboveProps) {

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8 md:space-y-12">
        {/* Image - Partial Width on Desktop */}
        {showImage && (
          <div className="lg:max-w-md">
            {imageElement || (
              <div className="relative w-full aspect-[4/3] rounded-card bg-muted/50 dark:bg-muted/30 flex items-center justify-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground/40">
                  <div className="w-16 h-16 md:w-20 md:h-20 mb-3 rounded-lg bg-muted/60 dark:bg-muted/40 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.5} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content - Full Width */}
        <div className="space-y-6">
          {tagline && (
            <p className="text-primary text-sm md:text-base font-bold uppercase tracking-wide">
              {tagline}
            </p>
          )}
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading leading-tight text-foreground">
            {heading}
          </h2>
          <div className="text-base text-muted-foreground leading-relaxed space-y-4 max-w-none">
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
    </section>
  )
}
