'use client'

import { useCallback, useEffect, useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { authClient } from '@/modules/auth/client'
import { adminService } from '@/services/admin/user/adminService'
import type { User, UserRole } from '@/types/user'

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchCurrentUser = useCallback(async () => {
    try {
      const session = await authClient.getSession()
      if (session.data?.user?.id) {
        setCurrentUserId(session.data.user.id)
      }
    } catch {
      setCurrentUserId(null)
    }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const list = await adminService.listUsers()
      setUsers(list)
      setError(null)
    } catch (err) {
      setUsers([])
      setError('Failed to load users')
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to load users',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
    fetchCurrentUser()
  }, [fetchUsers, fetchCurrentUser])

  const refreshUsers = async () => {
    await fetchUsers()
  }

  const updateUserRole = async (userId: string, role: UserRole) => {
    await adminService.updateUserRole(userId, role)
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)))
    toast({
      title: 'Role updated',
      description: `User role updated to ${role}`,
    })
  }

  const deleteUser = async (userId: string) => {
    await adminService.deleteUser(userId)
    setUsers((prev) => prev.filter((u) => u.id !== userId))
    toast({
      title: 'User deleted',
      description: 'The user has been permanently deleted.',
    })
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
