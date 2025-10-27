import { env } from '../env'
import type { EmailProvider } from './provider-interface'
import { ResendProvider } from './providers/resend'
import { ConvertKitProvider } from './providers/convertkit'
import { MailerLiteProvider } from './providers/mailerlite'
import { BrevoProvider } from './providers/brevo'
import { SenderProvider } from './providers/sender'

export function createTransactionalEmailProvider(): EmailProvider {
  return new ResendProvider()
}

export function createMarketingEmailProvider(): EmailProvider {
  const provider = env.EMAIL_PROVIDER

  switch (provider) {
    case 'convertkit':
      return new ConvertKitProvider()
    case 'mailerlite':
      return new MailerLiteProvider()
    case 'brevo':
      return new BrevoProvider()
    case 'sender':
      return new SenderProvider()
    default:
      throw new Error(`Unknown email provider: ${provider}`)
  }
}
