'use client'

import * as React from 'react'
import Image from 'next/image'
import { Heart, ShoppingCart, X } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'
import { type Product } from './product-card'

export interface WishlistGridProps {
  /** Wishlist items */
  items: Product[]
  /** Add to cart callback */
  onAddToCart?: (product: Product) => void
  /** Remove from wishlist callback */
  onRemove?: (productId: string) => void
  /** Product click callback */
  onProductClick?: (product: Product) => void
  /** Grid columns */
  columns?: 2 | 3 | 4
  /** Show empty state */
  showEmptyState?: boolean
}

/**
 * WishlistGrid - Wishlist product grid
 *
 * @example
 * ```tsx
 * <WishlistGrid
 *   items={wishlistItems}
 *   onAddToCart={(product) => addToCart(product)}
 *   onRemove={(id) => removeFromWishlist(id)}
 *   onProductClick={(product) => navigate(`/products/${product.id}`)}
 *   columns={3}
 * />
 * ```
 */
export function WishlistGrid({
  items,
  onAddToCart,
  onRemove,
  onProductClick,
  columns = 3,
  showEmptyState = true,
}: WishlistGridProps) {
  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  if (items.length === 0 && showEmptyState) {
    return (
      <EnhancedCard tilt={false} glowEffect={false} className="text-center py-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted/30 mb-4">
          <Heart className="w-10 h-10 text-muted-foreground/40" />
        </div>
        <h3 className="text-xl font-heading font-semibold mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-muted-foreground">
          Save items you love to your wishlist
        </p>
      </EnhancedCard>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-bold">My Wishlist</h2>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </p>
      </div>

      <div className={`grid gap-6 ${gridColumns[columns]}`}>
        {items.map((product) => (
          <EnhancedCard
            key={product.id}
            tilt={false}
            glowEffect={false}
            className="group cursor-pointer h-full flex flex-col"
            onClick={() => onProductClick?.(product)}
          >
            {/* Image Section */}
            <div className="relative aspect-square overflow-hidden bg-muted/30">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {/* Remove Button */}
              {onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(product.id)
                  }}
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors text-destructive"
                  aria-label="Remove from wishlist"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* Stock Badge */}
              {!product.inStock && (
                <div className="absolute top-3 left-3">
                  <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs font-bold rounded">
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Sale Badge */}
              {product.onSale && product.originalPrice && (
                <div className="absolute bottom-3 left-3">
                  <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex flex-col flex-1">
              {/* Category */}
              {product.category && (
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category}
                </p>
              )}

              {/* Title */}
              <h3 className="font-heading font-semibold text-base mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Price */}
              <div className="mt-auto mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-foreground">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              {product.inStock && onAddToCart && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onAddToCart(product)
                  }}
                  className="btn-mm w-full flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              )}

              {/* Out of Stock Message */}
              {!product.inStock && (
                <div className="w-full py-2 px-4 bg-muted/30 rounded-md text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    Out of Stock
                  </p>
                </div>
              )}
            </div>
          </EnhancedCard>
        ))}
      </div>
    </div>
  )
}
