// components/admin/auth/SignIn.tsx - Notion Style Design
'use client'

import { Loader2, Lock, Mail, Package } from 'lucide-react'
import { useId, useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthContext } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

export default function LoginForm() {
  const { isLoading, handleAuth } = useAuthContext()
  const { theme, isInitialized } = useTheme()

  // Determine effective theme (same logic as AdminLayout)
  const effectiveTheme = useMemo(() => {
    if (isInitialized) return theme
    if (typeof window === 'undefined') return theme
    try {
      const saved = localStorage.getItem('nova-theme')
      return saved && ['light', 'dark', 'blue', 'green', 'purple', 'orange', 'beige'].includes(saved)
        ? (saved as any)
        : theme
    } catch {
      return theme
    }
  }, [isInitialized, theme])

  const themeClass = `theme-${effectiveTheme}`
  const isDarkTheme = ['dark', 'blue', 'green', 'purple', 'orange'].includes(
    effectiveTheme as string,
  )

  // Map theme variables to CSS vars (aligned with AdminLayout)
  const getThemeVars = (t: string) => {
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

  const emailId = useId()
  const passwordId = useId()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: '', password: '' }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid'
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      await handleAuth(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when value changes
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div
      className={`min-h-screen relative admin-scope ${themeClass} ${isDarkTheme ? 'dark' : ''}`}
      data-theme={effectiveTheme}
      style={{
        ...getThemeVars(effectiveTheme as string),
        backgroundColor: effectiveTheme === 'light' ? '#ffffff' : 'var(--theme-bg-primary)',
      }}
    >
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      {/* Subtle floating elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-500/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40"
        style={{ animationDelay: '2s' }}
      />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl theme-accent-bg theme-text">
                <Package className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-semibold theme-text tracking-tight">Nova CMS</h1>
                <p className="text-sm theme-text-secondary font-medium">Admin Panel</p>
              </div>
            </div>
            <p className="text-lg theme-text-secondary font-light">Sign in to your workspace</p>
            <p className="text-sm theme-text-secondary mt-2">
              First time?
              <a
                href="/admin/signup"
                className="theme-accent hover:theme-accent-hover ml-1 font-medium"
              >
                Create administrator
              </a>
            </p>
          </div>

          {/* Form Card */}
          <div className="theme-card rounded-xl p-8 theme-border shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor={emailId} className="text-sm font-medium theme-text">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg theme-border focus:theme-border-focus focus:ring-theme-accent ${
                      errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor={passwordId} className="text-sm font-medium theme-text">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={passwordId}
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg theme-border focus:theme-border-focus focus:ring-theme-accent ${
                      errors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : ''
                    }`}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm theme-text-secondary">Exclusive access for administrators</p>
          </div>
        </div>
      </div>
    </div>
  )
}
