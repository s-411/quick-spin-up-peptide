'use client'

import * as React from 'react'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface CartItem {
  /** Item ID */
  id: string
  /** Product ID */
  productId: string
  /** Product name */
  name: string
  /** Product price */
  price: number
  /** Item quantity */
  quantity: number
  /** Product image */
  image: string
  /** Product variant (size, color, etc.) */
  variant?: string
}

export interface ShoppingCartProps {
  /** Cart items */
  items: CartItem[]
  /** Update quantity callback */
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  /** Remove item callback */
  onRemoveItem?: (itemId: string) => void
  /** Continue shopping callback */
  onContinueShopping?: () => void
  /** Proceed to checkout callback */
  onCheckout?: () => void
  /** Show actions */
  showActions?: boolean
  /** Editable quantities */
  editable?: boolean
}

/**
 * ShoppingCart - Full shopping cart component
 *
 * @example
 * ```tsx
 * <ShoppingCart
 *   items={cartItems}
 *   onUpdateQuantity={(id, qty) => updateQuantity(id, qty)}
 *   onRemoveItem={(id) => removeItem(id)}
 *   onContinueShopping={() => navigate('/products')}
 *   onCheckout={() => navigate('/checkout')}
 *   editable
 *   showActions
 * />
 * ```
 */
export function ShoppingCart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onContinueShopping,
  onCheckout,
  showActions = true,
  editable = true,
}: ShoppingCartProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1 // 10% tax
  const shipping = subtotal > 50 ? 0 : 9.99
  const total = subtotal + tax + shipping

  const handleQuantityChange = (itemId: string, delta: number) => {
    const item = items.find((i) => i.id === itemId)
    if (item && onUpdateQuantity) {
      const newQuantity = Math.max(1, item.quantity + delta)
      onUpdateQuantity(itemId, newQuantity)
    }
  }

  if (items.length === 0) {
    return (
      <EnhancedCard tilt={false} glowEffect={false} className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
          <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2">
          Your cart is empty
        </h3>
        <p className="text-muted-foreground mb-6">
          Add items to your cart to get started
        </p>
        {onContinueShopping && (
          <button onClick={onContinueShopping} className="btn-mm">
            Continue Shopping
          </button>
        )}
      </EnhancedCard>
    )
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-heading font-bold">
            Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
          </h2>
        </div>

        {items.map((item) => (
          <EnhancedCard key={item.id} tilt={false} glowEffect={false}>
            <div className="flex gap-4">
              {/* Image */}
              <div className="relative w-24 h-24 flex-shrink-0 bg-muted/30 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant}</p>
                    )}
                  </div>
                  <p className="font-semibold text-lg whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4">
                  {/* Quantity Controls */}
                  {editable ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, -1)}
                        className="p-1.5 rounded-md border border-border hover:bg-muted/30 transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium w-8 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, 1)}
                        className="p-1.5 rounded-md border border-border hover:bg-muted/30 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  )}

                  {/* Remove Button */}
                  {editable && onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-sm text-destructive hover:text-destructive/80 transition-colors flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                </div>

                {/* Unit Price */}
                <p className="text-xs text-muted-foreground mt-2">
                  ${item.price.toFixed(2)} each
                </p>
              </div>
            </div>
          </EnhancedCard>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <EnhancedCard tilt={false} glowEffect={false}>
          <h3 className="text-xl font-heading font-bold mb-6">Order Summary</h3>

          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tax</span>
              <span className="font-medium">${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="font-semibold text-lg">Total</span>
              <span className="font-bold text-2xl">${total.toFixed(2)}</span>
            </div>
          </div>

          {shipping > 0 && (
            <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-300">
                Add ${(50 - subtotal).toFixed(2)} more for free shipping!
              </p>
            </div>
          )}

          {showActions && (
            <div className="space-y-3">
              {onCheckout && (
                <button onClick={onCheckout} className="btn-mm w-full">
                  Proceed to Checkout
                </button>
              )}
              {onContinueShopping && (
                <button onClick={onContinueShopping} className="btn-secondary w-full">
                  Continue Shopping
                </button>
              )}
            </div>
          )}
        </EnhancedCard>
      </div>
    </div>
  )
}
