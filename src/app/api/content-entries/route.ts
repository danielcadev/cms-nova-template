import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: Crear nueva entrada de contenido
export async function POST(request: Request) {
  try {
    const { contentTypeId, data } = await request.json();

    if (!contentTypeId || !data) {
      return new NextResponse(
        JSON.stringify({ error: 'contentTypeId y data son requeridos' }),
        { status: 400 }
      );
    }

    // Verificar que el tipo de contenido existe
    const contentType = await prisma.contentType.findUnique({
      where: { id: contentTypeId }
    });

    if (!contentType) {
      return new NextResponse(
        JSON.stringify({ error: 'Tipo de contenido no encontrado' }),
        { status: 404 }
      );
    }

    // Crear la entrada de contenido
    const contentEntry = await prisma.contentEntry.create({
      data: {
        contentTypeId,
        data: JSON.stringify(data),
        status: 'draft'
      }
    });

    return NextResponse.json(contentEntry, { status: 201 });
  } catch (error) {
    console.error('Error al crear entrada de contenido:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
}

// GET: Obtener entradas de contenido (con filtros opcionales)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const contentTypeId = searchParams.get('contentTypeId');

    const where = contentTypeId ? { contentTypeId } : {};

    const entries = await prisma.contentEntry.findMany({
      where,
      include: {
        contentType: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Error al obtener entradas de contenido:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
}
