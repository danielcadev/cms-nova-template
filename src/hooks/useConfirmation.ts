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

// Configuraciones predefinidas para casos comunes
export const confirmationPresets = {
  deleteUser: (userName: string): ConfirmationConfig => ({
    title: 'Eliminar Usuario',
    description: `¿Estás seguro de que quieres eliminar a ${userName}?\n\nEsta acción no se puede deshacer. Toda la información del usuario será eliminada permanentemente.`,
    confirmText: 'Eliminar Usuario',
    variant: 'destructive' as const,
    icon: 'delete' as const,
  }),

  deleteContent: (contentName: string): ConfirmationConfig => ({
    title: 'Eliminar Contenido',
    description: `¿Estás seguro de que quieres eliminar "${contentName}"?\n\nEsta acción no se puede deshacer.`,
    confirmText: 'Eliminar',
    variant: 'destructive' as const,
    icon: 'file' as const,
  }),

  banUser: (userName: string): ConfirmationConfig => ({
    title: 'Banear Usuario',
    description: `¿Estás seguro de que quieres banear a ${userName}?\n\nEl usuario no podrá acceder al sistema hasta que sea desbaneado.`,
    confirmText: 'Banear Usuario',
    variant: 'warning' as const,
    icon: 'ban' as const,
  }),

  deleteDay: (dayNumber: number): ConfirmationConfig => ({
    title: 'Eliminar Día del Itinerario',
    description: `¿Estás seguro de que quieres eliminar el Día ${dayNumber}?\n\nEsta acción no se puede deshacer. Toda la información del día será eliminada permanentemente.`,
    confirmText: 'Eliminar Día',
    variant: 'destructive' as const,
    icon: 'delete' as const,
  }),

  removeAdmin: (userName: string): ConfirmationConfig => ({
    title: 'Remover Permisos de Admin',
    description: `¿Estás seguro de que quieres remover los permisos de administrador de ${userName}?\n\nEl usuario perderá acceso a todas las funciones administrativas.`,
    confirmText: 'Remover Admin',
    variant: 'warning' as const,
    icon: 'shield' as const,
  }),
}
