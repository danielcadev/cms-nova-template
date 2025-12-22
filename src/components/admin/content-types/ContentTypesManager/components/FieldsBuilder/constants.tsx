import React from 'react'
import { Calendar, Hash, ImageIcon, Pilcrow, Text, ToggleRight } from 'lucide-react'
import * as z from 'zod'

// Schema para validar campos
export const fieldSchema = z.object({
  type: z.enum(['TEXT', 'RICH_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'MEDIA']),
  label: z.string(),
  apiIdentifier: z.string(),
  isRequired: z.boolean().default(false),
})

export const fieldTypes: {
  type: z.infer<typeof fieldSchema>['type']
  label: string
  icon: React.JSX.Element
  description: string
  color: string
}[] = [
    {
      type: 'TEXT',
      label: 'Short Text',
      icon: <Pilcrow className="h-5 w-5" />,
      description: 'Simple text field',
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: 'RICH_TEXT',
      label: 'Long Text',
      icon: <Text className="h-5 w-5" />,
      description: 'Rich text editor',
      color: 'from-green-500 to-green-600',
    },
    {
      type: 'NUMBER',
      label: 'Number',
      icon: <Hash className="h-5 w-5" />,
      description: 'Numeric field',
      color: 'from-orange-500 to-orange-600',
    },
    {
      type: 'BOOLEAN',
      label: 'Yes/No',
      icon: <ToggleRight className="h-5 w-5" />,
      description: 'True/false toggle',
      color: 'from-purple-500 to-purple-600',
    },
    {
      type: 'DATE',
      label: 'Date',
      icon: <Calendar className="h-5 w-5" />,
      description: 'Date picker',
      color: 'from-pink-500 to-pink-600',
    },
    {
      type: 'MEDIA',
      label: 'Media',
      icon: <ImageIcon className="h-5 w-5" />,
      description: 'Files and images',
      color: 'from-indigo-500 to-indigo-600',
    },
  ]
