'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'
import { prisma } from '@/lib/prisma'
import type { PlanFormValues } from '@/schemas/plan'

// Función para actualizar plan con objeto JavaScript (para auto-save)
export async function updatePlanDataAction(planId: string, data: PlanFormValues) {
  try {
    if (!planId) {
      return { success: false, error: 'Plan ID is required' }
    }

    // Verificar que el plan existe
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true }
    })

    if (!existingPlan) {
      return { success: false, error: 'Plan not found' }
    }

    // Actualizar el plan en la base de datos
    await prisma.plan.update({
      where: { id: planId },
      data: {
        mainTitle: data.mainTitle,
        destinationId: data.destinationId,
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
        includes: typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes || []),
        notIncludes: data.notIncludes,
        itinerary: data.itinerary || [],
        priceOptions: data.priceOptions || [],
        mainImage: data.mainImage,
        generalPolicies: data.generalPolicies,
        transportOptions: data.transportOptions || [],
        videoUrl: data.videoUrl,
      },
    })

    revalidatePath('/admin/dashboard/plans')
    revalidatePath(`/admin/dashboard/plans/edit/${planId}`)

    return { success: true }
  } catch (error) {
    console.error('❌ Error updating plan data:', error)
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'A plan with this alias already exists. Please use a different alias.' }
      }
      if (error.message.includes('Foreign key constraint')) {
        return { success: false, error: 'Invalid destination selected. Please choose a valid destination.' }
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
    // Crear el plan borrador en la base de datos
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    
    // Generar un articleAlias único
    let articleAlias = data.articleAlias || `plan-${timestamp}-${randomSuffix}`
    
    // Verificar si ya existe y generar uno nuevo si es necesario
    const existingPlan = await prisma.plan.findUnique({
      where: { articleAlias }
    })
    
    if (existingPlan) {
      articleAlias = `plan-${timestamp}-${randomSuffix}-${Math.random().toString(36).substring(2, 4)}`
    }
    
    const newPlan = await prisma.plan.create({
      data: {
        mainTitle: data.mainTitle || 'Plan sin título',
        destinationId: data.destinationId || null,
        allowGroundTransport: data.allowGroundTransport || false,
        articleAlias,
        categoryAlias: data.categoryAlias || `categoria-${timestamp}`,
        section: data.section || 'planes', // Default section
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

    // Debug removed

    // Revalidar la caché
    revalidatePath('/admin/dashboard/plans')

    return { success: true, planId: newPlan.id }
  } catch (error) {
    console.error('❌ Error creating draft plan:', error)
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'A plan with this alias already exists. Please try again.' }
      }
      if (error.message.includes('Foreign key constraint')) {
        return { success: false, error: 'Invalid destination selected. Please choose a valid destination.' }
      }
      return { success: false, error: `Database error: ${error.message}` }
    }
    
    return { success: false, error: 'Failed to create draft plan' }
  }
}

