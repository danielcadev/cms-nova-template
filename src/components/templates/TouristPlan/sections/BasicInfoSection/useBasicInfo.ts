import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import slugify from 'slugify'
import type { ComboboxOption } from '@/components/ui/combobox'
import type { PlanFormValues } from '@/schemas/plan'

export function useBasicInfo() {
  const form = useFormContext<PlanFormValues>()
  const { control, setValue, watch } = form

  const [categoryOptions, setCategoryOptions] = useState<ComboboxOption[]>([])
  const [planSlugOptions, setPlanSlugOptions] = useState<ComboboxOption[]>([])
  const [categoryFeedback, setCategoryFeedback] = useState<string>('')
  const [slugFeedback, setSlugFeedback] = useState<string>('')

  // Local persistence keys
  const CATEGORY_KEY = 'nova.categoryOptions'
  const SLUG_KEY = 'nova.planSlugOptions'

  const [mainTitle, articleAlias, section, categoryAlias] = watch([
    'mainTitle',
    'articleAlias',
    'section',
    'categoryAlias',
  ])

  const generateSmartSlug = useCallback((text: string, count: number = 7): string[] => {
    if (!text) return []
    const [title] = text.split(/[|]/).map((part) => part.trim())
    const stopWords = new Set([
      'plan',
      'tour',
      'viaje',
      'paquete',
      'en',
      'de',
      'del',
      'la',
      'los',
      'y',
      'a',
      'o',
    ])
    const titleParts = title
      .replace(/^circuito\s+/i, '')
      .split(/,|\sy\s/i)
      .map((p) => p.trim())
      .filter(Boolean)
    const dests = titleParts
      .map(
        (p) =>
          (p.match(/\b[A-ZÀ-Ú][a-zà-ú']+\b/g) || [])
            .map((d) => d.toLowerCase())
            .filter((d) => !stopWords.has(d))[0],
      )
      .filter(Boolean)
      .slice(0, 3) as string[]
    const durationMatch = text.match(/(\d+)\s*d[ií]as?/i)
    const duration = durationMatch ? `${durationMatch[1]}dias` : ''
    const suggestions = new Set<string>()
    if (dests.length > 0) {
      const base = dests.join('-')
      suggestions.add(base)
      if (duration) suggestions.add(`${base}-${duration}`)
    }
    return Array.from(suggestions)
      .map((s) => slugify(s, { lower: true, strict: true }))
      .filter(Boolean)
      .slice(0, count)
  }, [])

  // Memoize slug options to prevent unnecessary recalculations
  const suggestedSlugOptions = useMemo(() => {
    const suggestions = mainTitle ? generateSmartSlug(mainTitle, 7) : []
    const options = suggestions.map((s) => ({ label: s, value: s }))

    // If there's a current articleAlias and it's not in suggestions, add it at the beginning
    if (articleAlias && !suggestions.includes(articleAlias)) {
      options.unshift({ label: articleAlias, value: articleAlias })
    }

    return options
  }, [mainTitle, articleAlias, generateSmartSlug])

  // Update plan slug options when suggestions change
  useEffect(() => {
    setPlanSlugOptions(suggestedSlugOptions)
  }, [suggestedSlugOptions])

  // Load initial options from localStorage only once on mount
  useEffect(() => {
    try {
      const storedCats = JSON.parse(localStorage.getItem(CATEGORY_KEY) || '[]')
      // Don't set planSlugOptions here as it will be handled by suggestedSlugOptions
      setCategoryOptions(Array.isArray(storedCats) ? storedCats : [])
    } catch {}
  }, [])

  // Ensure current form values are included in options when they change
  useEffect(() => {
    if (categoryAlias) {
      setCategoryOptions((prev) => {
        const exists = prev.some((o) => o.value === categoryAlias)
        if (!exists) {
          return [{ label: categoryAlias, value: categoryAlias }, ...prev]
        }
        return prev
      })
    }
  }, [categoryAlias])

  useEffect(() => {
    // Save changes locally
    try {
      localStorage.setItem(CATEGORY_KEY, JSON.stringify(categoryOptions))
    } catch {}
  }, [categoryOptions])

  useEffect(() => {
    try {
      localStorage.setItem(SLUG_KEY, JSON.stringify(planSlugOptions))
    } catch {}
  }, [planSlugOptions])

  const handleCreateCategory = useCallback(
    async (inputValue: string) => {
      const newValue = slugify(inputValue, { lower: true, strict: true })
      if (!categoryOptions.some((o: ComboboxOption) => o.value === newValue)) {
        const newOption = { label: inputValue, value: newValue }
        setCategoryOptions((prev: ComboboxOption[]) => [newOption, ...prev])
        setValue('categoryAlias', newValue)
        setCategoryFeedback(`Destination "${inputValue}" saved.`)
      }
    },
    [categoryOptions, setValue],
  )

  const handleCreatePlanSlug = useCallback(
    (inputValue: string) => {
      const newValue = slugify(inputValue, { lower: true, strict: true })
      if (!planSlugOptions.some((o: ComboboxOption) => o.value === newValue)) {
        const newOption = { label: inputValue, value: newValue }
        setPlanSlugOptions((prev: ComboboxOption[]) => [newOption, ...prev])
        setValue('articleAlias', newValue)
        setSlugFeedback(`Slug "${inputValue}" saved.`)
      }
    },
    [planSlugOptions, setValue],
  )

  useEffect(() => {
    if (!categoryAlias) {
      setCategoryFeedback('')
    }
  }, [categoryAlias])

  useEffect(() => {
    if (!articleAlias) {
      setSlugFeedback('')
    }
  }, [articleAlias])

  const handleDeleteCategoryOption = useCallback((val: string) => {
    setCategoryOptions((prev) => prev.filter((o) => o.value !== val))
    // Note: We don't clear the field value here to allow deleting options without clearing the form
    // But if the user wants to clear the field, they can do it manually or we can add logic
    // The original code did: if (field.value === val) setValue('categoryAlias', '')
    // We'll return a handler that the component can use
  }, [])

  const handleDeleteSlugOption = useCallback((val: string) => {
    setPlanSlugOptions((prev) => prev.filter((o) => o.value !== val))
  }, [])

  return {
    form,
    control,
    setValue,
    categoryOptions,
    planSlugOptions,
    categoryFeedback,
    slugFeedback,
    setCategoryOptions,
    setPlanSlugOptions,
    handleCreateCategory,
    handleCreatePlanSlug,
    handleDeleteCategoryOption,
    handleDeleteSlugOption,
    section,
    categoryAlias,
    articleAlias,
    CATEGORY_KEY,
    SLUG_KEY,
  }
}
