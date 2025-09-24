import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000'
      : 'http://localhost:3000',
  plugins: [adminClient()],
})
