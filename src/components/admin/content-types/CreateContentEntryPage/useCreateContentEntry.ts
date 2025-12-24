'use client'

import { useId, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import type { ContentType } from './data'

export function useCreateContentEntry(contentType: ContentType) {
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [status, setStatus] = useState('draft')

    // Legacy slug state (only used if no explicit SLUG field exists)
    const [legacySlug, setLegacySlug] = useState<string>('')
    const [typePath, setTypePath] = useState<string>(contentType.apiIdentifier)
    const [isSaving, setIsSaving] = useState(false)
    const [isCreatingDraft, setIsCreatingDraft] = useState(false)
    const [mounted, setMounted] = useState(false)

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

    useEffect(() => setMounted(true), [])

    // Generate unique IDs for form elements
    const statusId = useId()
    const pathPrefixId = useId()
    const slugId = useId()

    // Function to generate unique field IDs
    const getFieldId = (fieldId: string) => `field-${fieldId}`

    // Detect specialized fields
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

    const slugField = contentType.fields.find((f) => f.type === 'SLUG')

    // SEO/Specialized Fields Detection
    const metaTitleField = contentType.fields.find(
        (f) => f.type === 'TEXT' && /(metaTitle|meta_title|seoTitle|seo_title)/i.test(f.apiIdentifier),
    )
    const metaDescriptionField = contentType.fields.find(
        (f) => (f.type === 'TEXT' || f.type === 'RICH_TEXT') && /(metaDescription|meta_description|seoDescription|seo_desc)/i.test(f.apiIdentifier),
    )
    const imageAltField = contentType.fields.find(
        (f) => f.type === 'TEXT' && /(altText|imageAlt|alt_text|alt)/i.test(f.apiIdentifier),
    )
    const tagsField = contentType.fields.find(
        (f) => (f.type === 'TEXT' || f.type === 'RICH_TEXT') && /(tags|etiquetas|tag)/i.test(f.apiIdentifier),
    )

    // Helper to get current slug value (either from formData or legacy state)
    const currentSlug = slugField
        ? formData[slugField.apiIdentifier]
        : legacySlug

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

    const validateForm = () => {
        const requiredFields = contentType.fields.filter((field) => field.isRequired)
        return requiredFields.every((field) => {
            const value = formData[field.apiIdentifier]
            return value !== undefined && value !== null && value !== ''
        })
    }

    const isFormValid = validateForm()

    // Reactive auto-slug: Update slug when title changes if it's safe to do so
    useEffect(() => {
        if (!titleField || !mounted) return

        const titleValue = formData[titleField.apiIdentifier]
        if (typeof titleValue === 'string' && titleValue) {
            // Only auto-update if we are in a "pristine" state or if slug is empty
            // For simplicity in this fix, we'll generate if slug is empty or we are just starting
            const newSlug = slugify(titleValue, { lower: true, strict: true })

            // Check current slug value
            const currentSlugVal = slugField ? formData[slugField.apiIdentifier] : legacySlug

            // If current slug is empty, fill it
            if (!currentSlugVal) {
                if (slugField) {
                    handleFieldChange(slugField.apiIdentifier, newSlug)
                } else {
                    setLegacySlug(newSlug)
                }
            }
        }
    }, [formData, titleField, slugField, mounted, legacySlug])

    const getPayload = () => {
        // If we have an explicit slug field, it's already in formData.
        // If not, we append legacySlug as 'slug'.
        const payload: Record<string, any> = { ...formData, typePath }

        // Ensure 'slug' prop is present for API validation
        if (slugField) {
            payload.slug = formData[slugField.apiIdentifier]
        } else {
            payload.slug = legacySlug
        }

        // Ensure 'title' prop is present for API validation
        if (titleField) {
            payload.title = formData[titleField.apiIdentifier]
        }

        return payload
    }

    const handleSave = async (saveStatus: string = status) => {
        setIsSaving(true)

        try {
            const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: getPayload(),
                    status: saveStatus,
                }),
            })
            // ... rest of handleSave


            if (response.ok) {
                const _result = await response.json()
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
        if (!currentSlug) return
        setIsSaving(true)
        try {
            const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: getPayload(), status: 'published' }),
            })
            if (response.ok) {
                const target = `/${typePath || contentType.apiIdentifier}/${currentSlug}`
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
        const newSlug = slugify(value, { lower: true, strict: true })
        if (slugField) {
            handleFieldChange(slugField.apiIdentifier, newSlug)
        } else {
            setLegacySlug(newSlug)
        }
    }

    const handleTypePathChange = (value: string) => {
        setTypePath(slugify(value, { lower: true, strict: true }))
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

    // Auto-create draft when title is typed
    useEffect(() => {
        const titleValue = titleField ? formData[titleField.apiIdentifier] : null

        // Only trigger if we have a title, it's long enough, and we haven't started saving/creating yet
        if (titleValue && typeof titleValue === 'string' && titleValue.length > 3 && !isCreatingDraft && !isSaving) {

            const timer = setTimeout(async () => {
                // Prepare payload
                const payload = getPayload()

                // Validate critical fields before auto-saving
                if (!payload.slug) {
                    // Try to generate slug on the fly if missing
                    payload.slug = slugify(titleValue, { lower: true, strict: true })
                }
                if (!payload.title) {
                    payload.title = titleValue
                }

                setIsCreatingDraft(true)
                try {
                    const response = await fetch(`/api/content-types/${contentType.apiIdentifier}/entries`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            data: payload,
                            status: 'draft',
                        }),
                    })

                    if (response.ok) {
                        const result = await response.json()
                        router.push(`/admin/dashboard/content-types/${contentType.apiIdentifier}/content/${result.id}`)
                    } else {
                        // Silent fail or minimal error log for auto-draft
                        console.warn('Auto-draft failed with status:', response.status)
                        setIsCreatingDraft(false)
                    }
                } catch (error) {
                    console.error('Auto-draft failed', error)
                    setIsCreatingDraft(false)
                }
            }, 2000) // 2 second delay to debounce typing
            return () => clearTimeout(timer)
        }
    }, [formData, titleField, isCreatingDraft, isSaving, contentType.apiIdentifier, legacySlug, typePath, router])

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
            isCreatingDraft,
            mounted,
            isFormValid,
            aiModal,
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
            handlePublishAndView,
            handleSlugChange,
            handleTypePathChange,
            generateSlugFromTitle,
            generateMetaTitle,
            generateMetaDescription,
            generateImageAlt,
            generateTags,
            openAIModal,
            closeAIModal,
            handleAIApply,
        }
    }
}
