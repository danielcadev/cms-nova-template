'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import 'quill/dist/quill.snow.css'
import { createPortal } from 'react-dom'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface RichTextFieldProps {
  value: string | undefined
  onChange: (value: string) => void
  placeholder?: string
  id?: string
}

export function RichTextField({ value, onChange, placeholder, id }: RichTextFieldProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<any>(null)
  const isUpdatingRef = useRef(false)
  const [toolbarEl, setToolbarEl] = useState<HTMLElement | null>(null)

  // Word-like, familiar fonts (system-available)
  const FONT_WHITELIST = useMemo(
    () => [
      'calibri',
      'arial',
      'helvetica',
      'times-new-roman',
      'georgia',
      'garamond',
      'cambria',
      'verdana',
      'tahoma',
      'trebuchet-ms',
      'courier-new',
      'sans',
      'serif',
      'mono',
    ],
    [],
  )

  const SIZE_WHITELIST = useMemo(
    () => ['10px', '12px', '14px', '16px', '18px', '24px', '32px', '48px'],
    [],
  )

  const toolbar = useMemo(
    () => [
      [{ header: [1, 2, 3, false] }],
      // keep native font dropdown hidden; we will use custom UI
      [{ font: FONT_WHITELIST }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ color: [] }, { background: [] }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ align: [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean'],
    ],
    [FONT_WHITELIST],
  )

  useEffect(() => {
    let quillInstance: any
    let mounted = true
    ;(async () => {
      const Quill = (await import('quill')).default
      // Register custom font whitelist before instantiating
      // Dynamic editor configuration requires any type
      const Font: any = (Quill as any).import('formats/font')
      Font.whitelist = FONT_WHITELIST
      ;(Quill as any).register(Font, true)
      // Register size whitelist (px values like Word)
      // Dynamic editor configuration requires any type
      const SizeAttr: any = (Quill as any).import('attributors/style/size')
      SizeAttr.whitelist = SIZE_WHITELIST
      ;(Quill as any).register(SizeAttr, true)
      if (!mounted || !editorRef.current) return
      // Avoid duplicate init (e.g., React StrictMode)
      if (quillRef.current) return
      // Clear any residue toolbar/container
      editorRef.current.innerHTML = ''
      quillInstance = new Quill(editorRef.current, {
        theme: 'snow',
        modules: { toolbar },
      })
      quillRef.current = quillInstance
      // Grab Quill toolbar and hide native font/size pickers
      const tb = editorRef.current.previousElementSibling as HTMLElement | null
      if (tb) {
        // Create a custom group at the start of the toolbar so our controls appear first
        let group = tb.querySelector('[data-custom-font-group="true"]') as HTMLElement | null
        if (!group) {
          group = document.createElement('span')
          group.className = 'ql-formats'
          group.setAttribute('data-custom-font-group', 'true')
          tb.insertBefore(group, tb.firstChild)
        }
        setToolbarEl(group)
        const nativeFont = tb.querySelector('.ql-font')
        const nativeSize = tb.querySelector('.ql-size')
        if (nativeFont instanceof HTMLElement) nativeFont.style.display = 'none'
        if (nativeSize instanceof HTMLElement) nativeSize.style.display = 'none'
      }
      // Set initial content
      if (value) {
        quillInstance.clipboard.dangerouslyPasteHTML(value)
      }
      // Listen to changes
      quillInstance.on('text-change', () => {
        if (isUpdatingRef.current) return
        const html = quillInstance.root.innerHTML
        onChange(html)
      })
      // Placeholder
      if (placeholder) {
        quillInstance.root.dataset.placeholder = placeholder
      }
    })()
    return () => {
      mounted = false
      const quill = quillRef.current
      if (quill) {
        quill.off('text-change')
      }
      quillRef.current = null
      if (editorRef.current) editorRef.current.innerHTML = ''
      setToolbarEl(null)
    }
  }, [toolbar, FONT_WHITELIST, SIZE_WHITELIST, onChange, placeholder, value])

  // Sync external value -> editor
  useEffect(() => {
    const quill = quillRef.current
    if (!quill) return
    const current = quill.root.innerHTML
    if ((value || '') !== (current || '')) {
      isUpdatingRef.current = true
      quill.clipboard.dangerouslyPasteHTML(value || '')
      // Allow next change
      setTimeout(() => {
        isUpdatingRef.current = false
      }, 0)
    }
  }, [value])

  return (
    <div className="quill-wrapper">
      {toolbarEl &&
        createPortal(
          <div className="flex items-center gap-2 mr-2">
            <Select onValueChange={(v) => quillRef.current?.format('font', v)}>
              <SelectTrigger className="quill-tool w-auto min-w-[180px] h-7 text-[12px] px-1.5 border-0 shadow-none rounded-none bg-transparent focus:ring-0">
                <SelectValue placeholder="Font" />
              </SelectTrigger>
              <SelectContent>
                {FONT_WHITELIST.map((f) => (
                  <SelectItem key={f} value={f}>
                    {f.replace(/-/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => quillRef.current?.format('size', v)}>
              <SelectTrigger className="quill-tool w-auto min-w-[120px] h-7 text-[12px] px-1.5 border-0 shadow-none rounded-none bg-transparent focus:ring-0">
                <SelectValue placeholder="Size" />
              </SelectTrigger>
              <SelectContent>
                {SIZE_WHITELIST.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>,
          toolbarEl,
        )}

      <div id={id} ref={editorRef} />
      <style jsx global>{`
        .quill-wrapper .ql-toolbar {
          border-radius: 0.5rem 0.5rem 0 0;
          border-color: rgba(148, 163, 184, 0.3);
        }
        .quill-wrapper .ql-container {
          border-radius: 0 0 0.5rem 0.5rem;
          border-color: rgba(148, 163, 184, 0.3);
          background: rgba(255,255,255,0.8);
        }
        .dark .quill-wrapper .ql-container {
          background: rgba(17,24,39,0.8);
        }
        /* Ensure readable text color inside editor for both themes */
        .quill-wrapper .ql-editor { color: rgba(17,24,39,0.95); }
        .dark .quill-wrapper .ql-editor { color: rgba(243,244,246,0.95); }
        .quill-wrapper .ql-toolbar .quill-tool {
          border: 0;
          background: transparent;
          border-radius: 0.375rem;
          vertical-align: middle;
        }
        .quill-wrapper .ql-toolbar .quill-tool:hover { background: rgba(0,0,0,0.04); }
        .dark .quill-wrapper .ql-toolbar .quill-tool:hover { background: rgba(255,255,255,0.06); }
        /* Map Quill font names (Word-like) to CSS font-families */
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="calibri"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="calibri"]::before {
          content: 'Calibri';
          font-family: Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="arial"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="arial"]::before {
          content: 'Arial';
          font-family: Arial, Helvetica, sans-serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="helvetica"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="helvetica"]::before {
          content: 'Helvetica';
          font-family: Helvetica, Arial, sans-serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="times-new-roman"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="times-new-roman"]::before {
          content: 'Times New Roman';
          font-family: "Times New Roman", Times, serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="georgia"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="georgia"]::before {
          content: 'Georgia';
          font-family: Georgia, Times, "Times New Roman", serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="garamond"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="garamond"]::before {
          content: 'Garamond';
          font-family: Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="cambria"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="cambria"]::before {
          content: 'Cambria';
          font-family: Cambria, Georgia, serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="verdana"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="verdana"]::before {
          content: 'Verdana';
          font-family: Verdana, Geneva, sans-serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="tahoma"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="tahoma"]::before {
          content: 'Tahoma';
          font-family: Tahoma, Verdana, Segoe, sans-serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="trebuchet-ms"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="trebuchet-ms"]::before {
          content: 'Trebuchet MS';
          font-family: "Trebuchet MS", Helvetica, sans-serif;
        }
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-label[data-value="courier-new"]::before,
        .quill-wrapper .ql-snow .ql-picker.ql-font .ql-picker-item[data-value="courier-new"]::before {
          content: 'Courier New';
          font-family: "Courier New", Courier, monospace;
        }
        .quill-wrapper .ql-font-calibri { font-family: Calibri, Candara, Segoe, Segoe UI, Optima, Arial, sans-serif; }
        .quill-wrapper .ql-font-arial { font-family: Arial, Helvetica, sans-serif; }
        .quill-wrapper .ql-font-helvetica { font-family: Helvetica, Arial, sans-serif; }
        .quill-wrapper .ql-font-times-new-roman { font-family: "Times New Roman", Times, serif; }
        .quill-wrapper .ql-font-georgia { font-family: Georgia, Times, "Times New Roman", serif; }
        .quill-wrapper .ql-font-garamond { font-family: Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif; }
        .quill-wrapper .ql-font-cambria { font-family: Cambria, Georgia, serif; }
        .quill-wrapper .ql-font-verdana { font-family: Verdana, Geneva, sans-serif; }
        .quill-wrapper .ql-font-tahoma { font-family: Tahoma, Verdana, Segoe, sans-serif; }
        .quill-wrapper .ql-font-trebuchet-ms { font-family: "Trebuchet MS", Helvetica, sans-serif; }
        .quill-wrapper .ql-font-courier-new { font-family: "Courier New", Courier, monospace; }
        .quill-wrapper .ql-font-sans { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; }
        .quill-wrapper .ql-font-serif { font-family: ui-serif, Georgia, Cambria, Times New Roman, Times, serif; }
        .quill-wrapper .ql-font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
      `}</style>
    </div>
  )
}
