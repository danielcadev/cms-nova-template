import { PrismaClient } from '@prisma/client'

declare global {
  // Global variable for Prisma client in development
  var __prisma: PrismaClient | undefined
}

const createPrismaClient = () =>
  new PrismaClient({
    log: ['query'],
  })

export const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma
