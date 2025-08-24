'use client'

import { useCallback, useRef } from 'react'

interface SimpleRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SimpleRichEditor({
  value,
  onChange,
  placeholder,
  className,
}: SimpleRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)

  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML)
      }
    },
    [onChange],
  )

  const handleContentChange = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }, [onChange])

  return (
    <div className={`simple-rich-editor ${className}`}>
      <style jsx>{`
        .simple-rich-editor {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          background: white;
        }
        
        .toolbar {
          display: flex;
          gap: 8px;
          padding: 12px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          flex-wrap: wrap;
        }
        
        .toolbar button {
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          background: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
        }
        
        .toolbar button:hover {
          background: #f1f5f9;
          border-color: #cbd5e1;
        }
        
        .toolbar button.active {
          background: #3b82f6;
          color: white;
          border-color: #3b82f6;
        }
        
        .editor {
          min-height: 200px;
          padding: 16px;
          outline: none;
        }
        
        .editor:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
        }
      `}</style>

      <div className="toolbar">
        <button type="button" onClick={() => execCommand('bold')} title="Bold">
          B
        </button>
        <button type="button" onClick={() => execCommand('italic')} title="Italic">
          I
        </button>
        <button type="button" onClick={() => execCommand('underline')} title="Underline">
          U
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          title="Numbered List"
        >
          1.
        </button>
        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          title="Bullet List"
        >
          •
        </button>
        <button type="button" onClick={() => execCommand('justifyLeft')} title="Align Left">
          ←
        </button>
        <button type="button" onClick={() => execCommand('justifyCenter')} title="Align Center">
          ↔
        </button>
        <button type="button" onClick={() => execCommand('justifyRight')} title="Align Right">
          →
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
          }}
          title="Link"
        >
          🔗
        </button>
        <button type="button" onClick={() => execCommand('removeFormat')} title="Clear">
          ✕
        </button>
      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleContentChange}
        data-placeholder={placeholder}
      />
    </div>
  )
}
