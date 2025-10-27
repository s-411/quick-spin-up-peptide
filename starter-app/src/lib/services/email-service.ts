import { CircuitBreaker, retryWithBackoff } from '../errors'
import { createTransactionalEmailProvider, createMarketingEmailProvider } from '../email/factory'
import type { SendEmailOptions, AddSubscriberOptions } from '../email/provider-interface'

// Email service with circuit breaker and retry logic
class EmailService {
  private transactionalCircuitBreaker = new CircuitBreaker(5, 60000)
  private marketingCircuitBreaker = new CircuitBreaker(5, 60000)

  async sendTransactionalEmail(options: SendEmailOptions): Promise<void> {
    return this.transactionalCircuitBreaker.execute(async () => {
      return retryWithBackoff(
        async () => {
          const provider = createTransactionalEmailProvider()
          await provider.sendEmail(options)
        },
        3,
        1000
      )
    })
  }

  async addMarketingSubscriber(email: string, options?: AddSubscriberOptions): Promise<string> {
    return this.marketingCircuitBreaker.execute(async () => {
      return retryWithBackoff(
        async () => {
          const provider = createMarketingEmailProvider()
          return provider.addSubscriber(email, options)
        },
        3,
        1000
      )
    })
  }

  async removeMarketingSubscriber(email: string): Promise<void> {
    return this.marketingCircuitBreaker.execute(async () => {
      const provider = createMarketingEmailProvider()
      await provider.removeSubscriber(email)
    })
  }

  getTransactionalCircuitBreakerStatus() {
    return this.transactionalCircuitBreaker.getState()
  }

  getMarketingCircuitBreakerStatus() {
    return this.marketingCircuitBreaker.getState()
  }
}

export const emailService = new EmailService()
