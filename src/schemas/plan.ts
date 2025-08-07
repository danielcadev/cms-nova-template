import * as z from 'zod';

/**
 * TOURIST PLAN SCHEMA - NOVA CMS
 * ==============================
 * Comprehensive validation schema for tourist plans with detailed validations
 */

// Constantes para precios
export const CURRENCY_OPTIONS = [
  { value: 'COP', label: 'COP (Pesos Colombianos)', symbol: '$' },
  { value: 'USD', label: 'USD (Dólares)', symbol: 'US$' },
  { value: 'EUR', label: 'EUR (Euros)', symbol: '€' }
] as const;

export interface PricePackage {
  id: string;
  numPersons: number;
  currency: 'COP' | 'USD' | 'EUR';
  perPersonPrice?: number | null;
}

export const DEFAULT_PRICE_OPTION = {
  id: '',
  numPersons: 1,
  currency: 'COP' as const,
  perPersonPrice: 0
};

// Esquema para una sección de incluye
const includeSectionSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  title: z.string()
    .min(5, "El título debe tener al menos 5 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  content: z.string()
    .min(20, "El contenido debe tener al menos 20 caracteres")
    .max(1000, "El contenido no puede exceder 1000 caracteres")
});

// Esquema para un día del itinerario
const ItineraryDaySchema = z.object({
  day: z.number()
    .min(1, "El día debe ser mayor a 0")
    .max(30, "No se permiten itinerarios de más de 30 días"),
  title: z.string()
    .min(1, 'El título del día es requerido')
    .max(150, "El título no puede exceder 150 caracteres"),
  description: z.string()
    .max(2000, "La descripción no puede exceder 2000 caracteres")
    .optional(),
  image: z.string()
    .url('Debe ser una URL válida de imagen')
    .optional()
    .or(z.literal('')),
});

// Esquema para una opción de precio
const PriceOptionSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  numPersons: z.number()
    .min(1, "El número de personas debe ser al menos 1")
    .max(100, "No se permiten grupos de más de 100 personas"),
  currency: z.enum(['COP', 'USD', 'EUR'], {
    errorMap: () => ({ message: "La moneda debe ser COP, USD o EUR" })
  }),
  perPersonPrice: z.number({
    invalid_type_error: "El precio debe ser un número válido"
  })
  .min(0, "El precio debe ser mayor o igual a 0")
  .nullable()
  .optional(),
});

// Esquema para opciones de transporte
const TransportOptionSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  title: z.string()
    .min(3, "El título debe tener al menos 3 caracteres")
    .max(100, "El título no puede exceder 100 caracteres"),
  features: z.string()
    .min(10, "Las características deben tener al menos 10 caracteres")
    .max(500, "Las características no pueden exceder 500 caracteres"),
  frequency: z.string()
    .min(3, "La frecuencia debe tener al menos 3 caracteres")
    .max(100, "La frecuencia no puede exceder 100 caracteres"),
  price: z.number()
    .min(0, "El precio debe ser mayor o igual a 0")
});

export const planSchema = z.object({
  // Información básica
  mainTitle: z.string()
    .min(3, 'El título principal debe tener al menos 3 caracteres')
    .max(200, 'El título principal no puede exceder 200 caracteres'),
  destinationId: z.string().optional(),
  allowGroundTransport: z.boolean().default(false),
  articleAlias: z.string()
    .max(100, "El alias no puede exceder 100 caracteres")
    .optional(),
  categoryAlias: z.string()
    .max(100, "El alias de categoría no puede exceder 100 caracteres")
    .optional(),

  // Texto promocional
  promotionalText: z.string()
    .max(1000, "El texto promocional no puede exceder 1000 caracteres")
    .optional(),
  
  // Secciones de contenido
  attractionsTitle: z.string()
    .max(150, "El título de atracciones no puede exceder 150 caracteres")
    .optional(),
  attractionsText: z.string()
    .max(2000, "El texto de atracciones no puede exceder 2000 caracteres")
    .optional(),
  
  transfersTitle: z.string()
    .max(150, "El título de traslados no puede exceder 150 caracteres")
    .optional(),
  transfersText: z.string()
    .max(2000, "El texto de traslados no puede exceder 2000 caracteres")
    .optional(),

  holidayTitle: z.string()
    .max(150, "El título de festividades no puede exceder 150 caracteres")
    .optional(),
  holidayText: z.string()
    .max(2000, "El texto de festividades no puede exceder 2000 caracteres")
    .optional(),

  // Arrays de datos estructurados
  itinerary: z.array(ItineraryDaySchema)
    .max(30, "No se permiten itinerarios de más de 30 días")
    .optional(),
  priceOptions: z.array(PriceOptionSchema)
    .max(20, "No se permiten más de 20 opciones de precio")
    .optional(),
  
  // Imagen principal
  mainImage: z.any().optional(),

  // Contenido detallado de inclusiones
  includes: z.union([
    z.string().max(5000, "Las inclusiones no pueden exceder 5000 caracteres"),
    z.array(includeSectionSchema).max(50, "No se permiten más de 50 secciones de inclusiones")
  ]).optional(),
  notIncludes: z.string()
    .max(2000, "Las exclusiones no pueden exceder 2000 caracteres")
    .optional(),
  
  // Políticas y transporte
  generalPolicies: z.string()
    .max(5000, "Las políticas generales no pueden exceder 5000 caracteres")
    .optional()
    .default(""),
  transportOptions: z.array(TransportOptionSchema)
    .max(10, "No se permiten más de 10 opciones de transporte")
    .optional()
    .default([]),

  // Video promocional
  videoUrl: z.string()
    .url("Debe ser una URL válida")
    .refine((url) => {
      const youtubeRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/;
      return youtubeRegex.test(url);
    }, "Debe ser una URL válida de YouTube")
    .optional()
    .or(z.literal('')),
  
  // Campo interno para seguimiento del paso actual
  _lastStep: z.number()
    .min(0, "El paso debe ser mayor o igual a 0")
    .max(10, "Paso fuera de rango")
    .optional(),
});

export type PlanFormValues = z.infer<typeof planSchema>;

// Tipos exportados para las secciones de incluye
export type IncludeSection = z.infer<typeof includeSectionSchema>;

// Tipo exportado para opciones de precios
export type PriceOption = z.infer<typeof PriceOptionSchema>;

// Tipo exportado para opciones de transporte
export type TransportOption = z.infer<typeof TransportOptionSchema>;
