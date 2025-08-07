import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Obtener una entrada específica
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string; entryId: string } }
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

    const entry = await prisma.contentEntry.findUnique({
      where: {
        id: params.entryId,
        contentTypeId: contentType.id
      },
      include: {
        contentType: {
          include: {
            fields: true
          }
        }
      }
    });

    if (!entry) {
      return NextResponse.json(
        { success: false, error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      entry: {
        ...entry,
        createdAt: entry.createdAt.toISOString(),
        updatedAt: entry.updatedAt.toISOString(),
        contentType: {
          ...entry.contentType,
          createdAt: entry.contentType.createdAt.toISOString(),
          updatedAt: entry.contentType.updatedAt.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Error fetching content entry:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// PUT - Actualizar entrada
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string; entryId: string } }
) {
  try {
    const body = await request.json();
    const { data, status } = body;

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

    // Verificar que la entrada existe y pertenece al content type
    const existingEntry = await prisma.contentEntry.findUnique({
      where: {
        id: params.entryId,
        contentTypeId: contentType.id
      }
    });

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    // Validar campos requeridos si el status es published
    if (status === 'published') {
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
    }

    // Actualizar la entrada
    const updatedEntry = await prisma.contentEntry.update({
      where: { id: params.entryId },
      data: {
        data,
        status: status || existingEntry.status
      }
    });

    return NextResponse.json({
      success: true,
      entry: {
        ...updatedEntry,
        createdAt: updatedEntry.createdAt.toISOString(),
        updatedAt: updatedEntry.updatedAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error updating content entry:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar entrada
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string; entryId: string } }
) {
  try {
    // Verificar que el content type existe
    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier: params.slug }
    });

    if (!contentType) {
      return NextResponse.json(
        { success: false, error: 'Content type no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que la entrada existe y pertenece al content type
    const existingEntry = await prisma.contentEntry.findUnique({
      where: {
        id: params.entryId,
        contentTypeId: contentType.id
      }
    });

    if (!existingEntry) {
      return NextResponse.json(
        { success: false, error: 'Entrada no encontrada' },
        { status: 404 }
      );
    }

    // Eliminar la entrada
    await prisma.contentEntry.delete({
      where: { id: params.entryId }
    });

    return NextResponse.json({
      success: true,
      message: 'Entrada eliminada correctamente'
    });
  } catch (error) {
    console.error('Error deleting content entry:', error);
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}