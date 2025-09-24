import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/lib/auth'

console.log('🚀 Auth route handler loaded!')

export const { GET, POST } = toNextJsHandler(auth)
