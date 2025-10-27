#!/usr/bin/env tsx

import { env } from '../lib/env'

interface ValidationResult {
  category: string
  checks: {
    name: string
    status: 'pass' | 'fail' | 'warn'
    message: string
  }[]
}

function checkSetup(): ValidationResult[] {
  const results: ValidationResult[] = []

  // Application configuration
  results.push({
    category: 'Application',
    checks: [
      {
        name: 'NODE_ENV',
        status: env.NODE_ENV ? 'pass' : 'fail',
        message: env.NODE_ENV || 'Not set',
      },
      {
        name: 'NEXT_PUBLIC_APP_URL',
        status: env.NEXT_PUBLIC_APP_URL ? 'pass' : 'fail',
        message: env.NEXT_PUBLIC_APP_URL || 'Not set',
      },
    ],
  })

  // Supabase configuration
  results.push({
    category: 'Supabase (Database & Auth)',
    checks: [
      {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        status: env.NEXT_PUBLIC_SUPABASE_URL ? 'pass' : 'fail',
        message: env.NEXT_PUBLIC_SUPABASE_URL || 'Not set - Required',
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        status: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'pass' : 'fail',
        message: env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set - Required',
      },
      {
        name: 'SUPABASE_SERVICE_ROLE_KEY',
        status: env.SUPABASE_SERVICE_ROLE_KEY ? 'pass' : 'warn',
        message: env.SUPABASE_SERVICE_ROLE_KEY
          ? 'Set'
          : 'Not set - Optional for development, required for production',
      },
    ],
  })

  // Stripe configuration
  const paymentsEnabled = env.NEXT_PUBLIC_ENABLE_PAYMENTS
  results.push({
    category: 'Stripe (Payments)',
    checks: [
      {
        name: 'Feature Enabled',
        status: paymentsEnabled ? 'pass' : 'warn',
        message: paymentsEnabled ? 'Enabled' : 'Disabled',
      },
      {
        name: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        status: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'pass' : paymentsEnabled ? 'fail' : 'warn',
        message: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
          ? 'Set'
          : paymentsEnabled
            ? 'Required when payments enabled'
            : 'Not set',
      },
      {
        name: 'STRIPE_SECRET_KEY',
        status: env.STRIPE_SECRET_KEY ? 'pass' : paymentsEnabled ? 'fail' : 'warn',
        message: env.STRIPE_SECRET_KEY
          ? 'Set'
          : paymentsEnabled
            ? 'Required when payments enabled'
            : 'Not set',
      },
      {
        name: 'STRIPE_WEBHOOK_SECRET',
        status: env.STRIPE_WEBHOOK_SECRET ? 'pass' : 'warn',
        message: env.STRIPE_WEBHOOK_SECRET
          ? 'Set'
          : 'Not set - Run `stripe listen` for development',
      },
    ],
  })

  // OpenAI configuration
  const ragEnabled = env.NEXT_PUBLIC_ENABLE_RAG
  results.push({
    category: 'OpenAI (RAG/AI Features)',
    checks: [
      {
        name: 'Feature Enabled',
        status: ragEnabled ? 'pass' : 'warn',
        message: ragEnabled ? 'Enabled' : 'Disabled',
      },
      {
        name: 'OPENAI_API_KEY',
        status: env.OPENAI_API_KEY ? 'pass' : ragEnabled ? 'fail' : 'warn',
        message: env.OPENAI_API_KEY ? 'Set' : ragEnabled ? 'Required when RAG enabled' : 'Not set',
      },
      {
        name: 'OPENAI_EMBEDDING_MODEL',
        status: 'pass',
        message: env.OPENAI_EMBEDDING_MODEL,
      },
      {
        name: 'OPENAI_CHAT_MODEL',
        status: 'pass',
        message: env.OPENAI_CHAT_MODEL,
      },
    ],
  })

  // Email configuration
  results.push({
    category: 'Email (Transactional - Resend)',
    checks: [
      {
        name: 'RESEND_API_KEY',
        status: env.RESEND_API_KEY ? 'pass' : 'warn',
        message: env.RESEND_API_KEY ? 'Set' : 'Not set - Optional',
      },
      {
        name: 'RESEND_FROM_EMAIL',
        status: env.RESEND_FROM_EMAIL ? 'pass' : 'warn',
        message: env.RESEND_FROM_EMAIL || 'Not set - Optional',
      },
    ],
  })

  // Marketing email configuration
  const emailMarketingEnabled = env.NEXT_PUBLIC_ENABLE_EMAIL_MARKETING
  const emailProvider = env.EMAIL_PROVIDER
  results.push({
    category: 'Email Marketing',
    checks: [
      {
        name: 'Feature Enabled',
        status: emailMarketingEnabled ? 'pass' : 'warn',
        message: emailMarketingEnabled ? 'Enabled' : 'Disabled',
      },
      {
        name: 'EMAIL_PROVIDER',
        status: emailProvider ? 'pass' : emailMarketingEnabled ? 'fail' : 'warn',
        message: emailProvider || 'Not set',
      },
      {
        name: `Provider API Key (${emailProvider || 'none'})`,
        status:
          emailProvider &&
          ((emailProvider === 'convertkit' && env.CONVERTKIT_API_KEY) ||
            (emailProvider === 'mailerlite' && env.MAILERLITE_API_KEY) ||
            (emailProvider === 'brevo' && env.BREVO_API_KEY) ||
            (emailProvider === 'sender' && env.SENDER_API_KEY))
            ? 'pass'
            : emailMarketingEnabled
              ? 'fail'
              : 'warn',
        message:
          emailProvider &&
          ((emailProvider === 'convertkit' && env.CONVERTKIT_API_KEY) ||
            (emailProvider === 'mailerlite' && env.MAILERLITE_API_KEY) ||
            (emailProvider === 'brevo' && env.BREVO_API_KEY) ||
            (emailProvider === 'sender' && env.SENDER_API_KEY))
            ? 'Set'
            : 'Not set',
      },
    ],
  })

  return results
}

function printResults(results: ValidationResult[]) {
  console.log('\n🔍 Starter App Setup Validation\n')
  console.log('='.repeat(80))

  let hasErrors = false
  let hasWarnings = false

  results.forEach(result => {
    console.log(`\n${result.category}:`)
    result.checks.forEach(check => {
      const icon = check.status === 'pass' ? '✓' : check.status === 'fail' ? '✗' : '⚠'
      const color =
        check.status === 'pass' ? '\x1b[32m' : check.status === 'fail' ? '\x1b[31m' : '\x1b[33m'
      const reset = '\x1b[0m'

      console.log(`  ${color}${icon}${reset} ${check.name}: ${check.message}`)

      if (check.status === 'fail') hasErrors = true
      if (check.status === 'warn') hasWarnings = true
    })
  })

  console.log('\n' + '='.repeat(80))

  if (hasErrors) {
    console.log('\n❌ Setup validation failed. Please fix the errors above.')
    console.log('💡 See .env.example for required environment variables.')
    process.exit(1)
  } else if (hasWarnings) {
    console.log('\n⚠️  Setup validation passed with warnings.')
    console.log('💡 Some features may be disabled. Check warnings above.')
  } else {
    console.log('\n✅ All checks passed! Your environment is properly configured.')
  }

  console.log('\n📚 For help, see: starter-app/README.md\n')
}

// Run validation
try {
  const results = checkSetup()
  printResults(results)
} catch (error) {
  console.error('\n❌ Setup validation encountered an error:')
  console.error(error instanceof Error ? error.message : error)
  console.log('\n💡 Check your .env.local file and ensure all values are correctly formatted.\n')
  process.exit(1)
}
