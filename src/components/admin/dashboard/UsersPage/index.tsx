'use client'

import { CheckCircle, Clock, RefreshCw, Shield, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { useToast } from '@/hooks/use-toast'
import { useUsers } from '@/hooks/use-users'
import type { User as UserType } from '@/types/user'
import { AdminLoading } from '../AdminLoading'
import { UserDetailModal } from './UserDetailModal'
// Componentes modulares
import { UsersGrid } from './UsersGrid'

export function UsersPage() {
  const { users, loading, updateUserRole, refreshUsers } = useUsers()
  const { toast } = useToast()
  const [searchTerm, _setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filtrar usuarios
  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Estadísticas
  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === 'ADMIN').length,
    verified: users.filter((u) => u.emailVerified).length,
    newThisMonth: users.filter((u) => {
      if (!u.createdAt) return false
      const userDate = new Date(u.createdAt)
      const now = new Date()
      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear()
    }).length,
  }

  // Determinar el primer usuario (el más antiguo)
  const firstUser =
    users.length > 0
      ? users.reduce((oldest, current) =>
          new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current,
        )
      : null

  // Handlers
  const handleViewDetails = (user: UserType) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refreshUsers()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const handleUpdateRole = async (userId: string, role: 'ADMIN' | 'USER') => {
    try {
      await updateUserRole(userId, role)
      await refreshUsers()
      toast({
        title: 'Success',
        description: 'Role updated successfully',
      })
    } catch (_error) {
      toast({
        title: 'Error',
        description: 'Could not update role',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteUser = async (_userId: string) => {
    toast({
      title: 'Feature not available',
      description: 'User deletion will be available soon',
      variant: 'destructive',
    })
  }

  const handleToggleBan = async (_userId: string, _shouldBan: boolean) => {
    toast({
      title: 'Feature not available',
      description: 'User banning will be available soon',
      variant: 'destructive',
    })
  }

  // Loading state
  if (loading)
    return (
      <div className="px-6 pt-6 relative">
        <AdminLoading
          title="Users"
          message="Loading user management..."
          variant="content"
          fullScreen
        />
      </div>
    )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-950">
      <div className="mx-auto max-w-6xl px-8 py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-2xl border theme-border theme-card mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-8 md:p-10 flex items-start justify-between">
            <div>
              <p className="text-sm theme-text-muted mb-2">Directory</p>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight theme-text">
                Users
              </h1>
              <p className="mt-2 theme-text-secondary max-w-xl">
                Manage users, roles and permissions across your organization.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <ThemedButton
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh'}
              </ThemedButton>
              <ThemedButton className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border theme-border theme-card theme-text hover:theme-card-hover transition-colors">
                <UserPlus className="h-4 w-4" />
                Invite user
              </ThemedButton>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total users
              </span>
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Users className="h-4 w-4 text-gray-600 dark:text-gray-300" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.total}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Admins</span>
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-600 dark:text-gray-300" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.admins}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified</span>
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <CheckCircle
                  className="h-4 w-4 text-gray-600 dark:text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.verified}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                New this month
              </span>
              <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <Clock className="h-4 w-4 text-gray-600 dark:text-gray-300" strokeWidth={1.5} />
              </div>
            </div>
            <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.newThisMonth}
            </div>
          </div>
        </div>

        {/* Users grid */}
        <div className="mb-8">
          <UsersGrid
            users={filteredUsers}
            loading={loading}
            error={null}
            onViewDetails={handleViewDetails}
          />
        </div>

        {/* User Detail Modal */}
        <UserDetailModal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onUpdateRole={handleUpdateRole}
          onDeleteUser={handleDeleteUser}
          onToggleBan={handleToggleBan}
          isFirstUser={selectedUser?.id === firstUser?.id}
        />
      </div>
    </div>
  )
}
