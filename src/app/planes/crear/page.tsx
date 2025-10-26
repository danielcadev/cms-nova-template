'use client'

import { CreatePlanForm } from '@/components/templates'
import { ImageUploadProvider } from '@/contexts/ImageUploadContext'

// Server Component por defecto
export default function CrearPlanPage() {
  return (
    <ImageUploadProvider>
      <div className="container mx-auto py-10">
        <CreatePlanForm />
      </div>
    </ImageUploadProvider>
  )
}
