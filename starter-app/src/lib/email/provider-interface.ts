// Common interface for all email marketing providers

export interface EmailProvider {
  // Add subscriber to list
  addSubscriber(email: string, options?: AddSubscriberOptions): Promise<string>

  // Remove subscriber from list
  removeSubscriber(email: string): Promise<void>

  // Update subscriber information
  updateSubscriber(email: string, options?: UpdateSubscriberOptions): Promise<void>

  // Send transactional email
  sendEmail(options: SendEmailOptions): Promise<void>

  // Get subscriber status
  getSubscriber(email: string): Promise<SubscriberInfo | null>
}

export interface AddSubscriberOptions {
  firstName?: string
  lastName?: string
  tags?: string[]
  customFields?: Record<string, any>
}

export interface UpdateSubscriberOptions {
  firstName?: string
  lastName?: string
  tags?: string[]
  customFields?: Record<string, any>
}

export interface SendEmailOptions {
  to: string | string[]
  from?: string
  subject: string
  html: string
  text?: string
  replyTo?: string
}

export interface SubscriberInfo {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed' | 'bounced' | 'complained'
  subscribedAt?: Date
  unsubscribedAt?: Date
  tags?: string[]
}

export class EmailProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string
  ) {
    super(message)
    this.name = 'EmailProviderError'
  }
}
