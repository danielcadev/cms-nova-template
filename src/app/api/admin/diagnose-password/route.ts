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

    const rl = rateLimit(request, {
      limit: 5,
      windowMs: 60_000,
      key: 'admin:diagnose-password:GET',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const problemUser = await prisma.user.findUnique({
      where: { email: 'daniel.ca.pe207@gmail.com' },
      include: { accounts: { where: { providerId: 'credential' } } },
    })

    if (!problemUser) return R.error('User not found', 404)

    const userPassword = problemUser.password
    const accountPassword = problemUser.accounts[0]?.password

    const diagnosis = {
      user: {
        id: problemUser.id,
        email: problemUser.email,
        hasPassword: !!userPassword,
        passwordLength: userPassword?.length || 0,
        passwordStartsWith: userPassword?.substring(0, 10) || 'N/A',
        passwordType: detectPasswordType(userPassword),
      },
      account: {
        exists: !!problemUser.accounts[0],
        hasPassword: !!accountPassword,
        passwordLength: accountPassword?.length || 0,
        passwordStartsWith: accountPassword?.substring(0, 10) || 'N/A',
        passwordType: detectPasswordType(accountPassword),
        providerId: problemUser.accounts[0]?.providerId || 'N/A',
      },
      comparison: {
        passwordsMatch: userPassword === accountPassword,
        bothExist: !!userPassword && !!accountPassword,
      },
    }

    return NextResponse.json({ success: true, diagnosis })
  } catch (error) {
    logger.error('Error in password diagnosis:', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

function detectPasswordType(password: string | null | undefined): string {
  if (!password) return 'none'
  if (password.startsWith('$2')) return 'bcrypt'
  if (password.startsWith('$argon2')) return 'argon2'
  if (/^[a-f0-9]+$/.test(password)) return 'hex (possibly scrypt)'
  if (/^[A-Za-z0-9+/]+=*$/.test(password)) return 'base64'
  return 'unknown format'
}
