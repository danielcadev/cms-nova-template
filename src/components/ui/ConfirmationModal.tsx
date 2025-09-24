'use client'

import { AlertTriangle, Ban, FileX, Shield, Trash2, UserX } from 'lucide-react'
import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'

export interface ConfirmationConfig {
  title: string
  description: string
  confirmText: string
  cancelText?: string
  variant?: 'destructive' | 'warning' | 'info'
  icon?: 'delete' | 'ban' | 'warning' | 'shield' | 'file' | 'user' | 'custom'
  customIcon?: React.ComponentType<{ className?: string }>
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  config: ConfirmationConfig
}

const iconMap = {
  delete: Trash2,
  ban: Ban,
  warning: AlertTriangle,
  shield: Shield,
  file: FileX,
  user: UserX,
  custom: AlertTriangle, // fallback
}

const variantConfig = {
  destructive: {
    iconBg: 'bg-red-100 dark:bg-red-900/20',
    iconColor: 'text-red-600 dark:text-red-400',
    buttonBg: 'bg-red-600 hover:bg-red-700',
    buttonBorder: 'border-red-600 hover:border-red-700',
  },
  warning: {
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/20',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    buttonBg: 'bg-yellow-600 hover:bg-yellow-700',
    buttonBorder: 'border-yellow-600 hover:border-yellow-700',
  },
  info: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
    buttonBg: 'bg-blue-600 hover:bg-blue-700',
    buttonBorder: 'border-blue-600 hover:border-blue-700',
  },
}

export function ConfirmationModal({ isOpen, onClose, onConfirm, config }: ConfirmationModalProps) {
  const [isLoading, setIsLoading] = useState(false)

  const variant = config.variant || 'destructive'
  const styling = variantConfig[variant]

  const IconComponent = config.customIcon || iconMap[config.icon || 'warning']

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      await onConfirm()
      onClose()
    } catch (_error) {
      // El error se maneja en el componente padre
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md mx-4 sm:mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
        <AlertDialogHeader>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 text-center sm:text-left">
            <div
              className={`flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl ${styling.iconBg}`}
            >
              <IconComponent
                className={`h-5 w-5 sm:h-6 sm:w-6 ${styling.iconColor}`}
                strokeWidth={1.5}
              />
            </div>
            <AlertDialogTitle className="text-gray-900 dark:text-gray-100 text-base sm:text-lg font-semibold">
              {config.title}
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="sm:pl-15 pt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed text-center sm:text-left">
            {config.description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="pt-4 sm:pt-6 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel asChild onClick={onClose} disabled={isLoading}>
            <Button
              variant="outline"
              className="w-full sm:w-auto border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm sm:text-base"
            >
              {config.cancelText || 'Cancelar'}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={handleConfirm}
              disabled={isLoading}
              className={`w-full sm:w-auto ${styling.buttonBg} text-white ${styling.buttonBorder} gap-2 text-sm sm:text-base`}
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span className="hidden sm:inline">Procesando...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <IconComponent className="h-4 w-4" />
                  {config.confirmText}
                </>
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
