import Link from 'next/link'
import { PublicNavbar } from '@/components/layout/PublicNavbar'
import { defaultConfig } from '@/config/default-config'

export default function HomePage() {
  const showPlans = !!defaultConfig.features?.plans
  const showCircuitos = !!defaultConfig.features?.circuitos

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <PublicNavbar />

      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-100/40 dark:from-gray-950 dark:via-gray-950 dark:to-gray-900/40" />
        <div className="relative mx-auto max-w-5xl px-6 min-h-[64vh] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-300 mb-6">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-500" />
              Nova CMS • Modular & Modern
            </div>
            <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 dark:text-gray-100 mb-5">
              A Notion‑style publishing starter
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
              Publish content types and optional templates with clean URLs.
            </p>
            <div className="flex items-center justify-center gap-4">
              {showPlans && (
                <Link
                  href="/planes"
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 hover:bg-white/70 dark:hover:bg-gray-900/50 text-sm"
                >
                  Explore Plans
                </Link>
              )}
              {showCircuitos && (
                <Link
                  href="/circuitos"
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-800 hover:bg-white/70 dark:hover:bg-gray-900/50 text-sm"
                >
                  Explore Circuits
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Collections */}
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 place-items-center">
          {showPlans && (
            <Link
              href="/planes"
              className="group w-full rounded-3xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/70 p-8 transition-all hover:shadow-md"
            >
              <div className="flex items-start gap-5">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg">
                  ✈︎
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 group-hover:opacity-90">
                    Tourist Plans
                  </h2>
                  <p className="mt-2 text-[15px] text-gray-600 dark:text-gray-400">
                    Design plans and publish with destination‑based URLs.
                  </p>
                  <div className="mt-4 inline-flex items-center text-sm text-emerald-600">
                    /planes
                    <span className="ml-2 transition-transform group-hover:translate-x-0.5">→</span>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-900/50">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-xs text-gray-500">
          <span>Nova CMS</span>
          <div className="flex items-center gap-3">
            {showPlans && (
              <Link href="/planes" className="hover:text-gray-700 dark:hover:text-gray-300">
                Plans
              </Link>
            )}
            {showCircuitos && (
              <Link href="/circuitos" className="hover:text-gray-700 dark:hover:text-gray-300">
                Circuits
              </Link>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
