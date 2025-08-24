import type { ReactNode } from 'react'
import { AdminLayout } from '@/components/admin/AdminLayout'

export default function ContentTypesTemplate({ children }: { children: ReactNode }) {
  // Ensures AdminLayout wraps and keeps theme stable across segment navigation
  return <AdminLayout>{children}</AdminLayout>
}
