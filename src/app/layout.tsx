import { GeistSans } from 'geist/font/sans'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { cookies } from 'next/headers'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { isDarkThemeId, normalizeTheme, type Theme } from '@/lib/theme'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
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

  const _themeClass = `theme-${validTheme}`

  const messages = await getMessages()
  const locale = await getLocale()

  return (
    <html lang={locale} className={`${fontSans.variable} ${GeistSans.variable}`}>
      <body className="antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ErrorProvider>
            {/* Pass initialTheme from server cookie to avoid hydration mismatch */}
            <ThemeProvider initialTheme={validTheme}>
              <AuthProvider>
                {children}
                <Toaster />
              </AuthProvider>
            </ThemeProvider>
          </ErrorProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
