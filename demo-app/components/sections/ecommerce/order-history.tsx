'use client'

import * as React from 'react'
import Image from 'next/image'
import { Package, Clock, CheckCircle2, XCircle, Truck, ChevronRight } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderHistoryItem {
  /** Order ID */
  id: string
  /** Order number */
  orderNumber: string
  /** Order date */
  date: string
  /** Order status */
  status: OrderStatus
  /** Order total */
  total: number
  /** Number of items */
  itemCount: number
  /** First product image (for preview) */
  previewImage?: string
  /** Tracking number */
  trackingNumber?: string
}

export interface OrderHistoryProps {
  /** Array of orders */
  orders: OrderHistoryItem[]
  /** View order details callback */
  onViewOrder?: (orderId: string) => void
  /** Track order callback */
  onTrackOrder?: (orderId: string) => void
  /** Reorder callback */
  onReorder?: (orderId: string) => void
  /** Show empty state */
  showEmptyState?: boolean
}

/**
 * OrderHistory - Order history list component
 *
 * @example
 * ```tsx
 * <OrderHistory
 *   orders={orderHistory}
 *   onViewOrder={(id) => navigate(`/orders/${id}`)}
 *   onTrackOrder={(id) => navigate(`/tracking/${id}`)}
 *   onReorder={(id) => reorderItems(id)}
 * />
 * ```
 */
export function OrderHistory({
  orders,
  onViewOrder,
  onTrackOrder,
  onReorder,
  showEmptyState = true,
}: OrderHistoryProps) {
  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      pending: {
        label: 'Pending',
        icon: Clock,
        color: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300',
      },
      processing: {
        label: 'Processing',
        icon: Package,
        color: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
      },
      shipped: {
        label: 'Shipped',
        icon: Truck,
        color: 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300',
      },
      delivered: {
        label: 'Delivered',
        icon: CheckCircle2,
        color: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
      },
      cancelled: {
        label: 'Cancelled',
        icon: XCircle,
        color: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
      },
    }
    return configs[status]
  }

  if (orders.length === 0 && showEmptyState) {
    return (
      <EnhancedCard tilt={false} glowEffect={false} className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
          <Package className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2">
          No orders yet
        </h3>
        <p className="text-muted-foreground">
          Your order history will appear here once you make a purchase
        </p>
      </EnhancedCard>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold">Order History</h2>
        <p className="text-sm text-muted-foreground">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>

      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status)
        const StatusIcon = statusConfig.icon

        return (
          <EnhancedCard key={order.id} tilt={false} glowEffect={false}>
            <div className="space-y-4">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-heading font-semibold">
                      Order #{order.orderNumber}
                    </h3>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{new Date(order.date).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>{order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}</span>
                    <span>•</span>
                    <span className="font-semibold text-foreground">
                      ${order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onViewOrder?.(order.id)}
                  className="btn-secondary flex items-center gap-2 whitespace-nowrap"
                >
                  View Details
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Order Content */}
              <div className="flex items-center justify-between">
                {/* Preview Image */}
                {order.previewImage && (
                  <div className="relative w-16 h-16 bg-muted/30 rounded-lg overflow-hidden">
                    <Image
                      src={order.previewImage}
                      alt="Order preview"
                      fill
                      className="object-cover"
                    />
                    {order.itemCount > 1 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          +{order.itemCount - 1}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {order.trackingNumber && order.status === 'shipped' && onTrackOrder && (
                    <button
                      onClick={() => onTrackOrder(order.id)}
                      className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
                    >
                      <Truck className="w-4 h-4" />
                      Track
                    </button>
                  )}
                  {order.status === 'delivered' && onReorder && (
                    <button
                      onClick={() => onReorder(order.id)}
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          </EnhancedCard>
        )
      })}
    </div>
  )
}
