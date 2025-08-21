// src/utils/db.ts

import type { Prisma } from '@prisma/client'
import type { PlanFormValues } from '../schemas/plan'

export function formatPlanData(data: PlanFormValues) {
  type ItineraryItem = { day: number; title: string; description: string; image?: string }
  type TransportOption = { title: string; features: string; frequency: string }
  type PriceOptionJson = {
    id: string
    numPersons: number
    price: number | null
    groupPrice: number | null
    accommodation: string
    currency: string
  }
  type MainImage = {
    url: string
    alt: string
    width: number
    height: number
    caption?: string
    key?: string
  }

  const itineraryJson: ItineraryItem[] = data.itinerary
    ? data.itinerary.map((item) => ({
        day: Number(item.day),
        title: String(item.title),
        description: String(item.description || ''),
        image: item.image ? String(item.image) : undefined,
      }))
    : []

  const transportOptionsJson: TransportOption[] = data.transportOptions.map((item) => ({
    title: String(item.title),
    features: String(item.features),
    frequency: String(item.frequency),
  }))

  let priceOptionsJson: PriceOptionJson[] = []

  if (data.priceOptions && Array.isArray(data.priceOptions)) {
    priceOptionsJson = data.priceOptions
      .filter((option) => option && typeof option === 'object')
      .map((option: Record<string, unknown>) => {
        const id = option?.id
          ? String(option.id)
          : String(Math.random().toString(36).substring(2, 9))
        const numPersons = option?.numPersons ? Number(option.numPersons) : 1
        let price: number | null = null
        if (option.price !== undefined) {
          if (option.price === null) price = null
          else {
            const numPrice = Number(option.price)
            price = Number.isNaN(numPrice) ? null : numPrice
          }
        }
        let groupPrice: number | null = null
        if (option.groupPrice !== undefined) {
          if (option.groupPrice === null) groupPrice = null
          else {
            const numGroupPrice = Number(option.groupPrice)
            groupPrice = Number.isNaN(numGroupPrice) ? null : numGroupPrice
          }
        }
        if (price === null && groupPrice !== null && numPersons > 0)
          price = Math.round(groupPrice / numPersons)
        else if (groupPrice === null && price !== null) groupPrice = price * numPersons
        const accommodation = option?.accommodation ? String(option.accommodation) : 'doble'
        const currency = option?.currency ? String(option.currency) : 'COP'
        return { id, numPersons, price, groupPrice, accommodation, currency }
      })
  } else {
    priceOptionsJson = []
  }

  const mainImageJson: MainImage | null = data.mainImage
    ? {
        url: String(data.mainImage.url),
        alt: String(data.mainImage.alt),
        width: Number(data.mainImage.width),
        height: Number(data.mainImage.height),
        caption: data.mainImage.caption?.trim(),
        key: data.mainImage.key,
      }
    : null

  const includesValue =
    typeof data.includes === 'string' ? data.includes.trim() : JSON.stringify(data.includes)

  const baseData = {
    mainTitle: data.mainTitle.trim(),
    articleAlias: data.articleAlias?.trim() || '',
    categoryAlias: data.categoryAlias?.trim() || '',
    promotionalText: data.promotionalText?.trim() || '',
    attractionsTitle: data.attractionsTitle?.trim() || '',
    attractionsText: data.attractionsText?.trim() || '',
    transfersTitle: data.transfersTitle?.trim() || '',
    transfersText: data.transfersText?.trim() || '',
    holidayTitle: data.holidayTitle?.trim() || '',
    holidayText: data.holidayText?.trim() || '',
    destination: data.destinationId?.trim() || '',
    includes: includesValue,
    notIncludes: data.notIncludes?.trim() || '',
    itinerary: itineraryJson as Prisma.InputJsonValue[],
    generalPolicies: data.generalPolicies?.trim() || '',
    transportOptions: transportOptionsJson as Prisma.InputJsonValue[],
    videoUrl: data.videoUrl?.trim() || null,
    mainImage: mainImageJson as Prisma.InputJsonValue,
    priceOptions: priceOptionsJson as Prisma.InputJsonValue[],
    published: false,
  }

  return baseData as Prisma.PlanCreateInput
}

export const validateRequiredFields = (data: PlanFormValues) => {
  const requiredFields = {
    mainTitle: 'Main title',
    articleAlias: 'Article alias',
    categoryAlias: 'Category',
    promotionalText: 'Promotional text',
    destination: 'Destination',
  } as const

  const missingFields = Object.entries(requiredFields)
    .filter(([key]) => !data[key as keyof PlanFormValues])
    .map(([, label]) => label)

  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
  }
}

export const createSearchFilter = (field: string, search: string) => ({
  [field]: { contains: search, mode: 'insensitive' as Prisma.QueryMode },
})
