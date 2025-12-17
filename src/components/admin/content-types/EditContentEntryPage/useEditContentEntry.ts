'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import type { ContentEntry } from './data'

export function useEditContentEntry(entry: ContentEntry) {
    const [formData, setFormData] = useState<Record<string, any>>(entry.data || {})
    const [status, setStatus] = useState(entry.status)
    const [slug, setSlug] = useState<string>(() => String(entry.data?.slug || ''))
    const [typePath, setTypePath] = useState<string>(() =>
        String(entry.data?.typePath || entry.contentType.apiIdentifier),
    )
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    // Generate unique IDs for form elements
    const statusId = useId()
    const pathPrefixId = useId()
    const slugId = useId()

    const getFieldId = (fieldId: string) => `field-${fieldId}`

    // Translate common Spanish labels to English for display only
    const normalizeLabel = (label: string): string => {
        const l = (label || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
        const rules: { re: RegExp; out: string }[] = [
            { re: /(titulo del post|titulo de la entrada|post title)/, out: 'Post title' },
            { re: /(titulo|headline|heading)/, out: 'Title' },
            { re: /(imagen principal|main image|cover image)/, out: 'Main image' },
            { re: /(imagen destacada|featured image|thumbnail)/, out: 'Featured image' },
            { re: /(imagen|image|foto|photo)/, out: 'Image' },
            { re: /(descripcion|description)/, out: 'Description' },
            { re: /(contenido|content)/, out: 'Content' },
            { re: /(fecha|date)/, out: 'Date' },
            { re: /(autor|author)/, out: 'Author' },
            { re: /(categoria|categor[ií]a|category)/, out: 'Category' },
            { re: /(etiquetas|tags|tag)/, out: 'Tags' },
        ]
        for (const r of rules) if (r.re.test(l)) return r.out
        return label
    }

    // Highlighted fields
    const titleField = entry.contentType.fields.find(
        (f) =>
            (f.type === 'TEXT' || f.type === 'RICH_TEXT') &&
            (/(title|titulo|headline|heading)/i.test(f.apiIdentifier) ||
                /(title|t[íi]tulo|titulo|headline|heading)/i.test(f.label)),
    )
    const imageField = entry.contentType.fields.find(
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

    const handleSave = async (saveStatus: string = status) => {
        setIsSaving(true)

        try {
            const response = await fetch(
                `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: { ...formData, slug, typePath },
                        status: saveStatus,
                    }),
                },
            )

            if (response.ok) {
                // Success logic if needed
            } else {
                throw new Error('Error updating entry')
            }
        } catch (error) {
            console.error('Error updating entry:', error)
            alert('Error updating entry')
        } finally {
            setIsSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)

        try {
            const response = await fetch(
                `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
                {
                    method: 'DELETE',
                },
            )

            if (response.ok) {
                router.push(`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`)
            } else {
                throw new Error('Error deleting entry')
            }
        } catch (error) {
            console.error('Error deleting entry:', error)
            alert('Error deleting entry')
        } finally {
            setIsDeleting(false)
        }
    }

    const validateForm = () => {
        const requiredFields = entry.contentType.fields.filter((field) => field.isRequired)
        return requiredFields.every((field) => {
            const value = formData[field.apiIdentifier]
            return value !== undefined && value !== null && value !== ''
        })
    }

    const isFormValid = validateForm()

    const handlePublishAndView = async () => {
        if (!slug) return
        setIsSaving(true)
        try {
            const response = await fetch(
                `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: { ...formData, slug, typePath }, status: 'published' }),
                },
            )
            if (response.ok) {
                const target = `/${typePath || entry.contentType.apiIdentifier}/${slug}`
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
            isDeleting,
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
        helpers: {
            normalizeLabel,
        },
        actions: {
            setStatus,
            handleFieldChange,
            handleSave,
            handleDelete,
            handlePublishAndView,
            handleSlugChange,
            handleTypePathChange,
            generateSlugFromTitle,
        },
    }
}
