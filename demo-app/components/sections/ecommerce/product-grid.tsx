'use client'

import * as React from 'react'
import { ProductCard, type Product } from './product-card'
import { SlidersHorizontal, Grid3x3, List } from 'lucide-react'

export interface ProductGridProps {
  /** Array of products to display */
  products: Product[]
  /** Add to cart callback */
  onAddToCart?: (product: Product) => void
  /** Add to wishlist callback */
  onAddToWishlist?: (product: Product) => void
  /** Quick view callback */
  onQuickView?: (product: Product) => void
  /** Product click callback */
  onProductClick?: (product: Product) => void
  /** Show filters */
  showFilters?: boolean
  /** Show view toggle */
  showViewToggle?: boolean
  /** Grid columns */
  columns?: 2 | 3 | 4
  /** Section title */
  title?: string
  /** Section subtitle */
  subtitle?: string
}

/**
 * ProductGrid - Grid layout for displaying multiple products
 *
 * @example
 * ```tsx
 * <ProductGrid
 *   products={products}
 *   title="Featured Products"
 *   subtitle="Discover our best sellers"
 *   onAddToCart={(product) => addToCart(product)}
 *   onAddToWishlist={(product) => addToWishlist(product)}
 *   onQuickView={(product) => showQuickView(product)}
 *   showFilters
 *   showViewToggle
 *   columns={3}
 * />
 * ```
 */
export function ProductGrid({
  products,
  onAddToCart,
  onAddToWishlist,
  onQuickView,
  onProductClick,
  showFilters = false,
  showViewToggle = false,
  columns = 3,
  title,
  subtitle,
}: ProductGridProps) {
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = React.useState('featured')

  const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }

  return (
    <div className="w-full">
      {/* Header */}
      {(title || subtitle || showFilters || showViewToggle) && (
        <div className="mb-8">
          {/* Title & Subtitle */}
          {(title || subtitle) && (
            <div className="mb-6">
              {title && (
                <h2 className="text-3xl font-heading font-bold mb-2">{title}</h2>
              )}
              {subtitle && (
                <p className="text-muted-foreground">{subtitle}</p>
              )}
            </div>
          )}

          {/* Filters & View Toggle */}
          {(showFilters || showViewToggle) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border">
              {/* Filters */}
              {showFilters && (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Sort by:</span>
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 rounded-md border border-border bg-background text-sm"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="newest">Newest</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              )}

              {/* View Toggle */}
              {showViewToggle && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found</p>
        </div>
      ) : (
        <div
          className={`
            grid gap-6
            ${viewMode === 'grid' ? gridColumns[columns] : 'grid-cols-1'}
          `}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
              onQuickView={onQuickView}
              onClick={onProductClick}
              variant={viewMode === 'list' ? 'detailed' : 'default'}
            />
          ))}
        </div>
      )}

      {/* Results Count */}
      {products.length > 0 && (
        <div className="mt-8 text-center text-sm text-muted-foreground">
          Showing {products.length} {products.length === 1 ? 'product' : 'products'}
        </div>
      )}
    </div>
  )
}
