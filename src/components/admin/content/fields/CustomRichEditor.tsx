'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'

interface CustomRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function CustomRichEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your content...",
  className = ""
}: CustomRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Format commands
  const execCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleContentChange()
  }, [])

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (isUpdating || !editorRef.current) return
    
    const html = editorRef.current.innerHTML
    onChange(html)
  }, [onChange, isUpdating])

  // Sync external value changes
  useEffect(() => {
    if (!editorRef.current || isUpdating) return
    
    setIsUpdating(true)
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ''
    }
    setIsUpdating(false)
  }, [value, isUpdating])

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault()
          execCommand('bold')
          break
        case 'i':
          e.preventDefault()
          execCommand('italic')
          break
        case 'u':
          e.preventDefault()
          execCommand('underline')
          break
        case 'k':
          e.preventDefault()
          const url = prompt('Enter URL:')
          if (url) execCommand('createLink', url)
          break
        case 'q':
          e.preventDefault()
          execCommand('formatBlock', 'blockquote')
          break
        case 'e':
          e.preventDefault()
          // Insert inline code
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            const selectedText = range.toString()
            const codeElement = document.createElement('code')
            codeElement.textContent = selectedText || 'code'
            codeElement.style.backgroundColor = 'var(--theme-card-hover)'
            codeElement.style.padding = '2px 6px'
            codeElement.style.borderRadius = '4px'
            codeElement.style.fontFamily = 'monospace'
            codeElement.style.fontSize = '0.9em'
            range.deleteContents()
            range.insertNode(codeElement)
            selection.removeAllRanges()
          }
          handleContentChange()
          break
      }
    }
  }, [execCommand, handleContentChange])

  // Check if command is active
  const isCommandActive = useCallback((command: string) => {
    return document.queryCommandState(command)
  }, [])

  // Toolbar button component
  const ToolbarButton = ({ 
    command, 
    icon, 
    title, 
    value 
  }: { 
    command: string
    icon: string
    title: string
    value?: string 
  }) => (
    <button
      type="button"
      className={`toolbar-btn ${isCommandActive(command) ? 'active' : ''}`}
      onClick={() => execCommand(command, value)}
      title={title}
      onMouseDown={(e) => e.preventDefault()} // Prevent losing focus
    >
      <span className={`icon icon-${icon}`}></span>
    </button>
  )

  // Format block (headers)
  const handleFormatBlock = (tag: string) => {
    execCommand('formatBlock', tag)
  }

  return (
    <div className={`custom-rich-editor ${className}`}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* Headers */}
        <select 
          className="format-select"
          onChange={(e) => handleFormatBlock(e.target.value)}
          onMouseDown={(e) => e.preventDefault()}
        >
          <option value="div">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        {/* Text formatting */}
        <ToolbarButton command="bold" icon="bold" title="Bold (Ctrl+B)" />
        <ToolbarButton command="italic" icon="italic" title="Italic (Ctrl+I)" />
        <ToolbarButton command="underline" icon="underline" title="Underline (Ctrl+U)" />

        {/* Separator */}
        <div className="toolbar-separator"></div>

        {/* Lists */}
        <ToolbarButton command="insertOrderedList" icon="list-ordered" title="Numbered List" />
        <ToolbarButton command="insertUnorderedList" icon="list-bullet" title="Bullet List" />

        {/* Separator */}
        <div className="toolbar-separator"></div>

        {/* Alignment */}
        <ToolbarButton command="justifyLeft" icon="align-left" title="Align Left" />
        <ToolbarButton command="justifyCenter" icon="align-center" title="Align Center" />
        <ToolbarButton command="justifyRight" icon="align-right" title="Align Right" />

        {/* Separator */}
        <div className="toolbar-separator"></div>

        {/* More tools */}
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          title="Blockquote (Ctrl+Q)"
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="icon icon-blockquote"></span>
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
          }}
          title="Insert Link (Ctrl+K)"
          onMouseDown={(e) => e.preventDefault()}
        >
          <span className="icon icon-link"></span>
        </button>
        <ToolbarButton command="removeFormat" icon="clear" title="Clear Formatting" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        suppressContentEditableWarning
        onInput={handleContentChange}
        onKeyDown={handleKeyDown}
        data-placeholder={placeholder}
        style={{ minHeight: '200px' }}
      />

      <style jsx>{`
        .custom-rich-editor {
          border: 1px solid var(--theme-border);
          border-radius: 12px;
          background: var(--theme-card);
          overflow: hidden;
          transition: all 0.2s ease;
        }

        .custom-rich-editor:focus-within {
          border-color: var(--theme-accent);
          box-shadow: 0 0 0 3px var(--theme-accent-light);
        }

        /* Toolbar */
        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: var(--theme-card-hover);
          border-bottom: 1px solid var(--theme-border);
          flex-wrap: nowrap;
          min-height: 64px;
          overflow-x: auto;
          overflow-y: hidden;
        }

        .toolbar-separator {
          width: 1px;
          height: 24px;
          background: var(--theme-border);
          margin: 0 4px;
          flex-shrink: 0;
        }

        /* Toolbar buttons */
        .toolbar-btn {
          width: 40px;
          height: 40px;
          min-width: 40px;
          border: none;
          border-radius: 8px;
          background: transparent;
          color: var(--theme-text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
          position: relative;
          flex-shrink: 0;
        }

        .toolbar-btn:hover {
          background: var(--theme-card);
          color: var(--theme-text-primary);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px var(--theme-shadow);
        }

        .toolbar-btn.active {
          background: var(--theme-accent);
          color: white;
          box-shadow: 0 2px 8px var(--theme-accent-light);
        }

        /* Format select */
        .format-select {
          border: 1px solid var(--theme-border);
          border-radius: 8px;
          padding: 8px 12px;
          background: var(--theme-card);
          color: var(--theme-text-primary);
          font-size: 14px;
          font-weight: 500;
          min-width: 120px;
          height: 40px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .format-select:hover {
          border-color: var(--theme-accent);
          background: var(--theme-card-hover);
        }

        .format-select:focus {
          outline: none;
          border-color: var(--theme-accent);
          box-shadow: 0 0 0 2px var(--theme-accent-light);
        }

        /* Editor content */
        .editor-content {
          padding: 20px 24px;
          min-height: 200px;
          outline: none;
          font-size: 16px;
          line-height: 1.6;
          color: var(--theme-text-primary);
        }

        .editor-content:empty::before {
          content: attr(data-placeholder);
          color: var(--theme-text-secondary);
          font-style: italic;
          pointer-events: none;
        }

        /* Content styling */
        .editor-content h1 {
          font-size: 2em;
          font-weight: 700;
          margin: 0.5em 0;
          color: var(--theme-text-primary);
        }

        .editor-content h2 {
          font-size: 1.5em;
          font-weight: 600;
          margin: 0.5em 0;
          color: var(--theme-text-primary);
        }

        .editor-content h3 {
          font-size: 1.25em;
          font-weight: 600;
          margin: 0.5em 0;
          color: var(--theme-text-primary);
        }

        .editor-content p {
          margin: 0.5em 0;
        }

        .editor-content ul, .editor-content ol {
          margin: 0.5em 0;
          padding-left: 2em;
        }

        .editor-content li {
          margin: 0.25em 0;
        }

        .editor-content a {
          color: var(--theme-accent);
          text-decoration: underline;
        }

        .editor-content a:hover {
          color: var(--theme-accent-hover);
        }

        .editor-content blockquote {
          border-left: 4px solid var(--theme-accent);
          padding-left: 16px;
          margin: 1em 0;
          font-style: italic;
          color: var(--theme-text-secondary);
          background: var(--theme-card-hover);
          padding: 16px;
          border-radius: 8px;
        }

        .editor-content code {
          background: var(--theme-card-hover);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
          color: var(--theme-text-primary);
          border: 1px solid var(--theme-border);
        }

        .editor-content pre {
          background: var(--theme-card-hover);
          padding: 16px;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1em 0;
          border: 1px solid var(--theme-border);
        }

        .editor-content pre code {
          background: none;
          padding: 0;
          border: none;
          border-radius: 0;
        }

        /* Professional icons using CSS */
        .icon {
          width: 18px;
          height: 18px;
          display: block;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          filter: var(--icon-filter, none);
          transition: filter 0.2s ease;
        }

        .toolbar-btn:hover .icon {
          filter: var(--icon-filter-hover, var(--icon-filter, none));
        }

        .toolbar-btn.active .icon {
          filter: brightness(0) invert(1);
        }

        /* Icon definitions */
        .icon-bold {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'/%3E%3Cpath d='M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z'/%3E%3C/svg%3E");
        }

        .icon-italic {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cline x1='19' y1='4' x2='10' y2='4'/%3E%3Cline x1='14' y1='20' x2='5' y2='20'/%3E%3Cline x1='15' y1='4' x2='9' y2='20'/%3E%3C/svg%3E");
        }

        .icon-underline {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'%3E%3Cpath d='M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3'/%3E%3Cline x1='4' y1='21' x2='20' y2='21'/%3E%3C/svg%3E");
        }

        .icon-list-ordered {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='10' y1='6' x2='21' y2='6'/%3E%3Cline x1='10' y1='12' x2='21' y2='12'/%3E%3Cline x1='10' y1='18' x2='21' y2='18'/%3E%3Cpath d='M4 6h1v4'/%3E%3Cpath d='M4 10h2'/%3E%3Cpath d='M6 18H4c0-1 2-2 2-3s-1-1.5-2-1'/%3E%3C/svg%3E");
        }

        .icon-list-bullet {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='8' y1='6' x2='21' y2='6'/%3E%3Cline x1='8' y1='12' x2='21' y2='12'/%3E%3Cline x1='8' y1='18' x2='21' y2='18'/%3E%3Cline x1='3' y1='6' x2='3.01' y2='6'/%3E%3Cline x1='3' y1='12' x2='3.01' y2='12'/%3E%3Cline x1='3' y1='18' x2='3.01' y2='18'/%3E%3C/svg%3E");
        }

        .icon-align-left {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='17' y1='10' x2='3' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='17' y1='18' x2='3' y2='18'/%3E%3C/svg%3E");
        }

        .icon-align-center {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='18' y1='10' x2='6' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='18' y1='18' x2='6' y2='18'/%3E%3C/svg%3E");
        }

        .icon-align-right {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='21' y1='10' x2='7' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='21' y1='18' x2='7' y2='18'/%3E%3C/svg%3E");
        }

        .icon-align-justify {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cline x1='21' y1='10' x2='3' y2='10'/%3E%3Cline x1='21' y1='6' x2='3' y2='6'/%3E%3Cline x1='21' y1='14' x2='3' y2='14'/%3E%3Cline x1='21' y1='18' x2='3' y2='18'/%3E%3C/svg%3E");
        }

        .icon-indent {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpolyline points='3,8 7,12 3,16'/%3E%3Cline x1='21' y1='4' x2='11' y2='4'/%3E%3Cline x1='21' y1='8' x2='11' y2='8'/%3E%3Cline x1='21' y1='12' x2='11' y2='12'/%3E%3Cline x1='21' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='20' x2='3' y2='20'/%3E%3C/svg%3E");
        }

        .icon-outdent {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpolyline points='7,8 3,12 7,16'/%3E%3Cline x1='21' y1='4' x2='11' y2='4'/%3E%3Cline x1='21' y1='8' x2='11' y2='8'/%3E%3Cline x1='21' y1='12' x2='11' y2='12'/%3E%3Cline x1='21' y1='16' x2='11' y2='16'/%3E%3Cline x1='21' y1='20' x2='3' y2='20'/%3E%3C/svg%3E");
        }

        .icon-link {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71'/%3E%3Cpath d='M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71'/%3E%3C/svg%3E");
        }

        .icon-blockquote {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z'/%3E%3Cpath d='M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z'/%3E%3C/svg%3E");
        }

        .icon-code {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpolyline points='16,18 22,12 16,6'/%3E%3Cpolyline points='8,6 2,12 8,18'/%3E%3C/svg%3E");
        }

        .icon-clear {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M4 7h16'/%3E%3Cpath d='M10 11v6'/%3E%3Cpath d='M14 11v6'/%3E%3Cpath d='M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12'/%3E%3Cpath d='M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3'/%3E%3C/svg%3E");
        }

        /* Responsive design */
        @media (max-width: 768px) {
          .editor-toolbar {
            padding: 8px 12px;
            gap: 4px;
            min-height: 56px;
          }
          
          .toolbar-group {
            gap: 2px;
            padding-right: 8px;
            margin-right: 6px;
          }
          
          .toolbar-btn {
            width: 36px;
            height: 36px;
          }
          
          .format-select {
            height: 36px;
            font-size: 13px;
            min-width: 100px;
          }
          
          .icon {
            width: 16px;
            height: 16px;
          }
        }

        /* Theme-based icon filters */
        .custom-rich-editor {
          --icon-filter: brightness(0) saturate(100%) invert(45%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(85%);
          --icon-filter-hover: brightness(0) saturate(100%) invert(15%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(85%);
        }

        /* Dark theme adjustments */
        [data-theme="dark"] .custom-rich-editor,
        .dark .custom-rich-editor {
          --icon-filter: brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(85%);
          --icon-filter-hover: brightness(0) saturate(100%) invert(95%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(95%) contrast(85%);
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .editor-toolbar {
            padding: 8px 12px;
            gap: 2px;
          }
          
          .toolbar-btn {
            width: 36px;
            height: 36px;
          }

          .icon {
            width: 16px;
            height: 16px;
          }
          
          .format-select {
            height: 36px;
            min-width: 100px;
            font-size: 13px;
          }
          
          .toolbar-group {
            padding-right: 6px;
          }

          .editor-content {
            padding: 16px 20px;
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  )
}