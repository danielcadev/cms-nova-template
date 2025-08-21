import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/lib/server-session'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const registerSchema = z.object({
  key: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  folder: z.string().default('uploads'),
  title: z.string().optional().nullable(),
  alt: z.string().optional().nullable(),
  width: z.number().int().positive().optional().nullable(),
  height: z.number().int().positive().optional().nullable(),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req as unknown as Request, {
      limit: 30,
      windowMs: 60_000,
      key: 'media:register:POST',
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const json = await req.json().catch(() => ({}))
    const parsed = registerSchema.safeParse(json)
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

    const { key, url, mimeType, size, folder, title, alt, width, height } = parsed.data

    // Upsert by key to avoid duplicates if re-registered
    const item = await prisma.asset.upsert({
      where: { key },
      update: {
        url,
        mimeType,
        size,
        folder,
        title: title ?? null,
        alt: alt ?? null,
        width: width ?? null,
        height: height ?? null,
      },
      create: {
        key,
        url,
        mimeType,
        size,
        folder,
        title: title ?? null,
        alt: alt ?? null,
        width: width ?? null,
        height: height ?? null,
      },
    })

    return R.success(item, 'Asset registered')
  } catch (error) {
    logger.error('Error registering media asset:', error)
    return R.error('Internal Server Error', 500)
  }
}
