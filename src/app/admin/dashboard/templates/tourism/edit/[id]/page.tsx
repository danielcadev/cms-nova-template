import { EditPlanForm } from '@/components/templates';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import type { Plan as PrismaPlan } from '@prisma/client';
import type { PlanFormValues } from '@/schemas/plan';

// Función para transformar los datos de Prisma al formato del formulario
function transformPrismaPlanToFormValues(plan: PrismaPlan): PlanFormValues {
  // Aquí hacemos el mapeo cuidadoso de los tipos
  return {
    ...plan,
    // Campos obligatorios - asegurar que estén presentes
    mainTitle: plan.mainTitle,
    articleAlias: plan.articleAlias,
    categoryAlias: plan.categoryAlias,
    section: plan.section,
    promotionalText: plan.promotionalText,
    attractionsTitle: plan.attractionsTitle,
    attractionsText: plan.attractionsText,
    transfersTitle: plan.transfersTitle,
    transfersText: plan.transfersText,
    holidayTitle: plan.holidayTitle,
    holidayText: plan.holidayText,
    includes: plan.includes,
    notIncludes: plan.notIncludes,
    allowGroundTransport: plan.allowGroundTransport,
    published: plan.published,
    // Campos opcionales con valores por defecto
    destinationId: plan.destinationId ?? undefined,
    generalPolicies: plan.generalPolicies ?? '',
    videoUrl: plan.videoUrl ?? '',
    // Arrays JSON
    itinerary: Array.isArray(plan.itinerary) ? plan.itinerary.map(item => item as any) : [],
    priceOptions: Array.isArray(plan.priceOptions) ? plan.priceOptions.map(item => item as any) : [],
    transportOptions: Array.isArray(plan.transportOptions) ? plan.transportOptions.map(item => item as any) : [],
    // Imagen principal
    mainImage: plan.mainImage ? plan.mainImage as any : null,
  };
}

// Función para obtener los datos del plan desde el servidor
async function getPlanData(id: string) {
  const plan = await prisma.plan.findUnique({
    where: { id },
  });

  if (!plan) {
    notFound(); // Redirige a 404 si el plan no se encuentra
  }

  return plan;
}

export default async function EditTourismPlanPage({ params }: { params: { id: string } }) {
  // Solución según la documentación de Next.js: "esperamos" a que los parámetros estén listos.
  const awaitedParams = await params;
  const prismaPlan = await getPlanData(awaitedParams.id);
  const formValues = transformPrismaPlanToFormValues(prismaPlan);

  // Debug: verificar que articleAlias se está cargando
  console.log('Loading plan for edit:', {
    id: awaitedParams.id,
    mainTitle: formValues.mainTitle,
    articleAlias: formValues.articleAlias,
    categoryAlias: formValues.categoryAlias
  });

  return (
    <AdminLayout>
      <EditPlanForm planId={awaitedParams.id} initialData={formValues} />
    </AdminLayout>
  );
}