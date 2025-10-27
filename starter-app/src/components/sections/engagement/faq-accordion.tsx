'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  /** Question text */
  question: string
  /** Answer text */
  answer: string
}

export interface FaqAccordionProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of FAQ items */
  faqs: FaqItem[]
  /** Allow multiple items open at once */
  allowMultiple?: boolean
}

export function FaqAccordion({
  title = 'Frequently Asked Questions',
  description = 'Find answers to common questions',
  faqs,
  allowMultiple = false,
}: FaqAccordionProps) {
  const [openIndexes, setOpenIndexes] = React.useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    setOpenIndexes((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        if (!allowMultiple) {
          newSet.clear()
        }
        newSet.add(index)
      }
      return newSet
    })
  }

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndexes.has(index)
            return (
              <div
                key={index}
                className="border border-border rounded-card overflow-hidden bg-card"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleItem(index)}
                  className="faq-toggle w-full px-6 py-5 flex items-center justify-between gap-4 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-semibold text-foreground">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all ${
                    isOpen ? 'max-h-[500px]' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
