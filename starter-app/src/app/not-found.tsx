/**
 * 404 Not Found Page
 */

import Link from 'next/link'
import { Container } from '@/components/layout/container'

export default function NotFound() {
  return (
    <Container className="flex min-h-screen items-center justify-center py-16">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-3xl font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-4 text-lg text-muted-foreground">
          Sorry, we couldn't find the page you're looking for.
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <Link
            href="/"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="rounded-lg border border-border px-6 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            Go Back
          </button>
        </div>
      </div>
    </Container>
  )
}
