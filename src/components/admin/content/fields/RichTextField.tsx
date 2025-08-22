import SimpleRichEditor from './SimpleRichEditor'

interface RichTextFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextField({ value, onChange, placeholder, className }: RichTextFieldProps) {
  return (
    <SimpleRichEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  )
}