import React from 'react'
import { Calendar, Hash, ImageIcon, Link2, Pilcrow, Text, ToggleRight, List } from 'lucide-react'
import * as z from 'zod'

// Schema para validar campos
export const fieldSchema = z.object({
  type: z.enum(['TEXT', 'RICH_TEXT', 'NUMBER', 'BOOLEAN', 'DATE', 'MEDIA', 'SLUG', 'SELECT']),
  label: z.string(),
  apiIdentifier: z.string(),
  isRequired: z.boolean().default(false),
  isList: z.boolean().default(false).optional(),
  slugRoute: z.string().optional(),
  options: z.string().optional(), // For SELECT fields (comma separated)
})

export const fieldTypes: {
  type: z.infer<typeof fieldSchema>['type']
  labelKey: string
  descKey: string
  icon: React.JSX.Element
  color: string
}[] = [
    {
      type: 'TEXT',
      labelKey: 'fieldTypes.text',
      descKey: 'fieldTypes.textDesc',
      icon: <Pilcrow className="h-5 w-5" />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      type: 'RICH_TEXT',
      labelKey: 'fieldTypes.richText',
      descKey: 'fieldTypes.richTextDesc',
      icon: <Text className="h-5 w-5" />,
      color: 'from-green-500 to-green-600',
    },
    {
      type: 'NUMBER',
      labelKey: 'fieldTypes.number',
      descKey: 'fieldTypes.numberDesc',
      icon: <Hash className="h-5 w-5" />,
      color: 'from-orange-500 to-orange-600',
    },
    {
      type: 'BOOLEAN',
      labelKey: 'fieldTypes.boolean',
      descKey: 'fieldTypes.booleanDesc',
      icon: <ToggleRight className="h-5 w-5" />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      type: 'DATE',
      labelKey: 'fieldTypes.date',
      descKey: 'fieldTypes.dateDesc',
      icon: <Calendar className="h-5 w-5" />,
      color: 'from-pink-500 to-pink-600',
    },
    {
      type: 'MEDIA',
      labelKey: 'fieldTypes.media',
      descKey: 'fieldTypes.mediaDesc',
      icon: <ImageIcon className="h-5 w-5" />,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      type: 'SLUG',
      labelKey: 'fieldTypes.slug',
      descKey: 'fieldTypes.slugDesc',
      icon: <Link2 className="h-5 w-5" />,
      color: 'from-amber-500 to-amber-600',
    },
    {
      type: 'SELECT',
      labelKey: 'fieldTypes.select',
      descKey: 'fieldTypes.selectDesc',
      icon: <List className="h-5 w-5" />,
      color: 'from-cyan-500 to-cyan-600',
    },
  ]
