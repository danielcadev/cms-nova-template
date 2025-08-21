import { AdminLayout } from '@/components/admin/AdminLayout'
import { UsersPage } from '@/components/admin/dashboard/UsersPage'

export default function AdminUsersPage() {
  return (
    <AdminLayout>
      <UsersPage />
    </AdminLayout>
  )
}
