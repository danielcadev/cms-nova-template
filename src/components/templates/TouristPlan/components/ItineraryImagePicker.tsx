// components/templates/TouristPlan/components/ItineraryImagePicker.tsx
'use client'

import { Images, Trash2, Upload } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { MediaPicker } from '@/components/admin/media/MediaPicker'
import { Button } from '@/components/ui/button'

export function ItineraryImagePicker({
  value,
  onChange,
}: {
  value?: string
  onChange: (url: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative group w-full aspect-video rounded-md overflow-hidden">
          <Image src={value} alt="Itinerary image" fill className="object-cover" />
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setOpen(true)}
              className="rounded-full h-8 px-3 shadow-lg"
            >
              <Images className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="icon" onClick={() => onChange('')}>
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
            <Upload className="w-8 h-8 mb-4" />
            <p className="mb-2 text-sm font-semibold">Subir una imagen</p>
            <p className="text-xs">PNG, JPG, GIF hasta 10MB</p>
          </div>
          <input
            type="file"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && onChange(URL.createObjectURL(e.target.files[0]))
            }
            accept="image/*"
          />
          <Button
            type="button"
            variant="secondary"
            className="mt-3"
            onClick={(e) => {
              e.preventDefault()
              setOpen(true)
            }}
          >
            Elegir desde Media
          </Button>
        </label>
      )}

      <MediaPicker
        isOpen={open}
        onClose={() => setOpen(false)}
        onSelect={(item) => {
          onChange(item.url)
          setOpen(false)
        }}
      />
    </div>
  )
}
