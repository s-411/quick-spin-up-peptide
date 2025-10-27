'use client'

import * as React from 'react'
import { CreditCard, Smartphone, DollarSign, Check } from 'lucide-react'
import { EnhancedCard } from '@/components/ui/enhanced-card'

export type PaymentMethod = 'card' | 'paypal' | 'apple-pay' | 'google-pay'

export interface PaymentMethodsProps {
  /** Selected payment method */
  selectedMethod?: PaymentMethod
  /** Method selection callback */
  onSelectMethod?: (method: PaymentMethod) => void
  /** Available payment methods */
  availableMethods?: PaymentMethod[]
  /** Show card form */
  showCardForm?: boolean
}

/**
 * PaymentMethods - Payment method selection component
 *
 * @example
 * ```tsx
 * <PaymentMethods
 *   selectedMethod="card"
 *   onSelectMethod={(method) => setPaymentMethod(method)}
 *   availableMethods={['card', 'paypal', 'apple-pay']}
 *   showCardForm
 * />
 * ```
 */
export function PaymentMethods({
  selectedMethod = 'card',
  onSelectMethod,
  availableMethods = ['card', 'paypal', 'apple-pay', 'google-pay'],
  showCardForm = true,
}: PaymentMethodsProps) {
  const [cardData, setCardData] = React.useState({
    number: '',
    name: '',
    expiry: '',
    cvc: '',
  })

  const paymentOptions = [
    {
      id: 'card' as PaymentMethod,
      name: 'Credit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
    },
    {
      id: 'paypal' as PaymentMethod,
      name: 'PayPal',
      icon: DollarSign,
      description: 'Pay with PayPal account',
    },
    {
      id: 'apple-pay' as PaymentMethod,
      name: 'Apple Pay',
      icon: Smartphone,
      description: 'Pay with Apple Pay',
    },
    {
      id: 'google-pay' as PaymentMethod,
      name: 'Google Pay',
      icon: Smartphone,
      description: 'Pay with Google Pay',
    },
  ]

  const filteredOptions = paymentOptions.filter((option) =>
    availableMethods.includes(option.id)
  )

  return (
    <EnhancedCard tilt={false} glowEffect={false}>
      <h3 className="text-lg font-heading font-bold mb-6">Payment Method</h3>

      {/* Payment Method Selection */}
      <div className="space-y-3 mb-6">
        {filteredOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedMethod === option.id

          return (
            <button
              key={option.id}
              onClick={() => onSelectMethod?.(option.id)}
              className={`
                w-full p-4 rounded-lg border-2 transition-all text-left
                ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`
                  w-10 h-10 rounded-full flex items-center justify-center
                  ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted/30'}
                `}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{option.name}</h4>
                    {isSelected && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Credit Card Form */}
      {showCardForm && selectedMethod === 'card' && (
        <div className="space-y-4 pt-6 border-t border-border">
          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium mb-2">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              value={cardData.number}
              onChange={(e) =>
                setCardData({ ...cardData, number: e.target.value })
              }
              placeholder="1234 5678 9012 3456"
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
              maxLength={19}
            />
          </div>

          <div>
            <label htmlFor="cardName" className="block text-sm font-medium mb-2">
              Cardholder Name
            </label>
            <input
              id="cardName"
              type="text"
              value={cardData.name}
              onChange={(e) =>
                setCardData({ ...cardData, name: e.target.value })
              }
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded-md border border-border bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="cardExpiry" className="block text-sm font-medium mb-2">
                Expiry Date
              </label>
              <input
                id="cardExpiry"
                type="text"
                value={cardData.expiry}
                onChange={(e) =>
                  setCardData({ ...cardData, expiry: e.target.value })
                }
                placeholder="MM/YY"
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
                maxLength={5}
              />
            </div>

            <div>
              <label htmlFor="cardCvc" className="block text-sm font-medium mb-2">
                CVC
              </label>
              <input
                id="cardCvc"
                type="text"
                value={cardData.cvc}
                onChange={(e) =>
                  setCardData({ ...cardData, cvc: e.target.value })
                }
                placeholder="123"
                className="w-full px-4 py-2 rounded-md border border-border bg-background"
                maxLength={4}
              />
            </div>
          </div>

          {/* Card Brand Icons */}
          <div className="flex items-center gap-3 pt-2">
            <p className="text-xs text-muted-foreground">Accepted cards:</p>
            <div className="flex items-center gap-2">
              <div className="w-10 h-6 bg-muted/30 rounded flex items-center justify-center text-xs font-semibold">
                VISA
              </div>
              <div className="w-10 h-6 bg-muted/30 rounded flex items-center justify-center text-xs font-semibold">
                MC
              </div>
              <div className="w-10 h-6 bg-muted/30 rounded flex items-center justify-center text-xs font-semibold">
                AMEX
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PayPal Notice */}
      {selectedMethod === 'paypal' && (
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            You will be redirected to PayPal to complete your purchase securely.
          </p>
        </div>
      )}

      {/* Digital Wallet Notice */}
      {(selectedMethod === 'apple-pay' || selectedMethod === 'google-pay') && (
        <div className="pt-6 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Click the button below to complete your purchase with{' '}
            {selectedMethod === 'apple-pay' ? 'Apple Pay' : 'Google Pay'}.
          </p>
        </div>
      )}
    </EnhancedCard>
  )
}
