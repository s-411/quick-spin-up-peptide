'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag } from 'lucide-react'
import { ThemeToggle } from '@/design-system/lib/theme-toggle'
import {
  ProductGrid,
  ProductQuickView,
  ShoppingCart,
  CartDrawer,
  CartSummary,
  CheckoutForm,
  PaymentMethods,
  OrderConfirmation,
  UserProfile,
  OrderHistory,
  WishlistGrid,
  type Product,
  type CartItem,
  type CheckoutFormData,
  type PaymentMethod,
  type UserProfileData,
  type OrderHistoryItem,
  type Order,
} from '@/components/sections'

export default function EcommercePage() {
  // Product data
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: 'Premium Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: 299.99,
      originalPrice: 399.99,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      category: 'Electronics',
      rating: 4.5,
      reviewCount: 128,
      inStock: true,
      onSale: true,
    },
    {
      id: '2',
      name: 'Smart Watch Pro',
      description: 'Advanced fitness tracking and notifications',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      category: 'Wearables',
      rating: 4.8,
      reviewCount: 256,
      inStock: true,
      badge: 'New',
    },
    {
      id: '3',
      name: 'Leather Backpack',
      description: 'Premium leather backpack for everyday use',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
      category: 'Accessories',
      rating: 4.3,
      reviewCount: 89,
      inStock: true,
    },
  ]

  // Cart state
  const [cartItems, setCartItems] = React.useState<CartItem[]>([
    {
      id: '1',
      productId: '1',
      name: 'Premium Wireless Headphones',
      price: 299.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
      variant: 'Black, Standard Size',
    },
  ])

  // Quick view state
  const [quickViewProduct, setQuickViewProduct] = React.useState<Product | null>(null)
  const [isQuickViewOpen, setIsQuickViewOpen] = React.useState(false)

  // Cart drawer state
  const [isCartDrawerOpen, setIsCartDrawerOpen] = React.useState(false)

  // Payment method state
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>('card')

  // Sample user data
  const userData: UserProfileData = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    memberSince: '2023-01-15',
    totalOrders: 12,
    defaultAddress: {
      address1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
  }

  // Sample order history
  const orderHistory: OrderHistoryItem[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-02-15',
      status: 'delivered',
      total: 599.98,
      itemCount: 2,
      previewImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-03-01',
      status: 'shipped',
      total: 399.99,
      itemCount: 1,
      previewImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
      trackingNumber: 'TRK123456',
    },
  ]

  // Sample order confirmation
  const sampleOrder: Order = {
    id: '1',
    orderNumber: 'ORD-2024-123',
    date: new Date().toISOString(),
    items: cartItems,
    subtotal: 299.99,
    tax: 30.00,
    shipping: 0,
    total: 329.99,
    shippingAddress: {
      name: 'John Doe',
      address1: '123 Main Street',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'US',
    },
    email: 'john.doe@example.com',
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  }

  const handleAddToCart = (product: Product, quantity = 1) => {
    const existingItem = cartItems.find((item) => item.productId === product.id)
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      )
    } else {
      setCartItems([
        ...cartItems,
        {
          id: Date.now().toString(),
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
        },
      ])
    }
    alert(`${product.name} added to cart!`)
  }

  const handleUpdateQuantity = (itemId: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === itemId ? { ...item, quantity } : item))
    )
  }

  const handleRemoveItem = (itemId: string) => {
    setCartItems(cartItems.filter((item) => item.id !== itemId))
  }

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product)
    setIsQuickViewOpen(true)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <div className="h-6 w-px bg-border" />
              <h1 className="text-2xl font-heading font-bold">Tier 6: E-commerce Sections</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="relative p-2 hover:bg-muted/30 rounded-lg transition-colors"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-20">
          {/* Section: Product Display */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Product Display</h2>
              <p className="text-muted-foreground">
                Product cards, grids, and quick view modals
              </p>
            </div>

            <ProductGrid
              products={sampleProducts}
              title="Featured Products"
              subtitle="Check out our best sellers"
              onAddToCart={handleAddToCart}
              onAddToWishlist={(product) => alert(`Added ${product.name} to wishlist`)}
              onQuickView={handleQuickView}
              showFilters
              showViewToggle
              columns={3}
            />
          </section>

          {/* Section: Shopping Cart */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Shopping Cart</h2>
              <p className="text-muted-foreground">
                Full cart view with summary and actions
              </p>
            </div>

            <ShoppingCart
              items={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onContinueShopping={() => alert('Continue shopping')}
              onCheckout={() => alert('Proceed to checkout')}
              editable
              showActions
            />
          </section>

          {/* Section: Checkout Flow */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">Checkout Flow</h2>
              <p className="text-muted-foreground">
                Checkout form, payment methods, and order confirmation
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div className="lg:col-span-2">
                <CheckoutForm
                  onSubmit={(data) => console.log('Checkout data:', data)}
                  showSaveAddress
                />
              </div>
              <div className="lg:col-span-1">
                <CartSummary
                  items={cartItems}
                  showPromoCode
                  onApplyPromo={(code) => alert(`Promo code: ${code}`)}
                  onCheckout={() => alert('Checkout')}
                />
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-heading font-semibold mb-4">Payment Methods</h3>
              <PaymentMethods
                selectedMethod={paymentMethod}
                onSelectMethod={setPaymentMethod}
                showCardForm
              />
            </div>

            <div>
              <h3 className="text-xl font-heading font-semibold mb-4">Order Confirmation</h3>
              <OrderConfirmation
                order={sampleOrder}
                onContinueShopping={() => alert('Continue shopping')}
                onViewOrderDetails={() => alert('View order details')}
                onDownloadInvoice={() => alert('Download invoice')}
              />
            </div>
          </section>

          {/* Section: User Profile & Account */}
          <section>
            <div className="mb-8">
              <h2 className="text-3xl font-heading font-bold mb-2">User Profile & Account</h2>
              <p className="text-muted-foreground">
                Profile management, order history, and wishlist
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              <UserProfile
                user={userData}
                onUpdateProfile={(data) => console.log('Update profile:', data)}
                onChangeAvatar={() => alert('Change avatar')}
                editable
              />
              <div>
                <OrderHistory
                  orders={orderHistory}
                  onViewOrder={(id) => alert(`View order ${id}`)}
                  onTrackOrder={(id) => alert(`Track order ${id}`)}
                  onReorder={(id) => alert(`Reorder ${id}`)}
                />
              </div>
            </div>

            <div>
              <h3 className="text-xl font-heading font-semibold mb-4">Wishlist</h3>
              <WishlistGrid
                items={sampleProducts.slice(0, 2)}
                onAddToCart={handleAddToCart}
                onRemove={(id) => alert(`Remove ${id} from wishlist`)}
                onProductClick={(product) => alert(`View product ${product.name}`)}
                columns={3}
              />
            </div>
          </section>

          {/* Summary Stats */}
          <section className="border-t border-border pt-12">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-4xl font-bold mb-2">12</div>
                <div className="text-sm text-muted-foreground">Total Components</div>
              </div>
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-4xl font-bold mb-2">4</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center p-6 rounded-lg bg-muted/30">
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-sm text-muted-foreground">TypeScript Coverage</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        items={cartItems}
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        onRemoveItem={handleRemoveItem}
        onViewCart={() => {
          setIsCartDrawerOpen(false)
          document.querySelector('[data-cart-section]')?.scrollIntoView({ behavior: 'smooth' })
        }}
        onCheckout={() => alert('Checkout')}
      />

      {/* Quick View Modal */}
      <ProductQuickView
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        onAddToCart={handleAddToCart}
        onAddToWishlist={(product) => alert(`Added ${product.name} to wishlist`)}
      />
    </div>
  )
}
