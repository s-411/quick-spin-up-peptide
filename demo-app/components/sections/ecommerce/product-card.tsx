'use client'

import * as React from 'react'
import Image from 'next/image'
import { ShoppingCart, Heart, Eye, Star } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export interface Product {
  /** Product ID */
  id: string
  /** Product name */
  name: string
  /** Product description */
  description?: string
  /** Product price */
  price: number
  /** Original price (for sale items) */
  originalPrice?: number
  /** Product image URL */
  image: string
  /** Product category */
  category?: string
  /** Product rating (0-5) */
  rating?: number
  /** Number of reviews */
  reviewCount?: number
  /** Is product in stock */
  inStock?: boolean
  /** Is product on sale */
  onSale?: boolean
  /** Product badge text */
  badge?: string
}

export interface ProductCardProps {
  /** Product data */
  product: Product
  /** Add to cart callback */
  onAddToCart?: (product: Product) => void
  /** Add to wishlist callback */
  onAddToWishlist?: (product: Product) => void
  /** Quick view callback */
  onQuickView?: (product: Product) => void
  /** Product click callback */
  onClick?: (product: Product) => void
  /** Show quick actions on hover */
  showQuickActions?: boolean
  /** Layout variant */
  variant?: 'default' | 'compact' | 'detailed'
}

/**
 * ProductCard - E-commerce product card component
 *
 * @example
 * ```tsx
 * <ProductCard
 *   product={{
 *     id: '1',
 *     name: 'Premium Wireless Headphones',
 *     price: 299.99,
 *     originalPrice: 399.99,
 *     image: '/products/headphones.jpg',
 *     rating: 4.5,
 *     reviewCount: 128,
 *     inStock: true,
 *     onSale: true
 *   }}
 *   onAddToCart={(product) => addToCart(product)}
 *   onAddToWishlist={(product) => addToWishlist(product)}
 *   showQuickActions
 * />
 * ```
 */
export function ProductCard({
  product,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onClick,
  showQuickActions = true,
  variant = 'default',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = React.useState(false)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.(product)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuickView?.(product)
  }

  return (
    <EnhancedCard
      tilt={false}
      glowEffect={false}
      className="group cursor-pointer h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick?.(product)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-muted/30">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.onSale && discount > 0 && (
            <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
              -{discount}%
            </span>
          )}
          {product.badge && (
            <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs font-bold rounded">
              {product.badge}
            </span>
          )}
          {!product.inStock && (
            <span className="inline-block px-2 py-1 bg-muted text-muted-foreground text-xs font-bold rounded">
              Out of Stock
            </span>
          )}
        </div>

        {/* Quick Actions */}
        {showQuickActions && (
          <div
            className={`
              absolute top-3 right-3 flex flex-col gap-2
              transition-opacity duration-200
              ${isHovered ? 'opacity-100' : 'opacity-0'}
            `}
          >
            <button
              onClick={handleWishlist}
              className={`
                p-2 rounded-full bg-background/80 backdrop-blur-sm
                hover:bg-background transition-colors
                ${isWishlisted ? 'text-red-500' : 'text-foreground'}
              `}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                aria-label="Quick view"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Add to Cart - Overlay on Hover */}
        {product.inStock && showQuickActions && (
          <div
            className={`
              absolute bottom-0 left-0 right-0 p-3
              transition-transform duration-200
              ${isHovered ? 'translate-y-0' : 'translate-y-full'}
            `}
          >
            <button
              onClick={handleAddToCart}
              className="btn-mm w-full flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
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

        {/* Description - Detailed variant only */}
        {variant === 'detailed' && product.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating || 0)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-muted-foreground/30'
                  }`}
                />
              ))}
            </div>
            {product.reviewCount !== undefined && (
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="mt-auto flex items-center gap-2">
          <span className="text-lg font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Compact variant - Add to cart button */}
        {variant === 'compact' && product.inStock && !showQuickActions && (
          <button
            onClick={handleAddToCart}
            className="btn-secondary w-full mt-3 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
          </button>
        )}
      </div>
    </EnhancedCard>
  )
}
