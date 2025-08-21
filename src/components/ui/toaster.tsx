'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast key={id} {...props} className="min-w-[320px] max-w-[420px] shadow rounded-lg">
          <div className="flex gap-3 items-start">
            {variant === 'destructive' ? (
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            ) : (
              <CheckCircle className="h-5 w-5 theme-text-secondary mt-0.5" />
            )}
            <div className="grid gap-1">
              {title && <ToastTitle className="font-medium theme-text">{title}</ToastTitle>}
              {description && (
                <ToastDescription className="theme-text-secondary">{description}</ToastDescription>
              )}
            </div>
          </div>
          {action}
          <ToastClose className="theme-text-secondary hover:theme-text opacity-80 hover:opacity-100" />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  )
}
