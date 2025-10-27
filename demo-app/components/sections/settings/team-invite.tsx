'use client'

import { useState } from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Mail, UserPlus, X, AlertCircle } from 'lucide-react'

/**
 * Props for the TeamInvite component
 */
export interface TeamInviteProps {
  /** Callback when invite is submitted */
  onInvite?: (emails: string[], role: string, message?: string) => void
  /** Available roles to assign to invitees */
  roles: Array<{ value: string; label: string }>
  /** Whether the invite operation is in progress */
  isInviting?: boolean
}

/**
 * TeamInvite component allows inviting new team members via email.
 * Supports single or bulk email invitations with role selection.
 */
export function TeamInvite({ onInvite, roles, isInviting = false }: TeamInviteProps) {
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [selectedRole, setSelectedRole] = useState(roles[0]?.value || '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim()

    if (!trimmedEmail) {
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address')
      return
    }

    if (emails.includes(trimmedEmail)) {
      setError('This email is already in the list')
      return
    }

    setEmails([...emails, trimmedEmail])
    setEmailInput('')
    setError('')
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (emails.length === 0) {
      setError('Please add at least one email address')
      return
    }

    if (!selectedRole) {
      setError('Please select a role')
      return
    }

    onInvite?.(emails, selectedRole, message || undefined)
  }

  const handleReset = () => {
    setEmails([])
    setEmailInput('')
    setMessage('')
    setError('')
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">
          Invite Team Members
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Send invitations to join your team
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email-input" className="block text-sm font-medium text-foreground mb-2">
            Email Addresses
          </label>
          <div className="flex gap-2">
            <input
              id="email-input"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter email address"
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isInviting}
              aria-label="Email address input"
            />
            <button
              type="button"
              onClick={handleAddEmail}
              disabled={isInviting}
              className="btn-secondary px-6"
              aria-label="Add email to list"
            >
              Add
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Press Enter or click Add to add multiple emails
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Email List */}
        {emails.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              Inviting {emails.length} {emails.length === 1 ? 'person' : 'people'}
            </p>
            <div className="flex flex-wrap gap-2">
              {emails.map((email) => (
                <div
                  key={email}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm"
                >
                  <Mail className="w-3 h-3" />
                  {email}
                  <button
                    type="button"
                    onClick={() => handleRemoveEmail(email)}
                    disabled={isInviting}
                    className="hover:text-primary"
                    aria-label={`Remove ${email}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Role Selection */}
        <div>
          <label htmlFor="role-select" className="block text-sm font-medium text-foreground mb-2">
            Role
          </label>
          <select
            id="role-select"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={isInviting}
            className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Select role for invitees"
          >
            {roles.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Message */}
        <div>
          <label htmlFor="message-input" className="block text-sm font-medium text-foreground mb-2">
            Custom Message (Optional)
          </label>
          <textarea
            id="message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a personal message to your invitation..."
            rows={4}
            disabled={isInviting}
            className="w-full px-4 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            aria-label="Custom invitation message"
          />
        </div>

        {/* Preview */}
        {emails.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Invitation Preview
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>
                <strong>Recipients:</strong> {emails.length} {emails.length === 1 ? 'person' : 'people'}
              </p>
              <p>
                <strong>Role:</strong> {roles.find(r => r.value === selectedRole)?.label}
              </p>
              {message && (
                <p>
                  <strong>Message:</strong> {message}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isInviting || emails.length === 0}
            className="btn-mm flex items-center gap-2 flex-1"
            aria-label="Send invitations"
          >
            <UserPlus className="w-4 h-4" />
            {isInviting ? 'Sending...' : `Send ${emails.length > 0 ? emails.length : ''} Invitation${emails.length !== 1 ? 's' : ''}`}
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={isInviting}
            className="btn-secondary"
            aria-label="Clear form"
          >
            Clear
          </button>
        </div>
      </form>
    </EnhancedCard>
  )
}
