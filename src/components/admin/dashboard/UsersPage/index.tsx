'use client'

import { useMemo, useState } from 'react'
import type { User } from '@/types/user'
import { AdminLoading } from '../AdminLoading'
import { UserDetailModal } from './UserDetailModal'
import { UsersGrid } from './UsersGrid'
import { UsersHeader } from './UsersHeader'
import { useUsers } from './useUsers'

export function UsersPage() {
  const { users, loading, error, currentUserId, updateUserRole, deleteUser, refreshUsers } =
    useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Filter users
  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users
    const lowerTerm = searchTerm.toLowerCase()
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(lowerTerm) ||
        user.email?.toLowerCase().includes(lowerTerm),
    )
  }, [users, searchTerm])

  const handleViewDetails = (user: User) => {
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDeleteUser = async (user: User) => {
    if (
      window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    ) {
      await deleteUser(user.id)
    }
  }

  if (loading) {
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
  }

  return (
    <div className="px-6 pt-6 pb-20 space-y-6">
      <UsersHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />

      <UsersGrid
        users={filteredUsers}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
        onDeleteUser={handleDeleteUser}
        currentUserId={currentUserId || undefined}
      />

      <UserDetailModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdateRole={async (userId, role) => {
          await updateUserRole(userId, role)
          refreshUsers()
        }}
        onDeleteUser={async (userId) => {
          const user = users.find((u) => u.id === userId)
          if (user) await handleDeleteUser(user)
        }}
        onToggleBan={async () => {}}
        isFirstUser={false}
      />
    </div>
  )
}
