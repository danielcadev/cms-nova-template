'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from '../contexts/AuthContext'
import type { NovaConfig } from '../types'

interface NovaAdminProviderProps {
  children: ReactNode
  config: NovaConfig
}

export function NovaAdminProvider({ children, config }: NovaAdminProviderProps) {
  return (
    <AuthProvider>
      <div className="nova-admin" data-theme={config.ui?.theme || 'light'}>
        {children}
      </div>
    </AuthProvider>
  )
}
