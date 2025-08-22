'use client'

import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import slugify from 'slugify'
import { type ComboboxOption, Combobox as OriginalCombobox } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import type { PlanFormValues } from '@/schemas/plan'
import { MainImage } from '../components/MainImage'

// =====================================================================================
// SECCIÓN UNIFICADA, SIN PASOS
// =====================================================================================

const URLPreview = memo(
  ({
    section,
    categoryAlias,
    articleAlias,
  }: {
    section: string
    categoryAlias: string
    articleAlias: string
  }) => (
    <div className="text-sm font-mono theme-text break-all theme-bg-secondary p-4 rounded-lg theme-border">
      <span className="theme-text-secondary">tudominio.com</span>
      <span className="theme-text-secondary font-medium">/</span>
      <span className="theme-text">{section || 'planes'}</span>
      <span className="theme-text-secondary font-medium">/</span>
      <span className="theme-text">{categoryAlias || 'destino'}</span>
      <span className="theme-text-secondary font-medium">/</span>
      <span className="theme-accent font-medium">{articleAlias || 'mi-plan'}</span>
    </div>
  ),
)
URLPreview.displayName = 'URLPreview'

export function BasicInfoSection() {
  const { control, setValue, watch } = useFormContext<PlanFormValues>()
  const { toast } = useToast()

  const [destinations, setDestinations] = useState<ComboboxOption[]>([])
  const [isLoadingDest, setIsLoadingDest] = useState(true)
  const [categoryOptions, setCategoryOptions] = useState<ComboboxOption[]>([])
  const [planSlugOptions, setPlanSlugOptions] = useState<ComboboxOption[]>([])

  const mainTitle = watch('mainTitle')
  const destinationId = watch('destinationId')
  const articleAlias = watch('articleAlias')
  const section = watch('section')

  const destinationSlug = useMemo(() => {
    const selected = destinations.find((d) => d.value === destinationId)
    return selected ? slugify(selected.label, { lower: true, strict: true }) : ''
  }, [destinations, destinationId])

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

  useEffect(() => {
    const currentArticleAlias = watch('articleAlias')
    const suggestions = mainTitle ? generateSmartSlug(mainTitle, 7) : []
    
    // Crear opciones incluyendo el valor actual si existe
    const options = suggestions.map((s) => ({ label: s, value: s }))
    
    // Si hay un articleAlias actual y no está en las sugerencias, agregarlo al inicio
    if (currentArticleAlias && !suggestions.includes(currentArticleAlias)) {
      options.unshift({ label: currentArticleAlias, value: currentArticleAlias })
    }
    
    setPlanSlugOptions(options)
    
    // Solo establecer un valor por defecto si no hay articleAlias actual
    if (suggestions.length > 0 && !currentArticleAlias) {
      setValue('articleAlias', suggestions[0])
    }
  }, [mainTitle, setValue, watch, generateSmartSlug, articleAlias])

  useEffect(() => {
    const fetchDests = async () => {
      try {
        const res = await fetch('/api/destinations')
        const data = await res.json()
        setDestinations(data.map((d: any) => ({ label: d.name, value: d.id })))
      } catch (_e) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los destinos.',
        })
      } finally {
        setIsLoadingDest(false)
      }
    }
    fetchDests()
  }, [toast])

  // Cargar categorías existentes desde la base de datos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories')
        const data = await res.json()
        setCategoryOptions(data)
      } catch (e) {
        console.error('Error loading categories:', e)
        // No mostrar toast para categorías ya que no es crítico
      }
    }
    fetchCategories()
  }, [])

  const handleCreateCategory = useCallback(
    (inputValue: string) => {
      const newValue = slugify(inputValue, { lower: true, strict: true })
      if (!categoryOptions.some((o: ComboboxOption) => o.value === newValue)) {
        const newOption = { label: inputValue, value: newValue }
        setCategoryOptions((prev: ComboboxOption[]) => [newOption, ...prev])
        setValue('categoryAlias', newValue)
        toast({ title: 'Option Added', description: `"${inputValue}" will be used.` })
      }
    },
    [categoryOptions, setValue, toast],
  )

  const handleCreatePlanSlug = useCallback(
    (inputValue: string) => {
      const newValue = slugify(inputValue, { lower: true, strict: true })
      if (!planSlugOptions.some((o: ComboboxOption) => o.value === newValue)) {
        const newOption = { label: inputValue, value: newValue }
        setPlanSlugOptions((prev: ComboboxOption[]) => [newOption, ...prev])
        setValue('articleAlias', newValue)
        toast({ title: 'Option Added', description: `"${inputValue}" will be used.` })
      }
    },
    [planSlugOptions, setValue, toast],
  )

  // Función especial para crear destinos (requiere API call)
  const handleCreateDestination = useCallback(
    async (inputValue: string) => {
      try {
        const trimmedValue = inputValue.trim()

        // Verificar si ya existe por nombre
        if (destinations.some((d) => d.label.toLowerCase() === trimmedValue.toLowerCase())) {
          toast({
            title: 'Destination already exists',
            description: `"${trimmedValue}" is already in the list.`,
            variant: 'destructive',
          })
          return
        }

        // Crear destino en la base de datos
        const response = await fetch('/api/destinations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedValue }),
        })

        if (!response.ok) {
          throw new Error('Error al crear destino')
        }

        const newDestination = await response.json()
        const newOption = { label: newDestination.name, value: newDestination.id }

        // Actualizar la lista local y seleccionar el nuevo destino
        setDestinations((prev) => [newOption, ...prev])
        setValue('destinationId', newDestination.id)

        toast({
          title: 'Destino Creado',
          description: `"${trimmedValue}" ha sido añadido exitosamente.`,
        })
      } catch (error) {
        console.error('Error creating destination:', error)
        toast({
          title: 'Error',
          description: 'No se pudo crear el destino. Inténtalo de nuevo.',
          variant: 'destructive',
        })
      }
    },
    [destinations, setValue, toast],
  )

  return (
    <div className="space-y-10">
      {/* Sección de Imagen */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-xl font-bold theme-text mb-3">
              Cover Image
            </h3>
            <p className="text-sm theme-text-secondary leading-relaxed">
              This will be the first impression of your plan. Choose a high-quality horizontal image that represents the destination.
            </p>
          </div>
        </div>
        <div className="lg:col-span-3">
          <div className="theme-card rounded-xl p-6 theme-border">
            <MainImage form={useFormContext<PlanFormValues>()} />
          </div>
        </div>
      </div>

      {/* Sección de Destino y Transporte */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-xl font-bold theme-text mb-3">
              Destination Details
            </h3>
            <p className="text-sm theme-text-secondary leading-relaxed">
              Select the main destination from your database and specify its transportation characteristics.
            </p>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="theme-card rounded-xl p-6 theme-border">
            <FormField
              control={control}
              name="destinationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold theme-text mb-3 block">
                    Main Destination
                  </FormLabel>
                  <FormControl>
                    <OriginalCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={destinations}
                      onCreate={handleCreateDestination}
                      placeholder={
                        isLoadingDest ? 'Loading destinations...' : 'Search for a destination or create a new one'
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="theme-card rounded-xl p-6 theme-border">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <FormLabel className="text-lg font-semibold theme-text">
                  Is this a ground transport plan?
                </FormLabel>
                <p className="text-sm theme-text-secondary">
                  Enable this if the main means of transportation to reach the destination is by land (bus, car, etc.).
                </p>
              </div>
              <FormField
                control={control}
                name="allowGroundTransport"
                render={({ field }) => (
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                )}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Título y URLs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <h3 className="text-xl font-bold theme-text mb-3">
              Title and Web Address
            </h3>
            <p className="text-sm theme-text-secondary leading-relaxed">
              The name of your plan and how it will appear in the browser's address bar. Essential for SEO.
            </p>
          </div>
        </div>
        <div className="lg:col-span-3 space-y-6">
          <div className="theme-card rounded-xl p-6 theme-border">
            <FormField
              control={control}
              name="mainTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold theme-text mb-3 block">
                    Main Plan Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Magical Circuit through the Riviera Maya"
                      className="text-lg py-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="theme-card rounded-xl p-6 theme-border space-y-6">
            <div>
              <h4 className="text-lg font-semibold theme-text mb-2">URL Configuration</h4>
              <p className="text-sm theme-text-secondary">
                Configure how your plan will appear in the URL structure.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium theme-text">
                      Section
                      <span className="text-xs theme-text-secondary block font-normal">
                        Main category (planes, circuitos)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <OriginalCombobox
                        value={field.value || 'planes'}
                        onChange={field.onChange}
                        options={[
                          { label: 'Planes', value: 'planes' },
                          { label: 'Circuitos', value: 'circuitos' }
                        ]}
                        placeholder="Choose section..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="categoryAlias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium theme-text">
                      Destination
                      <span className="text-xs theme-text-secondary block font-normal">
                        Specific destination (panama, costa-rica)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <OriginalCombobox
                        value={field.value}
                        onChange={field.onChange}
                        options={categoryOptions}
                        onCreate={handleCreateCategory}
                        placeholder="Choose destination..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="articleAlias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-medium theme-text">
                      Plan Slug
                    </FormLabel>
                    <FormControl>
                      <OriginalCombobox
                        value={field.value}
                        onChange={field.onChange}
                        options={planSlugOptions}
                        onCreate={handleCreatePlanSlug}
                        placeholder="Choose or create..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div>
              <FormLabel className="font-medium theme-text mb-3 block">URL Preview</FormLabel>
              <URLPreview
                section={watch('section') || 'planes'}
                categoryAlias={watch('categoryAlias') || ''}
                articleAlias={articleAlias || ''}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
