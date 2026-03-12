import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { admin } from 'better-auth/plugins'
import { adminAc, userAc } from 'better-auth/plugins/admin/access'
import { prisma } from '@/lib/prisma'

const getTrustedOrigins = () => {
  if (process.env.NODE_ENV === 'production') {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_APP_URL or BETTER_AUTH_URL must be set in production')
    }

    const origins = [baseUrl]

    if (process.env.INCLUDE_WWW_VARIANT === 'true') {
      if (baseUrl.includes('://www.')) {
        origins.push(baseUrl.replace('://www.', '://'))
      } else if (baseUrl.includes('://') && !baseUrl.includes('://www.')) {
        origins.push(baseUrl.replace('://', '://www.'))
      }
    }

    return origins
  }

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
  trustedOrigins: getTrustedOrigins(),
  logger: {
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'error',
    disabled: false,
  },
  plugins: [
    admin({
      adminRoles: ['admin', 'ADMIN'],
      roles: {
        admin: adminAc,
        ADMIN: adminAc,
        user: userAc,
      },
    }),
    nextCookies(),
  ],
})

export default auth
