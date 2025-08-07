// utils/plan-transformers.ts
import type { Plan } from "@/types/form";
import type { PlanFormValues, PriceOption } from "@/schemas/plan";
import { Prisma } from '@prisma/client';

export function transformPlanToFormData(plan: Plan): PlanFormValues {
  return {
    mainTitle: plan.mainTitle,
    articleAlias: plan.articleAlias,
    categoryAlias: plan.categoryAlias,
    promotionalText: plan.promotionalText,
    attractionsTitle: plan.attractionsTitle,
    attractionsText: plan.attractionsText,
    transfersTitle: plan.transfersTitle,
    transfersText: plan.transfersText,
    holidayTitle: plan.holidayTitle,
    holidayText: plan.holidayText,
    destinationId: plan.destination,
    allowGroundTransport: false,
    // Transformación de mainImage
    mainImage: plan.mainImage ? {
      url: plan.mainImage.url,
      alt: plan.mainImage.alt,
      width: plan.mainImage.width,
      height: plan.mainImage.height,
      caption: plan.mainImage.caption,
      key: plan.mainImage.key
    } : null,
    includes: plan.includes,
    notIncludes: plan.notIncludes,
    itinerary: plan.itinerary,
    priceOptions: Array.isArray(plan.priceOptions) 
      ? plan.priceOptions
          .filter(opt => opt !== null && typeof opt === 'object' && !Array.isArray(opt))
          .map((opt: any) => {
            // Asegurarse de que cada option cumpla con la estructura esperada
            return {
              id: String(opt.id || crypto.randomUUID()),
              numPersons: Number(opt.numPersons || 1),
              price: opt.price !== undefined ? Number(opt.price) : null,
              groupPrice: opt.groupPrice !== undefined ? Number(opt.groupPrice) : null,
              accommodation: String(opt.accommodation || 'doble'),
              currency: String(opt.currency || 'COP')
            } as PriceOption;
          })
      : [],
    generalPolicies: plan.generalPolicies ?? '',
    transportOptions: plan.transportOptions,
    videoUrl: plan.videoUrl ?? undefined
  };
}
