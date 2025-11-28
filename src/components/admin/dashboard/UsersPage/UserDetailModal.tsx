'use client'

import { Ban, CheckCircle, Crown, Edit, Mail, Trash2, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { confirmationPresets, useConfirmation } from '@/hooks/useConfirmation'

import type { User as UserType } from '@/types/user'

interface UserDetailModalProps {
  user: UserType | null
  isOpen: boolean
  onClose: () => void
  onUpdateRole?: (userId: string, role: 'ADMIN' | 'USER') => Promise<void>
  onDeleteUser?: (userId: string) => Promise<void>
  onToggleBan?: (userId: string, shouldBan: boolean) => Promise<void>
  isFirstUser?: boolean
}

export function UserDetailModal({
  user,
  isOpen,
  onClose,
  onUpdateRole,
  onDeleteUser,
  onToggleBan,
  isFirstUser = false,
}: UserDetailModalProps) {
  const [isUpdating, setIsUpdating] = useState(false)
  const confirmation = useConfirmation()

  // Safety cleanup for body lock
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => {
        document.body.style.pointerEvents = ''
        document.body.style.overflow = ''
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const handleRoleUpdate = async (newRole: 'ADMIN' | 'USER') => {
    if (!onUpdateRole || !user) return

    if (isFirstUser && newRole === 'USER') {
      alert('Cannot remove admin role from the first system user for security.')
      return
    }

    setIsUpdating(true)
    try {
      await onUpdateRole(user.id, newRole)
      onClose()
    } catch (error) {
      console.error('Error updating role:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDelete = () => {
    if (!onDeleteUser || !user) return

    if (isFirstUser) {
      alert('Cannot delete the first system user for security.')
      return
    }

    confirmation.confirm(confirmationPresets.deleteUser(user.name || user.email), async () => {
      setIsUpdating(true)
      try {
        await onDeleteUser(user.id)
        onClose()
      } catch (error) {
        console.error('Error deleting user:', error)
        throw error
      } finally {
        setIsUpdating(false)
      }
    })
  }

  const handleToggleBan = () => {
    if (!onToggleBan || !user) return

    const shouldBan = !user.banned

    if (isFirstUser && shouldBan) {
      alert('Cannot ban the first system user for security.')
      return
    }

    const config = shouldBan
      ? confirmationPresets.banUser(user.name || user.email)
      : {
          title: 'Unban User',
          description: `Are you sure you want to unban ${user.name || user.email}?`,
          confirmText: 'Unban User',
          variant: 'info' as const,
          icon: 'shield' as const,
        }

    confirmation.confirm(config, async () => {
      setIsUpdating(true)
      try {
        await onToggleBan(user.id, shouldBan)
        onClose()
      } catch (error) {
        console.error('Error toggling ban:', error)
        throw error
      } finally {
        setIsUpdating(false)
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto p-0 overflow-hidden bg-white border-zinc-200">
        {!user ? (
          <div className="p-12 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900"></div>
          </div>
        ) : (
          <>
            <DialogHeader className="p-6 border-b border-zinc-100">
              <DialogTitle className="text-xl font-bold text-zinc-900">User Details</DialogTitle>
            </DialogHeader>

            <div className="p-6 space-y-8">
              {/* User Profile */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold bg-zinc-100 text-zinc-500 mb-4 border border-zinc-200">
                  {getInitials(user.name || 'User')}
                </div>

                <h3 className="text-xl font-bold text-zinc-900 mb-1">
                  {user.name || 'Unnamed User'}
                </h3>

                <div className="flex items-center gap-2 text-zinc-500 text-sm mb-4">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                  {user.emailVerified && <CheckCircle className="w-4 h-4 text-zinc-900" />}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-600 text-xs font-medium uppercase tracking-wide border border-zinc-200">
                    {user.role === 'ADMIN' ? (
                      <Crown className="w-3.5 h-3.5" />
                    ) : (
                      <User className="w-3.5 h-3.5" />
                    )}
                    {user.role}
                  </div>

                  {user.banned && (
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 text-white text-xs font-medium uppercase tracking-wide">
                      <Ban className="w-3.5 h-3.5" />
                      Banned
                    </div>
                  )}
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4 py-6 border-t border-b border-zinc-100">
                <div className="text-center">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">
                    Joined
                  </div>
                  <div className="text-sm font-medium text-zinc-900">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-zinc-400 uppercase tracking-wider font-medium mb-1">
                    Status
                  </div>
                  <div className="text-sm font-medium text-zinc-900">
                    {user.emailVerified ? 'Verified' : 'Unverified'}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Button
                  onClick={() => handleRoleUpdate(user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                  disabled={isUpdating || (isFirstUser && user.role === 'ADMIN')}
                  className="w-full rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 h-11"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  {user.role === 'ADMIN' ? 'Remove Admin Access' : 'Make Admin'}
                </Button>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleToggleBan}
                    disabled={isUpdating || isFirstUser}
                    variant="outline"
                    className="w-full rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 h-11"
                  >
                    <Ban className="w-4 h-4 mr-2" />
                    {user.banned ? 'Unban' : 'Ban'}
                  </Button>

                  <Button
                    onClick={handleDelete}
                    disabled={isUpdating || isFirstUser}
                    variant="outline"
                    className="w-full rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-red-600 hover:border-red-200 h-11"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>

      {/* Confirmation Modal */}
      {confirmation.config && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.handleConfirm}
          config={confirmation.config}
        />
      )}
    </Dialog>
  )
}
