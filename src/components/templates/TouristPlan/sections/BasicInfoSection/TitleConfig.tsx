'use client'

import { Combobox as OriginalCombobox } from '@/components/ui/combobox'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { URLPreview } from './URLPreview'
import { useBasicInfo } from './useBasicInfo'

export function TitleConfig() {
  const {
    control,
    setValue,
    categoryOptions,
    planSlugOptions,
    categoryFeedback,
    slugFeedback,
    handleCreateCategory,
    handleCreatePlanSlug,
    setCategoryOptions,
    setPlanSlugOptions,
    section,
    categoryAlias,
    articleAlias,
    CATEGORY_KEY,
    SLUG_KEY,
  } = useBasicInfo()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-1">
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">Title and Web Address</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">
          The name of your plan and how it will appear in the browser's address bar. Essential for
          SEO.
        </p>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <FormField
          control={control}
          name="mainTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-zinc-900 font-medium">Main Plan Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="e.g., Magical Circuit through the Riviera Maya"
                  className="text-lg py-6 bg-white border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-zinc-50/50 rounded-xl p-6 border border-zinc-200 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 mb-1">URL Configuration</h4>
            <p className="text-xs text-zinc-500">
              Configure how your plan will appear in the URL structure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={control}
              name="section"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 lg:col-span-1">
                  <FormLabel className="text-sm font-medium text-zinc-700">
                    Section
                    <span className="text-xs text-zinc-400 block font-normal mt-0.5">
                      Main category
                    </span>
                  </FormLabel>
                  <FormControl>
                    <OriginalCombobox
                      value={field.value || 'planes'}
                      onChange={field.onChange}
                      options={[
                        { label: 'Planes', value: 'planes' },
                        { label: 'Circuitos', value: 'circuitos' },
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
                  <FormLabel className="text-sm font-medium text-zinc-700">
                    Destination
                    <span className="text-xs text-zinc-400 block font-normal mt-0.5">
                      Specific destination
                    </span>
                  </FormLabel>
                  <FormControl>
                    <OriginalCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={categoryOptions}
                      onCreate={handleCreateCategory}
                      onDeleteOption={(val) => {
                        setCategoryOptions((prev) => prev.filter((o) => o.value !== val))
                        if (field.value === val) setValue('categoryAlias', '')
                        try {
                          localStorage.setItem(
                            CATEGORY_KEY,
                            JSON.stringify(categoryOptions.filter((o) => o.value !== val)),
                          )
                        } catch {}
                      }}
                      placeholder="Search or create..."
                      emptyMessage="No options"
                      clearable
                    />
                  </FormControl>
                  {categoryFeedback && (
                    <p className="mt-2 text-xs text-emerald-600">{categoryFeedback}</p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="articleAlias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-zinc-700">
                    Plan Slug
                    <span className="text-xs text-zinc-400 block font-normal mt-0.5">
                      URL identifier
                    </span>
                  </FormLabel>
                  <FormControl>
                    <OriginalCombobox
                      value={field.value}
                      onChange={field.onChange}
                      options={planSlugOptions}
                      onCreate={handleCreatePlanSlug}
                      onDeleteOption={(val) => {
                        setPlanSlugOptions((prev) => prev.filter((o) => o.value !== val))
                        if (field.value === val) setValue('articleAlias', '')
                        try {
                          localStorage.setItem(
                            SLUG_KEY,
                            JSON.stringify(planSlugOptions.filter((o) => o.value !== val)),
                          )
                        } catch {}
                      }}
                      placeholder="Search or create..."
                      emptyMessage="No options"
                      clearable
                    />
                  </FormControl>
                  {slugFeedback && <p className="mt-2 text-xs text-emerald-600">{slugFeedback}</p>}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel className="text-sm font-medium text-zinc-700 mb-3 block">
              URL Preview
            </FormLabel>
            <URLPreview
              section={section || 'planes'}
              categoryAlias={categoryAlias || ''}
              articleAlias={articleAlias || ''}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
