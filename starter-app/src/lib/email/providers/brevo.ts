import { env } from '@/lib/env'
import type {
  EmailProvider,
  AddSubscriberOptions,
  SendEmailOptions,
  SubscriberInfo,
} from '../provider-interface'
import { EmailProviderError } from '../provider-interface'

export class BrevoProvider implements EmailProvider {
  private apiKey: string
  private baseUrl = 'https://api.brevo.com/v3'

  constructor() {
    if (!env.BREVO_API_KEY) throw new Error('Brevo API key not configured')
    this.apiKey = env.BREVO_API_KEY
  }

  async addSubscriber(email: string, options?: AddSubscriberOptions): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'api-key': this.apiKey },
        body: JSON.stringify({
          email,
          attributes: { FIRSTNAME: options?.firstName, LASTNAME: options?.lastName },
        }),
      })
      if (!response.ok) throw new Error('Failed to add subscriber')
      return email
    } catch (error) {
      throw new EmailProviderError(error instanceof Error ? error.message : 'Failed', 'brevo')
    }
  }

  async removeSubscriber(email: string): Promise<void> {
    throw new EmailProviderError('Not implemented', 'brevo')
  }

  async updateSubscriber(): Promise<void> {
    throw new EmailProviderError('Not implemented', 'brevo')
  }

  async sendEmail(): Promise<void> {
    throw new EmailProviderError('Use Resend for transactional emails', 'brevo')
  }

  async getSubscriber(): Promise<SubscriberInfo | null> {
    return null
  }
}
