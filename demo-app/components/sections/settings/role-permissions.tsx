'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Shield, Plus, Edit2, Trash2, Users, Check, X } from 'lucide-react'

/**
 * Represents a permission for a specific resource
 */
export interface Permission {
  /** Resource name (e.g., "Projects", "Settings") */
  resource: string
  /** CRUD actions for the resource */
  actions: {
    /** Can create new instances */
    create: boolean
    /** Can read/view instances */
    read: boolean
    /** Can update existing instances */
    update: boolean
    /** Can delete instances */
    delete: boolean
  }
}

/**
 * Represents a role with its permissions
 */
export interface Role {
  /** Unique identifier for the role */
  id: string
  /** Role name */
  name: string
  /** Role description */
  description: string
  /** Permissions assigned to this role */
  permissions: Permission[]
  /** Number of team members with this role */
  memberCount: number
}

/**
 * Props for the RolePermissions component
 */
export interface RolePermissionsProps {
  /** Array of roles to display */
  roles: Role[]
  /** Callback when creating a new role */
  onCreateRole?: (role: Omit<Role, 'id' | 'memberCount'>) => void
  /** Callback when editing a role */
  onEditRole?: (id: string, role: Partial<Role>) => void
  /** Callback when deleting a role */
  onDeleteRole?: (id: string) => void
}

/**
 * RolePermissions component displays and manages role-based access control.
 * Shows permission matrix for each role and allows CRUD operations.
 */
export function RolePermissions({
  roles,
  onCreateRole,
  onEditRole,
  onDeleteRole,
}: RolePermissionsProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(roles[0]?.id || null)

  const currentRole = roles.find(r => r.id === selectedRole)

  const actionLabels: Array<keyof Permission['actions']> = ['create', 'read', 'update', 'delete']

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Roles & Permissions
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage role-based access control
          </p>
        </div>
        {onCreateRole && (
          <button
            onClick={() => onCreateRole({
              name: 'New Role',
              description: '',
              permissions: [],
            })}
            className="btn-mm flex items-center gap-2"
            aria-label="Create new role"
          >
            <Plus className="w-4 h-4" />
            Create Role
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role List */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Roles ({roles.length})
          </h3>
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className={`w-full text-left p-4 rounded-lg border transition-all ${
                selectedRole === role.id
                  ? 'bg-primary/10 border-primary'
                  : 'bg-card border-border hover:border-primary/50'
              }`}
              aria-label={`Select ${role.name} role`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Shield className={`w-5 h-5 ${
                    selectedRole === role.id ? 'text-primary' : 'text-muted-foreground'
                  }`} />
                  <h4 className="font-semibold text-foreground">
                    {role.name}
                  </h4>
                </div>
                {role.memberCount > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    {role.memberCount}
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {role.description}
              </p>
            </button>
          ))}
        </div>

        {/* Permission Matrix */}
        <div className="lg:col-span-2">
          {currentRole ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">
                  {currentRole.name} Permissions
                </h3>
                <div className="flex gap-2">
                  {onEditRole && (
                    <button
                      onClick={() => onEditRole(currentRole.id, {})}
                      className="btn-secondary p-2"
                      aria-label="Edit role"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteRole && currentRole.memberCount === 0 && (
                    <button
                      onClick={() => onDeleteRole(currentRole.id)}
                      className="btn-secondary p-2 text-destructive hover:text-destructive/90"
                      aria-label="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="text-left p-3 text-sm font-semibold text-foreground border-b border-border">
                        Resource
                      </th>
                      {actionLabels.map((action) => (
                        <th
                          key={action}
                          className="text-center p-3 text-sm font-semibold text-foreground border-b border-border capitalize"
                        >
                          {action}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentRole.permissions.map((permission, index) => (
                      <tr
                        key={permission.resource}
                        className={index % 2 === 0 ? 'bg-card' : 'bg-muted/30'}
                      >
                        <td className="p-3 text-sm font-medium text-foreground border-b border-border">
                          {permission.resource}
                        </td>
                        {actionLabels.map((action) => (
                          <td
                            key={action}
                            className="text-center p-3 border-b border-border"
                          >
                            {permission.actions[action] ? (
                              <div className="flex justify-center">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                  <Check className="w-4 h-4 text-primary" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex justify-center">
                                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                  <X className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Permission Summary */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Permission Summary
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {actionLabels.map((action) => {
                    const count = currentRole.permissions.filter(p => p.actions[action]).length
                    const total = currentRole.permissions.length
                    return (
                      <div key={action} className="text-center">
                        <p className="text-2xl font-bold text-primary">
                          {count}/{total}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {action}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Member Info */}
              {currentRole.memberCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {currentRole.memberCount} team {currentRole.memberCount === 1 ? 'member has' : 'members have'} this role
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>Select a role to view permissions</p>
            </div>
          )}
        </div>
      </div>
    </EnhancedCard>
  )
}
