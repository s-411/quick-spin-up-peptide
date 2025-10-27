'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { UserPlus, MoreVertical, Crown, Shield, User, Mail, Calendar, CheckCircle, Clock } from 'lucide-react'

/**
 * Represents a team member in the organization
 */
export interface TeamMember {
  /** Unique identifier for the team member */
  id: string
  /** Full name of the team member */
  name: string
  /** Email address */
  email: string
  /** Avatar image URL (optional) */
  avatar?: string
  /** Role in the organization */
  role: 'owner' | 'admin' | 'member'
  /** Account status */
  status: 'active' | 'pending'
  /** Date when the member joined */
  joinedDate: string
}

/**
 * Props for the TeamMembers component
 */
export interface TeamMembersProps {
  /** Array of team members to display */
  members: TeamMember[]
  /** Callback when add member button is clicked */
  onAddMember?: () => void
  /** Callback when edit member action is triggered */
  onEditMember?: (id: string) => void
  /** Callback when remove member action is triggered */
  onRemoveMember?: (id: string) => void
  /** ID of the current logged-in user */
  currentUserId: string
}

const roleConfig = {
  owner: { icon: Crown, label: 'Owner', color: 'text-primary' },
  admin: { icon: Shield, label: 'Admin', color: 'text-primary' },
  member: { icon: User, label: 'Member', color: 'text-muted-foreground' },
}

/**
 * TeamMembers component displays team members with their roles and status.
 * Allows for adding, editing, and removing team members.
 */
export function TeamMembers({
  members,
  onAddMember,
  onEditMember,
  onRemoveMember,
  currentUserId,
}: TeamMembersProps) {
  const activeMembers = members.filter(m => m.status === 'active')
  const pendingMembers = members.filter(m => m.status === 'pending')

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Team Members
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your team and their roles
          </p>
        </div>
        {onAddMember && (
          <button
            onClick={onAddMember}
            className="btn-mm flex items-center gap-2"
            aria-label="Add new team member"
          >
            <UserPlus className="w-4 h-4" />
            Add Member
          </button>
        )}
      </div>

      {/* Active Members */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-foreground">
          Active Members ({activeMembers.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeMembers.map((member) => {
            const RoleIcon = roleConfig[member.role].icon
            const isCurrentUser = member.id === currentUserId

            return (
              <div
                key={member.id}
                className="relative bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {member.avatar ? (
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {member.name}
                        {isCurrentUser && (
                          <span className="ml-2 text-xs text-muted-foreground">(You)</span>
                        )}
                      </h4>
                      <div className={`flex items-center gap-1 mt-1 ${roleConfig[member.role].color}`}>
                        <RoleIcon className="w-3 h-3" />
                        <span className="text-xs font-medium">
                          {roleConfig[member.role].label}
                        </span>
                      </div>
                    </div>
                  </div>
                  {!isCurrentUser && (onEditMember || onRemoveMember) && (
                    <button
                      className="text-muted-foreground hover:text-foreground"
                      aria-label="Member actions"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Joined {new Date(member.joinedDate).toLocaleDateString()}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-2 text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-xs font-medium">Active</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Pending Invitations */}
      {pendingMembers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Pending Invitations ({pendingMembers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingMembers.map((member) => {
              const RoleIcon = roleConfig[member.role].icon

              return (
                <div
                  key={member.id}
                  className="relative bg-card border border-border rounded-lg p-4 opacity-75"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-semibold">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {member.name}
                        </h4>
                        <div className={`flex items-center gap-1 mt-1 ${roleConfig[member.role].color}`}>
                          <RoleIcon className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {roleConfig[member.role].label}
                          </span>
                        </div>
                      </div>
                    </div>
                    {onRemoveMember && (
                      <button
                        onClick={() => onRemoveMember(member.id)}
                        className="text-muted-foreground hover:text-destructive"
                        aria-label="Cancel invitation"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      {member.email}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-secondary">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs font-medium">Pending</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </EnhancedCard>
  )
}
