import Link from 'next/link'
import { StatusDashboard } from '@/components/setup/status-dashboard'
import { Navbar } from '@/components/layout/navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="bg-background text-foreground">
        {/* Hero Section */}
        <section
          data-testid="hero-section"
          className="border-b border-border bg-gradient-to-br from-primary/10 via-background to-background"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6 py-24 text-center md:py-32">
            <span className="inline-flex items-center justify-center rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
              Production-Ready Starter Template
            </span>
            <h1 className="text-balance text-4xl font-heading md:text-6xl">Starter App Template</h1>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Launch your Next.js SaaS in under 15 minutes with pre-configured authentication,
              payments, email, and AI-powered Q&A. Built with TypeScript, Supabase, Stripe, and
              OpenAI.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                data-testid="cta-button"
                className="btn-mm"
              >
                Get Started
              </Link>
              <Link
                href="/pricing"
                className="btn-secondary"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="mx-auto max-w-5xl px-6 py-16">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-heading">Everything you need to launch fast</h2>
            <p className="text-muted-foreground">
              Pre-configured integrations and best practices out of the box
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: 'Authentication',
                body: 'Complete auth flow with Supabase: signup, signin, password reset, email verification, and protected routes.',
                icon: '🔐',
              },
              {
                title: 'Payments',
                body: 'Stripe integration with subscriptions, webhooks, customer portal, and pre-built pricing pages.',
                icon: '💳',
              },
              {
                title: 'Email',
                body: 'Transactional emails with Resend + marketing email adapter for ConvertKit, MailerLite, Brevo, and Sender.',
                icon: '📧',
              },
              {
                title: 'RAG Q&A Chatbot',
                body: 'AI-powered document Q&A with OpenAI, vector search, and source citations using pgvector.',
                icon: '🤖',
              },
              {
                title: 'Theme System',
                body: 'Dark/light/system modes with persistent preferences and design system token integration.',
                icon: '🎨',
              },
              {
                title: 'Type Safety',
                body: 'Strict TypeScript configuration with comprehensive type definitions and environment validation.',
                icon: '🛡️',
              },
            ].map(item => (
              <article
                key={item.title}
                className="rounded-card border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 font-heading text-xl">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Status Dashboard Section */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-8 text-center">
              <h2 className="mb-2 text-2xl font-heading">System Health</h2>
              <p className="text-sm text-muted-foreground">
                Real-time status of all integrated services
              </p>
            </div>
            <StatusDashboard />
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="mb-4 text-3xl font-heading">Ready to build your SaaS?</h2>
            <p className="mb-8 text-muted-foreground">
              Clone the template, add your environment variables, and start building in minutes.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="btn-mm"
              >
                Start Building
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
