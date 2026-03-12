import type { NextRequest } from 'next/server'
import { auth } from './config'

type RequestLike = Pick<NextRequest, 'headers'>

export async function getRequestSession(request: RequestLike) {
  return auth.api.getSession({ headers: request.headers })
}

export async function isRequestAdmin(request: RequestLike) {
  const session = await getRequestSession(request)
  const role = session?.user?.role?.toString().toLowerCase()
  return role === 'admin' || role === 'administrator'
}
