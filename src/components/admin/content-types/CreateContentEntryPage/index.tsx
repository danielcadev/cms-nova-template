'use client'

import { useTranslations } from 'next-intl'
import { TemplateHeader } from '@/components/admin/shared/TemplateHeader'
import { Button } from '@/components/ui/button'
import { DynamicFieldRenderer } from '../DynamicFieldRenderer'
import type { CreateContentEntryPageProps } from './data'
import { useCreateContentEntry } from './useCreateContentEntry'
import { PremiumLoading } from '@/components/admin/dashboard/PremiumLoading'
import { Save, Eye, Loader2 } from 'lucide-react'
import { AIPromptModal } from '../AIPromptModal'

export function CreateContentEntryPage({ contentType }: CreateContentEntryPageProps) {
  const t = useTranslations('createEntry')
  const { state, ids, fields, actions } = useCreateContentEntry(contentType)
  const { formData, status, isSaving, mounted, isFormValid, slug, aiModal } = state
  const { statusId, getFieldId } = ids
  const { titleField, imageField, slugField, metaTitleField, metaDescriptionField, imageAltField, tagsField } = fields
  const {
    setStatus,
    handleFieldChange,
    handleSave,
    handlePublishAndView,
    generateSlugFromTitle,
    generateMetaTitle,
    generateMetaDescription,
    generateImageAlt,
    generateTags,
    openAIModal,
    closeAIModal,
    handleAIApply,
  } = actions


  if (state.isCreatingDraft) {
    return (
      <PremiumLoading
        title={t('loadingTitle', { name: contentType.name })}
        subtitle={t('loadingSubtitle')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <TemplateHeader
        title={t('createTitle', { name: contentType.name })}
        subtitle={t('createSubtitle')}
        backHref={`/admin/dashboard/content-types/${contentType.apiIdentifier}/content`}
        status={status}
        onStatusChange={setStatus}
        statusOptions={{
          draft: t('statusOptions.draft'),
          published: t('statusOptions.published'),
          archived: t('statusOptions.archived')
        }}
        rightActions={
          <>
            <Button
              onClick={() => handleSave(status)}
              disabled={isSaving || state.isCreatingDraft || !isFormValid}
              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
            >
              {(isSaving || state.isCreatingDraft) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {isSaving || state.isCreatingDraft ? t('saving') : t('saveDraft')}
            </Button>
            <Button
              variant="outline"
              onClick={handlePublishAndView}
              disabled={isSaving || !isFormValid || (!slug && !slugField)}
              className="rounded-xl"
            >
              <Eye className="h-4 w-4 mr-2" />
              {t('view')}
            </Button>
          </>
        }
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* Form Container */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-8 shadow-sm space-y-8">

          {/* Featured Fields (Image & Title) */}
          {(titleField || imageField) && (
            <div className="space-y-6">
              {imageField && (
                <div>
                  <label className="block text-sm font-bold text-zinc-900 mb-2">
                    {imageField.label}
                    {imageField.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <DynamicFieldRenderer
                    field={imageField}
                    value={formData[imageField.apiIdentifier]}
                    onChange={(value) => handleFieldChange(imageField.apiIdentifier, value)}
                    variant="default"
                    fieldId={getFieldId(imageField.id)}
                  />
                </div>
              )}

              {titleField && (
                <div>
                  <label className="block text-sm font-bold text-zinc-900 mb-2">
                    {titleField.label}
                    {titleField.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  <DynamicFieldRenderer
                    field={titleField}
                    value={formData[titleField.apiIdentifier]}
                    onChange={(value) => handleFieldChange(titleField.apiIdentifier, value)}
                    fieldId={getFieldId(titleField.id)}
                  />
                </div>
              )}
            </div>
          )}

          {/* Other Fields */}
          <div className="space-y-6">
            {contentType.fields
              .filter((f) => f.id !== titleField?.id && f.id !== imageField?.id)
              .map((field) => (
                <div key={field.id} className="pt-4 border-t border-zinc-100 first:border-0 first:pt-0">
                  <label className="block text-sm font-bold text-zinc-900 mb-2">
                    {field.label}
                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
                  {mounted ? (
                    <DynamicFieldRenderer
                      field={field}
                      value={formData[field.apiIdentifier]}
                      onChange={(value) => handleFieldChange(field.apiIdentifier, value)}
                      fieldId={getFieldId(field.id)}
                      onAutoGenerate={
                        field.type === 'SLUG' ? generateSlugFromTitle :
                          field.id === metaTitleField?.id ? generateMetaTitle :
                            field.id === metaDescriptionField?.id ? generateMetaDescription :
                              field.id === imageAltField?.id ? generateImageAlt :
                                field.id === tagsField?.id ? generateTags :
                                  () => openAIModal(field.apiIdentifier, field.label)
                      }
                    />
                  ) : (
                    <div className="h-10 bg-zinc-100 rounded-xl" />
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      <AIPromptModal
        isOpen={aiModal.isOpen}
        onClose={closeAIModal}
        onApply={handleAIApply}
        fieldLabel={aiModal.fieldLabel}
        initialPrompt={aiModal.initialPrompt}
      />
    </div>
  )
}
