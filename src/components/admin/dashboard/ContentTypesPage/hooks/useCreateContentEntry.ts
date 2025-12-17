import { useCallback, useEffect, useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import type { ContentType } from '../data'

export function useCreateContentEntry(contentTypeSlug: string) {
    const [contentType, setContentType] = useState<ContentType | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({
        title: '',
        slug: '',
        status: 'draft',
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    const titleInputId = useId()
    const slugInputId = useId()

    const loadContentType = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/content-types/${contentTypeSlug}`)
            if (response.ok) {
                const data = await response.json()
                setContentType(data)

                const initialData: Record<string, any> = {
                    title: '',
                    slug: '',
                    status: 'draft',
                }

                data.fields.forEach((field: any) => {
                    initialData[field.name] = field.type === 'boolean' ? false : ''
                })

                setFormData(initialData)
            } else {
                toast({
                    title: 'Error',
                    description: 'Content type not found',
                    variant: 'destructive',
                })
                router.push('/admin/dashboard/content-types')
            }
        } catch (error) {
            console.error('Error loading content type:', error)
            toast({
                title: 'Error',
                description: 'Failed to load content type',
                variant: 'destructive',
            })
        } finally {
            setLoading(false)
        }
    }, [contentTypeSlug, router, toast])

    useEffect(() => {
        loadContentType()
    }, [loadContentType])

    const handleInputChange = useCallback((name: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (name === 'title' && typeof value === 'string') {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setFormData((prev) => ({
                ...prev,
                slug,
            }))
        }
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!contentType) return

        const errors: string[] = []

        if (!formData.title?.trim()) {
            errors.push('Title is required')
        }

        if (!formData.slug?.trim()) {
            errors.push('Slug is required')
        }

        contentType.fields.forEach((field) => {
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
            const response = await fetch(`/api/content-types/${contentTypeSlug}/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (response.ok) {
                toast({
                    title: 'Success',
                    description: 'Content entry created successfully',
                })
                router.push(`/admin/dashboard/content-types/${contentTypeSlug}/content`)
            } else {
                const error = await response.json()
                toast({
                    title: 'Error',
                    description: error.message || 'Failed to create content entry',
                    variant: 'destructive',
                })
            }
        } catch (error) {
            console.error('Error creating entry:', error)
            toast({
                title: 'Error',
                description: 'Failed to create content entry',
                variant: 'destructive',
            })
        } finally {
            setSaving(false)
        }
    }

    return {
        contentType,
        formData,
        loading,
        saving,
        titleInputId,
        slugInputId,
        handleInputChange,
        handleSubmit,
        router
    }
}
