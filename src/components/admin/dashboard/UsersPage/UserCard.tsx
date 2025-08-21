'use client'

import { Crown, Edit, Eye, MoreHorizontal, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { User as UserType } from '@/types/user'

interface UserCardProps {
  user: UserType
  index: number
  onViewDetails: (user: UserType) => void
}

export function UserCard({ user, onViewDetails }: UserCardProps) {
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

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors group">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center text-white font-medium text-sm',
            getRoleColor(user.role),
          )}
        >
          {getInitials(user.name || 'User')}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {user.name || 'Unnamed User'}
            </h3>
            <div
              className={cn(
                'w-4 h-4 rounded flex items-center justify-center',
                getRoleColor(user.role),
              )}
            >
              <RoleIcon className="w-2.5 h-2.5 text-white" />
            </div>
            {user.emailVerified && <div className="w-2 h-2 bg-green-500 rounded-full" />}
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{user.email || 'No email'}</span>
            <span>•</span>
            <span>{user.role?.toLowerCase() || 'user'}</span>
            <span>•</span>
            <span>
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

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetails(user)}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Eye className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
