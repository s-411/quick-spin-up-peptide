import { env } from '@/lib/env'
import type {
  EmailProvider,
  AddSubscriberOptions,
  SendEmailOptions,
  SubscriberInfo,
} from '../provider-interface'
import { EmailProviderError } from '../provider-interface'

export class ConvertKitProvider implements EmailProvider {
  private apiKey: string
  private apiSecret: string
  private baseUrl = 'https://api.convertkit.com/v3'

  constructor() {
    if (!env.CONVERTKIT_API_KEY || !env.CONVERTKIT_API_SECRET) {
      throw new Error('ConvertKit API credentials not configured')
    }
    this.apiKey = env.CONVERTKIT_API_KEY
    this.apiSecret = env.CONVERTKIT_API_SECRET
  }

  async addSubscriber(email: string, options?: AddSubscriberOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/forms/YOUR_FORM_ID/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: this.apiKey,
          email,
          first_name: options?.firstName,
          tags: options?.tags,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to add subscriber')

      return data.subscription.id
    } catch (error) {
      throw new EmailProviderError(
        error instanceof Error ? error.message : 'Failed to add subscriber',
        'convertkit'
      )
    }
  }

  async removeSubscriber(email: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/unsubscribe`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_secret: this.apiSecret,
          email,
        }),
      })

      if (!response.ok) throw new Error('Failed to unsubscribe')
    } catch (error) {
      throw new EmailProviderError(
        error instanceof Error ? error.message : 'Failed to remove subscriber',
        'convertkit'
      )
    }
  }

  async updateSubscriber(email: string, options?: any): Promise<void> {
    // ConvertKit updates via tags
    throw new EmailProviderError('Update not implemented for ConvertKit', 'convertkit')
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    throw new EmailProviderError(
      'ConvertKit is for marketing emails only. Use Resend for transactional emails.',
      'convertkit'
    )
  }

  async getSubscriber(email: string): Promise<SubscriberInfo | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/subscribers?api_secret=${this.apiSecret}&email_address=${email}`
      )
      const data = await response.json()

      if (!data.subscribers || data.subscribers.length === 0) return null

      const sub = data.subscribers[0]
      return {
        id: sub.id,
        email: sub.email_address,
        status: sub.state as any,
        subscribedAt: new Date(sub.created_at),
      }
    } catch (error) {
      return null
    }
  }
}
