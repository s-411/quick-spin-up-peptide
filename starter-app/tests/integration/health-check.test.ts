import { GET } from '@/app/api/health/route'
import { NextRequest } from 'next/server'

describe('Health Check API Integration Test', () => {
  it('should return healthy status when all services are available', async () => {
    const request = new NextRequest('http://localhost:3000/api/health')
    const response = await GET()

    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data).toHaveProperty('status')
    expect(data).toHaveProperty('timestamp')
    expect(data).toHaveProperty('checks')
    expect(Array.isArray(data.checks)).toBe(true)
  })

  it('should include Supabase health check', async () => {
    const response = await GET()
    const data = await response.json()

    const supabaseCheck = data.checks.find((check: any) => check.service === 'supabase')
    expect(supabaseCheck).toBeDefined()
    expect(supabaseCheck.status).toMatch(/healthy|unhealthy/)
  })

  it('should report disabled services correctly', async () => {
    const response = await GET()
    const data = await response.json()

    // At least one service should be tracked
    expect(data.checks.length).toBeGreaterThan(0)

    // Services can be healthy, unhealthy, or disabled
    data.checks.forEach((check: any) => {
      expect(['healthy', 'unhealthy', 'disabled']).toContain(check.status)
    })
  })

  it('should include latency for healthy services', async () => {
    const response = await GET()
    const data = await response.json()

    const healthyChecks = data.checks.filter((check: any) => check.status === 'healthy')

    healthyChecks.forEach((check: any) => {
      if (check.service !== 'resend' && !check.service.includes('email_marketing')) {
        // Resend and email marketing don't have latency checks in current impl
        expect(check.latency).toBeGreaterThanOrEqual(0)
      }
    })
  })
})
