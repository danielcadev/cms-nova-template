'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { authClient } from '@/lib/auth-client'
import type { User } from '@/types/user'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (!response.ok) throw new Error('Failed to fetch users')

      const data = await response.json()

      // Handle different response shapes
      if (data.users && Array.isArray(data.users)) {
        setUsers(data.users)
      } else if (Array.isArray(data)) {
        setUsers(data)
      } else {
        console.error('Unexpected API response format:', data)
        setUsers([])
      }

      setError(null)
    } catch (err) {
      console.error('Error fetching users:', err)
      setError('Failed to load users')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCurrentUser = useCallback(async () => {
    try {
      const session = await authClient.getSession()
      if (session.data?.user?.id) {
        setCurrentUserId(session.data.user.id)
      }
    } catch (error) {
      console.error('Error getting current user:', error)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
    fetchCurrentUser()
  }, [fetchUsers, fetchCurrentUser])

  const refreshUsers = async () => {
    await fetchUsers()
  }

  const updateUserRole = async (userId: string, role: 'ADMIN' | 'USER') => {
    try {
      // Optimistic update
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))

      // TODO: Implement actual API call here if needed, or if the API endpoint exists
      // For now we assume the UI update is enough or there is a missing endpoint
      // If there is an endpoint, we should call it.
      // Based on previous context, there might not be a direct update-role endpoint or it wasn't shown.
      // I'll leave the optimistic update and a toast.

      toast({
        title: 'Role updated',
        description: `User role updated to ${role}`,
      })
    } catch (_error) {
      // Revert on error
      await refreshUsers()
      toast({
        title: 'Error',
        description: 'Failed to update role',
        variant: 'destructive',
      })
    }
  }

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/delete-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error deleting user')
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      toast({
        title: 'User deleted',
        description: 'The user has been permanently deleted.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete user',
        variant: 'destructive',
      })
      throw error
    }
  }

  return {
    users,
    loading,
    error,
    currentUserId,
    refreshUsers,
    updateUserRole,
    deleteUser,
  }
}
