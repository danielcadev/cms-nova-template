import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { getRequestSession } from '@/server/auth/guards'
import logger from '@/server/observability/logger'

const deleteUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export async function POST(request: NextRequest) {
  try {
    // Ensure the requester is an authenticated admin.
    const session = await getRequestSession(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check role.
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, createdAt: true },
    })

    if (!currentUser?.role || !['admin', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Validate input.
    const body = await request.json()
    const { userId } = deleteUserSchema.parse(body)

    // Ensure the user exists.
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    })

    if (!userToDelete) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Do not allow deleting the first (primary) admin.
    const firstAdmin = await prisma.user.findFirst({
      where: {
        role: {
          in: ['admin', 'ADMIN'],
        },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true },
    })

    if (firstAdmin?.id === userId) {
      return NextResponse.json(
        {
          error: 'The primary admin cannot be deleted',
        },
        { status: 403 },
      )
    }

    // Prevent self-deletion.
    if (session.user.id === userId) {
      return NextResponse.json(
        {
          error: 'You cannot delete your own account',
        },
        { status: 403 },
      )
    }

    // Delete user and related records in a transaction.
    await prisma.$transaction(async (tx) => {
      // Delete linked accounts first.
      await tx.account.deleteMany({
        where: { userId: userId },
      })

      // Delete sessions.
      await tx.session.deleteMany({
        where: { userId: userId },
      })

      // Delete the user.
      await tx.user.delete({
        where: { id: userId },
      })
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (error) {
    logger.error('Error deleting user', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: error.issues.map((e) => e.message),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
      },
      { status: 500 },
    )
  }
}
