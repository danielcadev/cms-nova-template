import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import logger from '@/utils/logger'

export async function GET(request: Request) {
  try {
    const rl = rateLimit(request, { limit: 60, windowMs: 60_000, key: 'categories:GET' })
    if (!rl.allowed) return NextResponse.json({ error: 'Too many requests' }, { status: 429 })

    const plans = await prisma.plan.findMany({
      select: { categoryAlias: true },
      where: { categoryAlias: { not: '' } },
      distinct: ['categoryAlias'],
      orderBy: { categoryAlias: 'asc' },
    })

    const categories = plans
      .map((plan) => plan.categoryAlias)
      .filter(Boolean)
      .map((categoryAlias) => ({
        label: categoryAlias?.charAt(0).toUpperCase() + categoryAlias?.slice(1),
        value: categoryAlias!,
      }))

    return NextResponse.json(categories)
  } catch (error) {
    logger.error('Error getting categories:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
