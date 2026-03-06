
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/server-session'

export async function GET() {
    try {
        const session = await getAdminSession()
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const contentTypes = await prisma.contentType.findMany({
            include: {
                fields: true
            }
        })

        return NextResponse.json({
            count: contentTypes.length,
            types: contentTypes.map(ct => ({
                id: ct.id,
                name: ct.name,
                apiIdentifier: ct.apiIdentifier,
                fields: ct.fields.map(f => ({
                    label: f.label,
                    apiIdentifier: f.apiIdentifier,
                    type: f.type
                }))
            }))
        })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
