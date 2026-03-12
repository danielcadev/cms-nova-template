import { authClient } from '@/modules/auth/client'
import type { User, UserRole } from '@/types/user'

interface BetterAuthUser {
  id: string
  email: string
  name: string
  role?: string | null
  emailVerified: boolean
  createdAt: string | Date
  updatedAt: string | Date
  banned?: boolean | null
  banReason?: string | null
  banExpires?: string | Date | null
}

function mapBetterAuthUserToUser(userFromAuth: BetterAuthUser): User {
  return {
    id: userFromAuth.id,
    name: userFromAuth.name,
    email: userFromAuth.email,
    role: (userFromAuth.role as UserRole) || 'USER',
    emailVerified: userFromAuth.emailVerified,
    createdAt: new Date(userFromAuth.createdAt),
    updatedAt: new Date(userFromAuth.updatedAt),
    status: userFromAuth.banned ? 'inactive' : 'active',
    banned: !!userFromAuth.banned,
    banReason: userFromAuth.banReason || undefined,
    banExpires: userFromAuth.banExpires ? new Date(userFromAuth.banExpires) : undefined,
  }
}

async function listUsers(): Promise<User[]> {
  const response = await authClient.admin.listUsers({ query: { limit: 100 } })
  if ('error' in response && response.error) {
    throw new Error(response.error.message || 'Failed to list users')
  }

  const users =
    (response as any)?.data?.users?.map((u: BetterAuthUser) => mapBetterAuthUserToUser(u)) || []
  return users
}

async function updateUserRole(userId: string, role: UserRole) {
  const betterAuthRole = role === 'ADMIN' ? 'admin' : 'user'
  const response = await authClient.admin.setRole({ userId, role: betterAuthRole })
  if ('error' in response && response.error) {
    throw new Error(response.error.message || 'Failed to update user role')
  }
  return (response as any)?.data
}

async function deleteUser(userId: string): Promise<void> {
  const res = await fetch('/api/admin/delete-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId }),
  })

  const data = (await res.json().catch(() => ({}))) as any
  if (!res.ok) {
    throw new Error(data?.error || 'Failed to delete user')
  }
}

export const adminService = {
  listUsers,
  updateUserRole,
  deleteUser,
}
