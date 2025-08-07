import { z } from 'zod';

// Enums
export const PlanStatus = z.enum(['draft', 'published']);
export type PlanStatus = z.infer<typeof PlanStatus>;

// Plan Schema
export const Plan = z.object({
  id: z.string(),
  mainTitle: z.string(),
  categoryAlias: z.string(),
  articleAlias: z.string(),
  destinationId: z.string(),
  promotionalText: z.string().optional(),
  allowGroundTransport: z.boolean(),
  mainImage: z.string().optional(),
  status: PlanStatus,
  publishedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Plan = z.infer<typeof Plan>;

// Form Schemas
export const PlanFormSchema = z.object({
  mainTitle: z.string().min(1, 'El título es requerido'),
  categoryAlias: z.string().min(1, 'La categoría es requerida'),
  articleAlias: z.string().min(1, 'El slug es requerido'),
  destinationId: z.string().min(1, 'El destino es requerido'),
  promotionalText: z.string().optional(),
  allowGroundTransport: z.boolean().default(false),
  mainImage: z.string().optional(),
});

export type PlanFormValues = z.infer<typeof PlanFormSchema>; 
