import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { ApiResponseBuilder } from '@/utils/api-response'

export async function GET(_request: NextRequest) {
  try {
    // debug removed

    const contentTypes = await prisma.contentType.findMany({
      include: {
        fields: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // debug removed

    return ApiResponseBuilder.success({
      contentTypes: contentTypes.map((ct) => ({
        id: ct.id,
        name: ct.name,
        apiIdentifier: ct.apiIdentifier,
        description: ct.description,
        fields: ct.fields,
        createdAt: ct.createdAt.toISOString(),
        updatedAt: ct.updatedAt.toISOString(),
      })),
    })
  } catch (error) {
    console.error('🔴 Error fetching content types:', error)
    return ApiResponseBuilder.error('Internal Server Error while fetching content types', 500)
  }
}

import { getAdminSession } from '@/lib/server-session'
export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) return ApiResponseBuilder.error('Unauthorized', 401)

    const body = await request.json()
    const { name, apiIdentifier, description, fields } = body

    if (!name || !apiIdentifier) {
      return ApiResponseBuilder.error('Name and API identifier are required', 400)
    }

    // Ensure apiIdentifier uniqueness
    const existingContentType = await prisma.contentType.findUnique({
      where: { apiIdentifier },
    })

    if (existingContentType) {
      return ApiResponseBuilder.error('API identifier already exists', 400)
    }

    const contentType = await prisma.contentType.create({
      data: {
        name,
        apiIdentifier,
        description,
        fields: {
          create:
            fields?.map((field: any) => ({
              label: field.label,
              apiIdentifier: field.apiIdentifier,
              type: field.type,
              isRequired: field.isRequired || false,
            })) || [],
        },
      },
      include: {
        fields: true,
      },
    })

    return ApiResponseBuilder.success({
      contentType: {
        id: contentType.id,
        name: contentType.name,
        apiIdentifier: contentType.apiIdentifier,
        description: contentType.description,
        fields: contentType.fields,
        createdAt: contentType.createdAt.toISOString(),
        updatedAt: contentType.updatedAt.toISOString(),
      },
    })
  } catch (error) {
    console.error('🔴 Error creating content type:', error)
    return ApiResponseBuilder.error('Internal Server Error while creating content type', 500)
  }
}
