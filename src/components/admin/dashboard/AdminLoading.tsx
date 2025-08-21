'use client'

import { useEffect, useState } from 'react'

interface AdminLoadingProps {
  title?: string
  message?: string
  showSkeleton?: boolean
  variant?: 'page' | 'content'
  fullScreen?: boolean
}

export function AdminLoading({
  title,
  message = 'Loading...',
  showSkeleton = false,
  variant = 'page',
  fullScreen = false,
}: AdminLoadingProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!fullScreen) return
    let animationFrame: number
    let startTime: number | null = null
    const durationMs = 1200
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp
      const elapsed = timestamp - startTime
      const t = Math.min(1, elapsed / durationMs)
      const eased = 1 - (1 - t) ** 3
      const target = 90
      setProgress(Math.min(target, Math.max(10, eased * target)))
      if (t < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [fullScreen])

  if (showSkeleton) {
    return <AdminSkeletonLoader title={title} />
  }

  const isPage = variant === 'page'

  if (fullScreen) {
    const overlayBase = 'z-40 theme-bg flex items-center justify-center'
    const contentOverlay = 'fixed top-0 right-0 bottom-0 left-0 md:left-72'
    const overlayClass = isPage
      ? `fixed inset-0 ${overlayBase}`
      : `${contentOverlay} ${overlayBase}`
    return (
      <div className={overlayClass}>
        <div className="w-full max-w-sm rounded-2xl border theme-border theme-card shadow-sm p-6 text-center">
          {title && <h1 className="text-lg font-semibold tracking-tight theme-text">{title}</h1>}
          <div className="mt-4 flex items-center justify-center">
            {/* Spinner usa currentColor (theme-text) para el borde superior */}
            <output
              className="h-7 w-7 rounded-full border-2 theme-border border-t-current text-current theme-text animate-spin"
              style={{ animationDuration: '0.8s' }}
              aria-label="Cargando"
            />
          </div>
          <p className="mt-4 text-sm theme-text-secondary">{message}</p>
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full theme-border">
            <div
              className="h-full rounded-full bg-current theme-text transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={isPage ? 'min-h-screen theme-bg' : ''}>
      <div
        className={
          isPage ? 'flex items-center justify-center min-h-[calc(100vh-2rem)] px-6 py-8' : ''
        }
      >
        <div
          className={`w-full ${isPage ? 'max-w-md mx-auto' : ''} rounded-2xl border theme-border theme-card backdrop-blur-sm shadow-sm p-6 text-center`}
        >
          {title && <h1 className="text-lg font-semibold tracking-tight theme-text">{title}</h1>}

          <div className="mt-4 flex items-center justify-center">
            <output
              className="h-7 w-7 rounded-full border-2 theme-border border-t-current text-current theme-text animate-spin"
              style={{ animationDuration: '0.8s' }}
              aria-label="Cargando"
            />
          </div>

          <p className="mt-4 text-sm theme-text-secondary">{message}</p>

          <div className="mt-6 h-1 w-full overflow-hidden rounded-full theme-border">
            <div className="h-full w-1/3 animate-[loadingbar_1.2s_ease-in-out_infinite] bg-current theme-text rounded-full" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loadingbar {
          0% { transform: translateX(-150%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  )
}

function AdminSkeletonLoader({ title }: { title?: string }) {
  return (
    <div className="min-h-screen theme-bg">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-4">
          {title ? (
            <h1 className="text-2xl font-semibold tracking-tight theme-text">{title}</h1>
          ) : (
            <div className="h-8 w-56 rounded theme-border border animate-pulse" />
          )}

          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }, () => (
              <div
                key={crypto.randomUUID()}
                className="h-16 flex-1 min-w-[140px] rounded-xl border theme-border theme-card animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, () => (
            <div
              key={crypto.randomUUID()}
              className="rounded-xl border theme-border theme-card p-6 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="h-10 w-10 rounded-lg theme-border border animate-pulse" />
                <div className="h-4 w-16 rounded theme-border border animate-pulse" />
              </div>

              <div className="mt-6 space-y-2">
                <div className="h-4 w-3/4 rounded theme-border border animate-pulse" />
                <div className="h-3 w-1/2 rounded theme-border border animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <div
            className="h-6 w-6 rounded-full border-2 theme-border border-t-current text-current theme-text animate-spin"
            style={{ animationDuration: '0.8s' }}
          />
        </div>
      </div>
    </div>
  )
}
