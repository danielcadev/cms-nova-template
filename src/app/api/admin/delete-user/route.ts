import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const deleteUserSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
})

export async function POST(request: NextRequest) {
  try {
    // Verificar que el usuario actual es admin
    const session = await auth.api.getSession({ headers: request.headers })
    if (!session?.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar que es admin
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true, createdAt: true },
    })

    if (!currentUser?.role || !['admin', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Validar datos
    const body = await request.json()
    const { userId } = deleteUserSchema.parse(body)

    // Verificar que el usuario a eliminar existe
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true, createdAt: true },
    })

    if (!userToDelete) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // No permitir eliminar el primer admin
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
          error: 'No se puede eliminar al administrador principal',
        },
        { status: 403 },
      )
    }

    // No permitir que el usuario se elimine a sí mismo
    if (session.user.id === userId) {
      return NextResponse.json(
        {
          error: 'No puedes eliminarte a ti mismo',
        },
        { status: 403 },
      )
    }

    // Eliminar usuario y cuenta relacionada en una transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar cuenta asociada primero (si existe)
      await tx.account.deleteMany({
        where: { userId: userId },
      })

      // Eliminar sesiones asociadas
      await tx.session.deleteMany({
        where: { userId: userId },
      })

      // Eliminar usuario
      await tx.user.delete({
        where: { id: userId },
      })
    })

    console.log('✅ Usuario eliminado:', {
      userId: userId,
      email: userToDelete.email,
      deletedBy: session.user.id,
    })

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
    })
  } catch (error) {
    console.error('Error deleting user:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.issues.map((e) => e.message),
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        error: 'Error interno del servidor',
      },
      { status: 500 },
    )
  }
}
