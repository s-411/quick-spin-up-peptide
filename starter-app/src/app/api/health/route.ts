import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { env } from '@/lib/env'

export const dynamic = 'force-dynamic'

interface HealthCheckResult {
  service: string
  status: 'healthy' | 'unhealthy' | 'disabled'
  message?: string
  latency?: number
}

export async function GET() {
  const checks: HealthCheckResult[] = []
  let overallHealthy = true

  // Check Supabase connection
  try {
    const start = Date.now()
    const supabase = createAdminClient()
    const { error } = await supabase.from('user_profiles').select('count').limit(1).single()
    const latency = Date.now() - start

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" which is fine
      throw error
    }

    checks.push({
      service: 'supabase',
      status: 'healthy',
      message: 'Database connection successful',
      latency,
    })
  } catch (error) {
    overallHealthy = false
    checks.push({
      service: 'supabase',
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Database connection failed',
    })
  }

  // Check Stripe (if enabled)
  if (env.NEXT_PUBLIC_ENABLE_PAYMENTS && env.STRIPE_SECRET_KEY) {
    try {
      const start = Date.now()
      const stripe = (await import('stripe')).default
      const stripeClient = new stripe(env.STRIPE_SECRET_KEY, {
        apiVersion: '2024-11-20.acacia',
      })
      await stripeClient.products.list({ limit: 1 })
      const latency = Date.now() - start

      checks.push({
        service: 'stripe',
        status: 'healthy',
        message: 'Stripe API connection successful',
        latency,
      })
    } catch (error) {
      overallHealthy = false
      checks.push({
        service: 'stripe',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Stripe connection failed',
      })
    }
  } else {
    checks.push({
      service: 'stripe',
      status: 'disabled',
      message: 'Payments feature disabled',
    })
  }

  // Check OpenAI (if RAG enabled)
  if (env.NEXT_PUBLIC_ENABLE_RAG && env.OPENAI_API_KEY) {
    try {
      const start = Date.now()
      const openai = (await import('openai')).default
      const client = new openai({ apiKey: env.OPENAI_API_KEY })
      await client.models.list()
      const latency = Date.now() - start

      checks.push({
        service: 'openai',
        status: 'healthy',
        message: 'OpenAI API connection successful',
        latency,
      })
    } catch (error) {
      overallHealthy = false
      checks.push({
        service: 'openai',
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'OpenAI connection failed',
      })
    }
  } else {
    checks.push({
      service: 'openai',
      status: 'disabled',
      message: 'RAG feature disabled',
    })
  }

  // Check Email (Resend)
  if (env.RESEND_API_KEY) {
    checks.push({
      service: 'resend',
      status: 'healthy',
      message: 'Email configuration present (actual sending not tested)',
    })
  } else {
    checks.push({
      service: 'resend',
      status: 'disabled',
      message: 'Transactional email not configured',
    })
  }

  // Check Marketing Email Provider
  if (env.NEXT_PUBLIC_ENABLE_EMAIL_MARKETING && env.EMAIL_PROVIDER) {
    checks.push({
      service: `email_marketing_${env.EMAIL_PROVIDER}`,
      status: 'healthy',
      message: `Marketing email provider ${env.EMAIL_PROVIDER} configured`,
    })
  } else {
    checks.push({
      service: 'email_marketing',
      status: 'disabled',
      message: 'Marketing email disabled',
    })
  }

  return NextResponse.json(
    {
      status: overallHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: overallHealthy ? 200 : 503 }
  )
}
