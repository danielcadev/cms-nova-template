'use client'

import { MediaPicker } from './MediaPicker'

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (mediaUrl: string) => void
  title?: string
  folder?: string
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title,
  folder,
}: MediaPickerModalProps) {
  return (
    <MediaPicker
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      folder={folder}
      onSelect={(item) => onSelect(item.url)}
    />
  )
}
