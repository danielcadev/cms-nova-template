import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { nextCookies } from 'better-auth/next-js'
import { prisma } from './prisma'

// Configuración segura de orígenes confiables
const getTrustedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    return [
      // Ambos dominios - con y sin www
      'https://www.conociendocolombia.com',
      'https://conociendocolombia.com',
      // Solo agregar otros orígenes si están definidos explícitamente
      ...(process.env.NEXT_PUBLIC_APP_URL ? [process.env.NEXT_PUBLIC_APP_URL] : []),
    ].filter(Boolean) as string[]
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
