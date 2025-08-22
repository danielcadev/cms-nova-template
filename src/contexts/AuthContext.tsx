'use client'

import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { authClient } from '@/lib/auth-client'
import { isAdminUser } from '@/lib/auth-utils'
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
      const isAdmin = isAdminUser(session.data)
      setUser(session.data?.user || null)
      setIsAuthenticated(isAdmin)
      return isAdmin
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

        const signInResponse = (await authClient.signIn.email({
          email: formData.email,
          password: formData.password,
        })) as BetterAuthResponse<UserResponse>
        if (signInResponse.error)
          throw new Error(signInResponse.error.message || 'Failed to sign in')

        await new Promise((resolve) => setTimeout(resolve, 700))
        const isAdmin = await checkSession()
        if (!isAdmin) {
          await authClient.signOut()
          throw new Error('You do not have administrator permissions')
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
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <div className="text-center space-y-2">
            <p className="text-gray-900 font-medium text-lg">Loading workspace...</p>
            <p className="text-gray-500 text-sm">Please wait while we set things up</p>
          </div>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('useAuthContext must be used within an AuthProvider')
  return context
}
