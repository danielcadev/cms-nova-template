
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Find Content Type - Broad search to find ANYTHING helpful
        // But primarily target 'sEOBlog' since we know it exists
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

        const fieldsToAdd = [
            { label: 'Region Name', apiIdentifier: 'regionName', type: 'TEXT' },
            { label: 'Sub Region Name', apiIdentifier: 'subRegionName', type: 'TEXT' },
            { label: 'Zona Name', apiIdentifier: 'zonaName', type: 'TEXT' },
            { label: 'Category', apiIdentifier: 'category', type: 'TEXT' },
        ]

        const results = []

        for (const f of fieldsToAdd) {
            const exists = await prisma.field.findFirst({
                where: {
                    contentTypeId: contentType.id,
                    apiIdentifier: f.apiIdentifier
                }
            })

            if (!exists) {
                await prisma.field.create({
                    data: {
                        label: f.label,
                        apiIdentifier: f.apiIdentifier,
                        type: f.type as any,
                        contentTypeId: contentType.id,
                        isRequired: false
                    }
                })
                results.push(`Created: ${f.label} in ${contentType.name}`)
            } else {
                results.push(`Exists: ${f.label} in ${contentType.name}`)
            }
        }

        return NextResponse.json({ success: true, results })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
