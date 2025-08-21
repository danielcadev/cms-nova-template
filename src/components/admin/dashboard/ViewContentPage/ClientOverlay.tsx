'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'

interface ClientOverlayProps {
  children: React.ReactNode
  minDurationMs?: number
}

export function ClientOverlay({ children, minDurationMs = 500 }: ClientOverlayProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), Math.max(0, minDurationMs))
    return () => clearTimeout(timer)
  }, [minDurationMs])

  return (
    <div className="relative">
      {children}
      {visible && (
        <AdminLoading
          title="Content Library"
          message="Preparing your content..."
          variant="content"
          fullScreen
        />
      )}
    </div>
  )
}
