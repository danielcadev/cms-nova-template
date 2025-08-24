import * as z from 'zod'

/**
 * TOURIST PLAN SCHEMA - NOVA CMS
 * ==============================
 * Comprehensive validation schema for tourist plans with detailed validations
 */

// Constantes para precios
export const CURRENCY_OPTIONS = [
  { value: 'COP', label: 'COP (Pesos Colombianos)', symbol: '$' },
  { value: 'USD', label: 'USD (Dólares)', symbol: 'US$' },
  { value: 'EUR', label: 'EUR (Euros)', symbol: '€' },
] as const

export interface PricePackage {
  id: string
  numPersons: number
  currency: 'COP' | 'USD' | 'EUR'
  perPersonPrice?: number | null
}

export const DEFAULT_PRICE_OPTION = {
  id: '',
  numPersons: 1,
  currency: 'COP' as const,
  perPersonPrice: 0,
}

// Esquema para una sección de incluye
const includeSectionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z
    .string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  content: z
    .string()
    .min(20, 'Content must be at least 20 characters')
    .max(1000, 'Content cannot exceed 1000 characters'),
})

// Esquema para un día del itinerario
const ItineraryDaySchema = z.object({
  day: z
    .number()
    .min(1, 'Day must be greater than 0')
    .max(30, 'Itineraries of more than 30 days are not allowed'),
  title: z.string().min(1, 'Day title is required').max(150, 'Title cannot exceed 150 characters'),
  description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional(),
  image: z.string().url('Must be a valid image URL').optional().or(z.literal('')),
})

// Esquema para una opción de precio
const PriceOptionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  numPersons: z
    .number()
    .min(1, 'Number of people must be at least 1')
    .max(100, 'Groups of more than 100 people are not allowed'),
  currency: z.enum(['COP', 'USD', 'EUR'], {
    errorMap: () => ({ message: 'Currency must be COP, USD or EUR' }),
  }),
  perPersonPrice: z
    .number({
      invalid_type_error: 'Price must be a valid number',
    })
    .min(0, 'Price must be greater than or equal to 0')
    .nullable()
    .optional(),
})

// Esquema para opciones de transporte
const TransportOptionSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title cannot exceed 100 characters'),
  features: z
    .string()
    .min(10, 'Features must be at least 10 characters')
    .max(500, 'Features cannot exceed 500 characters'),
  frequency: z
    .string()
    .min(3, 'Frequency must be at least 3 characters')
    .max(100, 'Frequency cannot exceed 100 characters'),
  price: z.number().min(0, 'Price must be greater than or equal to 0'),
})

export const planSchema = z.object({
  // Información básica
  mainTitle: z
    .string()
    .min(3, 'Main title must be at least 3 characters')
    .max(200, 'Main title cannot exceed 200 characters'),
  destinationId: z.string().optional(),
  allowGroundTransport: z.boolean().default(false),
  // Top-level section for public URL (e.g., "planes", "circuitos"). Not persisted in DB, used at publish-time
  section: z.string().max(50).optional(),
  articleAlias: z.string().max(100, 'Alias cannot exceed 100 characters').optional(),
  categoryAlias: z.string().max(100, 'Category alias cannot exceed 100 characters').optional(),

  // Texto promocional
  promotionalText: z
    .string()
    .max(1000, 'Promotional text cannot exceed 1000 characters')
    .optional(),

  // Secciones de contenido
  attractionsTitle: z
    .string()
    .max(150, 'Attractions title cannot exceed 150 characters')
    .optional(),
  attractionsText: z
    .string()
    .max(2000, 'Attractions text cannot exceed 2000 characters')
    .optional(),

  transfersTitle: z.string().max(150, 'Transfers title cannot exceed 150 characters').optional(),
  transfersText: z.string().max(2000, 'Transfers text cannot exceed 2000 characters').optional(),

  holidayTitle: z.string().max(150, 'Holiday title cannot exceed 150 characters').optional(),
  holidayText: z.string().max(2000, 'Holiday text cannot exceed 2000 characters').optional(),

  // Arrays de datos estructurados
  itinerary: z
    .array(ItineraryDaySchema)
    .max(30, 'No se permiten itinerarios de más de 30 días')
    .optional(),
  priceOptions: z
    .array(PriceOptionSchema)
    .max(20, 'No se permiten más de 20 opciones de precio')
    .optional(),

  // Imagen principal
  mainImage: z.any().optional(),

  // Contenido detallado de inclusiones
  includes: z
    .union([
      z.string().max(5000, 'Las inclusiones no pueden exceder 5000 caracteres'),
      z.array(includeSectionSchema).max(50, 'No se permiten más de 50 secciones de inclusiones'),
    ])
    .optional(),
  notIncludes: z.string().max(2000, 'Las exclusiones no pueden exceder 2000 caracteres').optional(),

  // Políticas y transporte
  generalPolicies: z
    .string()
    .max(5000, 'Las políticas generales no pueden exceder 5000 caracteres')
    .optional()
    .default(''),
  transportOptions: z
    .array(TransportOptionSchema)
    .max(10, 'No se permiten más de 10 opciones de transporte')
    .optional()
    .default([]),

  // Video promocional
  videoUrl: z
    .string()
    .url('Debe ser una URL válida')
    .refine((url) => {
      const youtubeRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/
      return youtubeRegex.test(url)
    }, 'Debe ser una URL válida de YouTube')
    .optional()
    .or(z.literal('')),

  // Campo interno para seguimiento del paso actual
  _lastStep: z
    .number()
    .min(0, 'El paso debe ser mayor o igual a 0')
    .max(10, 'Paso fuera de rango')
    .optional(),

  // Estado de publicación
  published: z.boolean().default(false),
})

export type PlanFormValues = z.infer<typeof planSchema>

// Tipos exportados para las secciones de incluye
export type IncludeSection = z.infer<typeof includeSectionSchema>

// Tipo exportado para opciones de precios
export type PriceOption = z.infer<typeof PriceOptionSchema>

// Tipo exportado para opciones de transporte
export type TransportOption = z.infer<typeof TransportOptionSchema>
