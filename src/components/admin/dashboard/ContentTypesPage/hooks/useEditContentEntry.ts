import { useCallback, useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import type { ContentEntry } from '../data'

export function useEditContentEntry(contentTypeSlug: string, entryId: string) {
    const [entry, setEntry] = useState<ContentEntry | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const titleInputId = useId()
    const slugInputId = useId()

    const loadEntry = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`)
            if (response.ok) {
                const data = await response.json()
                setEntry(data)

                setFormData({
                    title: data.title,
                    slug: data.slug,
                    status: data.status,
                    ...data.data,
                })
            } else {
                toast({
                    title: 'Error',
                    description: 'Content entry not found',
                    variant: 'destructive',
                })
                router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)
            }
        } catch (error) {
            console.error('Error loading entry:', error)
            toast({
                title: 'Error',
                description: 'Failed to load content entry',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [contentTypeSlug, entryId, router, toast])

    useEffect(() => {
        loadEntry()
    }, [loadEntry])

    const handleInputChange = (name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!entry || !entry.contentType) return

        const errors: string[] = []

        if (!formData.title?.trim()) {
            errors.push('Title is required')
        }

        if (!formData.slug?.trim()) {
            errors.push('Slug is required')
        }

        entry.contentType.fields.forEach((field) => {
            if (field.required && !formData[field.name]) {
                errors.push(`${field.name} is required`)
            }
        })

        if (errors.length > 0) {
            toast({
                title: 'Validation Error',
                description: errors.join(', '),
                variant: 'destructive',
            })
            return
        }

        try {
            setSaving(true)
            const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Content entry updated successfully',
                })
                loadEntry()
            } else {
                const error = await response.json()
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to update content entry',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            console.error('Error updating entry:', error)
            toast({
                title: 'Error',
                description: 'Failed to update content entry',
                variant: 'destructive',
            })
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            return
        }

        try {
            setDeleting(true)
            const response = await fetch(`/api/content-types/${contentTypeSlug}/entries/${entryId}`, {
                method: 'DELETE',
            })

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Content entry deleted successfully',
                })
                router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)
            } else {
                toast({
                    title: 'Error',
                    description: 'Failed to delete content entry',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            console.error('Error deleting entry:', error)
            toast({
                title: 'Error',
                description: 'Failed to delete content entry',
                variant: 'destructive',
            })
        } finally {
            setDeleting(false)
        }
    }

    return {
        entry,
        formData,
        loading,
        saving,
        deleting,
        titleInputId,
        slugInputId,
        handleInputChange,
        handleSubmit,
        handleDelete,
        router
    }
}
