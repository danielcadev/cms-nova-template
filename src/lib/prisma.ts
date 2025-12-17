import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

declare global {
  // Global variable for Prisma client in development
  var __prisma: PrismaClient | undefined
}

const connectionString = `${process.env.DATABASE_URL}`

const createPrismaClient = () => {
  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({
    adapter,
    log: ['query'],
  })
}

export const prisma = globalThis.__prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalThis.__prisma = prisma
