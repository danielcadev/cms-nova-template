'use client'

import { Crown, Edit, Eye, MoreHorizontal, ShieldCheck, Trash2, User } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { User as UserType } from '@/types/user'

interface UserCardProps {
  user: UserType
  index: number
  onViewDetails: (user: UserType) => void
  onDeleteUser?: (user: UserType) => void
  currentUserId?: string
}

export function UserCard({ user, onViewDetails, onDeleteUser, currentUserId }: UserCardProps) {
  const t = useTranslations('users')
  const locale = useLocale()
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
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
  const canDelete = currentUserId !== user.id && onDeleteUser

  return (
    <div className="group relative flex flex-col items-center rounded-2xl bg-white p-6 border border-zinc-200 shadow-sm hover:shadow-md hover:border-zinc-300 transition-all duration-200">
      {/* Actions Menu (Top Right) */}
      <div className="absolute top-3 right-3 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-xl border-zinc-200 shadow-lg p-1"
          >
            <DropdownMenuItem
              onSelect={() => {
                // Allow dropdown to close immediately
                setTimeout(() => onViewDetails(user), 50)
              }}
              className="rounded-lg cursor-pointer text-sm font-medium text-zinc-700 focus:text-zinc-900 focus:bg-zinc-100"
            >
              <Eye className="mr-2 h-4 w-4 text-zinc-400" />
              {t('card.viewProfile')}
            </DropdownMenuItem>
            {canDelete && (
              <DropdownMenuItem
                onClick={() => onDeleteUser?.(user)}
                className="text-red-600 focus:text-red-600 focus:bg-red-50 rounded-lg cursor-pointer text-sm font-medium"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {t('card.deleteAccount')}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Avatar */}
      <div className="mb-4 relative z-10">
        <div className="w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold bg-zinc-100 text-zinc-600 border border-zinc-200">
          {getInitials(user.name || 'U')}
        </div>
        {user.emailVerified && (
          <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full border border-zinc-200">
            <ShieldCheck className="w-4 h-4 text-zinc-900 fill-zinc-100" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center w-full mb-6">
        <h3 className="font-semibold text-zinc-900 truncate w-full text-base mb-1">
          {user.name || t('card.unnamedUser')}
        </h3>
        <p className="text-sm text-zinc-500 truncate w-full">{user.email || t('card.noEmail')}</p>
      </div>

      {/* Badges & Footer */}
      <div className="w-full mt-auto space-y-4">
        <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-zinc-200 bg-zinc-50 text-xs font-medium uppercase tracking-wide w-fit mx-auto text-zinc-600">
          <RoleIcon className="w-3.5 h-3.5" />
          {t(`roles.${(user.role || 'user').toLowerCase()}`)}
        </div>

        <div className="pt-4 border-t border-zinc-100 w-full flex items-center justify-center text-xs text-zinc-400">
          <span>
            {t('card.joined')}{' '}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString(locale, {
                month: 'short',
                year: 'numeric',
              })
              : t('card.unknownDate')}
          </span>
        </div>
      </div>
    </div>
  )
}
