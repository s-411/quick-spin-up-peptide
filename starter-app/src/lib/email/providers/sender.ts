import { env } from '@/lib/env'
import type { EmailProvider, AddSubscriberOptions, SubscriberInfo } from '../provider-interface'
import { EmailProviderError } from '../provider-interface'

export class SenderProvider implements EmailProvider {
  constructor() {
    if (!env.SENDER_API_KEY) throw new Error('Sender API key not configured')
  }

  async addSubscriber(_email: string, _options?: AddSubscriberOptions): Promise<string> {
    throw new EmailProviderError('Sender provider not fully implemented', 'sender')
  }

  async removeSubscriber(_email: string): Promise<void> {
    throw new EmailProviderError('Not implemented', 'sender')
  }

  async updateSubscriber(_email: string): Promise<void> {
    throw new EmailProviderError('Not implemented', 'sender')
  }

  async sendEmail(): Promise<void> {
    throw new EmailProviderError('Use Resend for transactional emails', 'sender')
  }

  async getSubscriber(_email: string): Promise<SubscriberInfo | null> {
    return null
  }
}
