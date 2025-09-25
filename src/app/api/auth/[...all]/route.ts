import { auth } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'

// Debug info solo en desarrollo
if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Auth route handler loaded!')
  console.log('Environment:', process.env.NODE_ENV)
  console.log('Base URL:', process.env.BETTER_AUTH_URL || 'http://localhost:3000')
}

export const { GET, POST } = toNextJsHandler(auth)
