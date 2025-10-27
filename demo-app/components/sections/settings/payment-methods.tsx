'use client'

import { EnhancedCard } from '@/components/ui/enhanced-card'
import { CreditCard, Plus, Check, MoreVertical } from 'lucide-react'

/**
 * Represents a payment method
 */
export interface PaymentMethod {
  /** Unique identifier */
  id: string
  /** Payment method type */
  type: 'card' | 'paypal' | 'bank'
  /** Last 4 digits of card number (for cards) */
  last4?: string
  /** Card brand (e.g., "Visa", "Mastercard") */
  brand?: string
  /** Expiry month */
  expiryMonth?: number
  /** Expiry year */
  expiryYear?: number
  /** Whether this is the default payment method */
  isDefault: boolean
}

/**
 * Props for the PaymentMethods component
 */
export interface PaymentMethodsProps {
  /** Array of payment methods */
  methods: PaymentMethod[]
  /** Callback when add method is clicked */
  onAddMethod?: () => void
  /** Callback when setting a method as default */
  onSetDefault?: (id: string) => void
  /** Callback when removing a method */
  onRemoveMethod?: (id: string) => void
}

const cardBrandLogos: Record<string, string> = {
  visa: '💳',
  mastercard: '💳',
  amex: '💳',
  discover: '💳',
}

/**
 * PaymentMethods component displays and manages payment methods.
 * Allows adding, removing, and setting default payment options.
 */
export function PaymentMethods({
  methods,
  onAddMethod,
  onSetDefault,
  onRemoveMethod,
}: PaymentMethodsProps) {
  return (
    <EnhancedCard tilt={false} glowEffect={false} className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            Payment Methods
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your payment options
          </p>
        </div>
        {onAddMethod && (
          <button
            onClick={onAddMethod}
            className="btn-mm flex items-center gap-2"
            aria-label="Add payment method"
          >
            <Plus className="w-4 h-4" />
            Add Method
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {methods.map((method) => (
          <div
            key={method.id}
            className="relative bg-gradient-to-br from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 text-white min-h-[200px] flex flex-col justify-between"
          >
            {/* Card Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{cardBrandLogos[method.brand?.toLowerCase() || 'visa']}</span>
                <span className="text-sm font-semibold uppercase opacity-90">
                  {method.brand || 'Card'}
                </span>
              </div>
              {method.isDefault && (
                <div className="flex items-center gap-1 bg-primary px-2 py-1 rounded-full text-xs font-semibold text-white">
                  <Check className="w-3 h-3" />
                  Default
                </div>
              )}
            </div>

            {/* Card Number */}
            <div className="my-4">
              <div className="flex items-center gap-3 text-xl font-mono tracking-wider">
                <span>••••</span>
                <span>••••</span>
                <span>••••</span>
                <span>{method.last4}</span>
              </div>
            </div>

            {/* Card Footer */}
            <div className="flex items-end justify-between">
              <div>
                {method.expiryMonth && method.expiryYear && (
                  <div className="text-xs opacity-75 mb-1">EXPIRES</div>
                )}
                {method.expiryMonth && method.expiryYear && (
                  <div className="font-semibold">
                    {String(method.expiryMonth).padStart(2, '0')}/{String(method.expiryYear).slice(-2)}
                  </div>
                )}
              </div>
              <button
                className="text-white/80 hover:text-white"
                aria-label="Payment method options"
              >
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Actions (Hidden, shown on hover) */}
            {!method.isDefault && (
              <div className="absolute inset-0 bg-black/80 rounded-xl opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                {onSetDefault && (
                  <button
                    onClick={() => onSetDefault(method.id)}
                    className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    Set as Default
                  </button>
                )}
                {onRemoveMethod && (
                  <button
                    onClick={() => onRemoveMethod(method.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Add New Card Placeholder */}
        {onAddMethod && (
          <button
            onClick={onAddMethod}
            className="border-2 border-dashed border-border rounded-xl p-6 min-h-[200px] flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/10 transition-all group"
            aria-label="Add new payment method"
          >
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-foreground">Add Payment Method</p>
              <p className="text-sm text-muted-foreground mt-1">
                Credit card, debit card, or bank account
              </p>
            </div>
          </button>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 p-4 bg-primary/10 border border-primary rounded-lg">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              Secure Payment Processing
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Your payment information is encrypted and securely stored. We never see your full card details.
            </p>
          </div>
        </div>
      </div>
    </EnhancedCard>
  )
}
