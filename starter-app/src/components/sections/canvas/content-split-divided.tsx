'use client'

import * as React from 'react'

export interface ContentSplitDividedProps {
  /** Heading text (optional, for content-3) */
  heading?: string
  /** Body copy text */
  bodyCopy?: string
  /** Learn more link text */
  learnMoreText?: string
  /** Learn more link handler */
  onLearnMoreClick?: () => void
  /** Content layout - determines which content goes left vs right */
  layout?: 'heading-left' | 'body-left'
}

/**
 * ContentSplitDivided Component
 *
 * Two-column content layout with vertical divider between columns.
 * Used for content-3 and content-4 layouts.
 *
 * Features:
 * - Vertical divider line between columns
 * - Configurable left/right layout
 * - Learn more link
 * - Fully responsive (stacks on mobile, divider hidden)
 * - MM Design System styling
 */
export function ContentSplitDivided({
  heading = 'Sample heading to introduce the content',
  bodyCopy = 'Your content goes here. Edit or remove this text inline or in the module Content settings. You can also style every aspect of this content in the module Design settings and even apply custom CSS to this text in the module Advanced settings.\n\nIn write mathematicians frequency, at unmolested made like the muff it or on slight and reposed doctor\'s magnitude, bulk; Little in and or was herself for while could avarice expect, frequency; Really actual looked. All the both wasn\'t missions to the creative home by the in be in a to the then for in look design would government he flatter more time thoughts each of for she slight coordinates review, me in pass will. Would often if in it the should remember eyes of sublime lady the and soon to the postage think turn past in yes, back all decision-making.\n\nComment and chime in sometimes one. Everyone shortcuts. The a with too. Of as quitting months that in found odd more by learn that have far made and choose a synthesizers he any a versus in effectiveness back multi you\'d in of purpose a one me on up and one.',
  learnMoreText = 'Learn more',
  onLearnMoreClick,
  layout = 'heading-left',
}: ContentSplitDividedProps) {

  const headingColumn = heading ? (
    <div className="space-y-6">
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading leading-tight text-foreground">
        {heading}
      </h2>
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
  ) : (
    <div className="flex items-end h-full">
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

  const bodyColumn = (
    <div>
      <p className="text-base text-muted-foreground leading-relaxed whitespace-pre-line">
        {bodyCopy}
      </p>
    </div>
  )

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start relative">
          {/* Vertical divider - hidden on mobile */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-border -ml-px"></div>

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
