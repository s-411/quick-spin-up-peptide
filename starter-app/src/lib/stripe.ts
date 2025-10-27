import Stripe from 'stripe'
import { env } from './env'

// Server-side Stripe client
export function getStripeClient() {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }

  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-11-20.acacia',
    typescript: true,
  })
}

// Price IDs from environment
export const STRIPE_PRICE_IDS = {
  basic: env.STRIPE_PRICE_ID_BASIC || '',
  pro: env.STRIPE_PRICE_ID_PRO || '',
  enterprise: env.STRIPE_PRICE_ID_ENTERPRISE || '',
}

// Helper to get price ID by plan name
export function getPriceId(plan: 'basic' | 'pro' | 'enterprise'): string {
  const priceId = STRIPE_PRICE_IDS[plan]
  if (!priceId) {
    throw new Error(`Price ID not configured for plan: ${plan}`)
  }
  return priceId
}
