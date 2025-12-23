import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const locales = ['en', 'es']
const defaultLocale = 'es'

export function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Skip public files, api routes, and static assets
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next()
    }

    // Get locale from cookie
    let locale = request.cookies.get('NEXT_LOCALE')?.value

    // If no cookie, try to detect from headers or use default
    if (!locale) {
        const acceptLanguage = request.headers.get('accept-language')
        if (acceptLanguage) {
            if (acceptLanguage.startsWith('en')) {
                locale = 'en'
            } else if (acceptLanguage.startsWith('es')) {
                locale = 'es'
            }
        }

        locale = locale || defaultLocale

        // Set the cookie for future requests
        const response = NextResponse.next()
        response.cookies.set('NEXT_LOCALE', locale, {
            path: '/',
            maxAge: 31536000,
            sameSite: 'lax',
        })
        return response
    }

    return NextResponse.next()
}

// Next.js convention: the proxy function runs on every request matched by the matcher
export const config = {
    // Matcher ignoring `/_next/` and `/api/`
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
