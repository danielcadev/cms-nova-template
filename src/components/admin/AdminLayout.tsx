'use client'

import type React from 'react'
import { type ReactNode, useMemo, useState } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
import { Sidebar } from './dashboard/Sidebar'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, isInitialized } = useTheme()

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  // Use saved theme from DOM/localStorage during the first paint while context initializes
  const effectiveTheme = useMemo(() => {
    if (isInitialized) return theme
    if (typeof window === 'undefined') return theme
    try {
      const saved = localStorage.getItem('nova-theme')
      return saved &&
        ['light', 'dark', 'blue', 'green', 'purple', 'orange', 'beige'].includes(saved)
        ? saved
        : theme
    } catch {
      return theme
    }
  }, [isInitialized, theme])

  const themeClass = `theme-${effectiveTheme}`
  const isDarkTheme = ['dark', 'blue', 'green', 'purple', 'orange'].includes(
    effectiveTheme as string,
  )

  const _getThemeVariables = (t: string) => {
    const map: Record<string, any> = {
      light: {
        '--theme-bg-primary': '#ffffff',
        '--theme-bg-secondary': '#f8fafc',
        '--theme-bg-tertiary': '#f1f5f9',
        '--theme-text-primary': '#0f172a',
        '--theme-text-secondary': '#64748b',
        '--theme-text-muted': '#94a3b8',
        '--theme-border': '#e2e8f0',
        '--theme-border-light': '#f1f5f9',
        '--theme-accent': '#3b82f6',
        '--theme-accent-hover': '#2563eb',
        '--theme-accent-light': '#dbeafe',
        '--theme-card': '#ffffff',
        '--theme-card-hover': '#f8fafc',
      },
      dark: {
        '--theme-bg-primary': '#0b0f14',
        '--theme-bg-secondary': '#0f1620',
        '--theme-bg-tertiary': '#151b26',
        '--theme-text-primary': '#e6e9ee',
        '--theme-text-secondary': '#a6afbb',
        '--theme-text-muted': '#7d8696',
        '--theme-border': '#2a3441',
        '--theme-border-light': '#1e2733',
        '--theme-accent': '#6b778c',
        '--theme-accent-hover': '#8792a2',
        '--theme-accent-light': '#1d2430',
        '--theme-card': '#11161f',
        '--theme-card-hover': '#161d27',
      },
      blue: {
        '--theme-bg-primary': '#0c1116',
        '--theme-bg-secondary': '#0f141a',
        '--theme-bg-tertiary': '#121922',
        '--theme-text-primary': '#e6e9ee',
        '--theme-text-secondary': '#a6afbb',
        '--theme-text-muted': '#8b95a5',
        '--theme-border': '#202733',
        '--theme-border-light': '#171e28',
        '--theme-accent': '#3b82f6',
        '--theme-accent-hover': '#2563eb',
        '--theme-accent-light': '#0b1730',
        '--theme-card': '#0f141a',
        '--theme-card-hover': '#121922',
      },
      green: {
        '--theme-bg-primary': '#0d1116',
        '--theme-bg-secondary': '#11161c',
        '--theme-bg-tertiary': '#151b22',
        '--theme-text-primary': '#e6e9ee',
        '--theme-text-secondary': '#a6afbb',
        '--theme-text-muted': '#8b95a5',
        '--theme-border': '#202733',
        '--theme-border-light': '#171e28',
        '--theme-accent': '#9db5a3',
        '--theme-accent-hover': '#7fa78f',
        '--theme-accent-light': '#1b2a22',
        '--theme-card': '#11161c',
        '--theme-card-hover': '#151b22',
      },
      purple: {
        '--theme-bg-primary': '#0b0d14',
        '--theme-bg-secondary': '#0e1220',
        '--theme-bg-tertiary': '#141a2a',
        '--theme-text-primary': '#e8eaf2',
        '--theme-text-secondary': '#aab1c5',
        '--theme-text-muted': '#8e97ad',
        '--theme-border': '#1f2740',
        '--theme-border-light': '#171d30',
        '--theme-accent': '#8b5cf6',
        '--theme-accent-hover': '#7c3aed',
        '--theme-accent-light': '#1e1535',
        '--theme-card': '#0f1422',
        '--theme-card-hover': '#141a2a',
      },
      beige: {
        '--theme-bg-primary': '#f5f1e7',
        '--theme-bg-secondary': '#eee7db',
        '--theme-bg-tertiary': '#e7dece',
        '--theme-text-primary': '#1e2227',
        '--theme-text-secondary': '#585f66',
        '--theme-text-muted': '#7a828a',
        '--theme-border': '#e3dbcf',
        '--theme-border-light': '#ece3d6',
        '--theme-accent': '#2563eb',
        '--theme-accent-hover': '#1d4ed8',
        '--theme-accent-light': '#e7effe',
        '--theme-card': '#faf6ee',
        '--theme-card-hover': '#f3ede3',
      },
      orange: {
        '--theme-bg-primary': '#12100e',
        '--theme-bg-secondary': '#161310',
        '--theme-bg-tertiary': '#1c1814',
        '--theme-text-primary': '#ece7e2',
        '--theme-text-secondary': '#b4aba4',
        '--theme-text-muted': '#978e87',
        '--theme-border': '#2a2622',
        '--theme-border-light': '#1f1a16',
        '--theme-accent': '#f59e0b',
        '--theme-accent-hover': '#d97706',
        '--theme-accent-light': '#2a1d0b',
        '--theme-card': '#161310',
        '--theme-card-hover': '#1c1814',
      },
    }
    const base = map[t] || map.dark
    return {
      ...base,
      '--background': base['--theme-bg-primary'],
      '--foreground': base['--theme-text-primary'],
      '--card': base['--theme-card'],
      '--card-foreground': base['--theme-text-primary'],
      '--muted': base['--theme-bg-secondary'],
      '--muted-foreground': base['--theme-text-secondary'],
      '--border': base['--theme-border'],
      '--input': base['--theme-border'],
      '--ring': base['--theme-accent'],
      '--accent': base['--theme-accent'],
      '--accent-foreground': base['--theme-text-primary'],
      '--primary': base['--theme-accent'],
      '--primary-foreground': base['--theme-text-primary'],
    } as React.CSSProperties
  }

  return (
    <div
      className={`min-h-screen flex relative overflow-hidden ${themeClass} ${isDarkTheme ? 'dark' : ''}`}
      style={{ 
        backgroundColor: effectiveTheme === 'light' ? '#ffffff' : 'var(--theme-bg-primary)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Clean Notion-like background */}
      <div className="fixed inset-0 -z-10">
        <div 
          className="absolute inset-0" 
          style={{ 
            backgroundColor: effectiveTheme === 'light' ? '#ffffff' : 'var(--theme-bg-primary)' 
          }} 
        />
        {/* Subtle grid pattern for light theme */}
        {effectiveTheme === 'light' && (
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px'
            }}
          />
        )}
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onToggle={toggleSidebar}
      />

      <div className="flex-1 flex flex-col min-h-screen relative">
        <main className="flex-1 relative">
          <div className="h-full">
            <div className="transition-all duration-200 ease-out p-6 md:p-8 lg:p-12">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
