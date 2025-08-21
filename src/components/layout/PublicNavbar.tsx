'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useCurrentUser } from '@/hooks/use-current-user'

export function PublicNavbar() {
  const { user } = useCurrentUser()
  const pathname = usePathname()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [hasShadow, setHasShadow] = useState(false)

  useEffect(() => {
    const onScroll = () => setHasShadow(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isActive = (href: string) => pathname === href || pathname?.startsWith(`${href}/`)
  const segments = (pathname || '').split('/').filter(Boolean)
  const _currentSection =
    segments[0] === 'planes' || segments[0] === 'circuitos' ? segments[0] : null
  // Remove destination/category pill from navbar per request
  const currentCategory = null as unknown as string | null

  return (
    <nav className={`sticky top-0 z-40 transition-shadow ${hasShadow ? 'shadow-lg' : ''}`}>
      <div className="absolute inset-0 bg-white/70 dark:bg-gray-950/60 backdrop-blur supports-[backdrop-filter]:backdrop-blur" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent" />

      <div className="relative mx-auto max-w-7xl h-20 px-6 sm:px-8 grid grid-cols-3 items-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 shadow-sm" />
          <span className="text-lg font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300">
            Nova
          </span>
        </Link>

        <div className="hidden sm:flex items-center justify-center gap-2.5">
          <Link
            href="/blog"
            className={`px-4 py-2.5 rounded-xl text-[15px] transition-colors ${
              isActive('/blog')
                ? 'bg-gray-100/90 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/50'
            }`}
          >
            Blog
          </Link>
          <Link
            href="/planes"
            className={`px-4 py-2.5 rounded-xl text-[15px] transition-colors ${
              isActive('/planes')
                ? 'bg-gray-100/90 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/50'
            }`}
          >
            Plans
          </Link>
          <Link
            href="/circuitos"
            className={`px-4 py-2.5 rounded-xl text-[15px] transition-colors ${
              isActive('/circuitos')
                ? 'bg-gray-100/90 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-gray-800/50'
            }`}
          >
            Circuits
          </Link>
          {/* category pill removed */}
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            className="sm:hidden inline-flex items-center justify-center h-12 w-12 rounded-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 bg-white/60 dark:bg-gray-900/50"
            aria-label="Open menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <title>Menu</title>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              const targetType = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/blog'
              const q = query.trim()
              router.push(q ? `${targetType}?q=${encodeURIComponent(q)}` : targetType)
            }}
            className="hidden md:flex items-center h-11 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 overflow-hidden shadow-sm"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles..."
              className="px-3 text-sm bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 w-56"
            />
            <button
              type="submit"
              className="px-3 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
            >
              Go
            </button>
          </form>

          {user ? (
            <Link
              href="/admin/dashboard"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-900/50 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/admin/login"
              className="hidden sm:inline-flex px-3.5 py-2 rounded-xl text-sm border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-white/60 dark:hover:bg-gray-900/50 transition-colors"
            >
              Admin
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95">
          <div className="mx-auto max-w-7xl px-6 py-3 flex flex-col gap-1">
            <Link
              href="/blog"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm ${isActive('/blog') ? 'bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Blog
            </Link>
            <Link
              href="/planes"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm ${isActive('/planes') ? 'bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Plans
            </Link>
            <Link
              href="/circuitos"
              onClick={() => setMenuOpen(false)}
              className={`px-3 py-2 rounded-md text-sm ${isActive('/circuitos') ? 'bg-gray-100 dark:bg-gray-800/60 text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}
            >
              Circuits
            </Link>
            {user ? (
              <Link
                href="/admin/dashboard"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="px-3 py-2 rounded-md text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-2 pt-3"
              >
                Admin
              </Link>
            )}
            {currentCategory && (
              <div className="px-3 py-2 text-sm text-gray-600 dark:text-gray-300">
                Category: {currentCategory}
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const targetType = pathname?.split('/')[1] ? `/${pathname.split('/')[1]}` : '/blog'
                const q = query.trim()
                setMenuOpen(false)
                router.push(q ? `${targetType}?q=${encodeURIComponent(q)}` : targetType)
              }}
              className="mt-2 flex items-center h-10 rounded-xl border border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/50 overflow-hidden shadow-sm"
            >
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="px-3 text-sm bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 w-full"
              />
              <button
                type="submit"
                className="px-3 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Go
              </button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
