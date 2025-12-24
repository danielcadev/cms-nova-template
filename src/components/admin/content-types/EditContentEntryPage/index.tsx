'use client'

import { TemplateHeader } from '@/components/admin/dashboard/TemplatesPage/TemplateHeader'
import { Button } from '@/components/ui/button'
import { DynamicFieldRenderer } from '../DynamicFieldRenderer'
import type { EditContentEntryPageProps } from './data'
import { useEditContentEntry } from './useEditContentEntry'
import { Save, Eye, Trash2 } from 'lucide-react'
import { AIPromptModal } from '../AIPromptModal'

export function EditContentEntryPage({ entry }: EditContentEntryPageProps) {
  const { state, ids, fields, actions } = useEditContentEntry(entry)
  const { formData, status, isSaving, isDeleting, isFormValid, slug, aiModal } = state
  const { statusId, getFieldId } = ids
  const { titleField, imageField, slugField, metaTitleField, metaDescriptionField, imageAltField, tagsField } = fields
  const {
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
  } = actions

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-20">
      <TemplateHeader
        title={`Edit ${entry.contentType.name}`}
        subtitle={`Editing entry: ${(titleField && formData[titleField.apiIdentifier]) || entry.title || 'Untitled'}`}
        backHref={`/admin/dashboard/content-types/${entry.contentType.apiIdentifier}/content`}
        status={status}
        onStatusChange={setStatus}
        statusOptions={{
          draft: 'Draft',
          published: 'Published',
          archived: 'Archived'
        }}
        rightActions={
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button
              onClick={() => handleSave(status)}
              disabled={isSaving || !isFormValid}
              className="bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="outline"
              onClick={handlePublishAndView}
              disabled={isSaving || !isFormValid || !slug}
              className="rounded-xl"
            >
              <Eye className="h-4 w-4 mr-2" />
              View
            </Button>
          </div>
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
            {entry.contentType.fields
              .filter((f) => f.id !== titleField?.id && f.id !== imageField?.id)
              .map((field) => (
                <div key={field.id} className="pt-4 border-t border-zinc-100 first:border-0 first:pt-0">
                  <label className="block text-sm font-bold text-zinc-900 mb-2">
                    {field.label}
                    {field.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </label>
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
                </div>
              ))}
          </div>
        </div>

        {/* Info Footer */}
        <div className="text-center text-xs text-zinc-400 pb-8">
          <p>Created: {new Date(entry.createdAt).toLocaleString()} • Updated: {new Date(entry.updatedAt).toLocaleString()}</p>
          <p className="mt-1">Content Type: {entry.contentType.name}</p>
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
