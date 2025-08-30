'use client'

import { Check, Info, Palette, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useTheme } from '@/contexts/ThemeContext'

export function SettingsPage() {
  const { theme, setTheme, themes } = useTheme()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Small delay to ensure loader is visible and avoid flash
    const t = setTimeout(() => setLoading(false), 250)
    return () => clearTimeout(t)
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title="Settings"
          message="Loading your settings..."
          variant="content"
          fullScreen
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-6 py-10 space-y-10">
        {/* Cover Header */}
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-lg theme-bg-secondary flex items-center justify-center shrink-0">
                <Settings className="h-6 w-6 theme-text-secondary" />
              </div>
              <div>
                <p className="text-sm theme-text-muted mb-2">System</p>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                  Settings
                </h1>
                <p className="mt-2 theme-text-secondary max-w-xl">
                  Customize your CMS appearance and manage system preferences with modern, elegant
                  themes.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6 max-w-4xl">
          <Card className="theme-card theme-border border">
            <CardHeader>
              <CardTitle className="theme-text flex items-center gap-2">
                <Palette className="h-5 w-5 theme-text-secondary" />
                Interface Theme
              </CardTitle>
              <CardDescription className="theme-text-secondary">
                Choose a professional color palette inspired by modern design systems. Select from
                light, dark, or accent themes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...themes]
                  .sort((a, b) => {
                    const order = [
                      'light',
                      'beige',
                      'dark',
                      'blue',
                      'purple',
                      'orange',
                      'green',
                    ] as const
                    return order.indexOf(a.id as any) - order.indexOf(b.id as any)
                  })
                  .map((themeOption) => (
                    <button
                      type="button"
                      key={themeOption.id}
                      onClick={() => setTheme(themeOption.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all theme-card-hover ${
                        theme === themeOption.id
                          ? 'theme-accent-bg ring-2 ring-blue-500/20'
                          : 'theme-border hover:theme-border-light'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                          style={{
                            background: `linear-gradient(135deg, ${themeOption.colors.primary} 0%, ${themeOption.colors.secondary} 100%)`,
                          }}
                        />
                        <div className="text-left">
                          <p className="font-medium theme-text">{themeOption.name}</p>
                          <p className="text-sm theme-text-secondary">
                            {themeOption.id === 'light' && 'Clean minimalist'}
                            {themeOption.id === 'beige' && 'Warm parchment'}
                            {themeOption.id === 'dark' && 'Elegant dark'}
                            {themeOption.id === 'blue' && 'Professional slate'}
                            {themeOption.id === 'purple' && 'Soft iris accent'}
                            {themeOption.id === 'orange' && 'Subtle amber'}
                            {themeOption.id === 'green' && 'Forest green'}
                          </p>
                        </div>
                      </div>
                      {theme === themeOption.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" strokeWidth={2} />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
              </div>

              <div className="pt-4 border-t theme-border">
                <p className="text-sm theme-text-secondary">
                  Your theme preference is saved locally and will persist across sessions.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="theme-card theme-border border">
            <CardHeader>
              <CardTitle className="theme-text flex items-center gap-2">
                <Info className="h-5 w-5 theme-text-secondary" />
                About Nova CMS
              </CardTitle>
              <CardDescription className="theme-text-secondary">
                Version and system information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b theme-border">
                  <span className="theme-text-secondary font-medium">Version</span>
                  <span className="theme-text font-mono">1.0.0</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b theme-border">
                  <span className="theme-text-secondary font-medium">Framework</span>
                  <span className="theme-text font-mono">Next.js 15</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b theme-border">
                  <span className="theme-text-secondary font-medium">Database</span>
                  <span className="theme-text font-mono">Prisma + PostgreSQL</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="theme-text-secondary font-medium">Authentication</span>
                  <span className="theme-text font-mono">Better Auth</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t theme-border">
                <p className="text-xs theme-text-muted">
                  Nova CMS is a modern headless content management system built with Next.js and
                  TypeScript.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
