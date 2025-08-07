'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { PlanFormValues } from '@/schemas/plan';
import { prisma } from '@/lib/prisma';

export async function createDraftPlanAction(data: PlanFormValues) {
  try {
    // Crear el plan borrador en la base de datos
    const timestamp = Date.now();
    const newPlan = await prisma.plan.create({
      data: {
        mainTitle: data.mainTitle || 'Plan sin título',
        destinationId: data.destinationId || null,
        allowGroundTransport: data.allowGroundTransport || false,
        articleAlias: data.articleAlias || `plan-${timestamp}`, // Generar alias único
        categoryAlias: data.categoryAlias || `categoria-${timestamp}`,
        promotionalText: data.promotionalText || '',
        attractionsTitle: data.attractionsTitle || '',
        attractionsText: data.attractionsText || '',
        transfersTitle: data.transfersTitle || '',
        transfersText: data.transfersText || '',
        holidayTitle: data.holidayTitle || '',
        holidayText: data.holidayText || '',
        includes: typeof data.includes === 'string' ? data.includes : JSON.stringify(data.includes) || '',
        notIncludes: data.notIncludes || '',
        itinerary: data.itinerary || [],
        priceOptions: data.priceOptions || [],
        mainImage: data.mainImage || null,
        generalPolicies: data.generalPolicies || '',
        transportOptions: data.transportOptions || [],
        videoUrl: data.videoUrl || '',
      },
    });
    
    console.log('✅ Created draft plan:', newPlan.id);
    
    // Revalidar la caché
    revalidatePath('/admin/dashboard/plans');
    
    return { success: true, planId: newPlan.id };
  } catch (error) {
    console.error('❌ Error creating draft plan:', error);
    return { success: false, error: 'Failed to create draft plan' };
  }
}

export async function updatePlanAction(prevState: any, formData: FormData) {
  try {
    const planId = formData.get('planId') as string;
    
    if (!planId) {
      return { success: false, error: 'Plan ID is required' };
    }

    // Extraer datos del FormData
    const data: Partial<PlanFormValues> = {};
    
    // Convertir FormData a objeto
    for (const [key, value] of formData.entries()) {
      if (key !== 'planId') {
        try {
          // Intentar parsear como JSON si es un objeto/array
          data[key as keyof PlanFormValues] = JSON.parse(value as string);
        } catch {
          // Si no es JSON, usar como string
          data[key as keyof PlanFormValues] = value as any;
        }
      }
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
    });
    
    console.log('✅ Updated plan:', planId);
    
    revalidatePath('/admin/dashboard/plans');
    revalidatePath(`/admin/dashboard/plans/edit/${planId}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Error updating plan:', error);
    return { success: false, error: 'Failed to update plan' };
  }
}

export async function deletePlanAction(planId: string) {
  try {
    if (!planId) {
      return { success: false, error: 'ID del plan es requerido' };
    }

    // Verificar que el plan existe antes de eliminarlo
    const existingPlan = await prisma.plan.findUnique({
      where: { id: planId },
      select: { id: true, mainTitle: true }
    });

    if (!existingPlan) {
      return { success: false, error: 'Plan no encontrado' };
    }

    // Eliminar el plan de la base de datos
    await prisma.plan.delete({
      where: { id: planId }
    });

    console.log(`🗑️ Deleted plan: ${planId} - ${existingPlan.mainTitle}`);

    // Revalidar las rutas para actualizar la caché
    revalidatePath('/admin/dashboard/plans');
    revalidatePath('/admin/dashboard/templates/tourism');

    return { 
      success: true, 
      message: 'Plan eliminado exitosamente',
      deletedPlan: existingPlan 
    };

  } catch (error) {
    console.error('❌ Error deleting plan:', error);
    return { 
      success: false, 
      error: 'Error al eliminar el plan. Inténtalo de nuevo.' 
    };
  }
}
