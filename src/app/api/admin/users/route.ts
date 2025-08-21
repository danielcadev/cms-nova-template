import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'
export async function GET(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request, { limit: 30, windowMs: 60_000, key: 'admin:users:GET' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const users = await prisma.user.findMany()

    // Legacy shape expected by UI: top-level users array
    return NextResponse.json({ success: true, users })
  } catch (error) {
    logger.error('Error in /api/admin/users:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  }
}
