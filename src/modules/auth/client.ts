import { createAuthClient } from 'better-auth/client'
import { adminClient } from 'better-auth/client/plugins'

const getBaseURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000'
  }

  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

const baseURL = getBaseURL()

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
})
