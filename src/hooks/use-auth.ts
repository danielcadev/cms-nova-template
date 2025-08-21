// hooks/useAuth.ts
'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
// import { useToast } from '@/hooks/use-toast';
import { authClient } from '@/lib/auth-client'
import { isAdminUser } from '@/lib/auth-utils'
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
          throw new Error('Por favor, complete todos los campos')
        }
        if (!formData.email.includes('@')) {
          throw new Error('Por favor, ingrese un email válido')
        }

        // Intentar inicio de sesión
        const signInResponse = (await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        })) as BetterAuthResponse<UserResponse>

        if (signInResponse.error) {
          throw new Error(signInResponse.error.message || 'Error al iniciar sesión')
        }

        // Esperar un momento para que se establezca la sesión
        await new Promise((resolve) => setTimeout(resolve, 700))

        // Verificar que sea admin
        const session = (await authClient.getSession()) as GetSessionResponse
        if (session.error || !isAdminUser(session.data)) {
          await authClient.signOut()
          throw new Error('No tienes permisos de administrador')
        }

        router.replace('/admin/dashboard')
      } catch (_error: unknown) {
        // El manejo visual de error se centraliza en AuthContext
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
      // El manejo visual de error de logout se centraliza en AuthContext
    }
  }, [router])

  return { isLoading, handleAuth, handleLogout }
}
