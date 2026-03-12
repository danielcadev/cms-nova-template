'use client'

import { Check, Palette } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTheme } from '@/contexts/ThemeContext'

export function SettingsPage() {
  const t = useTranslations('settings')
  const { theme, setTheme, themes } = useTheme()

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">{t('title')}</h1>
        <p className="text-zinc-500">{t('subtitle')}</p>
      </div>
      <div className="max-w-3xl space-y-8">
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
                  className={`group relative flex flex-col items-start gap-3 p-4 rounded-xl border transition-all duration-200 ${
                    theme === themeItem.id
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
      </div>
    </div>
  )
}
