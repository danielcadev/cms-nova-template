import { parseSetCookieHeader } from 'better-auth/cookies'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createAdminSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
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

    console.log('🔍 Current user check:', {
      userId: session.user.id,
      currentUserRole: currentUser?.role,
      sessionData: session.user,
    })

    if (!currentUser?.role || !['admin', 'ADMIN'].includes(currentUser.role)) {
      return NextResponse.json({ error: 'Permisos insuficientes' }, { status: 403 })
    }

    // Solo el primer admin puede crear otros admins (super admin)
    const firstAdmin = await prisma.user.findFirst({
      where: {
        role: {
          in: ['admin', 'ADMIN'],
        },
      },
      orderBy: { createdAt: 'asc' },
      select: { id: true, role: true, createdAt: true },
    })

    console.log('👑 First admin check:', {
      firstAdmin,
      currentUserId: session.user.id,
      isFirstAdmin: firstAdmin?.id === session.user.id,
    })

    if (!firstAdmin || firstAdmin.id !== session.user.id) {
      return NextResponse.json(
        {
          error: 'Solo el administrador principal puede crear nuevos administradores',
        },
        { status: 403 },
      )
    }

    // Validar datos
    const body = await request.json()
    const validatedData = createAdminSchema.parse(body)

    // Verificar que el email no existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
    }

    // Crear usuario con el endpoint administrativo sin propagar los cookies de la respuesta
    const createResponse = await auth.api.createUser({
      body: {
        email: validatedData.email,
        password: validatedData.password,
        name: validatedData.name,
        role: 'admin',
        data: {},
      },
      headers: request.headers,
      asResponse: true,
    })

    if (!createResponse.ok) {
      const errorBody = await createResponse.json().catch(() => null)
      console.error('Better Auth createUser failed:', {
        status: createResponse.status,
        body: errorBody,
      })

      return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
    }

    const setCookieHeader = createResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      const cookieStore = cookies()
      const parsedCookies = parseSetCookieHeader(setCookieHeader)
      parsedCookies.forEach((_, key) => {
        if (!key) return
        try {
          cookieStore.delete(key)
        } catch (error) {
          console.error('Failed to delete Better Auth cookie', { key, error })
        }
      })
    }

    const createData = (await createResponse.json().catch(() => null)) as {
      user?: { id: string }
    } | null

    const createdUser = createData?.user

    if (!createdUser) {
      throw new Error('Failed to parse created user from Better Auth response')
    }

    // Actualizar el rol y otros campos necesarios
    const result = await prisma.user.update({
      where: { id: createdUser.id },
      data: {
        role: 'admin', // Minúsculas como Better Auth espera por defecto
        emailVerified: true, // Boolean true para verificado
        banned: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    console.log('✅ Usuario y cuenta creados:', {
      userId: result.id,
      email: result.email,
      role: result.role,
    })

    return NextResponse.json({
      success: true,
      user: result,
      message: 'Usuario admin creado exitosamente',
    })
  } catch (error) {
    console.error('Error creating admin user:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: error.errors.map((e) => e.message),
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
