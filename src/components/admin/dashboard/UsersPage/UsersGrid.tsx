'use client'

import { UserPlus, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { User as UserType } from '@/types/user'
import { UserCard } from './UserCard'

interface UsersGridProps {
  users: UserType[]
  loading: boolean
  error: any
  onViewDetails: (user: UserType) => void
}

export function UsersGrid({ users, loading, error, onViewDetails }: UsersGridProps) {
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
    <div className="space-y-3">
      {users.map((user, index) => (
        <UserCard key={user.id} user={user} index={index} onViewDetails={onViewDetails} />
      ))}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }, () => (
        <div
          key={crypto.randomUUID()}
          className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 animate-pulse"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            <div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
      ))}
    </div>
  )
}

function ErrorState() {
  return (
    <div className="text-center py-16 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="w-12 h-12 mx-auto bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-center mb-4">
        <Users className="w-6 h-6 text-red-600 dark:text-red-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        Error loading users
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        Could not load users. Check your connection and try again.
      </p>

      <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
        Retry
      </Button>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-16 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-4">
        <Users className="w-6 h-6 text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No users yet</h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        No users are registered in the system yet. Users will appear here when they sign up.
      </p>

      <Button>
        <UserPlus className="w-4 h-4 mr-2" />
        Invite User
      </Button>
    </div>
  )
}
