import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener todas las entradas de un content type por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: params.slug }
    });

    if (!contentType) {
      return NextResponse.json(
        { success: false, error: 'Content type no encontrado' },
        { status: 404 }
      );
    }

    const entries = await prisma.contentEntry.findMany({
      where: {
        contentTypeId: contentType.id
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      entries: entries.map(entry => ({
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }))
    });
  } catch (error) {
    console.error('Error fetching content entries:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST - Crear nueva entrada
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json();
    const { data, status = 'draft' } = body;

    // Verificar que el content type existe
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: params.slug },
      include: { fields: true }
    });

    if (!contentType) {
      return NextResponse.json(
        { success: false, error: 'Content type no encontrado' },
        { status: 404 }
      );
    }

    // Validar campos requeridos
    const requiredFields = contentType.fields.filter(field => field.isRequired);
    const missingFields = requiredFields.filter(field => {
      const value = data[field.apiIdentifier];
      return value === undefined || value === null || value === '';
    });

    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Campos requeridos faltantes: ${missingFields.map(f => f.label).join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Crear la entrada
    const entry = await prisma.contentEntry.create({
      data: {
        contentTypeId: contentType.id,
        data,
        status
      }
    });

    return NextResponse.json({
      success: true,
      entry: {
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error creating content entry:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}