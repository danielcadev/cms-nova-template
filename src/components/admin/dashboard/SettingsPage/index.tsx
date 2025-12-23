'use client'

import { Check, Database, Info, Layout, Palette, Settings, Shield } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'
import { useTheme } from '@/contexts/ThemeContext'

export function SettingsPage() {
  const t = useTranslations('settings')
  const { theme, setTheme, themes } = useTheme()
  const [loading, setLoading] = useState(true)
  const [version, setVersion] = useState('1.0.0')

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 250)

    // Fetch latest version from npm
    fetch('https://registry.npmjs.org/create-cms-nova/latest')
      .then((res) => res.json())
      .then((data) => {
        if (data.version) setVersion(data.version)
      })
      .catch((err) => console.error('Failed to fetch version:', err))

    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <AdminLoading
        title={t('title')}
        message={t('loading')}
        variant="content"
        fullScreen
      />
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{t('title')}</h1>
        <p className="text-zinc-500">{t('subtitle')}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Theme Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <Palette className="w-4 h-4" />
              <h2>{t('appearance.title')}</h2>
            </div>

            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {themes.map((themeItem) => (
                  <button
                    type="button"
                    key={themeItem.id}
                    onClick={() => setTheme(themeItem.id)}
                    className={`group relative flex flex-col items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${theme === themeItem.id
                      ? 'border-zinc-900 bg-zinc-50 ring-1 ring-zinc-900'
                      : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/50'
                      }`}
                  >
                    <div className="w-full aspect-video rounded-lg bg-white border border-zinc-100 shadow-sm overflow-hidden relative">
                      {/* Abstract Preview */}
                      <div className="absolute top-0 left-0 w-1/3 h-full bg-zinc-50 border-r border-zinc-100" />
                      <div
                        className="absolute top-3 right-3 w-8 h-8 rounded-full"
                        style={{ background: themeItem.colors.primary }}
                      />
                    </div>

                    <div className="w-full flex items-center justify-between">
                      <span className="font-medium text-sm text-zinc-900">
                        {t(`appearance.themes.${themeItem.id}`)}
                      </span>
                      {theme === themeItem.id && (
                        <div className="w-5 h-5 bg-zinc-900 rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* System Info Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-zinc-900 font-semibold">
              <Database className="w-4 h-4" />
              <h2>{t('system.title')}</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                    <Layout className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{t('system.framework')}</p>
                    <p className="text-xs text-zinc-500">Next.js 15</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-md bg-zinc-100 text-xs font-medium text-zinc-600">
                  {t('system.latest')}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{t('system.database')}</p>
                    <p className="text-xs text-zinc-500">PostgreSQL</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{t('system.auth')}</p>
                    <p className="text-xs text-zinc-500">Better Auth</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-400">{t('system.secure')}</span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">{t('system.version')}</p>
                    <p className="text-xs text-zinc-500">{t('system.versionInfo', { version })}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{t('pro.title')}</h3>
                <p className="text-zinc-400 text-sm mt-1">
                  {t('pro.description')}
                </p>
              </div>
              <button
                type="button"
                className="w-full py-2 bg-white text-zinc-900 rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors"
              >
                {t('pro.viewLicense')}
              </button>
            </div>

            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-2xl rounded-full -mr-10 -mt-10" />
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-6 space-y-4">
            <h3 className="font-semibold text-zinc-900 text-sm">{t('quickActions.title')}</h3>
            <div className="space-y-2">
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg transition-colors text-sm text-zinc-600"
              >
                <span>{t('quickActions.clearCache')}</span>
                <span className="text-xs bg-zinc-100 px-2 py-1 rounded text-zinc-500">⌘K</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg transition-colors text-sm text-zinc-600"
              >
                <span>{t('quickActions.documentation')}</span>
                <span className="text-xs text-zinc-400">↗</span>
              </button>
              <button
                type="button"
                className="w-full flex items-center justify-between p-2 hover:bg-zinc-50 rounded-lg transition-colors text-sm text-zinc-600"
              >
                <span>{t('quickActions.support')}</span>
                <span className="text-xs text-zinc-400">↗</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
