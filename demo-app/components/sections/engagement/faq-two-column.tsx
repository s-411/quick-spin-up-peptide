'use client'

import * as React from 'react'

export interface FaqCategory {
  /** Category name */
  category: string
  /** Array of Q&A items */
  items: Array<{
    question: string
    answer: string
  }>
}

export interface FaqTwoColumnProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of FAQ categories */
  categories: FaqCategory[]
}

export function FaqTwoColumn({
  title = 'Questions & Answers',
  description = 'Everything you need to know',
  categories,
}: FaqTwoColumnProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {categories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              {/* Category Title */}
              <h3 className="text-2xl font-heading mb-8 pb-4 border-b border-border">
                {category.category}
              </h3>

              {/* Q&A Grid */}
              <div className="grid md:grid-cols-2 gap-8">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-3">
                    {/* Question */}
                    <div className="text-lg font-semibold text-foreground">
                      {item.question}
                    </div>

                    {/* Answer */}
                    <div className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
