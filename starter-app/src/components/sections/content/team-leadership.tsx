'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Linkedin, Twitter, Mail } from 'lucide-react'

export interface Leader {
  /** Leader name */
  name: string
  /** Job title */
  title: string
  /** Detailed bio */
  bio: string
  /** Photo URL */
  photo: string
  /** Key achievements */
  achievements?: string[]
  /** LinkedIn URL */
  linkedin?: string
  /** Twitter URL */
  twitter?: string
  /** Email */
  email?: string
}

export interface TeamLeadershipProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of leaders */
  leaders: Leader[]
  /** Layout style */
  layout?: 'horizontal' | 'vertical'
}

export function TeamLeadership({
  title = 'Leadership Team',
  description = 'Meet the visionaries guiding our mission',
  leaders,
  layout = 'horizontal',
}: TeamLeadershipProps) {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-16">
            {title && (
              <h2 className="text-3xl md:text-4xl font-heading mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Leaders */}
        <div className="space-y-12">
          {leaders.map((leader, index) => (
            <EnhancedCard
              key={index}
              className="!p-0 overflow-hidden"
            >
              <div className={`grid ${layout === 'horizontal' ? 'md:grid-cols-[300px_1fr]' : 'grid-cols-1'} gap-0`}>
                {/* Photo */}
                <div className={`relative ${layout === 'horizontal' ? 'aspect-[3/4]' : 'aspect-[16/9] md:aspect-[3/1]'} overflow-hidden`}>
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-8 md:p-12">
                  {/* Name & Title */}
                  <h3 className="text-3xl font-heading mb-2">{leader.name}</h3>
                  <p className="text-xl text-primary font-semibold mb-6">{leader.title}</p>

                  {/* Bio */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    {leader.bio}
                  </p>

                  {/* Achievements */}
                  {leader.achievements && leader.achievements.length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-foreground mb-3">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {leader.achievements.map((achievement, achIndex) => (
                          <li
                            key={achIndex}
                            className="flex items-start gap-2 text-sm text-muted-foreground"
                          >
                            <span className="text-primary mt-1">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Social Links */}
                  <div className="flex gap-3">
                    {leader.linkedin && (
                      <a
                        href={leader.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="LinkedIn"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {leader.twitter && (
                      <a
                        href={leader.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Twitter"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {leader.email && (
                      <a
                        href={`mailto:${leader.email}`}
                        className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                        aria-label="Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
