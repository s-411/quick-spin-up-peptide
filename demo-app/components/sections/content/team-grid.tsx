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
  /** LinkedIn URL */
  linkedin?: string
  /** Twitter URL */
  twitter?: string
  /** GitHub URL */
  github?: string
  /** Email */
  email?: string
}

export interface TeamGridProps {
  /** Section title */
  title?: string
  /** Section description */
  description?: string
  /** Array of team members */
  members: TeamMember[]
  /** Grid columns */
  columns?: 2 | 3 | 4
  /** Show social links */
  showSocial?: boolean
  /** Show bio */
  showBio?: boolean
}

export function TeamGrid({
  title = 'Meet Our Team',
  description = 'The people behind our success',
  members,
  columns = 3,
  showSocial = true,
  showBio = false,
}: TeamGridProps) {
  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  }

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

        {/* Team Grid */}
        <div className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}>
          {members.map((member, index) => (
            <EnhancedCard key={index} className="text-center">
              {/* Photo */}
              <div className="mb-4 flex justify-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name */}
              <h3 className="text-xl font-heading mb-1">{member.name}</h3>

              {/* Title */}
              <p className="text-primary font-semibold mb-3">{member.title}</p>

              {/* Bio */}
              {showBio && member.bio && (
                <p className="text-sm text-muted-foreground mb-4">
                  {member.bio}
                </p>
              )}

              {/* Social Links */}
              {showSocial && (
                <div className="flex justify-center gap-3">
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
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
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
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
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </EnhancedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
