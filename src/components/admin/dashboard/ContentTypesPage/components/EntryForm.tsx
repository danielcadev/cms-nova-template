import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { ContentTypeField } from '../data'

interface EntryFormProps {
    field: ContentTypeField
    value: any
    onChange: (name: string, value: any) => void
}

export function EntryForm({ field, value, onChange }: EntryFormProps) {
    const currentValue = value || ''

    switch (field.type) {
        case 'text':
            return (
                <Input
                    value={currentValue}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.name}`}
                />
            )

        case 'textarea':
            return (
                <Textarea
                    value={currentValue}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.name}`}
                    rows={4}
                />
            )

        case 'select':
            return (
                <Select value={currentValue} onValueChange={(val) => onChange(field.name, val)}>
                    <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                        {field.options?.map((option) => (
                            <SelectItem key={option} value={option}>
                                {option}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )

        case 'boolean':
            return (
                <Select
                    value={currentValue ? 'true' : 'false'}
                    onValueChange={(val) => onChange(field.name, val === 'true')}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                </Select>
            )

        default:
            return (
                <Input
                    value={currentValue}
                    onChange={(e) => onChange(field.name, e.target.value)}
                    placeholder={`Enter ${field.name}`}
                />
            )
    }
}
