import { AdminLoading } from '@/components/admin/dashboard/AdminLoading'

export default function Loading() {
  return (
    <div className="relative">
      <AdminLoading
        title="Dashboard"
        message="Loading your workspace..."
        variant="content"
        fullScreen
      />
    </div>
  )
}
