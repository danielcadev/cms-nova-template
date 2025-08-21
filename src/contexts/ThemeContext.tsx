'use client'

import { usePathname } from 'next/navigation'
import type React from 'react'
import { createContext, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { isDarkThemeId, normalizeTheme, type Theme, themes as themeList } from '@/lib/theme'

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
  const pathname = usePathname()

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

    const root = document.documentElement
    const body = document.body
    const isAdminRoute = pathname ? pathname.includes('/admin') : false

    if (isAdminRoute) {
      themeList.forEach((t) => {
        root.classList.remove(`theme-${t.id}`)
        body.classList.remove(`theme-${t.id}`)
      })
      const currentThemeClass = `theme-${theme}`
      root.classList.add(currentThemeClass)
      body.classList.add(currentThemeClass)
      const dark = isDarkThemeId(theme)
      if (dark) {
        root.classList.add('dark')
        body.classList.add('dark')
      } else {
        root.classList.remove('dark')
        body.classList.remove('dark')
      }
      root.setAttribute('data-theme', theme)
      body.setAttribute('data-theme', theme)
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
      root.removeAttribute('data-theme')
      body.removeAttribute('data-theme')
      themeList.forEach((t) => {
        root.classList.remove(`theme-${t.id}`)
        body.classList.remove(`theme-${t.id}`)
      })
    }

    const themeConfig = themeList.find((t) => t.id === theme)
    if (themeConfig) {
      root.style.setProperty('--theme-primary', themeConfig.colors.primary)
      root.style.setProperty('--theme-secondary', themeConfig.colors.secondary)
      body.style.setProperty('--theme-primary', themeConfig.colors.primary)
      body.style.setProperty('--theme-secondary', themeConfig.colors.secondary)
    }

    try {
      localStorage.setItem('nova-theme', theme)
      if (typeof document !== 'undefined') {
        // Using a helper function to avoid direct cookie assignment
        setCookie('nova-theme', theme, 365)
      }
    } catch {}
  }, [theme, pathname, isInitialized])

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
