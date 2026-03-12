// hooks/useAuth.ts
'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { authClient } from '@/modules/auth/client'
import { isAdminUser } from '@/modules/auth/utils'
import type { BetterAuthResponse, GetSessionResponse, UserResponse } from '@/types/user'

interface LoginFormData {
  email: string
  password: string
}

export function useAuth() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleAuth = useCallback(
    async (formData: LoginFormData) => {
      setIsLoading(true)

      try {
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in all fields')
        }
        if (!formData.email.includes('@')) {
          throw new Error('Please enter a valid email')
        }

        // Attempt sign-in.
        const signInResponse = (await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        })) as BetterAuthResponse<UserResponse>

        if (signInResponse.error) {
          throw new Error(signInResponse.error.message || 'Failed to sign in')
        }

        // Wait briefly for session propagation.
        await new Promise((resolve) => setTimeout(resolve, 700))

        // Ensure admin access.
        const session = (await authClient.getSession()) as GetSessionResponse
        if (session.error || !isAdminUser(session.data)) {
          await authClient.signOut()
          throw new Error('You do not have admin permissions')
        }

        router.replace('/admin/dashboard')
      } catch (_error: unknown) {
        // Visual error handling is centralized in AuthContext.
      } finally {
        setIsLoading(false)
      }
    },
    [router],
  )

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut()
      router.push('/admin/login')
    } catch (_error) {
      // Visual logout error handling is centralized in AuthContext.
    }
  }, [router])

  return { isLoading, handleAuth, handleLogout }
}
