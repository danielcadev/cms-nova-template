'use client'

import { createContext, type ReactNode, useContext, useState } from 'react'

interface ImageUploadContextType {
  isUploading: boolean
  setIsUploading: (uploading: boolean) => void
  uploadingItems: Set<string>
  addUploadingItem: (id: string) => void
  removeUploadingItem: (id: string) => void
}

const ImageUploadContext = createContext<ImageUploadContextType | null>(null)

export function ImageUploadProvider({ children }: { children: ReactNode }) {
  const [uploadingItems, setUploadingItems] = useState<Set<string>>(new Set())

  const isUploading = uploadingItems.size > 0

  const addUploadingItem = (id: string) => {
    setUploadingItems((prev) => new Set(prev).add(id))
  }

  const removeUploadingItem = (id: string) => {
    setUploadingItems((prev) => {
      const newSet = new Set(prev)
      newSet.delete(id)
      return newSet
    })
  }

  const setIsUploading = (uploading: boolean) => {
    // For backward compatibility, but prefer using addUploadingItem/removeUploadingItem
    if (!uploading) {
      setUploadingItems(new Set())
    }
  }

  return (
    <ImageUploadContext.Provider
      value={{
        isUploading,
        setIsUploading,
        uploadingItems,
        addUploadingItem,
        removeUploadingItem,
      }}
    >
      {children}
    </ImageUploadContext.Provider>
  )
}

export function useImageUpload() {
  const context = useContext(ImageUploadContext)
  if (!context) {
    throw new Error('useImageUpload must be used within an ImageUploadProvider')
  }
  return context
}
