'use client'

import { CheckCircle2, XCircle } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

export function IncludesSection() {
  const { control } = useFormContext()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold theme-text mb-3">
          Includes / Not Included
        </h3>
        <p className="text-sm theme-text-secondary max-w-2xl mx-auto leading-relaxed">
          Specify in detail which services and products are covered by the plan price. This helps customers understand exactly what they are buying.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="theme-card rounded-xl p-8 theme-border">
          <FormField
            control={control}
            name="includes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-3 text-xl font-semibold theme-text mb-6">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                    <CheckCircle2
                      className="h-5 w-5 text-emerald-600 dark:text-emerald-400"
                      strokeWidth={2}
                    />
                  </div>
                  <span>What does the plan include?</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g.: 
• 3-night accommodation in 4-star hotel
• Round-trip airfare
• Breakfast and dinner included
• Ground transportation
• Specialized tour guide
• Basic travel insurance"
                    rows={12}
                    className="resize-none text-base leading-relaxed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="theme-card rounded-xl p-8 theme-border">
          <FormField
            control={control}
            name="notIncludes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-3 text-xl font-semibold theme-text mb-6">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" strokeWidth={2} />
                  </div>
                  <span>What is NOT included in the plan?</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="e.g.: 
• Unspecified personal expenses
• International medical assistance card
• Tips for guides and drivers
• Lunches during the tour
• Optional activities not mentioned
• Alcoholic beverages"
                    rows={12}
                    className="resize-none text-base leading-relaxed"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
