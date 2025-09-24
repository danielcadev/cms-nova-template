'use client'

import { Crown, Edit, Eye, MoreHorizontal, Trash2, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { User as UserType } from '@/types/user'

interface UserCardProps {
  user: UserType
  index: number
  onViewDetails: (user: UserType) => void
  onDeleteUser?: (user: UserType) => void
  currentUserId?: string
}

export function UserCard({ user, onViewDetails, onDeleteUser, currentUserId }: UserCardProps) {
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
        return 'bg-blue-600'
      case 'editor':
        return 'bg-emerald-600'
      case 'user':
        return 'bg-gray-600'
      default:
        return 'bg-gray-600'
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'admin':
        return Crown
      case 'editor':
        return Edit
      default:
        return User
    }
  }

  const RoleIcon = getRoleIcon(user.role)

  // No permitir eliminar el usuario actual
  const canDelete = currentUserId !== user.id && onDeleteUser

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group gap-3 sm:gap-0">
      <div className="flex items-start sm:items-center gap-3 sm:gap-4 flex-1 min-w-0">
        <div
          className={cn(
            'w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white font-medium text-sm flex-shrink-0',
            getRoleColor(user.role),
          )}
        >
          {getInitials(user.name || 'User')}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate text-sm sm:text-base">
                {user.name || 'Unnamed User'}
              </h3>
              <div
                className={cn(
                  'w-4 h-4 rounded flex items-center justify-center flex-shrink-0',
                  getRoleColor(user.role),
                )}
              >
                <RoleIcon className="w-2.5 h-2.5 text-white" />
              </div>
              {user.emailVerified && (
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
            <span className="truncate max-w-full sm:max-w-xs">{user.email || 'No email'}</span>
            <span className="hidden sm:inline">•</span>
            <div className="flex items-center gap-2 sm:gap-1">
              <span className="capitalize">{user.role?.toLowerCase() || 'user'}</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-xs">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 self-start sm:self-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(user)}
          className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 sm:h-9 sm:w-9"
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 sm:h-9 sm:w-9"
            >
              <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onViewDetails(user)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem
                onClick={() => onDeleteUser?.(user)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar usuario
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
