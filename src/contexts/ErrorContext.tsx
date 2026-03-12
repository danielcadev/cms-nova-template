'use client'

import type React from 'react'
import { createContext, type ReactNode, useCallback, useContext, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import logger from '@/server/observability/logger'

// Error types the app can categorize.
export enum ErrorType {
  VALIDATION = 'validation',
  API = 'api',
  AUTHENTICATION = 'auth',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

// Standardized error shape for app-level errors.
export interface AppError {
  type: ErrorType
  message: string
  details?: unknown
  timestamp: Date
}

// Error context interface.
interface ErrorContextType {
  errors: AppError[]
  hasErrors: boolean
  captureError: (error: Error | unknown, type?: ErrorType, showToast?: boolean) => void
  clearErrors: () => void
  clearError: (index: number) => void
}

// Create the context.
const ErrorContext = createContext<ErrorContextType | undefined>(undefined)

// Error context provider.
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([])
  const { toast } = useToast()

  // Whether any errors are currently captured.
  const hasErrors = errors.length > 0

  // Capture and optionally toast an error.
  const captureError = useCallback(
    (error: Error | unknown, type: ErrorType = ErrorType.UNKNOWN, showToast = true) => {
      let message = 'An unexpected error occurred'
      let details: unknown

      // Normalize the error shape.
      if (error instanceof Error) {
        message = error.message
        details = error.stack
      } else if (typeof error === 'string') {
        message = error
      } else if (error && typeof error === 'object') {
        message = ((error as Record<string, unknown>).message as string) || message
        details = error
      }

      // Build the standardized error object.
      const appError: AppError = {
        type,
        message,
        details,
        timestamp: new Date(),
      }

      // Save the error in state
      setErrors((prev) => [...prev, appError])

      // Log to the centralized logger.
      logger.error('Error captured:', appError)

      // Show a toast notification if requested
      if (showToast) {
        const title =
          type === ErrorType.VALIDATION
            ? 'Validation error'
            : type === ErrorType.API
              ? 'API error'
              : type === ErrorType.AUTHENTICATION
                ? 'Authentication error'
                : type === ErrorType.NETWORK
                  ? 'Network error'
                  : 'Error'

        toast({
          variant: 'destructive',
          title,
          description: message,
        })
      }
    },
    [toast],
  )

  // Function to clear all errors
  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  // Clear a single error by index.
  const clearError = useCallback((index: number) => {
    setErrors((prev) => prev.filter((_, i) => i !== index))
  }, [])

  // Context value.
  const contextValue: ErrorContextType = {
    errors,
    hasErrors,
    captureError,
    clearErrors,
    clearError,
  }

  return <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>
}

// Hook to access the error context.
export function useErrors() {
  const context = useContext(ErrorContext)
  if (context === undefined) {
    throw new Error('useErrors must be used within an ErrorProvider')
  }
  return context
}

// Convenience hook for captureError.
export function useCaptureError() {
  const { captureError } = useErrors()
  return captureError
}

// Higher-order component (HOC) that catches render errors.
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>,
): React.FC<P> {
  const ComponentWithErrorHandling: React.FC<P> = (props) => {
    const { captureError } = useErrors()

    try {
      return <Component {...props} />
    } catch (error) {
      captureError(error)
      return <div>There was an error loading this component.</div>
    }
  }

  return ComponentWithErrorHandling
}
