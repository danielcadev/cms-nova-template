'use client'

import { AlertTriangle, Bell, CheckCircle2, CircleAlert, Info, ShieldAlert } from 'lucide-react'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export function Toaster() {
  const { toasts } = useToast()

  const variantStyles = {
    default: {
      icon: Bell,
      badge:
        'border-neutral-200/80 bg-neutral-100 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300',
      accent:
        'from-neutral-200/80 via-neutral-200/30 to-transparent dark:from-neutral-700/60 dark:via-neutral-700/20',
    },
    success: {
      icon: CheckCircle2,
      badge:
        'border-emerald-300/80 bg-emerald-500/10 text-emerald-600 dark:border-emerald-800/70 dark:bg-emerald-900/40 dark:text-emerald-300',
      accent:
        'from-emerald-300/70 via-emerald-400/30 to-transparent dark:from-emerald-800/60 dark:via-emerald-700/20',
    },
    info: {
      icon: Info,
      badge:
        'border-sky-300/80 bg-sky-500/10 text-sky-600 dark:border-sky-800/70 dark:bg-sky-900/40 dark:text-sky-300',
      accent:
        'from-sky-300/70 via-sky-400/25 to-transparent dark:from-sky-800/60 dark:via-sky-700/20',
    },
    warning: {
      icon: AlertTriangle,
      badge:
        'border-amber-300/80 bg-amber-400/15 text-amber-600 dark:border-amber-800/70 dark:bg-amber-900/35 dark:text-amber-300',
      accent:
        'from-amber-300/70 via-amber-400/25 to-transparent dark:from-amber-800/60 dark:via-amber-700/20',
    },
    destructive: {
      icon: CircleAlert,
      badge:
        'border-red-300/80 bg-red-500/10 text-red-600 dark:border-red-900/70 dark:bg-red-950/40 dark:text-red-300',
      accent:
        'from-red-300/70 via-red-400/30 to-transparent dark:from-red-900/60 dark:via-red-800/20',
    },
  } as const

  return (
    <ToastProvider>
      {toasts.map(({ id, title, description, action, variant, ...props }) => {
        const toneKey = (variant as keyof typeof variantStyles) || 'default'
        const tone = variantStyles[toneKey] ?? variantStyles.default
        const Icon = tone.icon ?? ShieldAlert

        return (
          <Toast
            key={id}
            {...props}
            variant={variant}
            className="relative min-w-[320px] max-w-[420px] overflow-visible"
          >
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-y-0 left-0 w-1 rounded-full bg-gradient-to-b opacity-90',
                tone.accent,
              )}
            />
            <div className="flex w-full items-start gap-4">
              <span
                className={cn(
                  'mt-0.5 flex h-10 w-10 items-center justify-center rounded-full border text-base shadow-sm backdrop-blur-sm',
                  tone.badge,
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <div className="flex flex-1 flex-col gap-1 pr-8">
                {title && (
                  <ToastTitle className="text-sm font-semibold leading-5 text-neutral-900 dark:text-neutral-50">
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className="text-sm leading-5 text-neutral-600 dark:text-neutral-300">
                    {description}
                  </ToastDescription>
                )}
                {action ? <div className="pt-2">{action}</div> : null}
              </div>
            </div>
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
