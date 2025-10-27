import { render, screen, waitFor } from '@/test-utils'
import { StatusDashboard } from '@/components/setup/status-dashboard'

// Mock the fetch API
global.fetch = jest.fn()

describe('StatusDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render loading state initially', () => {
    ;(global.fetch as jest.Mock).mockImplementation(
      () =>
        new Promise(() => {
          /* never resolves */
        })
    )

    render(<StatusDashboard />)

    expect(screen.getByText(/loading/i)).toBeInTheDocument()
  })

  it('should display health check results when loaded', async () => {
    const mockHealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: [
        {
          service: 'supabase',
          status: 'healthy',
          message: 'Database connection successful',
          latency: 50,
        },
        {
          service: 'stripe',
          status: 'disabled',
          message: 'Payments feature disabled',
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockHealthData,
    })

    render(<StatusDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/supabase/i)).toBeInTheDocument()
    })

    expect(screen.getByText(/healthy/i)).toBeInTheDocument()
  })

  it('should display error state when health check fails', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<StatusDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument()
    })
  })

  it('should show service status with appropriate styling', async () => {
    const mockHealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: [
        {
          service: 'supabase',
          status: 'healthy',
          message: 'Database connection successful',
          latency: 50,
        },
        {
          service: 'stripe',
          status: 'unhealthy',
          message: 'Connection failed',
        },
        {
          service: 'openai',
          status: 'disabled',
          message: 'RAG feature disabled',
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockHealthData,
    })

    render(<StatusDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/supabase/i)).toBeInTheDocument()
    })

    // Each service should be displayed
    expect(screen.getByText(/supabase/i)).toBeInTheDocument()
    expect(screen.getByText(/stripe/i)).toBeInTheDocument()
    expect(screen.getByText(/openai/i)).toBeInTheDocument()
  })

  it('should display latency information for healthy services', async () => {
    const mockHealthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      checks: [
        {
          service: 'supabase',
          status: 'healthy',
          message: 'Database connection successful',
          latency: 42,
        },
      ],
    }

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockHealthData,
    })

    render(<StatusDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/42ms/i)).toBeInTheDocument()
    })
  })
})
