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

// Nueva estructura de precios (compatible con legacy)
const SeasonalAccommodationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  accommodation: z.string().min(1, 'Accommodation is required'),
  price: z.string().min(0).optional().or(z.literal('')),
  currency: z.enum(['COP', 'USD', 'EUR']),
})

const NewPriceOptionSchema = z.union([
  // Simple price per person
  z.object({
    id: z.string().min(1, 'ID is required'),
    mode: z.literal('simple'),
    label: z.string().optional(),
    price: z.string().min(0).optional().or(z.literal('')),
    currency: z.enum(['COP', 'USD', 'EUR']),
  }),
  // Advanced price with description
  z.object({
    id: z.string().min(1, 'ID is required'),
    mode: z.literal('advanced'),
    label: z.string().min(1, 'Label is required'),
    price: z.string().min(1, 'Price is required'),
    currency: z.enum(['COP', 'USD', 'EUR']),
  }),
  // Seasonal prices with accommodations
  z.object({
    id: z.string().min(1, 'ID is required'),
    mode: z.literal('seasonal'),
    label: z.string().optional(),
    price: z.string().optional().or(z.literal('')),
    seasonTitle: z.string().min(1, 'Season title is required'),
    seasonAccommodations: z.array(SeasonalAccommodationSchema),
    currency: z.enum(['COP', 'USD', 'EUR']),
  }),
  // Legacy support: numPersons + perPersonPrice
  z.object({
    id: z.string().min(1, 'ID is required'),
    numPersons: z
      .number()
      .min(1, 'Number of people must be at least 1')
      .max(100, 'Groups of more than 100 people are not allowed'),
    currency: z.enum(['COP', 'USD', 'EUR']),
    perPersonPrice: z
      .number()
      .min(0, 'Price must be greater than or equal to 0')
      .nullable()
      .optional(),
  }),
])

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
  // Basic info
  mainTitle: z
    .string()
    .min(3, 'Main title must be at least 3 characters')
    .max(200, 'Main title cannot exceed 200 characters'),
  allowGroundTransport: z.boolean(),
  // Top-level section for public URL (e.g., "planes", "circuitos"). Not persisted in DB, used at publish-time
  section: z.string().max(50).optional(),
  articleAlias: z.string().max(100, 'Alias cannot exceed 100 characters').optional(),
  categoryAlias: z.string().max(100, 'Category alias cannot exceed 100 characters').optional(),

  // Promotional text
  promotionalText: z
    .string()
    .max(1000, 'Promotional text cannot exceed 1000 characters')
    .optional(),

  // Content sections
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

  // Structured arrays
  itinerary: z.array(ItineraryDaySchema).max(30, 'Itinerary cannot exceed 30 days').optional(),
  priceOptions: z.array(NewPriceOptionSchema).max(20, 'Price options cannot exceed 20').optional(),

  // Main image
  mainImage: z.any().optional(),

  // Includes and exclusions
  includes: z
    .union([
      z.string().max(5000, 'Includes cannot exceed 5000 characters'),
      z.array(includeSectionSchema).max(50, 'Includes sections cannot exceed 50'),
    ])
    .optional(),
  notIncludes: z.string().max(2000, 'Exclusions cannot exceed 2000 characters').optional(),

  // Policies and transport
  generalPolicies: z.string().max(5000, 'General policies cannot exceed 5000 characters'),
  transportOptions: z.array(TransportOptionSchema).max(10, 'Transport options cannot exceed 10'),

  // Promotional video
  videoUrl: z
    .string()
    .url('Must be a valid URL')
    .refine((url) => {
      const youtubeRegex = /^https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]+/
      return youtubeRegex.test(url)
    }, 'Must be a valid YouTube URL')
    .optional()
    .or(z.literal('')),

  // Internal field: tracks the current wizard step
  _lastStep: z
    .number()
    .min(0, 'Step must be greater than or equal to 0')
    .max(10, 'Step out of range')
    .optional(),

  // Publish state
  published: z.boolean(),
})

export type PlanFormValues = z.infer<typeof planSchema>

// Exported types for includes sections
export type IncludeSection = z.infer<typeof includeSectionSchema>

// Exported type for price options
export type PriceOption = z.infer<typeof NewPriceOptionSchema>

// Exported type for transport options
export type TransportOption = z.infer<typeof TransportOptionSchema>
