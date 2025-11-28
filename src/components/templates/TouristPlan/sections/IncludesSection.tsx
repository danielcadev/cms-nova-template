'use client'

import { CheckCircle2, Plus, Trash2, XCircle } from 'lucide-react'
import { useCallback, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* INCLUDES SECTION */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="flex items-center gap-3 text-lg font-semibold text-zinc-900">
              <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-zinc-900" />
              </div>
              What's Included
            </h4>
            <Button
              type="button"
              onClick={addSection}
              variant="outline"
              size="sm"
              className="h-8 text-xs"
            >
              <Plus className="h-3 w-3 mr-1.5" />
              Add Section
            </Button>
          </div>

          {includeSections.length === 0 ? (
            <div className="bg-zinc-50 rounded-xl p-8 border border-dashed border-zinc-200 text-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-zinc-100">
                <CheckCircle2 className="h-6 w-6 text-zinc-400" />
              </div>
              <h5 className="text-sm font-medium text-zinc-900 mb-1">No sections yet</h5>
              <p className="text-xs text-zinc-500 mb-4">
                Add sections to organize what's included in your plan
              </p>
              <Button type="button" onClick={addSection} variant="outline" size="sm">
                <Plus className="h-3 w-3 mr-2" />
                Add First Section
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {includeSections.map((section, index) => (
                <div
                  key={section.id}
                  className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                      Section {index + 1}
                    </span>
                    {includeSections.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        variant="ghost"
                        size="sm"
                        className="text-zinc-400 hover:text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor={`title-${section.id}`}
                        className="block text-xs font-medium text-zinc-700 mb-1.5"
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
                        className="block text-xs font-medium text-zinc-700 mb-1.5"
                      >
                        Items Included
                      </label>
                      <Textarea
                        id={`content-${section.id}`}
                        value={section.content}
                        onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                        placeholder="List items..."
                        rows={5}
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
        <div className="space-y-6">
          <h4 className="flex items-center gap-3 text-lg font-semibold text-zinc-900">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center">
              <XCircle className="h-4 w-4 text-zinc-900" />
            </div>
            What is NOT included
          </h4>

          <div className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm">
            <FormField
              control={control}
              name="notIncludes"
              render={({ field }) => (
                <FormItem>
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
                      className="resize-none text-sm leading-relaxed border-0 focus-visible:ring-0 p-0 shadow-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Preview Section */}
      {includeSections.length > 0 && (
        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
          <h5 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-zinc-900 rounded-full"></span>
            Preview
          </h5>
          <div className="space-y-6">
            {includeSections.map((section) => (
              <div key={section.id}>
                {section.title && (
                  <h6 className="font-bold text-zinc-900 text-sm mb-2 uppercase tracking-wide">
                    {section.title}
                  </h6>
                )}
                {section.content && (
                  <div className="text-sm text-zinc-600 pl-4 border-l-2 border-zinc-200 whitespace-pre-line">
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
