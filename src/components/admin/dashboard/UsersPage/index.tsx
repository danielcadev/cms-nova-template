'use client'

import { CheckCircle, Clock, RefreshCw, Shield, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { ThemedButton } from '@/components/ui/ThemedButton'
import { useToast } from '@/hooks/use-toast'
import { useUsers } from '@/hooks/use-users'
import { confirmationPresets, useConfirmation } from '@/hooks/useConfirmation'
import { authClient } from '@/lib/auth-client'
import type { User as UserType } from '@/types/user'
import { AdminLoading } from '../AdminLoading'
import { CreateAdminModal } from './CreateAdminModal'
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Hook para confirmación genérica
  const confirmation = useConfirmation()

  // Obtener el usuario actual
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const session = await authClient.getSession()
        if (session.data?.user?.id) {
          setCurrentUserId(session.data.user.id)
        }
      } catch (error) {
        console.error('Error getting current user:', error)
      }
    }
    getCurrentUser()
  }, [])

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

  const handleDeleteUser = (userToDelete: UserType) => {
    // No permitir eliminar el primer admin
    if (userToDelete.id === firstUser?.id) {
      toast({
        title: 'No se puede eliminar',
        description: 'No puedes eliminar al administrador principal',
        variant: 'destructive',
      })
      return
    }

    // No permitir eliminarse a sí mismo
    if (userToDelete.id === currentUserId) {
      toast({
        title: 'No se puede eliminar',
        description: 'No puedes eliminarte a ti mismo',
        variant: 'destructive',
      })
      return
    }

    // Usar el modal de confirmación genérico
    confirmation.confirm(
      confirmationPresets.deleteUser(userToDelete.name || userToDelete.email),
      async () => {
        try {
          const response = await fetch(`/api/admin/delete-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: userToDelete.id }),
          })

          if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al eliminar usuario')
          }

          await refreshUsers()
          toast({
            title: 'Usuario eliminado',
            description: `${userToDelete.name || userToDelete.email} ha sido eliminado exitosamente`,
          })

          // Cerrar modal de detalles si está abierto para este usuario
          if (isModalOpen && selectedUser?.id === userToDelete.id) {
            handleCloseModal()
          }
        } catch (error: any) {
          toast({
            title: 'Error al eliminar usuario',
            description: error.message || 'No se pudo eliminar el usuario',
            variant: 'destructive',
          })
          throw error // Re-lanzar para que el modal maneje el estado de loading
        }
      },
    )
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
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        {/* Cover */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl border theme-border theme-card mb-4 sm:mb-6">
          <div className="absolute inset-0 theme-bg-secondary" />
          <div className="relative p-4 sm:p-6 lg:p-8 xl:p-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm theme-text-muted mb-2">Directory</p>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight theme-text">
                  Users
                </h1>
                <p className="mt-2 theme-text-secondary text-sm sm:text-base">
                  Manage users, roles and permissions across your organization.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <ThemedButton
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">
                    {isRefreshing ? 'Refreshing...' : 'Refresh'}
                  </span>
                </ThemedButton>
                <CreateAdminModal
                  onUserCreated={refreshUsers}
                  currentUserId={currentUserId || undefined}
                  users={users}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 sm:mb-8 lg:mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <div className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
                Total users
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Users
                  className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.total}
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
                Admins
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Shield
                  className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.admins}
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
                Verified
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <CheckCircle
                  className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
              {stats.verified}
            </div>
          </div>

          <div className="rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm p-3 sm:p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 leading-tight">
                New this month
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-md sm:rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                <Clock
                  className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600 dark:text-gray-300"
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div className="mt-1 sm:mt-2 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
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
            onDeleteUser={handleDeleteUser}
            currentUserId={currentUserId || undefined}
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

        {/* Confirmation Modal (genérico para todas las confirmaciones) */}
        {confirmation.config && (
          <ConfirmationModal
            isOpen={confirmation.isOpen}
            onClose={confirmation.close}
            onConfirm={confirmation.handleConfirm}
            config={confirmation.config}
          />
        )}
      </div>
    </div>
  )
}
