import CustomRichEditor from './CustomRichEditor'

interface RichTextFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextField({
  value,
  onChange,
  placeholder,
  className,
}: RichTextFieldProps) {
  return (
    <CustomRichEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={className}
    />
  )
}
