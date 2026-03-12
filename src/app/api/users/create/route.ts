import { parseSetCookieHeader } from 'better-auth/cookies'
import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { auth } from '@/server/auth/config'
import { getRequestSession } from '@/server/auth/guards'
import logger from '@/server/observability/logger'

const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  name: z.string().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Ensure the requester is an authenticated admin.
    const session = await getRequestSession(request)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only the first (primary) admin can create other users.
    const firstAdmin = await prisma.user.findFirst({
      orderBy: { createdAt: 'asc' },
    })

    if (!firstAdmin || firstAdmin.id !== session.user.id) {
      return NextResponse.json(
        { error: 'Only the primary admin can create new users' },
        { status: 403 },
      )
    }

    // Validate input.
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)

    // Ensure the email is not already registered.
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 400 })
    }

    // Create user via Better Auth admin API.
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
      logger.error('Better Auth createUser failed', {
        status: createResponse.status,
        body: errorBody,
      })
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    // Delete any set-cookie headers so this request does not alter the current session.
    const setCookieHeader = createResponse.headers.get('set-cookie')
    if (setCookieHeader) {
      const cookieStore = await cookies()
      const parsedCookies = parseSetCookieHeader(setCookieHeader)
      parsedCookies.forEach((_, key) => {
        if (!key) return
        try {
          cookieStore.delete(key)
        } catch (_error) {
          // ignore
        }
      })
    }

    const createData = await createResponse.json()
    const createdUser = createData?.user

    if (!createdUser) {
      throw new Error('Could not read created user data')
    }

    // Ensure role and verification flags.
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
      message: 'User created successfully',
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.issues.map((i) => i.message) },
        { status: 400 },
      )
    }
    logger.error('Error in /api/users/create', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
