
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const contentType = await prisma.contentType.findFirst({
            where: {
                OR: [
                    { apiIdentifier: 'sEOBlog' },
                    { name: 'SEO Blog' }
                ]
            }
        })

        if (!contentType) {
            return NextResponse.json({ error: 'Content Type "SEO Blog" not found.' }, { status: 404 })
        }

        const regions = [
            'Pacífico y Atlántico', 'Caribe', 'Santanderes', 'Andina',
            'Pacífico Sur', 'Orinoquía', 'Amazónica', 'Bogotá'
        ]

        const subRegions = [
            'Antioquia', 'Chocó', 'Bolívar', 'Sucre', 'Córdoba', 'Atlántico',
            'Cesar', 'Magdalena', 'La Guajira', 'San Andrés y Providencia',
            'Santander', 'Norte de Santander', 'Boyacá', 'Cundinamarca',
            'Caldas', 'Quindío', 'Risaralda', 'Tolima', 'Huila', 'Cauca',
            'Valle del Cauca', 'Nariño', 'Arauca', 'Casanare', 'Meta',
            'Vichada', 'Guaviare', 'Guainía', 'Vaupés', 'Amazonas',
            'Caquetá', 'Putumayo', 'Bogotá'
        ]

        const results = []

        const regionField = await prisma.field.findFirst({
            where: { contentTypeId: contentType.id, apiIdentifier: 'regionName' }
        })

        if (regionField) {
            await prisma.field.update({
                where: { id: regionField.id },
                data: {
                    type: 'SELECT' as any,
                    metadata: {
                        ...((regionField.metadata as any) || {}),
                        options: regions
                    }
                }
            })
            results.push('Converted Region Name to SELECT with options')
        }

        const subRegionField = await prisma.field.findFirst({
            where: { contentTypeId: contentType.id, apiIdentifier: 'subRegionName' }
        })

        if (subRegionField) {
            await prisma.field.update({
                where: { id: subRegionField.id },
                data: {
                    type: 'SELECT' as any,
                    metadata: {
                        ...((subRegionField.metadata as any) || {}),
                        options: subRegions
                    }
                }
            })
            results.push('Converted Sub Region Name to SELECT with options')
        }

        return NextResponse.json({ success: true, results })
    } catch (error: any) {
        console.error('API Error:', error)
        return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 })
    }
}
