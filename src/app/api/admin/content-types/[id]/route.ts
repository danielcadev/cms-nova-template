import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // Check if exists
        const existing = await prisma.contentType.findUnique({
            where: { id },
        })

        if (!existing) {
            return NextResponse.json(
                { success: false, message: 'Content type not found' },
                { status: 404 }
            )
        }

        // Delete (Cascade deletion should handle fields if configured, otherwise we might need to delete fields first)
        // Assuming standard relation where fields are deleted or checking if entries exist
        // For now, let's try direct delete. If Prisma schema has cascade, it works.

        // First delete all fields associated with this content type to be safe if cascade isn't set up
        await prisma.field.deleteMany({
            where: { contentTypeId: id },
        })

        // Delete the content type
        await prisma.contentType.delete({
            where: { id },
        })

        return NextResponse.json({
            success: true,
            message: 'Content type deleted successfully',
        })
    } catch (error) {
        console.error('Error deleting content type:', error)
        return NextResponse.json(
            { success: false, message: 'Failed to delete content type' },
            { status: 500 }
        )
    }
}
