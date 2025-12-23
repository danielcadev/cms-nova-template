'use client'

import { AlertCircle, UserPlus, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import type { User as UserType } from '@/types/user'
import { UserCard } from './UserCard'

interface UsersGridProps {
  users: UserType[]
  loading: boolean
  error: any
  onViewDetails: (user: UserType) => void
  onDeleteUser?: (user: UserType) => void
  currentUserId?: string
}

export function UsersGrid({
  users,
  loading,
  error,
  onViewDetails,
  onDeleteUser,
  currentUserId,
}: UsersGridProps) {
  if (loading) {
    return <LoadingState />
  }

  if (error) {
    return <ErrorState />
  }

  if (users.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.map((user, index) => (
        <UserCard
          key={user.id}
          user={user}
          index={index}
          onViewDetails={onViewDetails}
          onDeleteUser={onDeleteUser}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}

function LoadingState() {
  const skeletonIds = Array.from({ length: 8 }, (_, i) => `skeleton-${Date.now()}-${i}`)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {skeletonIds.map((id) => (
        <div
          key={id}
          className="h-[280px] rounded-2xl bg-white border border-zinc-100 p-6 shadow-sm animate-pulse flex flex-col items-center justify-center gap-4"
        >
          <div className="w-16 h-16 rounded-xl bg-zinc-100" />
          <div className="h-4 w-32 bg-zinc-100 rounded-full" />
          <div className="h-3 w-24 bg-zinc-100 rounded-full" />
          <div className="w-full mt-4 space-y-2">
            <div className="h-8 w-full bg-zinc-50 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}

function ErrorState() {
  const t = useTranslations('users')
  return (
    <div className="py-12">
      <div className="max-w-md mx-auto text-center p-8 rounded-2xl bg-red-50 border border-red-100">
        <div className="w-12 h-12 mx-auto bg-red-100 rounded-xl flex items-center justify-center mb-4 text-red-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-red-900 mb-2">{t('grid.errorTitle')}</h3>
        <p className="text-sm text-red-600 mb-6">
          {t('grid.errorDesc')}
        </p>
        <Button
          variant="outline"
          className="bg-white border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
        >
          {t('grid.tryAgain')}
        </Button>
      </div>
    </div>
  )
}

function EmptyState() {
  const t = useTranslations('users')
  return (
    <div className="py-20">
      <div className="max-w-md mx-auto text-center">
        <div className="w-20 h-20 mx-auto bg-zinc-50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100">
          <Users className="w-8 h-8 text-zinc-400" />
        </div>
        <h3 className="text-xl font-bold text-zinc-900 mb-2">{t('grid.emptyTitle')}</h3>
        <p className="text-zinc-500 mb-8">{t('grid.emptyDesc')}</p>
        <Button className="rounded-xl bg-zinc-900 text-white px-6 py-2.5 h-auto text-sm font-medium hover:bg-zinc-800 transition-colors">
          <UserPlus className="w-4 h-4 mr-2" />
          {t('inviteUser')}
        </Button>
      </div>
    </div>
  )
}
