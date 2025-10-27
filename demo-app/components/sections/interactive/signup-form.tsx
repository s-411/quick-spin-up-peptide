'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { Progress } from '@/components/ui/progress'
import { Mail, Lock, User, Eye, EyeOff, Check, X } from 'lucide-react'

export interface SignupFormProps {
  /** Form title */
  title?: string
  /** Form description */
  description?: string
  /** Submit callback */
  onSubmit?: (data: SignupFormData) => void | Promise<void>
  /** Require terms acceptance */
  requireTerms?: boolean
}

export interface SignupFormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  acceptTerms: boolean
}

type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong'

/**
 * SignupForm - User registration with password strength indicator
 *
 * @example
 * ```tsx
 * <SignupForm
 *   title="Create Account"
 *   onSubmit={handleSignup}
 *   requireTerms
 * />
 * ```
 */
export function SignupForm({
  title = 'Create Account',
  description = 'Sign up to get started',
  onSubmit,
  requireTerms = true,
}: SignupFormProps) {
  const [formData, setFormData] = React.useState<SignupFormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  })
  const [errors, setErrors] = React.useState<Partial<Record<keyof SignupFormData, string>>>({})
  const [showPassword, setShowPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    let score = 0
    if (password.length >= 8) score++
    if (password.length >= 12) score++
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++
    if (/\d/.test(password)) score++
    if (/[^a-zA-Z0-9]/.test(password)) score++

    if (score <= 1) return 'weak'
    if (score <= 2) return 'fair'
    if (score <= 3) return 'good'
    return 'strong'
  }

  const passwordStrength = formData.password ? calculatePasswordStrength(formData.password) : null

  const getStrengthColor = (strength: PasswordStrength): string => {
    switch (strength) {
      case 'weak':
        return 'bg-destructive'
      case 'fair':
        return 'bg-orange-500'
      case 'good':
        return 'bg-yellow-500'
      case 'strong':
        return 'bg-green-500'
    }
  }

  const getStrengthValue = (strength: PasswordStrength): number => {
    switch (strength) {
      case 'weak':
        return 25
      case 'fair':
        return 50
      case 'good':
        return 75
      case 'strong':
        return 100
    }
  }

  const passwordRequirements = [
    { label: 'At least 8 characters', test: (p: string) => p.length >= 8 },
    { label: 'Contains uppercase & lowercase', test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
    { label: 'Contains a number', test: (p: string) => /\d/.test(p) },
    { label: 'Contains a special character', test: (p: string) => /[^a-zA-Z0-9]/.test(p) },
  ]

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof SignupFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (requireTerms && !formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        console.log('Signup submitted:', { ...formData, password: '[REDACTED]' })
        alert('Account created successfully!')
      }
    } catch (error) {
      console.error('Signup error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <EnhancedCard tilt={false} glowEffect={false}>
      <div className="p-6 border-b border-border">
        <h3 className="text-xl font-heading">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <User className="w-4 h-4 text-muted-foreground" />
            Full Name <span className="text-destructive">*</span>
          </label>
          <Input
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={errors.name ? 'border-destructive' : ''}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            Email <span className="text-destructive">*</span>
          </label>
          <Input
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}

          {/* Password Strength Indicator */}
          {formData.password && passwordStrength && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Password strength:</span>
                <span className={`font-medium capitalize ${getStrengthColor(passwordStrength).replace('bg-', 'text-')}`}>
                  {passwordStrength}
                </span>
              </div>
              <Progress value={getStrengthValue(passwordStrength)} className="h-1.5" />
            </div>
          )}

          {/* Password Requirements */}
          {formData.password && (
            <div className="space-y-1 mt-3">
              {passwordRequirements.map((req, idx) => {
                const met = req.test(formData.password)
                return (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {met ? (
                      <Check className="w-3 h-3 text-green-500" />
                    ) : (
                      <X className="w-3 h-3 text-muted-foreground" />
                    )}
                    <span className={met ? 'text-green-500' : 'text-muted-foreground'}>
                      {req.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
        </div>

        {/* Terms Checkbox */}
        {requireTerms && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <Checkbox
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => handleChange('acceptTerms', checked as boolean)}
                className="mt-0.5"
              />
              <label className="text-sm leading-relaxed">
                I accept the{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.acceptTerms && <p className="text-sm text-destructive">{errors.acceptTerms}</p>}
          </div>
        )}

        {/* Submit Button */}
        <button type="submit" disabled={isSubmitting} className="btn-mm w-full">
          {isSubmitting ? (
            <>
              <span className="animate-spin mr-2">⏳</span>
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a href="#" className="text-primary hover:underline">
            Sign in
          </a>
        </p>
      </form>
    </EnhancedCard>
  )
}
