import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { admin } from 'better-auth/plugins'
import { prisma } from './prisma'

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
  // Configuración optimizada para Coolify
  trustedOrigins: process.env.NODE_ENV === 'production' 
    ? [
        'https://www.conociendocolombia.com',
        'http://www.conociendocolombia.com', // HTTP también por si Coolify lo necesita
        process.env.NEXT_PUBLIC_APP_URL,
        process.env.BETTER_AUTH_URL,
        // Coolify puede usar URLs internas
        ...(process.env.COOLIFY_URL ? [process.env.COOLIFY_URL] : []),
        ...(process.env.APP_URL ? [process.env.APP_URL] : []),
      ].filter(Boolean) as string[]
    : ['http://localhost:3000', 'http://localhost:3001'],
  plugins: [admin()],
})
