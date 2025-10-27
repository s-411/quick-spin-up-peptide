'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Linkedin, Twitter, Github, Mail } from 'lucide-react'

export interface TeamMember {
  /** Member name */
  name: string
  /** Job title */
  title: string
  /** Bio/description */
  bio?: string
  /** Photo URL */
  photo: string
  /** Skills/specialties */
  skills?: string[]
  /** LinkedIn URL */
  linkedin?: string
  /** Twitter URL */
  twitter?: string
  /** GitHub URL */
  github?: string
  /** Email */
  email?: string
}

export interface TeamCardsProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of team members */
  members: TeamMember[]
  /** Show bio in expanded state */
  showBio?: boolean
  /** Show skills */
  showSkills?: boolean
}

export function TeamCards({
  title = 'Our Team',
  description = 'The talented people driving our mission',
  members,
  showBio = true,
  showSkills = true,
}: TeamCardsProps) {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || description) && (
          <div className="text-center mb-12">
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

        {/* Team Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member, index) => {
            const isExpanded = expandedIndex === index

            return (
              <EnhancedCard
                key={index}
                className="!p-0 overflow-hidden cursor-pointer transition-all"
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
              >
                {/* Photo Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Overlay with Social Links */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent flex items-end p-4">
                    <div className="flex gap-2">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      )}
                      {member.twitter && (
                        <a
                          href={member.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </a>
                      )}
                      {member.github && (
                        <a
                          href={member.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label="GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-8 h-8 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                          aria-label="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Name & Title */}
                  <h3 className="text-xl font-heading mb-1">{member.name}</h3>
                  <p className="text-primary font-semibold mb-3">{member.title}</p>

                  {/* Bio (Expandable) */}
                  {showBio && member.bio && (
                    <div
                      className={`text-sm text-muted-foreground transition-all ${
                        isExpanded ? 'mb-3' : 'line-clamp-2 mb-3'
                      }`}
                    >
                      {member.bio}
                    </div>
                  )}

                  {/* Skills (Visible when expanded) */}
                  {showSkills && member.skills && member.skills.length > 0 && (
                    <div
                      className={`transition-all overflow-hidden ${
                        isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 pt-2">
                        {member.skills.map((skill, skillIndex) => (
                          <span
                            key={skillIndex}
                            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Expand Indicator */}
                  <div className="mt-3 pt-3 border-t border-border text-center text-sm text-muted-foreground">
                    {isExpanded ? 'Click to collapse' : 'Click to expand'}
                  </div>
                </div>
              </EnhancedCard>
            )
          })}
        </div>
      </div>
    </section>
  )
}
