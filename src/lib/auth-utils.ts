// src/lib/auth-utils.ts
import type { SessionData } from '@/types/user'

export function isAdminUser(session: SessionData | null): boolean {
  if (!session?.user) return false
  const role = typeof session.user.role === 'string' ? session.user.role.toLowerCase() : ''
  return role === 'admin' || role === 'administrator' || role === 'ADMIN'.toLowerCase()
}
