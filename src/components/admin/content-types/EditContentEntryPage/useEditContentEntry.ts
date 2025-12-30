'use client'

import { useForm } from 'react-hook-form'
import { useState, useId } from 'react'
import { useRouter } from 'next/navigation'
import slugify from 'slugify'
import { useToast } from "@/hooks/use-toast"
import type { ContentEntry } from './data'

export function useEditContentEntry(entry: ContentEntry) {
    const { toast } = useToast()

    // Field Definitions - Moved up to use for defaultValues
    const titleField = entry.contentType.fields.find((f) => f.apiIdentifier === 'title' || f.apiIdentifier === 'name' || f.apiIdentifier === 'headline' || f.apiIdentifier === 'titulo' || f.apiIdentifier === 'nombre')
    const imageField = entry.contentType.fields.find((f) => f.type === 'MEDIA' && (f.apiIdentifier === 'mainImage' || f.apiIdentifier === 'image' || f.apiIdentifier === 'cover' || f.apiIdentifier === 'featuredImage' || f.apiIdentifier === 'imagen'))
    const slugField = entry.contentType.fields.find((f) => f.type === 'SLUG')

    // SEO Fields
    const metaTitleField = entry.contentType.fields.find((f) => f.apiIdentifier === 'metaTitle' || f.apiIdentifier === 'seoTitle' || f.apiIdentifier === 'meta_title')
    const metaDescriptionField = entry.contentType.fields.find((f) => f.apiIdentifier === 'metaDescription' || f.apiIdentifier === 'seoDescription' || f.apiIdentifier === 'meta_description')
    const imageAltField = entry.contentType.fields.find((f) => f.apiIdentifier === 'imageAlt' || f.apiIdentifier === 'altText' || f.apiIdentifier === 'alt_text')
    const tagsField = entry.contentType.fields.find((f) => f.apiIdentifier === 'tags' || f.apiIdentifier === 'keywords')

    const form = useForm({
        defaultValues: {
            ...(entry.data || {}),
            // Map specialized columns back to form fields
            ...(titleField ? { [titleField.apiIdentifier]: entry.title } : {}),
            ...(slugField ? { [slugField.apiIdentifier]: entry.slug } : {}),
            ...(metaTitleField && entry.seoOptions ? { [metaTitleField.apiIdentifier]: (entry.seoOptions as any).metaTitle } : {}),
            ...(metaDescriptionField && entry.seoOptions ? { [metaDescriptionField.apiIdentifier]: (entry.seoOptions as any).metaDescription } : {}),
            ...(imageAltField && entry.seoOptions ? { [imageAltField.apiIdentifier]: (entry.seoOptions as any).imageAlt } : {}),
            ...(tagsField ? { [tagsField.apiIdentifier]: (Array.isArray(entry.tags) ? entry.tags.join(', ') : entry.tags) } : {}),
            // If category matches a field, map it back
            ...((() => {
                const catField = entry.contentType.fields.find(f => f.apiIdentifier === 'category' || f.apiIdentifier === 'categoria')
                return catField ? { [catField.apiIdentifier]: entry.category } : {}
            })())
        },
        mode: 'onChange'
    })
    const { watch, setValue, getValues } = form

    // Watch all fields to keep compatibility with existing code relying on formData
    const formData = watch()

    // NEW: Manual validation check for required fields
    const isFormValid = (() => {
        // Find all required fields in the content type
        const requiredFields = entry.contentType.fields.filter(f => f.isRequired)

        return requiredFields.every(field => {
            const val = formData[field.apiIdentifier]

            // Check based on field type if needed, but generally non-empty string/object
            if (val === undefined || val === null || val === '') return false

            // Special check for MEDIA (must have a URL)
            if (field.type === 'MEDIA') {
                return !!(val as any)?.url
            }

            return true
        })
    })()

    const [status, setStatus] = useState(entry.status)
    const [legacySlug, setLegacySlug] = useState<string>(() => String((entry as any).slug || ''))
    const [typePath, setTypePath] = useState<string>(() =>
        String(entry.data?.typePath || entry.contentType.apiIdentifier),
    )
    const [isSaving, setIsSaving] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const [aiModal, setAiModal] = useState({
        isOpen: false,
        fieldId: '',
        fieldLabel: '',
        initialPrompt: '',
    })

    const router = useRouter()
    const statusId = useId()
    const getFieldId = (fieldId: string) => `field-${fieldId}`

    // Rest of helper functions...

    const getPayload = () => {
        // Use the current watched values (formData) to construct the payload
        const payload: any = { ...formData }

        // Ensure slug is present
        if (slugField) {
            if (!payload[slugField.apiIdentifier]) {
                payload[slugField.apiIdentifier] = entry.slug || legacySlug
            }
            payload.slug = payload[slugField.apiIdentifier]
        } else {
            payload.slug = legacySlug
        }

        // Normalize Title
        if (titleField) {
            payload.title = formData[titleField.apiIdentifier]
        }

        // Normalize SEO Options
        const seo: any = {}
        if (metaTitleField) seo.metaTitle = formData[metaTitleField.apiIdentifier]
        if (metaDescriptionField) seo.metaDescription = formData[metaDescriptionField.apiIdentifier]
        if (imageAltField) seo.imageAlt = formData[imageAltField.apiIdentifier]
        if (Object.keys(seo).length > 0) {
            payload.seoOptions = seo
        }

        // Normalize Tags
        if (tagsField) {
            const tagVal = formData[tagsField.apiIdentifier]
            payload.tags = typeof tagVal === 'string'
                ? tagVal.split(',').map((t: string) => t.trim()).filter((t: string) => t.length > 0)
                : tagVal
        }

        // Normalize Category
        const catField = entry.contentType.fields.find(f => f.apiIdentifier === 'category' || f.apiIdentifier === 'categoria')
        if (catField) {
            payload.category = formData[catField.apiIdentifier]
        }

        return payload
    }

    const handleFieldChange = (fieldId: string, value: any) => {
        setValue(fieldId, value, {
            shouldDirty: true,
            shouldValidate: true,
            shouldTouch: true
        })
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
            toast.success({
                title: "Entry updated",
                description: "Changes have been saved successfully.",
            })
        } catch (error) {
            console.error('Error updating entry:', error)
            toast.error({
                title: "Error",
                description: "Failed to update entry. Please try again.",
            })
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

    // const isFormValid = validateForm() // replaced by formState.isValid
    const currentSlug = slugField ? formData[slugField.apiIdentifier] : legacySlug

    const handlePublishAndView = async () => {
        const payload = getPayload()
        if (!payload.slug) return

        setIsSaving(true)
        try {
            const response = await fetch(
                `/api/content-types/${entry.contentType.apiIdentifier}/entries/${entry.id}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: payload, status: 'published' }),
                },
            )

            if (response.ok) {
                const updatedEntry = await response.json()
                const finalSlug = updatedEntry.slug

                // Sync local state
                if (slugField) {
                    handleFieldChange(slugField.apiIdentifier, finalSlug)
                } else {
                    setLegacySlug(finalSlug)
                }

                // Determine the correct route segment
                const slugRoute = (slugField?.metadata as any)?.slugRoute
                let routeSegment = slugRoute || typePath || entry.contentType.apiIdentifier

                // Interpolate dynamic segments
                if (routeSegment && routeSegment.includes('[')) {
                    routeSegment = routeSegment.split('/').map((segment: string) => {
                        if (segment.startsWith('[') && segment.endsWith(']')) {
                            const paramKey = segment.slice(1, -1)
                            // Skip slug/currentField as they are handled at the end
                            if (paramKey === 'slug' || paramKey === '...slug' || paramKey === slugField?.apiIdentifier) {
                                return ''
                            }
                            const value = formData[paramKey] || entry.data?.[paramKey] || 'undefined'
                            return slugify(String(value), { lower: true, strict: true })
                        }
                        return segment
                    }).filter(Boolean).join('/')
                }

                // Construct target URL
                // If routeSegment already includes the slug placeholder, it will have been cleared or needs replacement
                // Let's be smart: if routeSegment is "Regiones/x/y/z", it becomes "/Regiones/x/y/z/slug"
                const target = `/${routeSegment}/${finalSlug}`.replace(/\/+/g, '/')

                toast.success({
                    title: "Entry published",
                    description: `Opening live view: ${target}`,
                })

                window.open(target, '_blank')
            } else {
                throw new Error('Error publishing entry')
            }
        } catch (error) {
            console.error('Error publishing entry:', error)
            toast.error({
                title: "Error",
                description: "Failed to publish entry.",
            })
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
            form,
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
