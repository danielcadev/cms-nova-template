'use server'

import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/server/auth/session'
import logger from '@/server/observability/logger'

export type RegionHierarchy = {
  id: string
  name: string
  subRegions: {
    id: string
    name: string
    zones: {
      id: string
      name: string
    }[]
  }[]
}

export async function getSlugHierarchy(): Promise<RegionHierarchy[]> {
  try {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    return await prisma.region.findMany({
      include: { subRegions: { include: { zones: true } } },
      orderBy: { name: 'asc' },
    })
  } catch (error) {
    logger.error('Error fetching hierarchy', error)
    return []
  }
}

export async function createSlugItem(
  type: 'region' | 'subRegion' | 'zone',
  name: string,
  parentId?: string,
) {
  try {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    const names = name
      .split(/[\n,/]+/)
      .map((n) => n.trim())
      .filter(Boolean)
    if (names.length > 1) {
      return Promise.all(names.map((n) => performSingleCreate(type, n, parentId)))
    }

    return performSingleCreate(type, names[0], parentId)
  } catch (error) {
    logger.error('Error creating item', error)
    throw new Error('Failed to create item')
  }
}

async function performSingleCreate(
  type: 'region' | 'subRegion' | 'zone',
  name: string,
  parentId?: string,
) {
  if (type === 'region') return prisma.region.create({ data: { name } })
  if (!parentId) throw new Error(`Parent ID required for type: ${type}`)
  if (type === 'subRegion') return prisma.subRegion.create({ data: { name, regionId: parentId } })
  if (type === 'zone') return prisma.zone.create({ data: { name, subRegionId: parentId } })
}

export async function deleteSlugItem(type: 'region' | 'subRegion' | 'zone', id: string) {
  try {
    const session = await getAdminSession()
    if (!session) throw new Error('Unauthorized')

    if (type === 'region') return await prisma.region.delete({ where: { id } })
    if (type === 'subRegion') return await prisma.subRegion.delete({ where: { id } })
    if (type === 'zone') return await prisma.zone.delete({ where: { id } })
  } catch (error) {
    logger.error('Error deleting item', error)
    throw new Error('Failed to delete item')
  }
}
