import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

const baseURL = process.env.NODE_ENV === 'production'
  ? process.env.NEXT_PUBLIC_APP_URL || 'https://www.conociendocolombia.com'
  : 'http://localhost:3000'

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
})

// Debug info para verificar la URL en uso
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('🔗 Auth Client Base URL:', baseURL)
}
