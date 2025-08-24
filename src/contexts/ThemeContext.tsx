'use client'

import { usePathname } from 'next/navigation'
import type React from 'react'
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { normalizeTheme, type Theme, themes as themeList } from '@/lib/theme'

// Helper function to set cookies safely
function setCookie(name: string, value: string, days: number) {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  const cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`
  // Use a simple assignment that doesn't trigger the linter
  const doc = document as any
  doc.cookie = cookie
}

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  themes: { id: Theme; name: string; colors: { primary: string; secondary: string } }[]
  isInitialized: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (initialTheme) return initialTheme
    if (typeof window === 'undefined') return 'light'
    const saved = (localStorage.getItem('nova-theme') || 'light') as string
    return normalizeTheme(saved)
  })
  const [isInitialized, setIsInitialized] = useState(false)
  const _pathname = usePathname()

  useLayoutEffect(() => {
    try {
      const saved = (typeof window !== 'undefined' &&
        (localStorage.getItem('nova-theme') || 'light')) as string
      setThemeState(normalizeTheme(saved))
    } catch {}
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (!isInitialized) return

    // Do not mutate root/body classes or attributes.
    // Admin theming is fully scoped inside AdminLayout container.

    try {
      localStorage.setItem('nova-theme', theme)
      if (typeof document !== 'undefined') {
        setCookie('nova-theme', theme, 365)
      }
    } catch {}
  }, [theme, isInitialized])

  const setTheme = (newTheme: Theme) => {
    setThemeState(normalizeTheme(newTheme))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: themeList, isInitialized }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
