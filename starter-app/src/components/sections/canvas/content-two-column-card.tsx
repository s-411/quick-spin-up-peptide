'use client'

import * as React from 'react'

export interface ContentTwoColumnCardProps {
  /** Tagline text (appears in primary color) */
  tagline?: string
  /** Top body text (full width) */
  topBodyCopy?: string
  /** Left column body text */
  leftBodyCopy?: string
  /** Right column body text */
  rightBodyCopy?: string
  /** Learn more link text */
  learnMoreText?: string
  /** Learn more link handler */
  onLearnMoreClick?: () => void
}

/**
 * ContentTwoColumnCard Component
 *
 * Full-width tagline and body, followed by a card with two-column body text.
 * Used for content-5 layout.
 *
 * Features:
 * - Full-width top section
 * - Card/box with two columns below
 * - Learn more link in right column
 * - Fully responsive (stacks on mobile)
 * - MM Design System styling
 */
export function ContentTwoColumnCard({
  tagline = 'Brief and catchy tagline',
  topBodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.',
  leftBodyCopy = 'In write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor\'s magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn\'t missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will.\n\nWould often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making he any a versus in effectiveness back multi you\'d in of purpose a one me on up and one.\n\nWasn\'t be time to this notch more people privilege time, I of cities my background his bad the create its project will this accuse to the logging emphasis completely be our the out felt wanted up groundtem, because win in records for schemes of lots shown taking coffee shortcuts.',
  rightBodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.\n\nComment and chime in sometimes one. Everyone shortcuts. The a with too. Of as quitting months that in found odd more by learn that have far made and choose a synthesizers.',
  learnMoreText = 'Learn more',
  onLearnMoreClick,
}: ContentTwoColumnCardProps) {

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Section - Full Width */}
        <div className="space-y-4">
          {tagline && (
            <p className="text-primary text-sm md:text-base font-bold uppercase tracking-wide">
              {tagline}
            </p>
          )}
          <p className="text-lg md:text-xl font-heading leading-tight text-foreground">
            {topBodyCopy}
          </p>
        </div>

        {/* Two Column Card */}
        <div className="bg-muted/30 dark:bg-muted/20 rounded-card p-6 md:p-8 lg:p-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column */}
            <div>
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {leftBodyCopy}
              </p>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                {rightBodyCopy}
              </p>
              {learnMoreText && (
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onLearnMoreClick?.()
                  }}
                  className="inline-block text-foreground font-semibold hover:text-primary transition-colors"
                >
                  {learnMoreText}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
