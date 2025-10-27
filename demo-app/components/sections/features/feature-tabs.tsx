'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LucideIcon } from 'lucide-react'
import Image from 'next/image'

export interface TabFeature {
  id: string
  icon: LucideIcon
  label: string
  title: string
  description: string
  image?: string | React.ReactNode
  features?: string[]
}

export interface FeatureTabsProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of tab features */
  tabs: TabFeature[]
  /** Default active tab */
  defaultTab?: string
}

export function FeatureTabs({
  title = 'Powerful Features',
  description = 'Everything you need in one place',
  tabs,
  defaultTab,
}: FeatureTabsProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue={defaultTab || tabs[0]?.id} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto mb-12" style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}>
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center gap-2"
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              )
            })}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="mt-0">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Content */}
                <div className="space-y-6">
                  <h3 className="text-3xl md:text-4xl font-heading">
                    {tab.title}
                  </h3>

                  <p className="text-lg text-muted-foreground">
                    {tab.description}
                  </p>

                  {/* Optional feature list */}
                  {tab.features && tab.features.length > 0 && (
                    <ul className="space-y-3">
                      {tab.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span className="text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Image */}
                <div>
                  {typeof tab.image === 'string' ? (
                    <div className="relative aspect-video rounded-card overflow-hidden border border-border">
                      <Image
                        src={tab.image}
                        alt={tab.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : tab.image ? (
                    tab.image
                  ) : (
                    // Placeholder
                    <div className="aspect-video rounded-card bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border">
                      <div className="text-center p-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-primary/20 flex items-center justify-center">
                          <tab.icon className="w-8 h-8 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">{tab.label}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
