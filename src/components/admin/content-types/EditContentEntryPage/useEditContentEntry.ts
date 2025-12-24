'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import type { ContentEntry } from './data'

export function useEditContentEntry(entry: ContentEntry) {
    const [formData, setFormData] = useState<Record<string, any>>(entry.data || {})
    const [status, setStatus] = useState(entry.status)
    const [legacySlug, setLegacySlug] = useState<string>(() => String((entry as any).slug || ''))
    const [typePath, setTypePath] = useState<string>(() =>
        String(entry.data?.typePath || entry.contentType.apiIdentifier),
    )
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // AI Modal State
    const [aiModal, setAiModal] = useState<{
        isOpen: boolean
        fieldId: string
        fieldLabel: string
        initialPrompt: string
    }>({
        isOpen: false,
        fieldId: '',
        fieldLabel: '',
        initialPrompt: '',
    })

    const router = useRouter()

    const statusId = useId()
    const getFieldId = (fieldId: string) => `field-${fieldId}`

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
    const slugField = entry.contentType.fields.find((f) => f.type === 'SLUG')

    // SEO/Specialized Fields Detection
    const metaTitleField = entry.contentType.fields.find(
        (f) => f.type === 'TEXT' && /(metaTitle|meta_title|seoTitle|seo_title)/i.test(f.apiIdentifier),
    )
    const metaDescriptionField = entry.contentType.fields.find(
        (f) => (f.type === 'TEXT' || f.type === 'RICH_TEXT') && /(metaDescription|meta_description|seoDescription|seo_desc)/i.test(f.apiIdentifier),
    )
    const imageAltField = entry.contentType.fields.find(
        (f) => f.type === 'TEXT' && /(altText|imageAlt|alt_text|alt)/i.test(f.apiIdentifier),
    )
    const tagsField = entry.contentType.fields.find(
        (f) => (f.type === 'TEXT' || f.type === 'RICH_TEXT') && /(tags|etiquetas|tag)/i.test(f.apiIdentifier),
    )

    const getPayload = () => {
        const payload: Record<string, any> = { ...formData, typePath }

        if (slugField) {
            payload.slug = formData[slugField.apiIdentifier]
        } else {
            payload.slug = legacySlug
        }

        if (titleField) {
            payload.title = formData[titleField.apiIdentifier]
        }

        return payload
    }

    const handleFieldChange = (fieldId: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [fieldId]: value,
        }))
    }

    // Helper for AI generation
    const callAI = async (prompt: string, fallback: () => void) => {
        try {
            const response = await fetch('/api/admin/ai/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            })
            const data = await response.json()
            if (data.success && data.text) {
                return data.text
            }
        } catch (e) {
            console.error('AI Call failed, using fallback', e)
        }
        fallback()
        return null
    }

    // Generation actions
    const generateMetaTitle = async () => {
        if (titleField && metaTitleField) {
            const val = formData[titleField.apiIdentifier]
            if (!val) return
            const aiVal = await callAI(
                `Generate a short, catchy SEO Meta Title for this post: "${val}". Return ONLY the title, no quotes.`,
                () => handleFieldChange(metaTitleField.apiIdentifier, val)
            )
            if (aiVal) handleFieldChange(metaTitleField.apiIdentifier, aiVal)
        }
    }

    const generateMetaDescription = async () => {
        if (titleField && metaDescriptionField) {
            const val = formData[titleField.apiIdentifier]
            if (!val) return
            const aiVal = await callAI(
                `Write a compelling SEO Meta Description (max 155 characters) for a post titled: "${val}". Return ONLY the description.`,
                () => {
                    const desc = `Learn more about ${val}. Comprehensive guide and details inside.`
                    handleFieldChange(metaDescriptionField.apiIdentifier, desc)
                }
            )
            if (aiVal) handleFieldChange(metaDescriptionField.apiIdentifier, aiVal)
        }
    }

    const generateImageAlt = async () => {
        if (titleField && imageAltField) {
            const val = formData[titleField.apiIdentifier]
            if (!val) return
            const aiVal = await callAI(
                `Write a short, descriptive Alt Text for an image representing: "${val}". Return ONLY the text.`,
                () => handleFieldChange(imageAltField.apiIdentifier, `Image of ${val}`)
            )
            if (aiVal) handleFieldChange(imageAltField.apiIdentifier, aiVal)
        }
    }

    const generateTags = async () => {
        if (titleField && tagsField) {
            const val = formData[titleField.apiIdentifier]
            if (!val) return
            const aiVal = await callAI(
                `Extract 5 relevant keyword tags for this post title: "${val}". Return ONLY a comma-separated list of tags. No numbering.`,
                () => {
                    const tags = (val as string).split(' ').filter((w: string) => w.length > 3).map((w: string) => w.toLowerCase()).slice(0, 5).join(', ')
                    handleFieldChange(tagsField.apiIdentifier, tags)
                }
            )
            if (aiVal) handleFieldChange(tagsField.apiIdentifier, aiVal)
        }
    }

    const handleSave = async (saveStatus: string = status) => {
        setIsSaving(true)
        try {
            const response = await fetch(
                `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        data: getPayload(),
                        status: saveStatus,
                    }),
                },
            )

            if (!response.ok) {
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
                { method: 'DELETE' },
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
    const currentSlug = slugField ? formData[slugField.apiIdentifier] : legacySlug

    const handlePublishAndView = async () => {
        if (!currentSlug) return
        setIsSaving(true)
        try {
            const response = await fetch(
                `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: { ...getPayload() }, status: 'published' }),
                },
            )
            if (response.ok) {
                const target = `/${typePath || entry.contentType.apiIdentifier}/${currentSlug}`
                window.open(target, '_blank')
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

    const generateSlugFromTitle = () => {
        if (titleField) {
            const titleValue = formData[titleField.apiIdentifier]
            if (typeof titleValue === 'string') {
                const newSlug = slugify(titleValue, { lower: true, strict: true })
                if (slugField) {
                    handleFieldChange(slugField.apiIdentifier, newSlug)
                } else {
                    setLegacySlug(newSlug)
                }
            }
        }
    }

    const openAIModal = (fieldId: string, label: string) => {
        setAiModal({
            isOpen: true,
            fieldId,
            fieldLabel: label,
            initialPrompt: '',
        })
    }

    const closeAIModal = () => {
        setAiModal((prev) => ({ ...prev, isOpen: false }))
    }

    const handleAIApply = (text: string) => {
        if (aiModal.fieldId) {
            handleFieldChange(aiModal.fieldId, text)
        }
    }

    return {
        state: {
            formData,
            status,
            slug: currentSlug,
            typePath,
            isSaving,
            isDeleting,
            isFormValid,
            aiModal,
        },
        ids: {
            statusId,
            getFieldId,
        },
        fields: {
            titleField,
            imageField,
            slugField,
            metaTitleField,
            metaDescriptionField,
            imageAltField,
            tagsField,
        },
        actions: {
            setStatus,
            handleFieldChange,
            handleSave,
            handleDelete,
            handlePublishAndView,
            generateSlugFromTitle,
            generateMetaTitle,
            generateMetaDescription,
            generateImageAlt,
            generateTags,
            openAIModal,
            closeAIModal,
            handleAIApply,
        },
    }
}
