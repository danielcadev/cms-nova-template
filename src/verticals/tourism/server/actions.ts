'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'
import type { PlanFormValues } from '@/verticals/tourism'

export async function updatePlanDataAction(
  planId: string,
  data: PlanFormValues,
  isAutosave = false,
) {
  try {
    const session = await getAdminSession()
    if (!session) return { success: false, error: 'Unauthorized' }

    if (!planId) {
      return { success: false, error: 'Plan ID is required' }
    }

    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true },
    })

    if (!existingPlan) {
      return { success: false, error: 'Plan not found' }
    }

    await prisma.plan.update({
      where: { id: planId },
      data: {
        mainTitle: data.mainTitle,
        allowGroundTransport: data.allowGroundTransport,
        articleAlias: data.articleAlias,
        categoryAlias: data.categoryAlias,
        section: data.section || 'planes',
        promotionalText: data.promotionalText,
        attractionsTitle: data.attractionsTitle,
        attractionsText: data.attractionsText,
        transfersTitle: data.transfersTitle,
        transfersText: data.transfersText,
        holidayTitle: data.holidayTitle,
        holidayText: data.holidayText,
        includes:
          typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes || []),
        notIncludes: data.notIncludes,
        itinerary: data.itinerary || [],
        priceOptions: data.priceOptions || [],
        mainImage: data.mainImage,
        generalPolicies: data.generalPolicies,
        transportOptions: data.transportOptions || [],
        videoUrl: data.videoUrl,
      },
    })

    if (!isAutosave) {
      revalidatePath('/admin/dashboard/templates/tourism')
      revalidatePath(`/admin/dashboard/templates/tourism/edit/${planId}`)
    }

    return { success: true }
  } catch (error) {
    logger.error('Error updating plan data', error)

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'A plan with this alias already exists. Please use a different alias.',
        }
      }
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error: 'Invalid destination selected. Please choose a valid destination.',
        }
      }
      if (error.message.includes('Record to update not found')) {
        return { success: false, error: 'Plan not found. It may have been deleted.' }
      }
      return { success: false, error: `Database error: ${error.message}` }
    }

    return { success: false, error: 'Failed to update plan' }
  }
}

export async function createDraftPlanAction(data: PlanFormValues) {
  try {
    const session = await getAdminSession()
    if (!session) return { success: false, error: 'Unauthorized' }

    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)

    let articleAlias = data.articleAlias || `plan-${timestamp}-${randomSuffix}`

    const existingPlan = await prisma.plan.findUnique({
      where: { articleAlias },
    })

    if (existingPlan) {
      articleAlias = `plan-${timestamp}-${randomSuffix}-${Math.random().toString(36).substring(2, 4)}`
    }

    const newPlan = await prisma.plan.create({
      data: {
        mainTitle: data.mainTitle || 'Untitled plan',
        allowGroundTransport: data.allowGroundTransport || false,
        articleAlias,
        categoryAlias: data.categoryAlias || `category-${timestamp}`,
        section: data.section || 'planes',
        promotionalText: data.promotionalText || '',
        attractionsTitle: data.attractionsTitle || '',
        attractionsText: data.attractionsText || '',
        transfersTitle: data.transfersTitle || '',
        transfersText: data.transfersText || '',
        holidayTitle: data.holidayTitle || '',
        holidayText: data.holidayText || '',
        includes:
          typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes) || '',
        notIncludes: data.notIncludes || '',
        itinerary: data.itinerary || [],
        priceOptions: data.priceOptions || [],
        mainImage: data.mainImage || null,
        generalPolicies: data.generalPolicies || '',
        transportOptions: data.transportOptions || [],
        videoUrl: data.videoUrl || '',
      },
    })

    revalidatePath('/admin/dashboard/templates/tourism')

    return { success: true, planId: newPlan.id }
  } catch (error) {
    logger.error('Error creating draft plan', error)

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'A plan with this alias already exists. Please try again.' }
      }
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error: 'Invalid destination selected. Please choose a valid destination.',
        }
      }
      return { success: false, error: `Database error: ${error.message}` }
    }

    return { success: false, error: 'Failed to create draft plan' }
  }
}

