'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

const fieldSchema = z.object({
  label: z.string().min(3, 'Label is required.'),
  apiIdentifier: z.string(),
  type: z.enum(['TEXT', 'RICH_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'MEDIA', 'SLUG', 'SELECT']),
  isRequired: z.boolean().optional().default(false),
  isList: z.boolean().optional().default(false),
  slugRoute: z.string().optional(),
  options: z.string().optional(),
})

const contentTypeSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  apiIdentifier: z.string().min(3, 'API identifier is required.'),
  description: z.string().optional(),
  fields: z.array(fieldSchema).min(1, 'You must add at least one field.'),
})

export type ContentTypeFormValues = z.input<typeof contentTypeSchema>

export async function createContentTypeAction(data: ContentTypeFormValues) {
  const session = await getAdminSession()
  if (!session) return { success: false, message: 'Unauthorized' }

  const validatedFields = contentTypeSchema.safeParse(data)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation error. Check the fields.',
    }
  }

  const { name, apiIdentifier, description, fields } = validatedFields.data

  try {
    await prisma.contentType.create({
      data: {
        name,
        apiIdentifier,
        description,
        fields: {
          create: fields.map((field) => ({
            label: field.label,
            apiIdentifier: field.apiIdentifier,
            type: field.type,
            isRequired: field.isRequired,
            metadata: {
              ...(field.slugRoute ? { slugRoute: field.slugRoute } : {}),
              ...(field.isList ? { isList: field.isList } : {}),
              ...(field.options
                ? {
                    options: field.options
                      .split(',')
                      .map((s: string) => s.trim())
                      .filter(Boolean),
                  }
                : {}),
            },
          })),
        },
      },
    })

    revalidatePath('/admin/dashboard')
    return { success: true, message: 'Content type created successfully.' }
  } catch (error) {
    logger.error('Error creating content type', error)
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return {
        success: false,
        message: 'Error: API Identifier already exists. Please choose a unique name.',
      }
    }
    return { success: false, message: 'Server error: Could not create content type.' }
  }
}

export async function updateContentTypeAction(id: string, data: ContentTypeFormValues) {
  const session = await getAdminSession()
  if (!session) return { success: false, message: 'Unauthorized' }

  const validatedFields = contentTypeSchema.safeParse(data)
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation error. Check the fields.',
    }
  }

  const { name, apiIdentifier, description, fields } = validatedFields.data

  try {
    const existingFields = await prisma.field.findMany({
      where: { contentTypeId: id },
      select: { id: true },
    })
    const existingFieldIds = new Set(existingFields.map((f) => f.id))
    const incomingFieldIds = new Set(fields.map((f: any) => f.id).filter(Boolean))

    await prisma.$transaction(async (tx) => {
      await tx.contentType.update({ where: { id }, data: { name, apiIdentifier, description } })

      const fieldsToDelete = Array.from(existingFieldIds).filter(
        (fieldId) => !incomingFieldIds.has(fieldId),
      )
      if (fieldsToDelete.length > 0) {
        await tx.field.deleteMany({ where: { id: { in: fieldsToDelete } } })
      }

      for (const fieldData of fields) {
        const fieldWithId = fieldData as any
        const metadata = {
          ...(fieldWithId.slugRoute ? { slugRoute: fieldWithId.slugRoute } : {}),
          ...(fieldWithId.isList ? { isList: fieldWithId.isList } : {}),
          ...(fieldWithId.options
            ? {
                options: fieldWithId.options
                  .split(',')
                  .map((s: string) => s.trim())
                  .filter(Boolean),
              }
            : {}),
        }

        if (fieldWithId.id && existingFieldIds.has(fieldWithId.id)) {
          await tx.field.update({
            where: { id: fieldWithId.id },
            data: {
              label: fieldData.label,
              apiIdentifier: fieldData.apiIdentifier,
              type: fieldData.type,
              isRequired: fieldData.isRequired,
              metadata,
            },
          })
        } else {
          await tx.field.create({
            data: {
              contentTypeId: id,
              label: fieldData.label,
              apiIdentifier: fieldData.apiIdentifier,
              type: fieldData.type,
              isRequired: fieldData.isRequired,
              metadata,
            },
          })
        }
      }
    })

    revalidatePath('/admin/dashboard/view-content')
    revalidatePath(`/admin/dashboard/content-types/edit/${id}`)
    return { success: true, message: 'Structure updated successfully.' }
  } catch (error) {
    logger.error('Error updating content type', error)
    return { success: false, message: 'Server error: Could not update the structure.' }
  }
}
