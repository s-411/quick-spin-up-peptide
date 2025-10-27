/**
 * Error Page
 * Handles unexpected errors
 */

'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Container } from '@/components/layout/container'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to console or error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-destructive/10">
          <svg
            className="h-12 w-12 text-destructive"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Something Went Wrong</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          We encountered an unexpected error. Please try again.
        </p>

        {error.message && (
          <div className="mt-4 rounded-lg bg-muted/50 p-4 text-left">
            <p className="text-sm font-mono text-muted-foreground">{error.message}</p>
          </div>
        )}

        <div className="mt-8 flex gap-4 justify-center">
          <button
            onClick={reset}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Go Home
          </Link>
        </div>
      </div>
    </Container>
  )
}
