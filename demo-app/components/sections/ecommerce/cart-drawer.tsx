'use client'

import * as React from 'react'
import Image from 'next/image'
import { X, ShoppingBag, Trash2 } from 'lucide-react'
import { type CartItem } from './shopping-cart'

export interface CartDrawerProps {
  /** Cart items */
  items: CartItem[]
  /** Is drawer open */
  isOpen: boolean
  /** Close drawer callback */
  onClose: () => void
  /** Remove item callback */
  onRemoveItem?: (itemId: string) => void
  /** View cart callback */
  onViewCart?: () => void
  /** Checkout callback */
  onCheckout?: () => void
}

/**
 * CartDrawer - Slide-out cart drawer component
 *
 * @example
 * ```tsx
 * <CartDrawer
 *   items={cartItems}
 *   isOpen={isCartOpen}
 *   onClose={() => setIsCartOpen(false)}
 *   onRemoveItem={(id) => removeItem(id)}
 *   onViewCart={() => navigate('/cart')}
 *   onCheckout={() => navigate('/checkout')}
 * />
 * ```
 */
export function CartDrawer({
  items,
  isOpen,
  onClose,
  onRemoveItem,
  onViewCart,
  onCheckout,
}: CartDrawerProps) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-background shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <ShoppingBag className="w-6 h-6" />
            <h2 className="text-xl font-heading font-bold">
              Cart ({items.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/30 rounded-lg transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
                <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
              </div>
              <h3 className="text-lg font-heading font-semibold mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-muted-foreground">
                Add items to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  {/* Image */}
                  <div className="relative w-20 h-20 flex-shrink-0 bg-muted/30 rounded-lg overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm line-clamp-2 mb-1">
                      {item.name}
                    </h4>
                    {item.variant && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {item.variant}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        <span className="text-muted-foreground">Qty:</span>{' '}
                        <span className="font-medium">{item.quantity}</span>
                      </p>
                      <p className="font-semibold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Remove Button */}
                  {onRemoveItem && (
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="flex-shrink-0 p-2 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border p-6 space-y-4">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-2xl font-bold">${subtotal.toFixed(2)}</span>
            </div>

            {/* Tax & Shipping Notice */}
            <p className="text-xs text-muted-foreground">
              Shipping and taxes calculated at checkout
            </p>

            {/* Actions */}
            <div className="space-y-2">
              {onCheckout && (
                <button onClick={onCheckout} className="btn-mm w-full">
                  Checkout
                </button>
              )}
              {onViewCart && (
                <button onClick={onViewCart} className="btn-secondary w-full">
                  View Cart
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
