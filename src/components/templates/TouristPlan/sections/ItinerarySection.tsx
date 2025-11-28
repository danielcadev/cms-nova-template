'use client'

import { PlusCircle, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { ConfirmationModal } from '@/components/ui/ConfirmationModal'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { confirmationPresets, useConfirmation } from '@/hooks/useConfirmation'
import { ItineraryDayImage } from '../components/ItineraryDayImage'

export function ItinerarySection() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary',
  })
  const confirmation = useConfirmation()

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        {fields.map((item, index) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-6 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-zinc-900/20">
                  {index + 1}
                </div>
                <div className="flex-1 sm:flex-initial">
                  <h4 className="text-lg font-bold text-zinc-900">Day {index + 1}</h4>
                  <p className="text-sm text-zinc-500">Configure activities for this day</p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => {
                  confirmation.confirm(confirmationPresets.deleteDay(index + 1), () =>
                    remove(index),
                  )
                }}
                className="text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-start sm:self-auto"
              >
                <Trash2 className="h-5 w-5" strokeWidth={1.5} />
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={control}
                  name={`itinerary.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-zinc-900">
                        Day Title
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Arrival in Cancun and free afternoon"
                          className="text-base py-2"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name={`itinerary.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-zinc-900">
                        Description and Activities
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Detail the activities, transfers, meals and other relevant information..."
                          rows={6}
                          className="resize-none text-sm leading-relaxed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <h5 className="text-base font-semibold text-zinc-900">Day Image</h5>
                <ItineraryDayImage fieldIndex={index} />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-16 px-8 bg-zinc-50 rounded-xl border border-dashed border-zinc-200">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-100">
              <PlusCircle className="h-8 w-8 text-zinc-400" />
            </div>
            <h4 className="text-lg font-semibold text-zinc-900 mb-2">Start your itinerary</h4>
            <p className="text-sm text-zinc-500 max-w-md mx-auto mb-6">
              Add the first day of your tourist plan. You can add as many days as you need.
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full bg-white border-dashed border-zinc-300 hover:bg-zinc-50 hover:border-zinc-400 text-zinc-600 py-6 text-base font-medium transition-all duration-200"
          onClick={() => append({ day: fields.length + 1, title: '', description: '', image: '' })}
        >
          <PlusCircle className="mr-2 h-5 w-5" strokeWidth={1.5} />
          Add Day {fields.length + 1} to Itinerary
        </Button>
      </div>

      {/* Confirmation Modal */}
      {confirmation.config && (
        <ConfirmationModal
          isOpen={confirmation.isOpen}
          onClose={confirmation.close}
          onConfirm={confirmation.handleConfirm}
          config={confirmation.config}
        />
      )}
    </div>
  )
}
