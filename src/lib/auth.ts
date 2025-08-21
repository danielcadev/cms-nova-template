// lib/auth.ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { prisma } from './prisma'

// Enforce a required secret in production; provide a safe dev default in development
const getAuthSecret = () => {
  const secret = process.env.BETTER_AUTH_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('BETTER_AUTH_SECRET is required in production')
    }
    return 'cms-nova-default-secret-dev'
  }
  return secret
}

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  secret: getAuthSecret(),
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    admin({
      adminRoles: ['ADMIN', 'admin', 'Admin'],
    }),
    nextCookies(), // debe ir al final para manejo de cookies en Next
  ],
  databaseHooks: {
    user: {
      create: {
        before: async (userData) => {
          // Contamos si ya existe algún usuario en la base de datos.
          const userCount = await prisma.user.count()

          // Si no hay usuarios, este es el primero, así que lo hacemos ADMIN.
          if (userCount === 0) {
            return {
              data: {
                ...userData,
                role: 'ADMIN', // Añadimos el rol de ADMIN aquí.
              },
            }
          }

          // Para todos los demás, devolvemos los datos sin modificar.
          return { data: userData }
        },
      },
    },
  },
})
