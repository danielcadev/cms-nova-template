'use client'

import { usePathname, useRouter } from 'next/navigation'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { authClient } from '@/lib/auth-client'
import type {
  BetterAuthResponse,
  BetterAuthUser,
  GetSessionResponse,
  UserResponse,
} from '@/types/user'

interface LoginFormData {
  email: string
  password: string
}

interface AuthContextType {
  isLoading: boolean
  isAuthenticated: boolean | null
  user: BetterAuthUser | null
  handleAuth: (formData: LoginFormData) => Promise<void>
  handleLogout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [user, setUser] = useState<BetterAuthUser | null>(null)

  const isAuthPage =
    pathname?.startsWith('/admin/login') ||
    pathname?.startsWith('/admin/signin') ||
    pathname?.startsWith('/admin/signup')

  const checkSession = useCallback(async () => {
    try {
      const session = (await authClient.getSession()) as GetSessionResponse
      if (session.error) {
        setUser(null)
        setIsAuthenticated(false)
        return false
      }

      const hasUser = !!session.data?.user
      if (hasUser) {
        // Check if user has admin permissions
        try {
          const adminCheck = await authClient.admin.listUsers({ limit: 1 })
          console.log('👑 Admin check result:', adminCheck)
          setUser(session.data?.user || null)
          setIsAuthenticated(true)
        } catch (adminError) {
          console.log('❌ User does not have admin permissions:', adminError)
          setUser(null)
          setIsAuthenticated(false)
          return false
        }
      } else {
        setUser(null)
        setIsAuthenticated(false)
      }

      console.log('👤 Session check:', { hasUser, user: session.data?.user })
      return hasUser
    } catch (_error) {
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
  }, [])

  useEffect(() => {
    let mounted = true
    const initialCheck = async () => {
      await checkSession()
      if (mounted) setIsLoading(false)
    }
    initialCheck()
    return () => {
      mounted = false
    }
  }, [checkSession])

  useEffect(() => {
    const isAdminRoute = pathname?.startsWith('/admin')
    if (!isLoading && isAdminRoute && isAuthenticated === false && !isAuthPage) {
      router.replace('/admin/login')
    }
  }, [isAuthenticated, isLoading, isAuthPage, pathname, router])

  const handleAuth = useCallback(
    async (formData: LoginFormData) => {
      setIsLoading(true)
      try {
        if (!formData.email || !formData.password) throw new Error('Please fill in all fields')
        if (!formData.email.includes('@')) throw new Error('Please enter a valid email')

        console.log('🔐 Attempting sign in with:', { email: formData.email })

        // Intentar directamente sign in (usuarios deben crearse desde /admin/users)

        const signInResponse = (await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        })) as BetterAuthResponse<UserResponse>

        console.log('📥 Sign in response:', signInResponse)
        if (signInResponse.error)
          throw new Error(signInResponse.error.message || 'Failed to sign in')

        await new Promise((resolve) => setTimeout(resolve, 700))
        const isAuthenticated = await checkSession()
        if (!isAuthenticated) {
          await authClient.signOut()
          throw new Error('Authentication failed')
        }

        toast({
          title: 'Signed in successfully',
          description: 'Welcome to the dashboard',
          variant: 'default',
        })
        router.replace('/admin/dashboard')
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to sign in'
        toast({ title: 'Sign-in failed', description: errorMessage, variant: 'destructive' })
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    },
    [router, toast, checkSession],
  )

  const handleLogout = useCallback(async () => {
    try {
      await authClient.signOut()
      setUser(null)
      setIsAuthenticated(false)
      toast({ title: 'Signed out', description: 'See you soon', variant: 'default' })
      router.push('/admin/login')
    } catch (_error) {
      toast({
        title: 'Sign-out failed',
        description: 'There was an error signing out',
        variant: 'destructive',
      })
    }
  }, [toast, router])

  const value = { isLoading, isAuthenticated, user, handleAuth, handleLogout }

  if (isLoading && !isAuthPage) {
    const isAdminRoute = pathname?.startsWith('/admin')
    if (isAdminRoute) {
      // Avoid double loaders on admin routes; let route-level loaders handle it
      return null
    }
    // Public routes: render children without admin-themed loader
    return <>{children}</>
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuthContext must be used within an AuthProvider')
  return context
}
