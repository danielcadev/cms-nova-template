'use server'

import { prisma } from '@/lib/prisma'

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

/**
 * Fetch the full hierarchy of regions, subregions, and zones.
 */
export async function getSlugHierarchy(): Promise<RegionHierarchy[]> {
    try {
        const regions = await prisma.region.findMany({
            include: {
                subRegions: {
                    include: {
                        zones: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        })
        return regions
    } catch (error) {
        console.error('Error fetching hierarchy:', error)
        return []
    }
}

/**
 * Create a new item (Region, SubRegion, or Zone)
 */
export async function createSlugItem(
    type: 'region' | 'subRegion' | 'zone',
    name: string,
    parentId?: string
) {
    try {
        // Support bulk creation (comma separated or new lines)
        const names = name.split(/[,\n\/]+/).map(n => n.trim()).filter(Boolean)

        if (names.length > 1) {
            return Promise.all(names.map(n => performSingleCreate(type, n, parentId)))
        }

        return performSingleCreate(type, names[0], parentId)
    } catch (error) {
        console.error('Error creating item:', error)
        throw new Error('Failed to create item')
    }
}

async function performSingleCreate(
    type: 'region' | 'subRegion' | 'zone',
    name: string,
    parentId?: string
) {
    if (type === 'region') {
        return prisma.region.create({ data: { name } })
    }

    if (!parentId) throw new Error(`Parent ID required for type: ${type}`)

    if (type === 'subRegion') {
        return prisma.subRegion.create({
            data: {
                name,
                regionId: parentId
            }
        })
    }

    if (type === 'zone') {
        return prisma.zone.create({
            data: {
                name,
                subRegionId: parentId
            }
        })
    }
}

/**
 * Delete an item (Region, SubRegion, or Zone)
 */
export async function deleteSlugItem(type: 'region' | 'subRegion' | 'zone', id: string) {
    try {
        if (type === 'region') {
            return await prisma.region.delete({ where: { id } })
        }
        if (type === 'subRegion') {
            return await prisma.subRegion.delete({ where: { id } })
        }
        if (type === 'zone') {
            return await prisma.zone.delete({ where: { id } })
        }
    } catch (error) {
        console.error('Error deleting item:', error)
        throw new Error('Failed to delete item')
    }
}
