'use client'

import { AlertCircle, Check, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

export type AutosaveState = 'idle' | 'saving' | 'saved' | 'error'

interface AutosaveStatusProps {
  status: AutosaveState
  lastSaved?: Date
  className?: string
}

export function AutosaveStatus({ status, lastSaved, className = '' }: AutosaveStatusProps) {
  const [showStatus, setShowStatus] = useState(false)

  useEffect(() => {
    if (status === 'saving' || status === 'saved' || status === 'error') {
      setShowStatus(true)

      if (status === 'saved') {
        const timer = setTimeout(() => {
          setShowStatus(false)
        }, 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [status])

  if (!showStatus && status === 'idle') {
    return null
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'saving':
        return {
          icon: Clock,
          text: 'Saving...',
          className: 'text-blue-600 bg-blue-50 border-blue-200',
        }
      case 'saved':
        return {
          icon: Check,
          text: lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Saved',
          className: 'text-green-600 bg-green-50 border-green-200',
        }
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Save failed',
          className: 'text-red-600 bg-red-50 border-red-200',
        }
      default:
        return null
    }
  }

  const config = getStatusConfig()
  if (!config) return null

  const Icon = config.icon

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all duration-200 ${config.className} ${className}`}
    >
      <Icon className="w-4 h-4" />
      <span>{config.text}</span>
    </div>
  )
}
