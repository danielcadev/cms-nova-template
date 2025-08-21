import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    if (process.env.NODE_ENV === 'production' || process.env.ENABLE_ADMIN_TOOLS !== 'true') {
      return new NextResponse('Not Found', { status: 404 })
    }
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    // Try login using Better Auth directly
    try {
      const result = await auth.api.signInEmail({
        body: { email, password },
      })

      return NextResponse.json({
        success: true,
        message: 'Login successful',
        user: result.user,
        token: result.token,
        url: result.url,
        redirect: result.redirect,
      })
    } catch (authError: any) {
      console.error('❌ Authentication error:', authError)

      return NextResponse.json(
        {
          success: false,
          error: 'Authentication error',
          details: authError.message || 'Unknown error',
          code: authError.code || 'UNKNOWN_ERROR',
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error('❌ Error in test-login:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
