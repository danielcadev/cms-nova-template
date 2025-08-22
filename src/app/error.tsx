'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error for debugging
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Algo salió mal</h1>
        <p className="text-gray-600">
          Hemos encontrado un error inesperado. Puedes intentar recargar la página.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Button onClick={() => reset()}>Reintentar</Button>
          <Button variant="outline" onClick={() => (window.location.href = '/')}>
            Ir al inicio
          </Button>
        </div>
      </div>
    </div>
  )
}
