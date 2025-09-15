'use client'

import { CheckCircle2, Plus, Trash2, XCircle } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { IncludeSection, PlanFormValues } from '@/schemas/plan'

export function IncludesSection() {
  const { control, watch, setValue } = useFormContext<PlanFormValues>()

  // Watch includes value
  const includes = watch('includes')

  // Parse includes - could be string (legacy) or array (new structure)
  const includeSections = useMemo((): IncludeSection[] => {
    if (!includes) return []
    if (typeof includes === 'string') {
      // Legacy format - convert to single section
      return includes.trim()
        ? [{ id: 'legacy', title: 'Included Services', content: includes }]
        : []
    }
    return includes as IncludeSection[]
  }, [includes])

  // Update includes with new sections
  const updateIncludes = useCallback(
    (newSections: IncludeSection[]) => {
      setValue('includes', newSections, { shouldDirty: true })
    },
    [setValue],
  )

  // Add new section
  const addSection = useCallback(() => {
    const newSection: IncludeSection = {
      id: `section-${Date.now()}`,
      title: '',
      content: '',
    }
    updateIncludes([...includeSections, newSection])
  }, [includeSections, updateIncludes])

  // Remove section
  const removeSection = useCallback(
    (id: string) => {
      updateIncludes(includeSections.filter((section) => section.id !== id))
    },
    [includeSections, updateIncludes],
  )

  // Update section
  const updateSection = useCallback(
    (id: string, field: keyof IncludeSection, value: string) => {
      const updatedSections = includeSections.map((section) =>
        section.id === id ? { ...section, [field]: value } : section,
      )
      updateIncludes(updatedSections)
    },
    [includeSections, updateIncludes],
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold theme-text mb-3">Includes / Not Included</h3>
        <p className="text-sm theme-text-secondary max-w-2xl mx-auto leading-relaxed">
          Create organized sections for what's included in your plan. You can add multiple
          categories like "INCLUDED IN BOGOTÁ", "INCLUDED IN AMAZONAS", etc.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* INCLUDES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-3 text-xl font-semibold theme-text">
              <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              What's Included
            </h4>
            <Button
              type="button"
              onClick={addSection}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Section
            </Button>
          </div>

          {includeSections.length === 0 ? (
            <div className="theme-card rounded-xl p-8 theme-border text-center">
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h5 className="font-medium theme-text mb-2">No sections yet</h5>
              <p className="text-sm theme-text-secondary mb-4">
                Add sections to organize what's included in your plan
              </p>
              <Button type="button" onClick={addSection} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {includeSections.map((section, index) => (
                <div key={section.id} className="theme-card rounded-xl p-6 theme-border">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium theme-text-secondary">
                      Section {index + 1}
                    </span>
                    {includeSections.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`title-${section.id}`}
                        className="block text-sm font-medium theme-text mb-2"
                      >
                        Section Title
                      </label>
                      <Input
                        id={`title-${section.id}`}
                        value={section.title}
                        onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                        placeholder="e.g., INCLUDED IN BOGOTÁ"
                        className="font-medium"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor={`content-${section.id}`}
                        className="block text-sm font-medium theme-text mb-2"
                      >
                        Items Included
                      </label>
                      <Textarea
                        id={`content-${section.id}`}
                        value={section.content}
                        onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                        placeholder="List what's included in this section:
• Airport transfers - hotel - airport
• 3 nights accommodation in Bogotá
• Meals: breakfast
• City Tour of Bogotá and Cable Car to Monserrate
• Excursion to Zipaquirá Salt Cathedral"
                        rows={6}
                        className="resize-none text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* NOT INCLUDES SECTION */}
        <div className="theme-card rounded-xl p-8 theme-border">
          <FormField
            control={control}
            name="notIncludes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-3 text-xl font-semibold theme-text mb-6">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <span>What is NOT included</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="List what's NOT included in the plan:
• Personal expenses not specified
• International medical assistance card
• Tips for guides and drivers
• Lunches during the tour
• Optional activities not mentioned
• Alcoholic beverages"
                    rows={12}
                    className="resize-none text-sm leading-relaxed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      {/* Preview Section */}
      {includeSections.length > 0 && (
        <div className="theme-card rounded-xl p-6 theme-border">
          <h5 className="font-semibold theme-text mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Preview
          </h5>
          <div className="space-y-4">
            {includeSections.map((section) => (
              <div key={section.id}>
                {section.title && (
                  <h6 className="font-bold theme-text text-sm mb-2 uppercase tracking-wide">
                    {section.title}
                  </h6>
                )}
                {section.content && (
                  <div className="text-sm theme-text-secondary pl-4 whitespace-pre-line">
                    {section.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
