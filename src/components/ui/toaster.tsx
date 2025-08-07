"use client"

import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast key={id} {...props} className={`
            ${variant === 'destructive' ? 'border-red-400 bg-red-50' : 'border-emerald-400 bg-emerald-50/90'}
            backdrop-blur-sm shadow-lg rounded-xl
            p-4 min-w-[300px]
          `}>
            <div className="flex gap-3">
              {variant === 'destructive' ? (
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              ) : (
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
              )}
              <div className="grid gap-1">
                {title && (
                  <ToastTitle className={`font-semibold ${variant === 'destructive' ? 'text-red-700' : 'text-emerald-700'}`}>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className={variant === 'destructive' ? 'text-red-600' : 'text-emerald-600'}>
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className={`
              ${variant === 'destructive' ? 'text-red-500 hover:text-red-700' : 'text-emerald-500 hover:text-emerald-700'}
              opacity-80 hover:opacity-100
            `} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
