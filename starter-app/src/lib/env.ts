import { z } from 'zod'

// Environment-aware schema (different requirements for dev vs prod)
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_APP_URL: z.string().url(),

  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url()
    .regex(/^https:\/\/[a-z0-9-]+\.supabase\.co$/, 'Invalid Supabase URL format'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .regex(
      /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
      'Invalid Supabase anon key format'
    ),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .regex(
      /^eyJ[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+\.[a-zA-Z0-9_-]+$/,
      'Invalid Supabase service role key format'
    )
    .optional(),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .regex(/^pk_(test|live)_[a-zA-Z0-9]+$/, 'Invalid Stripe publishable key format')
    .optional(),
  STRIPE_SECRET_KEY: z
    .string()
    .regex(/^sk_(test|live)_[a-zA-Z0-9]+$/, 'Invalid Stripe secret key format')
    .optional(),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .regex(/^whsec_[a-zA-Z0-9]+$/, 'Invalid Stripe webhook secret format')
    .optional(),
  STRIPE_PRICE_ID_BASIC: z.string().optional(),
  STRIPE_PRICE_ID_PRO: z.string().optional(),
  STRIPE_PRICE_ID_ENTERPRISE: z.string().optional(),

  // OpenAI
  OPENAI_API_KEY: z
    .string()
    .regex(/^sk-[a-zA-Z0-9]+$/, 'Invalid OpenAI API key format')
    .optional(),
  OPENAI_EMBEDDING_MODEL: z.string().default('text-embedding-3-small'),
  OPENAI_CHAT_MODEL: z.string().default('gpt-4-turbo-preview'),

  // Email - Transactional (Resend)
  RESEND_API_KEY: z
    .string()
    .regex(/^re_[a-zA-Z0-9]+$/, 'Invalid Resend API key format')
    .optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),

  // Email - Marketing Provider
  EMAIL_PROVIDER: z.enum(['convertkit', 'mailerlite', 'brevo', 'sender']).optional(),
  CONVERTKIT_API_KEY: z.string().optional(),
  CONVERTKIT_API_SECRET: z.string().optional(),
  MAILERLITE_API_KEY: z.string().optional(),
  BREVO_API_KEY: z.string().optional(),
  SENDER_API_KEY: z.string().optional(),

  // Analytics
  NEXT_PUBLIC_VERCEL_ANALYTICS_ID: z.string().optional(),

  // Feature Flags
  NEXT_PUBLIC_ENABLE_RAG: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
  NEXT_PUBLIC_ENABLE_PAYMENTS: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
  NEXT_PUBLIC_ENABLE_EMAIL_MARKETING: z
    .string()
    .transform(val => val === 'true')
    .default('true'),
})

// Production-specific validations
const productionSchema = envSchema.refine(
  data => {
    if (data.NODE_ENV === 'production') {
      return (
        data.SUPABASE_SERVICE_ROLE_KEY &&
        data.STRIPE_SECRET_KEY &&
        data.STRIPE_WEBHOOK_SECRET &&
        data.RESEND_API_KEY
      )
    }
    return true
  },
  {
    message:
      'Production environment requires: SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, and RESEND_API_KEY',
  }
)

// Feature-specific validations
const featureValidationSchema = envSchema.refine(
  data => {
    // If RAG is enabled, require OpenAI key
    if (data.NEXT_PUBLIC_ENABLE_RAG && !data.OPENAI_API_KEY) {
      return false
    }
    // If payments enabled, require Stripe keys
    if (
      data.NEXT_PUBLIC_ENABLE_PAYMENTS &&
      (!data.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || !data.STRIPE_SECRET_KEY)
    ) {
      return false
    }
    // If email marketing enabled, require provider and corresponding key
    if (data.NEXT_PUBLIC_ENABLE_EMAIL_MARKETING) {
      if (!data.EMAIL_PROVIDER) return false
      const providerKeys = {
        convertkit: data.CONVERTKIT_API_KEY,
        mailerlite: data.MAILERLITE_API_KEY,
        brevo: data.BREVO_API_KEY,
        sender: data.SENDER_API_KEY,
      }
      if (!providerKeys[data.EMAIL_PROVIDER]) return false
    }
    return true
  },
  {
    message: 'Feature flags require corresponding API keys to be set',
  }
)

// Parse and validate environment variables
function parseEnv() {
  const parsed = envSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:')
    console.error(JSON.stringify(parsed.error.format(), null, 2))
    throw new Error('Invalid environment variables')
  }

  // Apply production and feature validations
  const productionValidated = productionSchema.safeParse(parsed.data)
  if (!productionValidated.success) {
    console.error('❌ Production validation failed:')
    console.error(productionValidated.error.message)
    if (parsed.data.NODE_ENV === 'production') {
      throw new Error('Production validation failed')
    }
    console.warn('⚠️  Warning: Production requirements not met (development mode)')
  }

  const featureValidated = featureValidationSchema.safeParse(parsed.data)
  if (!featureValidated.success) {
    console.error('❌ Feature validation failed:')
    console.error(featureValidated.error.message)
    console.warn('⚠️  Warning: Some features may not work correctly due to missing API keys')
  }

  return parsed.data
}

// Export validated and typed environment variables
export const env = parseEnv()

// Type export for use throughout the app
export type Env = z.infer<typeof envSchema>
