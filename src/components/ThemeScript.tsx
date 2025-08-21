'use client'

import { usePathname } from 'next/navigation'
import { useLayoutEffect } from 'react'

export function ThemeScript() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const isAdminRoute = pathname?.includes('/admin')
    if (!isAdminRoute) return

    try {
      const savedTheme = localStorage.getItem('nova-theme') || 'light'
      const root = document.documentElement
      const body = document.body

      const themeClasses = [
        'theme-light',
        'theme-dark',
        'theme-blue',
        'theme-green',
        'theme-purple',
        'theme-orange',
        'theme-beige',
      ]
      themeClasses.forEach((cls) => {
        root.classList.remove(cls)
        body.classList.remove(cls)
      })

      root.classList.add(`theme-${savedTheme}`)
      body.classList.add(`theme-${savedTheme}`)

      const darkThemes = ['dark', 'blue', 'green', 'purple', 'orange']
      const isDarkTheme = darkThemes.includes(savedTheme)
      if (isDarkTheme) {
        root.classList.add('dark')
        body.classList.add('dark')
      } else {
        root.classList.remove('dark')
        body.classList.remove('dark')
      }

      root.setAttribute('data-theme', savedTheme)
      body.setAttribute('data-theme', savedTheme)

      // mark global for correlation with initializer (optional)
      // @ts-expect-error
      window.__NOVA_THEME_SCRIPT__ = { savedTheme }
    } catch {
      // no-op
    }
  }, [pathname])

  return null
}
