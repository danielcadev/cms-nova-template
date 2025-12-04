'use client'

import { useCallback, useEffect, useState } from 'react'

export interface Experience {
  id: string
  title: string
  location?: string | null
  locationAlias: string
  slug: string
  hostName?: string | null
  createdAt: string
  published: boolean
  durationType?: string | null
  duration?: string | null
  scheduleDays?: string[] | null
  schedule?: string | null
  updatedAt?: string | null
}

export function useExperiences() {
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadExperiences = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch('/api/experiences')
      if (!response.ok) {
        throw new Error('Failed to load experiences')
      }

      const data = await response.json()
      setExperiences(data.experiences || [])
    } catch (err) {
      console.error('Error fetching experiences', err)
      setError('Unable to load experiences.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const deleteExperience = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete experience')
      }

      setExperiences((prev) => prev.filter((experience) => experience.id !== id))
      return true
    } catch (err) {
      console.error('Error deleting experience', err)
      return false
    }
  }, [])

  const togglePublished = useCallback(async (id: string, published: boolean) => {
    try {
      const response = await fetch(`/api/experiences/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ published }),
      })

      if (!response.ok) {
        throw new Error('Failed to update experience')
      }

      setExperiences((prev) =>
        prev.map((experience) =>
          experience.id === id ? { ...experience, published } : experience,
        ),
      )
      return true
    } catch (err) {
      console.error('Error toggling experience publish state', err)
      return false
    }
  }, [])

  useEffect(() => {
    loadExperiences()
  }, [loadExperiences])

  return {
    experiences,
    isLoading,
    error,
    refreshExperiences: loadExperiences,
    deleteExperience,
    togglePublished,
  }
}
