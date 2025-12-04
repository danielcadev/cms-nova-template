import * as z from 'zod'

export const DAY_OPTIONS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export const DURATION_TYPES = ['flexible', 'single-day', 'multi-day', 'hourly'] as const

export const experienceSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  slug: z.string().optional(),
  location: z.string().optional(),
  durationType: z.enum(DURATION_TYPES),
  hostName: z.string().optional(),
  hostBio: z.string().optional(),
  summary: z.string().min(10, 'Summary is required'),
  narrative: z.string().min(20, 'Narrative is required'),
  activities: z.string().optional(),
  duration: z.string().optional(),
  schedule: z.string().optional(),
  scheduleDays: z.array(z.enum(DAY_OPTIONS)).optional(),
  scheduleNote: z.string().optional(),
  price: z.string().optional(),
  currency: z.string().min(1, 'Currency is required'),
  inclusions: z.string().optional(),
  exclusions: z.string().optional(),
  gallery: z.array(z.string().url().min(1)).max(4).optional(),
  featured: z.boolean(),
})

export type ExperienceFormValues = z.infer<typeof experienceSchema>

export const experienceDefaultValues: ExperienceFormValues = {
  title: '',
  slug: '',
  location: '',
  durationType: 'flexible',
  hostName: '',
  hostBio: '',
  summary: '',
  narrative: '',
  activities: '',
  duration: '',
  schedule: '',
  scheduleDays: [],
  scheduleNote: '',
  price: '',
  currency: 'COP',
  inclusions: '',
  exclusions: '',
  gallery: [],
  featured: false,
}
