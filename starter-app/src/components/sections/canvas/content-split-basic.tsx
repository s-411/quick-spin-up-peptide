'use client'

import * as React from 'react'

export interface ContentSplitBasicProps {
  /** Tagline text (appears in primary color) */
  tagline?: string
  /** Heading text */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Learn more link text */
  learnMoreText?: string
  /** Learn more link handler */
  onLearnMoreClick?: () => void
  /** Content layout - determines which content goes left vs right */
  layout?: 'heading-left' | 'heading-right'
}

/**
 * ContentSplitBasic Component
 *
 * Two-column content layout with tagline, heading, body text, and learn more link.
 * Used for content-1 and content-2 layouts.
 *
 * Features:
 * - Configurable left/right layout
 * - Tagline in primary color
 * - Learn more link
 * - Fully responsive (stacks on mobile)
 * - MM Design System styling
 */
export function ContentSplitBasic({
  tagline = 'Brief Catchy Tagline',
  heading = 'This can be a longer heading. Your content goes here. Edit or remove this text inline or in the module Content settings.',
  bodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.\n\nIn write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor\'s magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn\'t missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making.',
  learnMoreText = 'Learn more',
  onLearnMoreClick,
  layout = 'heading-left',
}: ContentSplitBasicProps) {

  const headingColumn = (
    <div className="space-y-4">
      {tagline && (
        <p className="text-primary text-sm md:text-base font-bold uppercase tracking-wide">
          {tagline}
        </p>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading leading-tight text-foreground">
        {heading}
      </h2>
    </div>
  )

  const bodyColumn = (
    <div className="space-y-6">
      <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
        {bodyCopy}
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
  )

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {layout === 'heading-left' ? (
            <>
              {headingColumn}
              {bodyColumn}
            </>
          ) : (
            <>
              {bodyColumn}
              {headingColumn}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
