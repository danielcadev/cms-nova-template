import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_ADMIN_TOOLS !== 'true') {
      return new NextResponse('Not Found', { status: 404 })
    }
    const rl = rateLimit(request, {
      limit: 5,
      windowMs: 60_000,
      key: 'admin:fix-credential-accounts:POST',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const usersWithoutCredentialAccount = await prisma.user.findMany({
      where: {
        accounts: { none: { providerId: 'credential' } },
        password: { not: null },
      },
      include: { accounts: true },
    })

    if (usersWithoutCredentialAccount.length === 0) {
      return R.success({ fixed: 0, users: [] }, 'All users already have credential accounts')
    }

    const fixedUsers: Array<{ id: string; email: string | null; name: string | null }> = []

    for (const user of usersWithoutCredentialAccount) {
      const hashedPassword = user.password!
      await prisma.account.create({
        data: {
          userId: user.id,
          accountId: user.id,
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })
      fixedUsers.push({ id: user.id, email: user.email, name: user.name })
    }

    return R.success(
      { fixed: fixedUsers.length, users: fixedUsers },
      `${fixedUsers.length} credential accounts created`,
    )
  } catch (error) {
    logger.error('Error fixing credential accounts:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
