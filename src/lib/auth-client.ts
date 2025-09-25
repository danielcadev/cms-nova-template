import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

// Determinar la URL base correctamente
const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }
  
  // En producción, usar la URL actual del navegador si está disponible
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Fallback a la variable de entorno o dominio por defecto
  return process.env.NEXT_PUBLIC_APP_URL || 'https://www.conociendocolombia.com'
}

const baseURL = getBaseURL()

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
})

// Debug info para verificar la URL en uso
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 Auth Client Base URL:', baseURL)
}
