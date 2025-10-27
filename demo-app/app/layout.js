import '@/design-system/styles/globals.css'
import { ThemeProvider } from '@/design-system/lib/theme-provider'
import { Toaster } from '@/components/ui/toaster'

export const metadata = {
  title: 'MM Design System Demo',
  description: 'Showcase of MM Design System components',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
