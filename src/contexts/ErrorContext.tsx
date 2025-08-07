'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import logger from '@/utils/logger';

// Tipos de error que podemos manejar
export enum ErrorType {
  VALIDATION = 'validation',
  API = 'api',
  AUTHENTICATION = 'auth',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

// Estructura estándar para errores en la aplicación
export interface AppError {
  type: ErrorType;
  message: string;
  details?: unknown;
  timestamp: Date;
}

// Interfaz del contexto de errores
interface ErrorContextType {
  errors: AppError[];
  hasErrors: boolean;
  captureError: (error: Error | unknown, type?: ErrorType, showToast?: boolean) => void;
  clearErrors: () => void;
  clearError: (index: number) => void;
}

// Crear el contexto
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Proveedor del contexto de errores
export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>([]);
  const { toast } = useToast();

  // Determinar si hay errores
  const hasErrors = errors.length > 0;

  // Función para capturar errores
  const captureError = useCallback((
    error: Error | unknown, 
    type: ErrorType = ErrorType.UNKNOWN,
    showToast = true
  ) => {
    let message = 'Ocurrió un error inesperado';
    let details: unknown;

    // Procesar el error según su tipo
    if (error instanceof Error) {
      message = error.message;
      details = error.stack;
    } else if (typeof error === 'string') {
      message = error;
    } else if (error && typeof error === 'object') {
      message = (error as Record<string, unknown>).message as string || message;
      details = error;
    }

    // Crear el objeto de error estandarizado
    const appError: AppError = {
      type,
      message,
      details,
      timestamp: new Date(),
    };

    // Guardar el error en el estado
    setErrors(prev => [...prev, appError]);

    // Registrar el error en el sistema de logs
    logger.error('Error capturado:', appError);

    // Mostrar una notificación toast si se solicita
    if (showToast) {
      const title = type === ErrorType.VALIDATION 
        ? 'Error de validación' 
        : type === ErrorType.API 
          ? 'Error de API' 
          : type === ErrorType.AUTHENTICATION 
            ? 'Error de autenticación'
            : type === ErrorType.NETWORK
              ? 'Error de red'
              : 'Error';

      toast({
        variant: "destructive",
        title,
        description: message,
      });
    }
  }, [toast]);

  // Función para limpiar todos los errores
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  // Función para limpiar un error específico
  const clearError = useCallback((index: number) => {
    setErrors(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Valor del contexto
  const contextValue: ErrorContextType = {
    errors,
    hasErrors,
    captureError,
    clearErrors,
    clearError,
  };

  return (
    <ErrorContext.Provider value={contextValue}>
      {children}
    </ErrorContext.Provider>
  );
}

// Hook para usar el contexto de errores
export function useErrors() {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrors debe ser usado dentro de un ErrorProvider');
  }
  return context;
}

// Hook para simplificar la captura de errores
export function useCaptureError() {
  const { captureError } = useErrors();
  return captureError;
}

// Componente de orden superior (HOC) para envolver componentes y capturar sus errores
export function withErrorHandling<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  const ComponentWithErrorHandling: React.FC<P> = (props) => {
    const { captureError } = useErrors();

    try {
      return <Component {...props} />;
    } catch (error) {
      captureError(error);
      return <div>Ocurrió un error al cargar este componente.</div>;
    }
  };

  return ComponentWithErrorHandling;
} 
