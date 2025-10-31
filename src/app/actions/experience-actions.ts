'use server'

import { revalidatePath } from 'next/cache'
import slugify from 'slugify'

import { prisma } from '@/lib/prisma'
import { type ExperienceFormValues, experienceSchema } from '@/schemas/experience'

function generateExperienceTags(data: ExperienceFormValues, locationAlias: string) {
  const tags = new Set<string>()
  const add = (value?: string | null) => {
    const trimmed = value?.trim()
    if (trimmed) {
      tags.add(trimmed)
    }
  }

  add(data.title)
  add(data.location)
  add(locationAlias.replace(/-/g, ' '))
  add(data.durationType)
  add(data.hostName)

  if (Array.isArray(data.scheduleDays)) {
    for (const day of data.scheduleDays) {
      add(day)
    }
  }

  return tags.size > 0 ? Array.from(tags).join(', ') : null
}

function normalizeGallery(gallery?: ExperienceFormValues['gallery']) {
  if (!Array.isArray(gallery)) return null
  const cleaned = gallery
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter((value) => value.length > 0)

  return cleaned.length > 0 ? cleaned.slice(0, 4) : null
}

type ExperienceActionMode = 'draft' | 'publish' | 'publish_view'

export interface CreateExperienceResult {
  success: boolean
  experienceId?: string
  publicPath?: string
  redirectPath?: string
  error?: string
}

export interface UpdateExperienceResult {
  success: boolean
  publicPath?: string
  redirectPath?: string
  error?: string
}

export async function createExperienceAction(
  payload: ExperienceFormValues,
  options: { mode?: ExperienceActionMode } = {},
): Promise<CreateExperienceResult> {
  const parsed = experienceSchema.safeParse(payload)
  if (!parsed.success) {
    const first = parsed.error.issues.at(0)
    return {
      success: false,
      error: first?.message || 'Invalid experience data',
    }
  }

  const data = parsed.data
  const mode = options.mode ?? 'draft'
  const slugBase = data.slug?.trim() || data.title
  const slug = slugify(slugBase, { lower: true, strict: true })
  const locationAlias = data.location
    ? slugify(data.location, { lower: true, strict: true })
    : 'colombia'
  const shouldPublish = mode === 'publish' || mode === 'publish_view'

  try {
    const experience = await (prisma as any).experience.create({
      data: {
        title: data.title,
        slug,
        location: data.location?.trim() || null,
        locationAlias,
        durationType: data.durationType || 'flexible',
        hostName: data.hostName?.trim() || null,
        hostBio: data.hostBio?.trim() || null,
        summary: data.summary,
        narrative: data.narrative,
        activities: data.activities?.trim() || null,
        duration: data.duration?.trim() || null,
        schedule: data.schedule?.trim() || null,
        scheduleDays: data.scheduleDays && data.scheduleDays.length > 0 ? data.scheduleDays : null,
        scheduleNote: data.scheduleNote?.trim() || null,
        price: data.price?.trim() || null,
        currency: data.currency || 'COP',
        inclusions: data.inclusions?.trim() || null,
        exclusions: data.exclusions?.trim() || null,
        gallery: normalizeGallery(data.gallery),
        tags: generateExperienceTags(data, locationAlias),
        featured: data.featured ?? false,
        published: shouldPublish,
      },
    })

    const publicPath = `/experiencias/${locationAlias}/${experience.slug}`
    const redirectPath =
      shouldPublish && mode === 'publish_view'
        ? publicPath
        : '/admin/dashboard/templates/experiences'

    revalidatePath('/admin/dashboard/templates/experiences')
    revalidatePath(publicPath)
    revalidatePath(`/experiencias/${locationAlias}`)

    return {
      success: true,
      experienceId: experience.id,
      publicPath: shouldPublish ? publicPath : undefined,
      redirectPath,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        error: 'Another experience already uses this slug. Please choose a different one.',
      }
    }

    console.error('createExperienceAction error', error)
    return {
      success: false,
      error: 'Unable to create experience right now.',
    }
  }
}

export async function updateExperienceAction(
  id: string,
  payload: ExperienceFormValues,
  options: { mode?: ExperienceActionMode } = {},
): Promise<UpdateExperienceResult> {
  const parsed = experienceSchema.safeParse(payload)
  if (!parsed.success) {
    const first = parsed.error.issues.at(0)
    return {
      success: false,
      error: first?.message || 'Invalid experience data',
    }
  }

  const data = parsed.data
  const mode = options.mode ?? 'draft'
  const slugBase = data.slug?.trim() || data.title
  const slug = slugify(slugBase, { lower: true, strict: true })
  const locationAlias = data.location
    ? slugify(data.location, { lower: true, strict: true })
    : 'colombia'
  const shouldPublish = mode === 'publish' || mode === 'publish_view'

  try {
    const experience = await (prisma as any).experience.update({
      where: { id },
      data: {
        title: data.title,
        slug,
        location: data.location?.trim() || null,
        locationAlias,
        durationType: data.durationType || 'flexible',
        hostName: data.hostName?.trim() || null,
        hostBio: data.hostBio?.trim() || null,
        summary: data.summary,
        narrative: data.narrative,
        activities: data.activities?.trim() || null,
        duration: data.duration?.trim() || null,
        schedule: data.schedule?.trim() || null,
        scheduleDays: data.scheduleDays && data.scheduleDays.length > 0 ? data.scheduleDays : null,
        scheduleNote: data.scheduleNote?.trim() || null,
        price: data.price?.trim() || null,
        currency: data.currency || 'COP',
        inclusions: data.inclusions?.trim() || null,
        exclusions: data.exclusions?.trim() || null,
        gallery: normalizeGallery(data.gallery),
        tags: generateExperienceTags(data, locationAlias),
        featured: data.featured ?? false,
        published: shouldPublish,
      },
    })

    const publicPath = `/experiencias/${experience.locationAlias}/${experience.slug}`
    const redirectPath =
      shouldPublish && mode === 'publish_view'
        ? publicPath
        : `/admin/dashboard/templates/experiences/edit/${id}`

    revalidatePath('/admin/dashboard/templates/experiences')
    revalidatePath(`/admin/dashboard/templates/experiences/edit/${id}`)
    revalidatePath(publicPath)
    revalidatePath(`/experiencias/${experience.locationAlias}`)

    return {
      success: true,
      publicPath: shouldPublish ? publicPath : undefined,
      redirectPath,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return {
        success: false,
        error: 'Another experience already uses this slug. Please choose a different one.',
      }
    }

    console.error('updateExperienceAction error', error)
    return {
      success: false,
      error: 'Unable to update experience right now.',
    }
  }
}
