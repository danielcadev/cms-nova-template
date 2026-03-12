import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'
import { ApiResponseBuilder as R } from '@/utils/api-response'

const planSchema = z
  .object({
    mainTitle: z.string().min(1),
    articleAlias: z.string().optional(),
    promotionalText: z.string().optional(),
    published: z.boolean().optional(),
  })
  .passthrough()

export async function GET(req: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req, { limit: 60, windowMs: 60_000, key: 'plans:GET' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const plans = await prisma.plan.findMany({ orderBy: { createdAt: 'desc' } })
    const formattedPlans = plans.map((plan) => ({
      id: plan.id,
      mainTitle: plan.mainTitle,
      published: plan.published,
      createdAt: plan.createdAt,
      articleAlias: plan.articleAlias,
      promotionalText: plan.promotionalText,
    }))

    return NextResponse.json({ success: true, plans: formattedPlans })
  } catch (error) {
    logger.error('Error getting plans', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession()
    if (!session) return R.error('Unauthorized', 401)

    const rl = rateLimit(req, { limit: 20, windowMs: 60_000, key: 'plans:POST' })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const body = await req.json().catch(() => ({}))
    const parsed = planSchema.safeParse(body)
    if (!parsed.success) {
      return R.validationError(
        'Invalid data',
        parsed.error.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
          code: e.code,
        })),
      )
    }

    const { mainTitle, articleAlias, promotionalText, published } = parsed.data
    const newPlan = await prisma.plan.create({
      data: {
        mainTitle,
        articleAlias: articleAlias || `plan-${Date.now()}`,
        promotionalText: promotionalText || '',
        published: published ?? false,
        categoryAlias: 'general',
        attractionsTitle: '',
        attractionsText: '',
        transfersTitle: '',
        transfersText: '',
        holidayTitle: '',
        holidayText: '',
        includes: '',
        notIncludes: '',
      },
    })

    return R.success({ plan: newPlan }, 'Plan created', 201)
  } catch (error) {
    logger.error('Error creating plan', error)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
