import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from './prisma'

// Configuración segura de orígenes confiables
const getTrustedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL or BETTER_AUTH_URL must be set in production')
    }
    
    const origins = [baseUrl]
    
    // OPCIONAL: Incluir automáticamente tanto www como sin www
    // Establecer INCLUDE_WWW_VARIANT=true para habilitar esta funcionalidad
    if (process.env.INCLUDE_WWW_VARIANT === 'true') {
      if (baseUrl.includes('://www.')) {
        origins.push(baseUrl.replace('://www.', '://'))
      } else if (baseUrl.includes('://') && !baseUrl.includes('://www.')) {
        origins.push(baseUrl.replace('://', '://www.'))
      }
    }
    
    return origins
  }
  
  // En desarrollo, solo localhost
  return ['http://localhost:3000']
}

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  // Configuración mejorada para Coolify
  trustedOrigins: getTrustedOrigins(),
  // Configuración adicional para debugging
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    disabled: false,
  },
  // Plugins - nextCookies DEBE ser el último plugin
  plugins: [admin(), nextCookies()],
})
