import { NextRequest, NextResponse } from 'next/server';
import { deletePlanAction } from '@/app/actions/plan-actions';
import { ApiResponseBuilder } from '@/utils/api-response';
import { prisma } from '@/lib/prisma';

interface RouteContext {
  params: { id: string };
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        ApiResponseBuilder.error('ID del plan es requerido'),
        { status: 400 }
      );
    }

    // Usar el Server Action para eliminar el plan
    const result = await deletePlanAction(id);

    if (!result.success) {
      const status = result.error?.includes('no encontrado') ? 404 : 500;
      return NextResponse.json(
        ApiResponseBuilder.error(result.error || 'Error al eliminar el plan'),
        { status }
      );
    }

    return NextResponse.json(
      ApiResponseBuilder.success(result)
    );

  } catch (error) {
    console.error('❌ Error al eliminar plan:', error);
    
    return NextResponse.json(
      ApiResponseBuilder.error('Error interno del servidor al eliminar el plan'),
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        ApiResponseBuilder.error('ID del plan es requerido'),
        { status: 400 }
      );
    }

    const plan = await prisma.plan.findUnique({
      where: { id }
    });
    
    if (!plan) {
      return NextResponse.json(
        ApiResponseBuilder.error('Plan no encontrado'),
        { status: 404 }
      );
    }

    return NextResponse.json(
      ApiResponseBuilder.success(plan)
    );

  } catch (error) {
    console.error('❌ Error al obtener plan:', error);
    
    return NextResponse.json(
      ApiResponseBuilder.error('Error interno del servidor'),
      { status: 500 }
    );
  }
}
