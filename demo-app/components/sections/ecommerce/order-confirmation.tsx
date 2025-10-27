'use client'

import * as React from 'react'
import Image from 'next/image'
import { CheckCircle2, Package, Truck, Mail, Download, ArrowRight } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { type CartItem } from './shopping-cart'

export interface Order {
  /** Order ID */
  id: string
  /** Order number */
  orderNumber: string
  /** Order date */
  date: string
  /** Order items */
  items: CartItem[]
  /** Subtotal */
  subtotal: number
  /** Tax */
  tax: number
  /** Shipping cost */
  shipping: number
  /** Total */
  total: number
  /** Shipping address */
  shippingAddress: {
    name: string
    address1: string
    address2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  /** Customer email */
  email: string
  /** Estimated delivery date */
  estimatedDelivery?: string
}

export interface OrderConfirmationProps {
  /** Order data */
  order: Order
  /** Continue shopping callback */
  onContinueShopping?: () => void
  /** View order details callback */
  onViewOrderDetails?: () => void
  /** Download invoice callback */
  onDownloadInvoice?: () => void
}

/**
 * OrderConfirmation - Order confirmation success page
 *
 * @example
 * ```tsx
 * <OrderConfirmation
 *   order={orderData}
 *   onContinueShopping={() => navigate('/')}
 *   onViewOrderDetails={() => navigate(`/orders/${orderData.id}`)}
 *   onDownloadInvoice={() => downloadInvoice(orderData.id)}
 * />
 * ```
 */
export function OrderConfirmation({
  order,
  onContinueShopping,
  onViewOrderDetails,
  onDownloadInvoice,
}: OrderConfirmationProps) {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Message */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-500/20 mb-4">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h1 className="text-3xl font-heading font-bold mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {/* Order Number */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-lg">
          <span className="text-sm text-muted-foreground">Order Number:</span>
          <span className="text-lg font-bold">{order.orderNumber}</span>
        </div>
      </div>

      {/* Order Status Steps */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm font-medium text-center">Order Placed</p>
            <p className="text-xs text-muted-foreground text-center">
              {new Date(order.date).toLocaleDateString()}
            </p>
          </div>

          <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />

          {/* Step 2 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Package className="w-6 h-6 text-primary" />
            </div>
            <p className="text-sm font-medium text-center">Processing</p>
            <p className="text-xs text-muted-foreground text-center">1-2 business days</p>
          </div>

          <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />

          {/* Step 3 */}
          <div className="flex flex-col items-center flex-1">
            <div className="w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center mb-2">
              <Truck className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-center">Shipped</p>
            {order.estimatedDelivery && (
              <p className="text-xs text-muted-foreground text-center">
                Est. {new Date(order.estimatedDelivery).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </EnhancedCard>

      {/* Confirmation Email Notice */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Order Confirmation Sent</h3>
            <p className="text-sm text-muted-foreground">
              We've sent a confirmation email to <span className="font-medium">{order.email}</span> with your order details and tracking information.
            </p>
          </div>
        </div>
      </EnhancedCard>

      {/* Order Summary */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <h3 className="text-lg font-heading font-bold mb-6">Order Summary</h3>

        {/* Items */}
        <div className="space-y-4 mb-6">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 flex-shrink-0 bg-muted/30 rounded-lg overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                {item.variant && (
                  <p className="text-xs text-muted-foreground">{item.variant}</p>
                )}
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold whitespace-nowrap">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="space-y-2 pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span>${order.shipping.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="font-semibold text-lg">Total</span>
            <span className="font-bold text-xl">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </EnhancedCard>

      {/* Shipping Address */}
      <EnhancedCard tilt={false} glowEffect={false}>
        <h3 className="text-lg font-heading font-bold mb-4">Shipping Address</h3>
        <div className="text-sm space-y-1">
          <p className="font-medium">{order.shippingAddress.name}</p>
          <p className="text-muted-foreground">{order.shippingAddress.address1}</p>
          {order.shippingAddress.address2 && (
            <p className="text-muted-foreground">{order.shippingAddress.address2}</p>
          )}
          <p className="text-muted-foreground">
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
          <p className="text-muted-foreground">{order.shippingAddress.country}</p>
        </div>
      </EnhancedCard>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {onContinueShopping && (
          <button onClick={onContinueShopping} className="btn-mm flex-1">
            Continue Shopping
          </button>
        )}
        {onViewOrderDetails && (
          <button onClick={onViewOrderDetails} className="btn-secondary flex-1">
            View Order Details
          </button>
        )}
        {onDownloadInvoice && (
          <button onClick={onDownloadInvoice} className="btn-secondary flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Invoice
          </button>
        )}
      </div>
    </div>
  )
}
