'use client'

import * as React from 'react'
import Image from 'next/image'
import { X, ShoppingCart, Heart, Star, Minus, Plus } from 'lucide-react'
import { type Product } from './product-card'

export interface ProductQuickViewProps {
  /** Product data */
  product: Product | null
  /** Is modal open */
  isOpen: boolean
  /** Close callback */
  onClose: () => void
  /** Add to cart callback */
  onAddToCart?: (product: Product, quantity: number) => void
  /** Add to wishlist callback */
  onAddToWishlist?: (product: Product) => void
}

/**
 * ProductQuickView - Modal for quick product preview
 *
 * @example
 * ```tsx
 * <ProductQuickView
 *   product={selectedProduct}
 *   isOpen={isQuickViewOpen}
 *   onClose={() => setIsQuickViewOpen(false)}
 *   onAddToCart={(product, quantity) => addToCart(product, quantity)}
 *   onAddToWishlist={(product) => addToWishlist(product)}
 * />
 * ```
 */
export function ProductQuickView({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onAddToWishlist,
}: ProductQuickViewProps) {
  const [quantity, setQuantity] = React.useState(1)
  const [isWishlisted, setIsWishlisted] = React.useState(false)

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

  if (!isOpen || !product) return null

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    onAddToCart?.(product, quantity)
    onClose()
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    onAddToWishlist?.(product)
  }

  const incrementQuantity = () => setQuantity((q) => q + 1)
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
          {/* Image Section */}
          <div className="relative aspect-square bg-muted/30 rounded-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-cover"
            />

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
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
            </div>
          </div>

          {/* Details Section */}
          <div className="flex flex-col">
            {/* Category */}
            {product.category && (
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                {product.category}
              </p>
            )}

            {/* Title */}
            <h2 className="text-2xl font-heading font-bold mb-4">
              {product.name}
            </h2>

            {/* Rating */}
            {product.rating !== undefined && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating.toFixed(1)}
                </span>
                {product.reviewCount !== undefined && (
                  <span className="text-sm text-muted-foreground">
                    ({product.reviewCount} reviews)
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300 text-sm font-medium rounded">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-muted-foreground mb-6">
                {product.description}
              </p>
            )}

            {/* Stock Status */}
            <div className="mb-6">
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-600 dark:bg-green-400" />
                  <span className="text-sm font-medium">In Stock</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                  <div className="w-2 h-2 rounded-full bg-red-600 dark:bg-red-400" />
                  <span className="text-sm font-medium">Out of Stock</span>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            {product.inStock && (
              <div className="mb-6">
                <label className="text-sm font-medium mb-2 block">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 rounded-md border border-border hover:bg-muted/30 transition-colors"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 rounded-md border border-border hover:bg-muted/30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-auto">
              {product.inStock && (
                <button
                  onClick={handleAddToCart}
                  className="btn-mm flex-1 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              )}
              <button
                onClick={handleWishlist}
                className={`
                  btn-secondary px-4
                  ${isWishlisted ? 'text-red-500' : ''}
                `}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
