import type React from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function ViewContentTemplate({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}
