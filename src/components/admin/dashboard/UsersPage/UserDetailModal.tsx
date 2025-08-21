'use client'

import {
  Activity,
  Ban,
  Calendar,
  CheckCircle,
  Clock,
  Crown,
  Edit,
  Mail,
  Shield,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
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

  if (!user) return null

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'bg-blue-500'
      case 'editor':
        return 'bg-emerald-500'
      case 'user':
        return 'bg-slate-500'
      default:
        return 'bg-gray-500'
    }
  }

  const handleRoleUpdate = async (newRole: 'ADMIN' | 'USER') => {
    if (!onUpdateRole) return

    // Protect first user from losing admin privileges
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

  const handleDelete = async () => {
    if (!onDeleteUser) return

    // Protect first user (main admin)
    if (isFirstUser) {
      alert('Cannot delete the first system user for security.')
      return
    }

    if (
      window.confirm('Are you sure you want to delete this user? This action cannot be undone.')
    ) {
      setIsUpdating(true)
      try {
        await onDeleteUser(user.id)
        onClose()
      } catch (error) {
        console.error('Error deleting user:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  const handleToggleBan = async () => {
    if (!onToggleBan) return

    const shouldBan = !user.banned
    const action = shouldBan ? 'ban' : 'unban'

    // Protect first user from being banned
    if (isFirstUser && shouldBan) {
      alert('Cannot ban the first system user for security.')
      return
    }

    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      setIsUpdating(true)
      try {
        await onToggleBan(user.id, shouldBan)
        onClose()
      } catch (error) {
        console.error('Error toggling ban:', error)
      } finally {
        setIsUpdating(false)
      }
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile */}
          <div className="flex items-start gap-4 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <div
              className={cn(
                'w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl',
                getRoleColor(user.role),
              )}
            >
              {getInitials(user.name || 'User')}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user.name || 'Unnamed User'}
                </h3>
                {user.role === 'ADMIN' && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium">
                    <Crown className="w-3 h-3" />
                    Admin
                  </span>
                )}
                {user.banned && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm font-medium">
                    <Ban className="w-3 h-3" />
                    Banned
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
                {user.emailVerified ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-500" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Joined:{' '}
                  {user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'Date not available'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {user.emailVerified ? 'Verified' : 'Unverified'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Email Status</div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-semibold text-gray-900 dark:text-white mb-1 capitalize">
                {user.role?.toLowerCase() || 'User'}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">User Role</div>
            </div>
          </div>

          {/* Ban Information */}
          {user.banned && (
            <div className="bg-red-50/50 dark:bg-red-900/20 backdrop-blur-lg rounded-2xl p-6 border border-red-200/50 dark:border-red-700/50">
              <div className="flex items-center gap-2 mb-3">
                <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-lg font-bold text-red-700 dark:text-red-300">
                  Usuario Baneado
                </span>
              </div>
              {user.banReason && (
                <p className="text-gray-700 dark:text-gray-300 mb-2">Razón: {user.banReason}</p>
              )}
              {user.banExpires && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Expira: {new Date(user.banExpires).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleRoleUpdate(user.role === 'ADMIN' ? 'USER' : 'ADMIN')}
                disabled={isUpdating || (isFirstUser && user.role === 'ADMIN')}
                className={`rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${
                  isFirstUser && user.role === 'ADMIN'
                    ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 dark:text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500/90 hover:bg-blue-600 text-white'
                }`}
              >
                <Edit className="w-4 h-4 mr-2" />
                {isFirstUser && user.role === 'ADMIN'
                  ? 'Admin protegido'
                  : user.role === 'ADMIN'
                    ? 'Quitar Admin'
                    : 'Hacer Admin'}
              </Button>

              <Button
                onClick={handleToggleBan}
                disabled={isUpdating || isFirstUser}
                variant="outline"
                className={`rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${
                  isFirstUser
                    ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                    : 'border-amber-300 dark:border-amber-600 text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`}
              >
                <Ban className="w-4 h-4 mr-2" />
                {isFirstUser ? 'Usuario protegido' : user.banned ? 'Desbanear' : 'Banear'}
              </Button>
            </div>

            <Button
              onClick={handleDelete}
              disabled={isUpdating || isFirstUser}
              variant="outline"
              className={`w-full rounded-xl py-3 font-medium transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 ${
                isFirstUser
                  ? 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  : 'border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isFirstUser ? 'Usuario protegido' : 'Eliminar Usuario'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
