import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: request.headers })

        if (!session?.user) {
            return NextResponse.json({ isFirstAdmin: false }, { status: 401 })
        }

        const firstAdmin = await prisma.user.findFirst({
            orderBy: { createdAt: 'asc' },
            select: { id: true },
        })

        const isFirstAdmin = firstAdmin?.id === session.user.id

        return NextResponse.json({ isFirstAdmin })
    } catch (error) {
        console.error('Error in /api/users/is-first-admin:', error)
        return NextResponse.json({ isFirstAdmin: false }, { status: 500 })
    }
}
