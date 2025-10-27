'use client'

import * as React from 'react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { MapPin, Mail, Phone, User } from 'lucide-react'

export interface CheckoutFormData {
  /** Customer email */
  email: string
  /** First name */
  firstName: string
  /** Last name */
  lastName: string
  /** Address line 1 */
  address1: string
  /** Address line 2 */
  address2?: string
  /** City */
  city: string
  /** State/Province */
  state: string
  /** Postal code */
  postalCode: string
  /** Country */
  country: string
  /** Phone number */
  phone: string
  /** Save address for future */
  saveAddress?: boolean
}

export interface CheckoutFormProps {
  /** Form submit callback */
  onSubmit?: (data: CheckoutFormData) => void
  /** Initial form data */
  initialData?: Partial<CheckoutFormData>
  /** Is form submitting */
  isSubmitting?: boolean
  /** Show save address option */
  showSaveAddress?: boolean
}

/**
 * CheckoutForm - Checkout information form
 *
 * @example
 * ```tsx
 * <CheckoutForm
 *   onSubmit={(data) => processCheckout(data)}
 *   initialData={{ email: 'user@example.com' }}
 *   isSubmitting={false}
 *   showSaveAddress
 * />
 * ```
 */
export function CheckoutForm({
  onSubmit,
  initialData,
  isSubmitting = false,
  showSaveAddress = true,
}: CheckoutFormProps) {
  const [formData, setFormData] = React.useState<CheckoutFormData>({
    email: initialData?.email || '',
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    address1: initialData?.address1 || '',
    address2: initialData?.address2 || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    postalCode: initialData?.postalCode || '',
    country: initialData?.country || 'US',
    phone: initialData?.phone || '',
    saveAddress: initialData?.saveAddress || false,
  })

  const [errors, setErrors] = React.useState<Partial<Record<keyof CheckoutFormData, string>>>({})

  const handleChange = (field: keyof CheckoutFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {}

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'

    if (!formData.firstName) newErrors.firstName = 'First name is required'
    if (!formData.lastName) newErrors.lastName = 'Last name is required'
    if (!formData.address1) newErrors.address1 = 'Address is required'
    if (!formData.city) newErrors.city = 'City is required'
    if (!formData.state) newErrors.state = 'State is required'
    if (!formData.postalCode) newErrors.postalCode = 'Postal code is required'
    if (!formData.country) newErrors.country = 'Country is required'
    if (!formData.phone) newErrors.phone = 'Phone is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit?.(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Contact Information */}
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="flex items-center gap-2 mb-6">
            <Mail className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-heading font-bold">Contact Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email Address *
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.email ? 'border-destructive' : 'border-border'
                } bg-background`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2">
                Phone Number *
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.phone ? 'border-destructive' : 'border-border'
                } bg-background`}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <p className="text-xs text-destructive mt-1">{errors.phone}</p>
              )}
            </div>
          </div>
        </EnhancedCard>

        {/* Shipping Information */}
        <EnhancedCard tilt={false} glowEffect={false}>
          <div className="flex items-center gap-2 mb-6">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-heading font-bold">Shipping Address</h3>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                  First Name *
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleChange('firstName', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.firstName ? 'border-destructive' : 'border-border'
                  } bg-background`}
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                  Last Name *
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleChange('lastName', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.lastName ? 'border-destructive' : 'border-border'
                  } bg-background`}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="address1" className="block text-sm font-medium mb-2">
                Address Line 1 *
              </label>
              <input
                id="address1"
                type="text"
                value={formData.address1}
                onChange={(e) => handleChange('address1', e.target.value)}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.address1 ? 'border-destructive' : 'border-border'
                } bg-background`}
                placeholder="123 Main Street"
              />
              {errors.address1 && (
                <p className="text-xs text-destructive mt-1">{errors.address1}</p>
              )}
            </div>

            <div>
              <label htmlFor="address2" className="block text-sm font-medium mb-2">
                Address Line 2 (Optional)
              </label>
              <input
                id="address2"
                type="text"
                value={formData.address2}
                onChange={(e) => handleChange('address2', e.target.value)}
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
                placeholder="Apt, Suite, Unit, etc."
              />
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium mb-2">
                  City *
                </label>
                <input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.city ? 'border-destructive' : 'border-border'
                  } bg-background`}
                  placeholder="New York"
                />
                {errors.city && (
                  <p className="text-xs text-destructive mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium mb-2">
                  State *
                </label>
                <input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.state ? 'border-destructive' : 'border-border'
                  } bg-background`}
                  placeholder="NY"
                />
                {errors.state && (
                  <p className="text-xs text-destructive mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className="block text-sm font-medium mb-2">
                  Postal Code *
                </label>
                <input
                  id="postalCode"
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                  className={`w-full px-4 py-2 rounded-md border ${
                    errors.postalCode ? 'border-destructive' : 'border-border'
                  } bg-background`}
                  placeholder="10001"
                />
                {errors.postalCode && (
                  <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="country" className="block text-sm font-medium mb-2">
                Country *
              </label>
              <select
                id="country"
                value={formData.country}
                onChange={(e) => handleChange('country', e.target.value)}
                className={`w-full px-4 py-2 rounded-md border ${
                  errors.country ? 'border-destructive' : 'border-border'
                } bg-background`}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
              </select>
              {errors.country && (
                <p className="text-xs text-destructive mt-1">{errors.country}</p>
              )}
            </div>

            {showSaveAddress && (
              <div className="flex items-center gap-2">
                <input
                  id="saveAddress"
                  type="checkbox"
                  checked={formData.saveAddress}
                  onChange={(e) => handleChange('saveAddress', e.target.checked)}
                  className="rounded border-border"
                />
                <label htmlFor="saveAddress" className="text-sm">
                  Save this address for future orders
                </label>
              </div>
            )}
          </div>
        </EnhancedCard>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-mm w-full"
        >
          {isSubmitting ? 'Processing...' : 'Continue to Payment'}
        </button>
      </div>
    </form>
  )
}