export async function updatePlanAction(_prevState: any, formData: FormData) {
  try {
    const session = await getAdminSession()
    if (!session) return { success: false, error: 'Unauthorized' }

    const planId = formData.get('planId') as string

    if (!planId) {
      return { success: false, error: 'Plan ID is required' }
    }

    const data: Partial<PlanFormValues> = {}

    const looksLikeJson = (str: string) => {
      const s = str?.trim()
      return (
        !!s && ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']')))
      )
    }

    for (const [key, value] of formData.entries()) {
      if (key === 'planId') continue
      const raw = value as string
      if (typeof raw === 'string' && looksLikeJson(raw)) {
        try {
          data[key as keyof PlanFormValues] = JSON.parse(raw)
          continue
        } catch {
          logger.warn('[updatePlanAction] JSON.parse failed', {
            key,
            preview: (raw ?? '').slice(0, 80),
          })
        }
      }

      switch (key) {
        case 'includes':
        case 'priceOptions':
        case 'itinerary':
        case 'transportOptions': {
          const v = value as string
          if (looksLikeJson(v)) {
            try {
              data[key as keyof PlanFormValues] = JSON.parse(v) as any
              break
            } catch {}
          }
          if (v === '' || v === undefined || v === null) {
            data[key as keyof PlanFormValues] = [] as any
          } else {
            data[key as keyof PlanFormValues] = Array.isArray(v) ? (v as any) : ([] as any)
          }
          break
        }
        case 'articleAlias':
        case 'categoryAlias':
        case 'section': {
          const v = String(value || '').trim()
          ;(data as any)[key] = slugify(v, { lower: true, strict: true })
          break
        }
        case 'allowGroundTransport': {
          const v = value as string
          data[key as keyof PlanFormValues] = (v === 'true' || v === '1') as any
          break
        }
        default:
          data[key as keyof PlanFormValues] = value as any
      }
    }

    await prisma.plan.update({
      where: { id: planId },
      data: {
        mainTitle: data.mainTitle,
        allowGroundTransport: data.allowGroundTransport,
        articleAlias: data.articleAlias,
        categoryAlias: data.categoryAlias,
        section: data.section || 'planes',
        promotionalText: data.promotionalText,
        attractionsTitle: data.attractionsTitle,
        attractionsText: data.attractionsText,
        transfersTitle: data.transfersTitle,
        transfersText: data.transfersText,
        holidayTitle: data.holidayTitle,
        holidayText: data.holidayText,
        includes: typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes),
        notIncludes: data.notIncludes,
        itinerary: data.itinerary,
        priceOptions: data.priceOptions,
        mainImage: data.mainImage,
        generalPolicies: data.generalPolicies,
        transportOptions: data.transportOptions,
        videoUrl: data.videoUrl,
      },
    })

    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath(`/admin/dashboard/templates/tourism/edit/${planId}`)

    return { success: true }
  } catch (error) {
    logger.error('Error updating plan', error)

    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return {
          success: false,
          error: 'A plan with this alias already exists. Please use a different alias.',
        }
      }
      if (error.message.includes('Foreign key constraint')) {
        return {
          success: false,
          error: 'Invalid destination selected. Please choose a valid destination.',
        }
      }
      if (error.message.includes('Record to update not found')) {
        return { success: false, error: 'Plan not found. It may have been deleted.' }
      }
      return { success: false, error: `Database error: ${error.message}` }
    }

    return { success: false, error: 'Failed to update plan' }
  }
}

export async function deletePlanAction(planId: string) {
  try {
    const session = await getAdminSession()
    if (!session) return { success: false, error: 'Unauthorized' }

    if (!planId) {
      return { success: false, error: 'Plan ID is required' }
    }

    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true, mainTitle: true },
    })

    if (!existingPlan) {
      return { success: false, error: 'Plan not found' }
    }

    await prisma.plan.delete({
      where: { id: planId },
    })

    revalidatePath('/admin/dashboard/templates/tourism')

    return {
      success: true,
      message: 'Plan deleted successfully',
      deletedPlan: existingPlan,
    }
  } catch (error) {
    logger.error('Error deleting plan', error)
    return {
      success: false,
      error: 'Failed to delete the plan. Please try again.',
    }
  }
}

export async function publishPlanAction(
  planId: string,
  opts?: { articleAlias?: string; categoryAlias?: string; section?: string },
) {
  try {
    const session = await getAdminSession()
    if (!session) return { success: false, error: 'Unauthorized' }

    if (!planId) return { success: false, error: 'Plan ID is required' }

    const existing = await prisma.plan.findUnique({ where: { id: planId } })
    if (!existing) return { success: false, error: 'Plan not found' }

    const baseArticle =
      opts?.articleAlias ||
      existing.articleAlias ||
      slugify(existing.mainTitle || 'plan', { lower: true, strict: true })
    const baseCategory = opts?.categoryAlias || existing.categoryAlias

    let articleAlias = baseArticle
    if (existing.articleAlias !== articleAlias) {
      let suffix = 1
      while (true) {
        const found = await prisma.plan.findUnique({ where: { articleAlias } })
        if (!found || found.id === planId) break
        articleAlias = `${baseArticle}-${++suffix}`
      }
    }

    const categoryAlias = slugify(baseCategory, { lower: true, strict: true })
    const section = slugify(opts?.section || existing.section || 'planes', {
      lower: true,
      strict: true,
    })

    const updated = await prisma.plan.update({
      where: { id: planId },
      data: {
        articleAlias,
        categoryAlias,
        section,
        published: true,
      },
      select: { id: true, articleAlias: true, categoryAlias: true, section: true },
    })

    const publicPath =
      `/${updated.section}/${updated.categoryAlias || ''}/${updated.articleAlias}`.replace(
        /\/+$/,
        '',
      )

    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath(`/admin/dashboard/templates/tourism/edit/${planId}`)
    revalidatePath(publicPath)
    revalidatePath(`/planes/${updated.categoryAlias}`)
    revalidatePath('/planes')

    return { success: true, publicPath }
  } catch (error) {
    logger.error('Error publishing plan', error)
    return { success: false, error: 'Failed to publish plan' }
  }
}

export async function unpublishPlanAction(planId: string) {
  try {
    const session = await getAdminSession()
    if (!session) return { success: false, error: 'Unauthorized' }

    if (!planId) return { success: false, error: 'Plan ID is required' }

    const existing = await prisma.plan.findUnique({ where: { id: planId } })
    if (!existing) return { success: false, error: 'Plan not found' }

    await prisma.plan.update({
      where: { id: planId },
      data: { published: false },
    })

    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath(`/admin/dashboard/templates/tourism/edit/${planId}`)
    revalidatePath('/planes')
    if (existing.categoryAlias) {
      revalidatePath(`/planes/${existing.categoryAlias}`)
    }

    return { success: true, message: 'Plan unpublished successfully!' }
  } catch (error) {
    logger.error('Error unpublishing plan', error)
    return { success: false, error: 'Failed to unpublish plan' }
  }
}
