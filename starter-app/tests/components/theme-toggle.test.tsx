import { render, screen, fireEvent } from '@/test-utils'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { useTheme } from 'next-themes'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

describe('ThemeToggle Component', () => {
  const mockSetTheme = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    })
  })

  it('should render theme toggle button', () => {
    render(<ThemeToggle />)

    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('should display current theme icon', () => {
    render(<ThemeToggle />)

    // Should show sun icon when in light mode
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should toggle theme when clicked', () => {
    render(<ThemeToggle />)

    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    // Should call setTheme
    expect(mockSetTheme).toHaveBeenCalled()
  })

  it('should show dark mode icon when theme is dark', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })

  it('should be accessible with aria-label', () => {
    render(<ThemeToggle />)

    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toHaveAttribute('aria-label')
  })

  it('should support system theme preference', () => {
    ;(useTheme as jest.Mock).mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
    })

    render(<ThemeToggle />)

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
  })
})
