import type { Metadata } from 'next'
import '../../../design-system/styles/globals.css'
import { ThemeProvider } from '@/components/providers/theme-provider'

export const metadata: Metadata = {
  title: {
    template: '%s | Starter App',
    default: 'Starter App Template',
  },
  description: 'Production-ready Next.js starter with auth, payments, email, and AI-powered Q&A chatbot',
  keywords: ['Next.js', 'React', 'TypeScript', 'Supabase', 'Stripe', 'OpenAI', 'RAG', 'Chatbot'],
  authors: [{ name: 'Starter App Team' }],
  creator: 'Starter App',
  publisher: 'Starter App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://starter-app.example.com',
    title: 'Starter App Template',
    description: 'Production-ready Next.js starter with auth, payments, email, and AI-powered Q&A',
    siteName: 'Starter App',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Starter App Template',
    description: 'Production-ready Next.js starter with auth, payments, email, and AI-powered Q&A',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

type RootLayoutProps = Readonly<{
  children: React.ReactNode
}>

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
