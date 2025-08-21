import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

export async function GET(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_ADMIN_TOOLS !== 'true') {
      return new NextResponse('Not Found', { status: 404 })
    }
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request, { limit: 10, windowMs: 60_000, key: 'admin:diagnose-auth:GET' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    // Contadores principales
    const totalUsers = await prisma.user.count()
    const totalAccounts = await prisma.account.count()
    const credentialAccounts = await prisma.account.count({ where: { providerId: 'credential' } })

    const usersWithAccounts = await prisma.user.findMany({
      include: {
        accounts: {
          select: { id: true, providerId: true, accountId: true, password: true, createdAt: true },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const usersWithoutCredentialAccount = await prisma.user.findMany({
      where: { accounts: { none: { providerId: 'credential' } } },
      select: { id: true, email: true, name: true, password: true, createdAt: true },
    })

    const problemUser = await prisma.user.findUnique({
      where: { email: 'daniel.ca.pe207@gmail.com' },
      include: { accounts: true },
    })

    const diagnosis = {
      summary: {
        totalUsers,
        totalAccounts,
        credentialAccounts,
        usersWithoutCredentialAccount: usersWithoutCredentialAccount.length,
      },
      problemUser: problemUser
        ? {
            id: problemUser.id,
            email: problemUser.email,
            name: problemUser.name,
            hasPassword: !!problemUser.password,
            emailVerified: problemUser.emailVerified,
            accounts: problemUser.accounts.map((acc) => ({
              providerId: acc.providerId,
              accountId: acc.accountId,
              hasPassword: !!acc.password,
            })),
          }
        : null,
      usersWithoutCredentialAccount: usersWithoutCredentialAccount.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        createdAt: user.createdAt,
      })),
      allUsersWithAccounts: usersWithAccounts.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        hasPassword: !!user.password,
        accounts: user.accounts.map((acc) => ({
          providerId: acc.providerId,
          accountId: acc.accountId,
          hasPassword: !!acc.password,
        })),
      })),
    }

    return NextResponse.json({ success: true, diagnosis })
  } catch (error) {
    logger.error('Error in diagnosis:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
