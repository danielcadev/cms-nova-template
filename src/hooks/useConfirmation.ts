import { useCallback, useState } from 'react'
import type { ConfirmationConfig } from '@/components/ui/ConfirmationModal'

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<ConfirmationConfig | null>(null)
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => Promise<void> | void) | null>(
    null,
  )

  const confirm = useCallback(
    (confirmationConfig: ConfirmationConfig, onConfirm: () => Promise<void> | void) => {
      setConfig(confirmationConfig)
      setOnConfirmCallback(() => onConfirm)
      setIsOpen(true)
    },
    [],
  )

  const close = useCallback(() => {
    setIsOpen(false)
    setConfig(null)
    setOnConfirmCallback(null)
  }, [])

  const handleConfirm = useCallback(async () => {
    if (onConfirmCallback) {
      await onConfirmCallback()
    }
  }, [onConfirmCallback])

  return {
    isOpen,
    config,
    confirm,
    close,
    handleConfirm,
  }
}

// Presets for common confirmation flows.
export const confirmationPresets = {
  deleteUser: (userName: string): ConfirmationConfig => ({
    title: 'Delete User',
    description: `Are you sure you want to delete ${userName}?\n\nThis action cannot be undone. All user data will be permanently deleted.`,
    confirmText: 'Delete User',
    variant: 'destructive' as const,
    icon: 'delete' as const,
  }),

  deleteContent: (contentName: string): ConfirmationConfig => ({
    title: 'Delete Content',
    description: `Are you sure you want to delete "${contentName}"?\n\nThis action cannot be undone.`,
    confirmText: 'Delete',
    variant: 'destructive' as const,
    icon: 'file' as const,
  }),

  banUser: (userName: string): ConfirmationConfig => ({
    title: 'Ban User',
    description: `Are you sure you want to ban ${userName}?\n\nThey will not be able to access the system until unbanned.`,
    confirmText: 'Ban User',
    variant: 'warning' as const,
    icon: 'ban' as const,
  }),

  deleteDay: (dayNumber: number): ConfirmationConfig => ({
    title: 'Delete Itinerary Day',
    description: `Are you sure you want to delete Day ${dayNumber}?\n\nThis action cannot be undone. All day information will be permanently deleted.`,
    confirmText: 'Delete Day',
    variant: 'destructive' as const,
    icon: 'delete' as const,
  }),

  removeAdmin: (userName: string): ConfirmationConfig => ({
    title: 'Remove Admin Access',
    description: `Are you sure you want to remove admin permissions from ${userName}?\n\nThey will lose access to all administrative features.`,
    confirmText: 'Remove Admin',
    variant: 'warning' as const,
    icon: 'shield' as const,
  }),
}
