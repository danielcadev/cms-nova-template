'use client'

import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { useConfirmation } from '@/hooks/useConfirmation'

interface DeletePlanButtonProps {
  planId: string
  planTitle?: string
  onDelete: (id: string) => Promise<void>
  disabled?: boolean
}

export function DeletePlanButton({ planId, planTitle, onDelete, disabled }: DeletePlanButtonProps) {
  const confirmation = useConfirmation()

  const handleDelete = () => {
    confirmation.confirm(
      {
        title: 'Eliminar Plan',
        description: `¿Estás seguro de que quieres eliminar ${planTitle ? `"${planTitle}"` : 'este plan'}?\n\nEsta acción no se puede deshacer y toda la información del plan será eliminada permanentemente.`,
        confirmText: 'Eliminar Plan',
        variant: 'destructive',
        icon: 'delete',
      },
      async () => {
        await onDelete(planId)
      },
    )
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={disabled}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      {/* Confirmation Modal */}
      {confirmation.config && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.handleConfirm}
          config={confirmation.config}
        />
      )}
    </>
  )
}
