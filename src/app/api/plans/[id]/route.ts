import { revalidatePath } from 'next/cache'
import type { NextRequest } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rateLimit } from '@/lib/rate-limit'
import { ApiResponseBuilder as R } from '@/utils/api-response'
import logger from '@/utils/logger'

const updatePlanSchema = z
  .object({
    published: z.boolean().optional(),
  })
  .refine((payload) => Object.keys(payload).length > 0, {
    message: 'At least one field must be provided',
  })

async function requireAdmin(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  const role = session?.user?.role?.toString().toLowerCase()
  return role === 'admin' || role === 'administrator'
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const rl = rateLimit(request, {
      limit: 60,
      windowMs: 60_000,
      key: `plans:${id}:GET`,
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const plan = await prisma.plan.findUnique({ where: { id } })
    if (!plan) return R.notFound('Plan not found')

    return R.success({ plan }, 'Plan fetched successfully')
  } catch (error) {
    logger.error('Error fetching plan', { error, planId: id })
    return R.error('Internal Server Error', 500)
  }
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const isAdmin = await requireAdmin(request)
    if (!isAdmin) return R.unauthorized('Unauthorized')

    const rl = rateLimit(request, {
      limit: 20,
      windowMs: 60_000,
      key: `plans:${id}:PATCH`,
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const json = await request.json().catch(() => null)
    if (!json || typeof json !== 'object') {
      return R.validationError('Invalid data', [
        {
          field: 'body',
          message: 'Expected a JSON object',
          code: 'invalid_type',
        },
      ])
    }

    const parsed = updatePlanSchema.safeParse(json)
    if (!parsed.success) {
      return R.validationError(
        'Invalid data',
        parsed.error.errors.map((err) => ({
          field: err.path.join('.') || 'body',
          message: err.message,
          code: err.code,
        })),
      )
    }

    const existingPlan = await prisma.plan.findUnique({ where: { id } })
    if (!existingPlan) return R.notFound('Plan not found')

    const dataToUpdate: Record<string, unknown> = {}
    if (parsed.data.published !== undefined) dataToUpdate.published = parsed.data.published

    const updatedPlan = await prisma.plan.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true,
        mainTitle: true,
        articleAlias: true,
        promotionalText: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath('/admin/dashboard/plans')

    return R.success({ plan: updatedPlan }, 'Plan updated successfully')
  } catch (error) {
    logger.error('Error updating plan', { error, planId: id })
    return R.error('Internal Server Error', 500)
  }
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const isAdmin = await requireAdmin(request)
    if (!isAdmin) return R.unauthorized('Unauthorized')

    const rl = rateLimit(request, {
      limit: 10,
      windowMs: 60_000,
      key: `plans:${id}:DELETE`,
    })
    if (!rl.allowed) return R.error('Too many requests. Please try again later.', 429)

    const existingPlan = await prisma.plan.findUnique({ where: { id } })
    if (!existingPlan) return R.notFound('Plan not found')

    const deletedPlan = await prisma.plan.delete({
      where: { id },
      select: {
        id: true,
        mainTitle: true,
        articleAlias: true,
        categoryAlias: true,
        published: true,
        createdAt: true,
      },
    })

    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath('/admin/dashboard/plans')

    return R.success({ plan: deletedPlan }, 'Plan deleted successfully')
  } catch (error) {
    logger.error('Error deleting plan', { error, planId: id })
    return R.error('Internal Server Error', 500)
  }
}
