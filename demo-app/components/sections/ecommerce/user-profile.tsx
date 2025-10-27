'use client'

import * as React from 'react'
import { User, Mail, Phone, MapPin, Edit2, Save, X } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface UserProfileData {
  /** User ID */
  id: string
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Email address */
  email: string
  /** Phone number */
  phone?: string
  /** Profile avatar URL */
  avatar?: string
  /** Default shipping address */
  defaultAddress?: {
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  /** Account created date */
  memberSince: string
  /** Total orders */
  totalOrders?: number
}

export interface UserProfileProps {
  /** User profile data */
  user: UserProfileData
  /** Update profile callback */
  onUpdateProfile?: (data: Partial<UserProfileData>) => void
  /** Change avatar callback */
  onChangeAvatar?: () => void
  /** Is editable */
  editable?: boolean
}

/**
 * UserProfile - User profile display and edit component
 *
 * @example
 * ```tsx
 * <UserProfile
 *   user={userData}
 *   onUpdateProfile={(data) => updateProfile(data)}
 *   onChangeAvatar={() => openAvatarUpload()}
 *   editable
 * />
 * ```
 */
export function UserProfile({
  user,
  onUpdateProfile,
  onChangeAvatar,
  editable = true,
}: UserProfileProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [formData, setFormData] = React.useState<Partial<UserProfileData>>({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  })

  const handleSave = () => {
    onUpdateProfile?.(formData)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-muted/30 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.firstName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
            {editable && onChangeAvatar && (
              <button
                onClick={onChangeAvatar}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                aria-label="Change avatar"
              >
                <Edit2 className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <h2 className="text-2xl font-heading font-bold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground">
                  Member since {new Date(user.memberSince).toLocaleDateString()}
                </p>
              </div>
              {editable && !isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit Profile
                </button>
              )}
            </div>

            {user.totalOrders !== undefined && (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                {user.totalOrders} {user.totalOrders === 1 ? 'Order' : 'Orders'}
              </div>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Contact Information */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-heading font-bold">Contact Information</h3>
          {isEditing && (
            <div className="flex items-center gap-2">
              <button onClick={handleCancel} className="btn-secondary flex items-center gap-2">
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button onClick={handleSave} className="btn-mm flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-4 py-2 rounded-md border border-border bg-background"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            {user.phone && (
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </EnhancedCard>

      {/* Default Shipping Address */}
      {user.defaultAddress && (
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-heading font-bold">Default Shipping Address</h3>
          </div>

          <div className="text-sm space-y-1">
            <p className="text-muted-foreground">{user.defaultAddress.address1}</p>
            {user.defaultAddress.address2 && (
              <p className="text-muted-foreground">{user.defaultAddress.address2}</p>
            )}
            <p className="text-muted-foreground">
              {user.defaultAddress.city}, {user.defaultAddress.state} {user.defaultAddress.postalCode}
            </p>
            <p className="text-muted-foreground">{user.defaultAddress.country}</p>
          </div>
        </EnhancedCard>
      )}
    </div>
  )
}