export async function updatePlanAction(_prevState: any, formData: FormData) {
  try {
    const planId = formData.get('planId') as string

    if (!planId) {
      return { success: false, error: 'Plan ID is required' }
    }

    // Extraer datos del FormData
    const data: Partial<PlanFormValues> = {}

    // Convertir FormData a objeto (parseo seguro solo cuando parece JSON)
    const looksLikeJson = (str: string) => {
      const s = str?.trim()
      return (
        !!s && ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']')))
      )
    }
    // Debug removed: keys of formData

    for (const [key, value] of formData.entries()) {
      if (key === 'planId') continue
      const raw = value as string
      if (typeof raw === 'string' && looksLikeJson(raw)) {
        try {
          data[key as keyof PlanFormValues] = JSON.parse(raw)
          continue
        } catch {
          console.warn('[updatePlanAction] JSON.parse failed', {
            key,
            preview: (raw ?? '').slice(0, 80),
          })
          // fall through to assign raw
        }
      }
      // Coerciones seguras por campo conocido
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
          // When UI sends an empty string or a transient non-JSON value, coerce to []
          if (v === '' || v === undefined || v === null) {
            data[key as keyof PlanFormValues] = [] as any
          } else {
            // If it's already an object/array (from client), trust it
            // Otherwise fallback to [] to avoid JSON.parse errors downstream
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

    // Debug removed: parsed payload summary

    // Actualizar el plan en la base de datos
    await prisma.plan.update({
      where: { id: planId },
      data: {
        mainTitle: data.mainTitle,
        destinationId: data.destinationId,
        allowGroundTransport: data.allowGroundTransport,
        articleAlias: data.articleAlias,
        categoryAlias: data.categoryAlias,
        section: data.section || 'planes', // Add section field
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

    // Debug removed

    revalidatePath('/admin/dashboard/plans')
    revalidatePath(`/admin/dashboard/plans/edit/${planId}`)

    return { success: true }
  } catch (error) {
    console.error('❌ Error updating plan:', error)
    
    // Manejo específico de errores de Prisma
    if (error instanceof Error) {
      if (error.message.includes('Unique constraint')) {
        return { success: false, error: 'A plan with this alias already exists. Please use a different alias.' }
      }
      if (error.message.includes('Foreign key constraint')) {
        return { success: false, error: 'Invalid destination selected. Please choose a valid destination.' }
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
    if (!planId) {
      return { success: false, error: 'ID del plan es requerido' }
    }

    // Verificar que el plan existe antes de eliminarlo
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true, mainTitle: true },
    })

    if (!existingPlan) {
      return { success: false, error: 'Plan no encontrado' }
    }

    // Eliminar el plan de la base de datos
    await prisma.plan.delete({
      where: { id: planId },
    })

    // Debug removed

    // Revalidar las rutas para actualizar la caché
    revalidatePath('/admin/dashboard/plans')
    revalidatePath('/admin/dashboard/templates/tourism')

    return {
      success: true,
      message: 'Plan eliminado exitosamente',
      deletedPlan: existingPlan,
    }
  } catch (error) {
    console.error('❌ Error deleting plan:', error)
    return {
      success: false,
      error: 'Error al eliminar el plan. Inténtalo de nuevo.',
    }
  }
}

/**
 * Publish a plan and ensure public URL aliases are set
 */
export async function publishPlanAction(
  planId: string,
  opts?: { articleAlias?: string; categoryAlias?: string; section?: string },
) {
  try {
    if (!planId) return { success: false, error: 'Plan ID is required' }

    const existing = await prisma.plan.findUnique({ where: { id: planId } })
    if (!existing) return { success: false, error: 'Plan not found' }

    // Build aliases
    const baseArticle =
      opts?.articleAlias ||
      existing.articleAlias ||
      slugify(existing.mainTitle || 'plan', { lower: true, strict: true })
    // Prefer destination name as first url segment
    let baseCategory = opts?.categoryAlias || existing.categoryAlias
    if (!baseCategory && existing.destinationId) {
      const dest = await prisma.destination.findUnique({
        where: { id: existing.destinationId },
        select: { name: true },
      })
      if (dest?.name) baseCategory = slugify(dest.name, { lower: true, strict: true })
    }
    // Do not force 'planes' default; keep empty if missing to avoid wrong prefix

    // Ensure unique articleAlias if constraint exists
    let articleAlias = baseArticle
    if (existing.articleAlias !== articleAlias) {
      let suffix = 1
      // If another plan has same articleAlias, append -n
      // articleAlias is unique in schema
      // Try until success
      // We do a probe query; if occupied, increment
      // To avoid race, final uniqueness is guaranteed by DB constraint
      // but this reduces retries
      // Intentional infinite loop for retry logic
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

    // Revalidate admin and public paths
    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath(`/admin/dashboard/templates/tourism/edit/${planId}`)
    revalidatePath(publicPath)

    return { success: true, publicPath }
  } catch (error) {
    console.error('❌ Error publishing plan:', error)
    return { success: false, error: 'Failed to publish plan' }
  }
}

// Función para despublicar un plan
export async function unpublishPlanAction(planId: string) {
  try {
    if (!planId) return { success: false, error: 'Plan ID is required' }

    const existing = await prisma.plan.findUnique({ where: { id: planId } })
    if (!existing) return { success: false, error: 'Plan not found' }

    await prisma.plan.update({
      where: { id: planId },
      data: { published: false },
    })

    // Revalidate admin paths
    revalidatePath('/admin/dashboard/templates/tourism')
    revalidatePath(`/admin/dashboard/templates/tourism/edit/${planId}`)
    
    // Revalidate public paths
    revalidatePath('/planes')

    return { success: true, message: 'Plan unpublished successfully!' }
  } catch (error) {
    console.error('❌ Error unpublishing plan:', error)
    return { success: false, error: 'Failed to unpublish plan' }
  }
}
