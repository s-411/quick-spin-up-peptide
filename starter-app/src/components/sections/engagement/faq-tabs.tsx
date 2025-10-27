'use client'

import * as React from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ChevronDown } from 'lucide-react'

export interface FaqTabCategory {
  /** Category ID */
  id: string
  /** Category label */
  label: string
  /** FAQ items in this category */
  faqs: Array<{
    question: string
    answer: string
  }>
}

export interface FaqTabsProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of FAQ tab categories */
  categories: FaqTabCategory[]
}

export function FaqTabs({
  title = 'Help Center',
  description = 'Browse questions by category',
  categories,
}: FaqTabsProps) {
  const [openIndexes, setOpenIndexes] = React.useState<Record<string, Set<number>>>({})

  const toggleItem = (categoryId: string, index: number) => {
    setOpenIndexes((prev) => {
      const categorySet = new Set(prev[categoryId] || [])
      if (categorySet.has(index)) {
        categorySet.delete(index)
      } else {
        categorySet.add(index)
      }
      return {
        ...prev,
        [categoryId]: categorySet,
      }
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

        {/* Tabs */}
        <Tabs defaultValue={categories[0]?.id} className="w-full">
          {/* Tab List */}
          <TabsList className="mb-8 flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex-1 min-w-[120px]"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Content */}
          {categories.map((category) => {
            const categoryOpenIndexes = openIndexes[category.id] || new Set()

            return (
              <TabsContent key={category.id} value={category.id}>
                <div className="space-y-4">
                  {category.faqs.map((faq, index) => {
                    const isOpen = categoryOpenIndexes.has(index)
                    return (
                      <div
                        key={index}
                        className="border border-border rounded-card overflow-hidden bg-card"
                      >
                        {/* Question Button */}
                        <button
                          onClick={() => toggleItem(category.id, index)}
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
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </section>
  )
}
