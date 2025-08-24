'use client'

import { AlertTriangle, PlusCircle, Trash2 } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ItineraryDayImage } from '../components/ItineraryDayImage'

export function ItinerarySection() {
  const { control } = useFormContext()
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'itinerary',
  })

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold theme-text mb-3">Day-by-Day Itinerary</h3>
        <p className="text-sm theme-text-secondary max-w-2xl mx-auto leading-relaxed">
          Create a detailed itinerary that shows your customers exactly what they can expect each
          day of the trip.
        </p>
      </div>

      <div className="space-y-6">
        {fields.map((item, index) => (
          <div key={item.id} className="theme-card rounded-xl p-8 theme-border shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 theme-accent rounded-xl flex items-center justify-center text-white font-bold text-lg">
                  {index + 1}
                </div>
                <div>
                  <h4 className="text-xl font-bold theme-text">Day {index + 1}</h4>
                  <p className="text-sm theme-text-secondary">
                    Configure the activities and experiences for this day
                  </p>
                </div>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="theme-text-secondary hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-lg"
                  >
                    <Trash2 className="h-5 w-5" strokeWidth={1.5} />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="theme-card rounded-xl shadow-xl theme-border">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/20">
                        <AlertTriangle
                          className="h-6 w-6 text-red-600 dark:text-red-400"
                          strokeWidth={1.5}
                        />
                      </div>
                      <AlertDialogTitle className="theme-text text-lg">
                        Delete Day from Itinerary?
                      </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="pl-15 pt-2 theme-text-secondary">
                      This action cannot be undone. Day {index + 1} and all its associated
                      information will be permanently deleted.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-4">
                    <AlertDialogCancel className="theme-border">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => remove(index)}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      Yes, delete day
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <FormField
                  control={control}
                  name={`itinerary.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold theme-text">Day Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Arrival in Cancun and free afternoon"
                          className="text-base py-3"
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
                      <FormLabel className="text-lg font-semibold theme-text">
                        Description and Activities
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Detail the activities, transfers, meals and other relevant information for this day. Include approximate schedules if possible."
                          rows={8}
                          className="resize-none text-base leading-relaxed"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <h5 className="text-lg font-semibold theme-text">Day Image</h5>
                <ItineraryDayImage fieldIndex={index} />
              </div>
            </div>
          </div>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-16 px-8 theme-card rounded-xl theme-border">
            <div className="w-20 h-20 theme-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <PlusCircle className="h-10 w-10 theme-text-secondary" />
            </div>
            <h4 className="text-xl font-semibold theme-text mb-3">Start your itinerary</h4>
            <p className="theme-text-secondary max-w-md mx-auto mb-6">
              Add the first day of your tourist plan. You can add as many days as you need.
            </p>
          </div>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full theme-card theme-border theme-hover py-6 border-dashed text-lg font-medium"
          onClick={() => append({ day: fields.length + 1, title: '', description: '', image: '' })}
        >
          <PlusCircle className="mr-3 h-5 w-5" strokeWidth={1.5} />
          Add Day {fields.length + 1} to Itinerary
        </Button>
      </div>
    </div>
  )
}
