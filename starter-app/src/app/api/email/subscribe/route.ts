import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { emailService } from '@/lib/services/email-service'
import { env } from '@/lib/env'

export async function POST(request: Request) {
  try {
    const { email, firstName, lastName, userId } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!env.EMAIL_PROVIDER) {
      return NextResponse.json({ error: 'Email provider not configured' }, { status: 500 })
    }

    // Add to marketing email provider
    const providerId = await emailService.addMarketingSubscriber(email, {
      firstName,
      lastName,
    })

    // Store in database
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('email_subscribers')
      .insert({
        user_id: userId || null,
        email,
        provider: env.EMAIL_PROVIDER,
        provider_subscriber_id: providerId,
        status: 'subscribed',
      })
      .select()
      .single()

    if (error && error.code !== '23505') {
      // Ignore duplicate key errors
      console.error('Database error:', error)
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
    }

    return NextResponse.json({ success: true, subscription: data })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to subscribe' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Remove from marketing email provider
    await emailService.removeMarketingSubscriber(email)

    // Update in database
    const supabase = createAdminClient()
    const { error } = await supabase
      .from('email_subscribers')
      .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
      .eq('email', email)

    if (error) {
      console.error('Database error:', error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unsubscribe error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to unsubscribe' },
      { status: 500 }
    )
  }
}
