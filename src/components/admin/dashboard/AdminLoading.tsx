'use client'

import { Loader2 } from 'lucide-react'
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
    const overlayBase = 'z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center'
    const contentOverlay = 'fixed top-0 right-0 bottom-0 left-0 md:left-72'
    const overlayClass = isPage
      ? `fixed inset-0 ${overlayBase}`
      : `${contentOverlay} ${overlayBase}`
    return (
      <div className={overlayClass}>
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white shadow-xl p-8 text-center">
          {title && <h1 className="text-lg font-bold tracking-tight text-zinc-900">{title}</h1>}
          <div className="mt-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-zinc-900 animate-spin" />
          </div>
          <p className="mt-4 text-sm text-zinc-500 font-medium">{message}</p>
          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div
              className="h-full rounded-full bg-zinc-900 transition-[width] duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={isPage ? 'min-h-screen bg-zinc-50/50' : ''}>
      <div
        className={
          isPage ? 'flex items-center justify-center min-h-[calc(100vh-2rem)] px-6 py-8' : ''
        }
      >
        <div
          className={`w-full ${isPage ? 'max-w-md mx-auto' : ''} rounded-2xl border border-zinc-200 bg-white shadow-sm p-8 text-center`}
        >
          {title && <h1 className="text-lg font-bold tracking-tight text-zinc-900">{title}</h1>}

          <div className="mt-6 flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-zinc-900 animate-spin" />
          </div>

          <p className="mt-4 text-sm text-zinc-500 font-medium">{message}</p>

          <div className="mt-6 h-1 w-full overflow-hidden rounded-full bg-zinc-100">
            <div className="h-full w-1/3 animate-[loadingbar_1.2s_ease-in-out_infinite] bg-zinc-900 rounded-full" />
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
    <div className="min-h-screen bg-zinc-50/50">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="space-y-6">
          {title ? (
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">{title}</h1>
          ) : (
            <div className="h-8 w-56 rounded-lg bg-zinc-200 animate-pulse" />
          )}

          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 4 }, () => (
              <div
                key={crypto.randomUUID()}
                className="h-24 flex-1 min-w-[140px] rounded-xl border border-zinc-200 bg-white animate-pulse"
              />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, () => (
            <div
              key={crypto.randomUUID()}
              className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="h-12 w-12 rounded-xl bg-zinc-100 animate-pulse" />
                <div className="h-5 w-20 rounded-md bg-zinc-100 animate-pulse" />
              </div>

              <div className="space-y-3">
                <div className="h-4 w-3/4 rounded bg-zinc-100 animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-zinc-100 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Loader2 className="h-8 w-8 text-zinc-300 animate-spin" />
        </div>
      </div>
    </div>
  )
}
