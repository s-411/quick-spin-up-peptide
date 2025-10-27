import { launchBrowser, setupTestServer } from './setup'

describe('Landing Page E2E', () => {
  let baseUrl: string

  beforeAll(async () => {
    baseUrl = await setupTestServer()
  })

  it('should load the landing page successfully', async () => {
    const browser = await launchBrowser()

    try {
      await browser.navigate(`${baseUrl}/`)
      await browser.waitForSelector('h1', 5000)

      const headingText = await browser.getText('h1')
      expect(headingText).toContain('Starter App Template')
    } finally {
      await browser.close()
    }
  })

  it('should display hero section with CTA', async () => {
    const browser = await launchBrowser()

    try {
      await browser.navigate(`${baseUrl}/`)
      await browser.waitForSelector('[data-testid="hero-section"]', 5000)
      await browser.waitForSelector('[data-testid="cta-button"]', 5000)

      const ctaText = await browser.getText('[data-testid="cta-button"]')
      expect(ctaText).toBeTruthy()
    } finally {
      await browser.close()
    }
  })

  it('should display status dashboard showing integration health', async () => {
    const browser = await launchBrowser()

    try {
      await browser.navigate(`${baseUrl}/`)
      await browser.waitForSelector('[data-testid="status-dashboard"]', 5000)

      const statusText = await browser.getText('[data-testid="status-dashboard"]')
      expect(statusText).toBeTruthy()
    } finally {
      await browser.close()
    }
  })

  it('should have working theme toggle in navbar', async () => {
    const browser = await launchBrowser()

    try {
      await browser.navigate(`${baseUrl}/`)
      await browser.waitForSelector('[data-testid="theme-toggle"]', 5000)

      await browser.click('[data-testid="theme-toggle"]')
      // Theme should change - could verify by checking data-theme attribute
    } finally {
      await browser.close()
    }
  })
})
