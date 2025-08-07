'use client'

import { memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Save, AlertCircle, CheckCircle2, Cloud } from 'lucide-react'

interface AutosaveIndicatorProps {
  isAutosaving: boolean
  lastSaved: Date | null
  hasUnsavedChanges: boolean
  error: string | null
  onForceSave?: () => void
  className?: string
}

export const AutosaveIndicator = memo(function AutosaveIndicator({
  isAutosaving,
  lastSaved,
  hasUnsavedChanges,
  error,
  onForceSave,
  className = ''
}: AutosaveIndicatorProps) {
  const formatLastSaved = (date: Date) => {
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) {
      return 'hace unos segundos'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`
    } else {
      return date.toLocaleTimeString('es-ES', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }
  }

  const getStatusInfo = () => {
    if (error) {
      return {
        icon: AlertCircle,
        text: 'Error al guardar',
        variant: 'destructive' as const,
        color: 'text-red-500'
      }
    }
    
    if (isAutosaving) {
      return {
        icon: Loader2,
        text: 'Guardando...',
        variant: 'secondary' as const,
        color: 'text-blue-500',
        animate: true
      }
    }
    
    if (hasUnsavedChanges) {
      return {
        icon: Cloud,
        text: 'Cambios sin guardar',
        variant: 'outline' as const,
        color: 'text-orange-500'
      }
    }
    
    if (lastSaved) {
      return {
        icon: CheckCircle2,
        text: `Guardado ${formatLastSaved(lastSaved)}`,
        variant: 'secondary' as const,
        color: 'text-green-500'
      }
    }
    
    return {
      icon: Cloud,
      text: 'No guardado',
      variant: 'outline' as const,
      color: 'text-gray-500'
    }
  }

  const status = getStatusInfo()
  const Icon = status.icon

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant={status.variant} className="flex items-center gap-1">
        <Icon 
          className={`h-3 w-3 ${status.color} ${status.animate ? 'animate-spin' : ''}`} 
        />
        <span className="text-xs">{status.text}</span>
      </Badge>
      
      {(hasUnsavedChanges || error) && onForceSave && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onForceSave}
          disabled={isAutosaving}
          className="h-6 px-2 text-xs"
        >
          <Save className="h-3 w-3 mr-1" />
          Guardar
        </Button>
      )}
    </div>
  )
})

AutosaveIndicator.displayName = 'AutosaveIndicator'
