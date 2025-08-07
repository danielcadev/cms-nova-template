import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { apiIdentifier: string } }
) {
  try {
    const { apiIdentifier } = await params;

    const contentType = await prisma.contentType.findUnique({
      where: { apiIdentifier },
      include: {
        fields: {
          orderBy: { label: 'asc' }
        }
      }
    });

    if (!contentType) {
      return new NextResponse(
        JSON.stringify({ error: 'Tipo de contenido no encontrado' }),
        { status: 404 }
      );
    }

    return NextResponse.json(contentType);
  } catch (error) {
    console.error('Error al obtener tipo de contenido:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500 }
    );
  }
}
