import { headers } from 'next/headers'
import { auth } from './config'

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getAdminSession() {
  const session = await getServerSession()
  const role = session?.user?.role?.toString().toLowerCase()
  return role === 'admin' || role === 'administrator' ? session : null
}
