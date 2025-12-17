'use client'

import { useId, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import type { ContentType } from './data'

export function useCreateContentEntry(contentType: ContentType) {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [status, setStatus] = useState('draft')
    const [slug, setSlug] = useState<string>('')
    const [typePath, setTypePath] = useState<string>(contentType.apiIdentifier)
    const [isSaving, setIsSaving] = useState(false)
    const [mounted, setMounted] = useState(false)

    const router = useRouter()

    useEffect(() => setMounted(true), [])

    // Generate unique IDs for form elements
    const statusId = useId()
    const pathPrefixId = useId()
    const slugId = useId()

    // Function to generate unique field IDs
    const getFieldId = (fieldId: string) => `field-${fieldId}`

    // Detect highlighted fields: title and main image
    const titleField = contentType.fields.find(
        (f) =>
            (f.type === 'TEXT' || f.type === 'RICH_TEXT') &&
            (/(title|titulo|headline|heading)/i.test(f.apiIdentifier) ||
                /(title|t[íi]tulo|titulo|headline|heading)/i.test(f.label)),
    )
    const imageField = contentType.fields.find(
        (f) =>
            f.type === 'MEDIA' &&
            (/(mainimage|image|imagen|cover|thumbnail|featured)/i.test(f.apiIdentifier) ||
                /(imagen|image|cover|thumbnail|principal|destacada)/i.test(f.label)),
    )

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }))
    }

    const validateForm = () => {
        const requiredFields = contentType.fields.filter((field) => field.isRequired)
        return requiredFields.every((field) => {
            const value = formData[field.apiIdentifier]
            return value !== undefined && value !== null && value !== ''
        })
    }

    const isFormValid = validateForm()

    const handleSave = async (saveStatus: string = status) => {
        setIsSaving(true)

        try {
            const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: { ...formData, slug, typePath },
                    status: saveStatus,
                }),
            })

            if (response.ok) {
                const _result = await response.json()
                // Optional: showing success message or redirect logic could go here
            } else {
                throw new Error('Error saving entry')
            }
        } catch (error) {
            console.error('Error saving entry:', error)
            alert('Error saving entry')
        } finally {
            setIsSaving(false)
        }
    }

    const handlePublishAndView = async () => {
        if (!slug) return
        setIsSaving(true)
        try {
            const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: { ...formData, slug, typePath }, status: 'published' }),
            })
            if (response.ok) {
                const target = `/${typePath || contentType.apiIdentifier}/${slug}`
                router.push(target)
            } else {
                throw new Error('Error publishing entry')
            }
        } catch (error) {
            console.error('Error publishing entry:', error)
            alert('Error publishing entry')
        } finally {
            setIsSaving(false)
        }
    }

    const handleSlugChange = (value: string) => {
        setSlug(slugify(value, { lower: true, strict: true }))
    }

    const handleTypePathChange = (value: string) => {
        setTypePath(slugify(value, { lower: true, strict: true }))
    }

    const generateSlugFromTitle = () => {
        if (titleField) {
            const titleValue = formData[titleField.apiIdentifier]
            if (typeof titleValue === 'string') {
                setSlug(slugify(titleValue, { lower: true, strict: true }))
            }
        }
    }

    return {
        state: {
            formData,
            status,
            slug,
            typePath,
            isSaving,
            mounted,
            isFormValid,
        },
        ids: {
            statusId,
            pathPrefixId,
            slugId,
            getFieldId,
        },
        fields: {
            titleField,
            imageField,
        },
        actions: {
            setStatus,
            handleFieldChange,
            handleSave,
            handlePublishAndView,
            handleSlugChange,
            handleTypePathChange,
            generateSlugFromTitle,
        }
    }
}
