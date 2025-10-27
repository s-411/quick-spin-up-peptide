import { Resend } from 'resend'
import { env } from '@/lib/env'
import type {
  EmailProvider,
  AddSubscriberOptions,
  SendEmailOptions,
  SubscriberInfo,
} from '../provider-interface'
import { EmailProviderError } from '../provider-interface'

export class ResendProvider implements EmailProvider {
  private client: Resend

  constructor() {
    if (!env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not configured')
    }
    this.client = new Resend(env.RESEND_API_KEY)
  }

  async addSubscriber(email: string, options?: AddSubscriberOptions): Promise<string> {
    // Resend doesn't have built-in subscriber management
    // This would typically integrate with a separate service or database
    throw new EmailProviderError(
      'Resend does not support subscriber management. Use a marketing email provider.',
      'resend'
    )
  }

  async removeSubscriber(email: string): Promise<void> {
    throw new EmailProviderError(
      'Resend does not support subscriber management. Use a marketing email provider.',
      'resend'
    )
  }

  async updateSubscriber(email: string): Promise<void> {
    throw new EmailProviderError(
      'Resend does not support subscriber management. Use a marketing email provider.',
      'resend'
    )
  }

  async sendEmail(options: SendEmailOptions): Promise<void> {
    try {
      const { error } = await this.client.emails.send({
        from: options.from || env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
        reply_to: options.replyTo,
      })

      if (error) {
        throw new EmailProviderError(error.message, 'resend')
      }
    } catch (error) {
      if (error instanceof EmailProviderError) throw error
      throw new EmailProviderError(
        error instanceof Error ? error.message : 'Failed to send email',
        'resend'
      )
    }
  }

  async getSubscriber(email: string): Promise<SubscriberInfo | null> {
    throw new EmailProviderError(
      'Resend does not support subscriber management. Use a marketing email provider.',
      'resend'
    )
  }
}
