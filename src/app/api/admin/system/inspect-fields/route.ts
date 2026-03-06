
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/server-session'

export async function GET() {
    try {
        const session = await getAdminSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const contentType = await prisma.contentType.findFirst({
            where: { apiIdentifier: 'seoBlog' },
            include: {
                fields: true
            }
        })

        if (!contentType) {
            return NextResponse.json({ error: 'SEO Blog content type not found' }, { status: 404 })
        }

        const fields = contentType.fields
            .filter(f => ['regionName', 'subRegionName', 'zonaName'].includes(f.apiIdentifier))
            .map(f => ({
                label: f.label,
                apiIdentifier: f.apiIdentifier,
                type: f.type,
                metadata: f.metadata
            }))

        return NextResponse.json({ fields })
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}
