import { parseSetCookieHeader } from 'better-auth/cookies'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createUserSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
    name: z.string().optional(),
})

export async function POST(request: NextRequest) {
    try {
        // Verificar que el usuario actual es admin
        const session = await auth.api.getSession({ headers: request.headers })
        if (!session?.user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Verificar que es el primer admin (Super Admin)
        const firstAdmin = await prisma.user.findFirst({
            orderBy: { createdAt: 'asc' },
        })

        if (!firstAdmin || firstAdmin.id !== session.user.id) {
            return NextResponse.json(
                { error: 'Solo el administrador principal puede crear nuevos usuarios' },
                { status: 403 }
            )
        }

        // Validar datos
        const body = await request.json()
        const validatedData = createUserSchema.parse(body)

        // Verificar que el email no existe
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return NextResponse.json({ error: 'El email ya está registrado' }, { status: 400 })
        }

        // Crear usuario con el endpoint administrativo
        const createResponse = await auth.api.createUser({
            body: {
                email: validatedData.email,
                password: validatedData.password,
                name: validatedData.name || 'Admin User',
                role: 'admin',
                data: {},
            },
            headers: request.headers,
            asResponse: true,
        })

        if (!createResponse.ok) {
            const errorBody = await createResponse.json().catch(() => null)
            console.error('Better Auth createUser failed:', errorBody)
            return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 })
        }

        // Manejar cookies para que no afecten la sesión actual
        const setCookieHeader = createResponse.headers.get('set-cookie')
        if (setCookieHeader) {
            const cookieStore = await cookies()
            const parsedCookies = parseSetCookieHeader(setCookieHeader)
            parsedCookies.forEach((_, key) => {
                if (!key) return
                try {
                    cookieStore.delete(key)
                } catch (error) {
                    // ignore
                }
            })
        }

        const createData = await createResponse.json()
        const createdUser = createData?.user

        if (!createdUser) {
            throw new Error('No se pudo obtener la información del usuario creado')
        }

        // Asegurar rol y verificación
        const result = await prisma.user.update({
            where: { id: createdUser.id },
            data: {
                role: 'admin',
                emailVerified: true,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        })

        return NextResponse.json({
            success: true,
            user: result,
            message: 'Usuario creado exitosamente',
        })
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Datos inválidos', details: error.issues.map(i => i.message) }, { status: 400 })
        }
        console.error('Error in /api/users/create:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
