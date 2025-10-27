import { env } from '@/lib/env'
import type {
  EmailProvider,
  AddSubscriberOptions,
  SendEmailOptions,
  SubscriberInfo,
} from '../provider-interface'
import { EmailProviderError } from '../provider-interface'

export class SenderProvider implements EmailProvider {
  private apiKey: string

  constructor() {
    if (!env.SENDER_API_KEY) throw new Error('Sender API key not configured')
    this.apiKey = env.SENDER_API_KEY
  }

  async addSubscriber(email: string, options?: AddSubscriberOptions): Promise<string> {
    throw new EmailProviderError('Sender provider not fully implemented', 'sender')
  }

  async removeSubscriber(email: string): Promise<void> {
    throw new EmailProviderError('Not implemented', 'sender')
  }

  async updateSubscriber(): Promise<void> {
    throw new EmailProviderError('Not implemented', 'sender')
  }

  async sendEmail(): Promise<void> {
    throw new EmailProviderError('Use Resend for transactional emails', 'sender')
  }

  async getSubscriber(): Promise<SubscriberInfo | null> {
    return null
  }
}
