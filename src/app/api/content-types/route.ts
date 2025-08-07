import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ApiResponseBuilder } from '@/utils/api-response';

export async function GET(request: NextRequest) {
  try {
    console.log('🟢 GET /api/content-types - Fetching content types');
    
    const contentTypes = await prisma.contentType.findMany({
      include: {
        fields: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log(`🟢 Found ${contentTypes.length} content types`);

    return ApiResponseBuilder.success({
      contentTypes: contentTypes.map(ct => ({
        id: ct.id,
        name: ct.name,
        apiIdentifier: ct.apiIdentifier,
        description: ct.description,
        fields: ct.fields,
        createdAt: ct.createdAt.toISOString(),
        updatedAt: ct.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    console.error('🔴 Error fetching content types:', error);
    return ApiResponseBuilder.error('Error al cargar tipos de contenido', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🟢 POST /api/content-types - Creating content type');
    
    const body = await request.json();
    const { name, apiIdentifier, description, fields } = body;

    if (!name || !apiIdentifier) {
      return ApiResponseBuilder.error('Nombre e identificador API son requeridos', 400);
    }

    // Verificar que el apiIdentifier sea único
    const existingContentType = await prisma.contentType.findUnique({
      where: { apiIdentifier },
    });

    if (existingContentType) {
      return ApiResponseBuilder.error('El identificador API ya existe', 400);
    }

    const contentType = await prisma.contentType.create({
      data: {
        name,
        apiIdentifier,
        description,
        fields: {
          create: fields?.map((field: any) => ({
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
    });

    console.log(`🟢 Content type created: ${contentType.id}`);

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
    });
  } catch (error) {
    console.error('🔴 Error creating content type:', error);
    return ApiResponseBuilder.error('Error al crear tipo de contenido', 500);
  }
}
