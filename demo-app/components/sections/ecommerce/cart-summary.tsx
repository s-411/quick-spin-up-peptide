'use client'

import * as React from 'react'
import { Tag, Truck } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { type CartItem } from './shopping-cart'

export interface CartSummaryProps {
  /** Cart items */
  items: CartItem[]
  /** Show promo code input */
  showPromoCode?: boolean
  /** Apply promo code callback */
  onApplyPromo?: (code: string) => void
  /** Promo discount amount */
  promoDiscount?: number
  /** Promo code applied */
  promoCode?: string
  /** Checkout callback */
  onCheckout?: () => void
  /** Tax rate (0-1) */
  taxRate?: number
  /** Free shipping threshold */
  freeShippingThreshold?: number
  /** Shipping cost */
  shippingCost?: number
}

/**
 * CartSummary - Order summary component with totals
 *
 * @example
 * ```tsx
 * <CartSummary
 *   items={cartItems}
 *   showPromoCode
 *   onApplyPromo={(code) => applyPromo(code)}
 *   promoDiscount={10}
 *   promoCode="SAVE10"
 *   onCheckout={() => navigate('/checkout')}
 *   taxRate={0.1}
 *   freeShippingThreshold={50}
 *   shippingCost={9.99}
 * />
 * ```
 */
export function CartSummary({
  items,
  showPromoCode = false,
  onApplyPromo,
  promoDiscount = 0,
  promoCode,
  onCheckout,
  taxRate = 0.1,
  freeShippingThreshold = 50,
  shippingCost = 9.99,
}: CartSummaryProps) {
  const [promoInput, setPromoInput] = React.useState('')
  const [promoError, setPromoError] = React.useState('')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= freeShippingThreshold ? 0 : shippingCost
  const discount = promoDiscount
  const subtotalAfterDiscount = subtotal - discount
  const tax = subtotalAfterDiscount * taxRate
  const total = subtotalAfterDiscount + tax + shipping

  const handleApplyPromo = () => {
    if (!promoInput.trim()) {
      setPromoError('Please enter a promo code')
      return
    }
    setPromoError('')
    onApplyPromo?.(promoInput)
  }

  const remainingForFreeShipping = freeShippingThreshold - subtotal

  return (
    <EnhancedCard tilt={false} glowEffect={false} className="sticky top-4">
      <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>

      {/* Line Items */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>

        {promoDiscount > 0 && promoCode && (
          <div className="flex items-center justify-between text-sm text-green-600 dark:text-green-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              Promo: {promoCode}
            </span>
            <span className="font-medium">-${promoDiscount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? (
              <span className="text-green-600 dark:text-green-400 font-semibold">
                FREE
              </span>
            ) : (
              `$${shipping.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            Tax ({(taxRate * 100).toFixed(0)}%)
          </span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-border pt-3 flex items-center justify-between">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-2xl">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Free Shipping Banner */}
      {shipping > 0 && remainingForFreeShipping > 0 && (
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-2">
            <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-1">
                Almost there!
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400">
                Add <span className="font-semibold">${remainingForFreeShipping.toFixed(2)}</span> more for free shipping
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Promo Code */}
      {showPromoCode && !promoCode && (
        <div className="mb-6">
          <label className="text-sm font-medium mb-2 block">
            Promo Code
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoInput}
              onChange={(e) => setPromoInput(e.target.value)}
              placeholder="Enter code"
              className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm"
            />
            <button
              onClick={handleApplyPromo}
              className="btn-secondary px-4"
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p className="text-xs text-destructive mt-1">{promoError}</p>
          )}
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          className="btn-mm w-full"
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </button>
      )}

      {/* Security Notice */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Secure checkout powered by Stripe
      </p>
    </EnhancedCard>
  )
}
