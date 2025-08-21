import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const createEntrySchema = z.object({
  contentTypeId: z.string().min(1),
  data: z.any(),
})

// POST: Create content entry
import { getAdminSession } from '@/lib/server-session'
export async function POST(request: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(request, { limit: 20, windowMs: 60_000, key: 'content-entries:POST' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const body = await request.json().catch(() => ({}))
    const parsed = createEntrySchema.safeParse(body)
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

    const { contentTypeId, data } = parsed.data

    const contentType = await prisma.contentType.findUnique({ where: { id: contentTypeId } })
    if (!contentType) return R.error('Content type not found', 404)

    const contentEntry = await prisma.contentEntry.create({
      data: { contentTypeId, data: JSON.stringify(data), status: 'draft' },
    })

    return R.success(contentEntry, 'Entry created', 201)
  } catch (error) {
    logger.error('Error creating content entry:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// GET: Get content entries (optional filters)
export async function GET(request: Request) {
  try {
    const rl = rateLimit(request, { limit: 60, windowMs: 60_000, key: 'content-entries:GET' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const { searchParams } = new URL(request.url)
    const contentTypeId = searchParams.get('contentTypeId')

    const where = contentTypeId ? { contentTypeId } : {}

    const entries = await prisma.contentEntry.findMany({
      where,
      include: { contentType: true },
      orderBy: { createdAt: 'desc' },
    })

    // Legacy shape compatibility for consumers expecting top-level entries array
    return NextResponse.json({ success: true, entries })
  } catch (error) {
    logger.error('Error getting content entries:', error)
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}
