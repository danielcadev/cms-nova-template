// api/admin/create-first-admin/route.ts - Create first administrator
import { type NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    // Ensure no admin/user exists yet
    const existingUserCount = await prisma.user.count()
    if (existingUserCount > 0) {
      return NextResponse.json(
        { error: 'An administrator already exists. Registration is disabled.' },
        { status: 403 },
      )
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Password length validation
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // Ensure email is not already registered
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already registered' }, { status: 409 })
    }

    const authContext = await auth.$context
    const hashedPassword = await authContext.password.hash(password)

    const admin = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: 'ADMIN',
          emailVerified: new Date(),
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      })

      await tx.account.create({
        data: {
          userId: newUser.id,
          accountId: newUser.id,
          providerId: 'credential',
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      return newUser
    })

    return NextResponse.json({
      success: true,
      message: 'Administrator created successfully',
      admin,
    })
  } catch (error) {
    console.error('Error creating first admin:', error)

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
