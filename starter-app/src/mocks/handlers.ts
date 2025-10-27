import { http, HttpResponse } from 'msw'

// Mock API handlers for testing
export const handlers = [
  // Health check
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: [
        {
          service: 'supabase',
          status: 'healthy',
          message: 'Database connection successful',
          latency: 50,
        },
      ],
    })
  }),

  // User profile
  http.get('/api/user/profile', () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      subscriptionStatus: 'free',
      themePreference: 'system',
      onboardingCompleted: false,
    })
  }),

  // Stripe checkout
  http.post('/api/stripe/checkout', async () => {
    return HttpResponse.json({
      url: 'https://checkout.stripe.com/test-session',
    })
  }),

  // Chat endpoints
  http.get('/api/chat/sessions', () => {
    return HttpResponse.json({
      data: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
    })
  }),
]
