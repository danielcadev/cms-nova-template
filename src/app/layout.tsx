import { GeistSans } from 'geist/font/sans'
import { Inter } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { isDarkThemeId, normalizeTheme, type Theme } from '@/lib/theme'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'Nova CMS - Modern Design',
  description: 'Modular administration system with modern and fluid design',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read theme from cookie on the server for first paint
  let validTheme: Theme = 'light'
  
  try {
    const cookieStore = await cookies()
    const cookieTheme = (cookieStore.get('nova-theme')?.value ?? 'light') as string
    validTheme = normalizeTheme(cookieTheme) as Theme
  } catch (error) {
    // Fallback to light theme if cookies are not available (e.g., in static generation)
    console.warn('Could not read theme cookie, using default theme:', error)
    validTheme = 'light'
  }
  
  const _isDark = isDarkThemeId(validTheme)
  const _themeClass = `theme-${validTheme}`

  return (
    <html lang="en" className={`${inter.variable} ${GeistSans.variable}`}>
      <body className="antialiased">
        <ErrorProvider>
          {/* Pass initialTheme from server cookie to avoid hydration mismatch */}
          <ThemeProvider initialTheme={validTheme}>
            <AuthProvider>
              {children}
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
