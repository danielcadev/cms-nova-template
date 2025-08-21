import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

export async function GET(req: NextRequest) {
  try {
    const rl = rateLimit(req as unknown as Request, {
      limit: 60,
      windowMs: 60_000,
      key: 'media:GET',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const { searchParams } = new URL(req.url)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '24', 10), 1), 100)
    const q = (searchParams.get('q') || '').trim()
    const folder = (searchParams.get('folder') || '').trim()
    const sort = (searchParams.get('sort') || 'newest').trim()

    const where: any = {}
    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { alt: { contains: q, mode: 'insensitive' } },
        { key: { contains: q, mode: 'insensitive' } },
        { mimeType: { contains: q, mode: 'insensitive' } },
      ]
    }
    if (folder) where.folder = folder

    const orderBy = (() => {
      switch (sort) {
        case 'oldest':
          return { createdAt: 'asc' } as const
        case 'name-asc':
          return { key: 'asc' } as const
        case 'name-desc':
          return { key: 'desc' } as const
        case 'size-asc':
          return { size: 'asc' } as const
        case 'size-desc':
          return { size: 'desc' } as const
        default:
          return { createdAt: 'desc' } as const
      }
    })()

    const [total, items] = await Promise.all([
      prisma.asset.count({ where }),
      prisma.asset.findMany({ where, orderBy, skip: (page - 1) * pageSize, take: pageSize }),
    ])

    // Legacy/expected shape: return items at top-level for some consumers
    return new Response(JSON.stringify({ success: true, page, pageSize, total, items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    logger.error('Error listing media:', error)
    return R.error('Internal Server Error', 500)
  }
}
