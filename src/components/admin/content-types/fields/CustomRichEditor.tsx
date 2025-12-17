'use client'

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Eraser,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Quote,
  Underline,
} from 'lucide-react'
import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface CustomRichEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

// Toolbar button component using lucide icons for theme compatibility
const ToolbarButton = ({
  command,
  title,
  isActive,
  onClick,
  children,
  value,
}: {
  command: string
  title: string
  isActive: boolean
  onClick: (command: string, value?: string) => void
  children: React.ReactNode
  value?: string
}) => {
  return (
    <button
      type="button"
      className={`toolbar-btn ${isActive ? 'active' : ''}`}
      title={title}
      aria-label={title}
      onMouseDown={(e) => {
        e.preventDefault() // keep selection and focus on editor
        onClick(command, value)
      }}
    >
      <span className="icon-wrap" aria-hidden="true">
        {children}
      </span>
    </button>
  )
}

export default function CustomRichEditor({
  value,
  onChange,
  placeholder = 'Start writing your content...',
  className = '',
}: CustomRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Handle content changes
  const handleContentChange = useCallback(() => {
    if (isUpdating || !editorRef.current) return

    const html = editorRef.current.innerHTML
    onChange(html)
  }, [onChange, isUpdating])

  // Format commands
  const execCommand = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value)
      editorRef.current?.focus()
      handleContentChange()
    },
    [handleContentChange],
  )

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
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
          case 'k': {
            e.preventDefault()
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
            break
          }
          case 'q':
            e.preventDefault()
            execCommand('formatBlock', 'blockquote')
            break
          case 'e': {
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
      }
    },
    [execCommand, handleContentChange],
  )

  // Check if command is active
  const isCommandActive = useCallback((command: string) => {
    return document.queryCommandState(command)
  }, [])

  // Format block (headers)
  const handleFormatBlock = (tag: string) => {
    const block = `<${tag}>`
    execCommand('formatBlock', block)
  }

  return (
    <div className={`custom-rich-editor ${className}`}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        {/* Headers */}
        <select
          className="format-select"
          onMouseDown={(e) => e.preventDefault()}
          onChange={(e) => {
            // preserve selection and apply block format
            const tag = e.target.value
            handleFormatBlock(tag)
          }}
        >
          <option value="div">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>

        {/* Text formatting */}
        <ToolbarButton
          command="bold"
          title="Bold (Ctrl+B)"
          isActive={isCommandActive('bold')}
          onClick={execCommand}
        >
          <Bold className="h-4 w-4 theme-text" />
        </ToolbarButton>
        <ToolbarButton
          command="italic"
          title="Italic (Ctrl+I)"
          isActive={isCommandActive('italic')}
          onClick={execCommand}
        >
          <Italic className="h-4 w-4 theme-text" />
        </ToolbarButton>
        <ToolbarButton
          command="underline"
          title="Underline (Ctrl+U)"
          isActive={isCommandActive('underline')}
          onClick={execCommand}
        >
          <Underline className="h-4 w-4 theme-text" />
        </ToolbarButton>

        {/* Separator */}
        <div className="toolbar-separator"></div>

        {/* Lists */}
        <ToolbarButton
          command="insertOrderedList"
          title="Numbered List"
          isActive={isCommandActive('insertOrderedList')}
          onClick={execCommand}
        >
          <ListOrdered className="h-4 w-4 theme-text" />
        </ToolbarButton>
        <ToolbarButton
          command="insertUnorderedList"
          title="Bullet List"
          isActive={isCommandActive('insertUnorderedList')}
          onClick={execCommand}
        >
          <List className="h-4 w-4 theme-text" />
        </ToolbarButton>

        {/* Separator */}
        <div className="toolbar-separator"></div>

        {/* Alignment */}
        <ToolbarButton
          command="justifyLeft"
          title="Align Left"
          isActive={isCommandActive('justifyLeft')}
          onClick={execCommand}
        >
          <AlignLeft className="h-4 w-4 theme-text" />
        </ToolbarButton>
        <ToolbarButton
          command="justifyCenter"
          title="Align Center"
          isActive={isCommandActive('justifyCenter')}
          onClick={execCommand}
        >
          <AlignCenter className="h-4 w-4 theme-text" />
        </ToolbarButton>
        <ToolbarButton
          command="justifyRight"
          title="Align Right"
          isActive={isCommandActive('justifyRight')}
          onClick={execCommand}
        >
          <AlignRight className="h-4 w-4 theme-text" />
        </ToolbarButton>

        {/* Separator */}
        <div className="toolbar-separator"></div>

        {/* More tools */}
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => execCommand('formatBlock', 'blockquote')}
          title="Blockquote (Ctrl+Q)"
          aria-label="Blockquote"
          onMouseDown={(e) => e.preventDefault()}
        >
          <Quote className="h-4 w-4 theme-text" />
        </button>
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => {
            const url = prompt('Enter URL:')
            if (url) execCommand('createLink', url)
          }}
          title="Insert Link (Ctrl+K)"
          aria-label="Insert Link"
          onMouseDown={(e) => e.preventDefault()}
        >
          <LinkIcon className="h-4 w-4 theme-text" />
        </button>
        <ToolbarButton
          command="removeFormat"
          title="Clear Formatting"
          isActive={false}
          onClick={execCommand}
        >
          <Eraser className="h-4 w-4 theme-text" />
        </ToolbarButton>
      </div>

      {/* Editor */}
      {/* biome-ignore lint/a11y/useSemanticElements: Rich text editor requires contentEditable div */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        role="textbox"
        tabIndex={0}
        aria-multiline="true"
        aria-label={placeholder}
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
          font-size: 16px;
          font-weight: 600;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
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

        /* Icon wrapper so SVGs inherit theme color */
        .icon-wrap :global(svg) {
          color: var(--theme-text-secondary);
        }
        .toolbar-btn:hover .icon-wrap :global(svg) {
          color: var(--theme-text);
        }
        .toolbar-btn.active .icon-wrap :global(svg) {
          color: white;
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
