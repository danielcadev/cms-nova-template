import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const schema = z.object({
  email: z.string().email(),
  newPassword: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_ADMIN_TOOLS !== 'true') {
      return new NextResponse('Not Found', { status: 404 })
    }
    const rl = rateLimit(request, {
      limit: 5,
      windowMs: 60_000,
      key: 'admin:fix-password-format:POST',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const body = await request.json().catch(() => ({}))
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return R.validationError(
        'Invalid data',
        parsed.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      )
    }

    const { email, newPassword } = parsed.data

    const user = await prisma.user.findUnique({
      where: { email },
      include: { accounts: { where: { providerId: 'credential' } } },
    })

    if (!user) return R.error('User not found', 404)
    if (!user.accounts[0]) return R.error('Credential account not found', 404)

    const authContext = await auth.$context
    const hashedPassword = await authContext.password.hash(newPassword)

    await prisma.$transaction(async (tx) => {
      await tx.user.update({ where: { id: user.id }, data: { password: hashedPassword } })
      await tx.account.update({
        where: { id: user.accounts[0].id },
        data: { password: hashedPassword },
      })
    })

    return R.success(
      { id: user.id, email: user.email, name: user.name },
      'Password updated with correct format',
    )
  } catch (error) {
    logger.error('Error fixing password format:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
