import { env } from '@/lib/env'
import type { EmailProvider, AddSubscriberOptions, SubscriberInfo } from '../provider-interface'
import { EmailProviderError } from '../provider-interface'

export class MailerLiteProvider implements EmailProvider {
  private baseUrl = 'https://connect.mailerlite.com/api'

  constructor() {
    if (!env.MAILERLITE_API_KEY) throw new Error('MailerLite API key not configured')
  }

  async addSubscriber(email: string, options?: AddSubscriberOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/subscribers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({
          email,
          fields: { name: options?.firstName, last_name: options?.lastName },
        }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Failed to add subscriber')
      return data.data.id
    } catch (error) {
      throw new EmailProviderError(
        error instanceof Error ? error.message : 'Failed to add subscriber',
        'mailerlite'
      )
    }
  }

  async removeSubscriber(_email: string): Promise<void> {
    throw new EmailProviderError('Remove subscriber not implemented', 'mailerlite')
  }

  async updateSubscriber(_email: string): Promise<void> {
    throw new EmailProviderError('Update subscriber not implemented', 'mailerlite')
  }

  async sendEmail(): Promise<void> {
    throw new EmailProviderError(
      'MailerLite is for marketing only. Use Resend for transactional emails.',
      'mailerlite'
    )
  }

  async getSubscriber(_email: string): Promise<SubscriberInfo | null> {
    return null
  }
}
