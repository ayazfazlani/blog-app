"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Image as ImageIcon, Table as TableIcon, Code } from "lucide-react"

interface RichTextEditorProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  className,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !file.type.startsWith("image/")) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      if (editorRef.current) {
        const img = document.createElement("img")
        img.src = imageUrl
        img.style.maxWidth = "100%"
        img.style.height = "auto"
        img.style.display = "block"
        img.style.margin = "1rem 0"
        
        const selection = window.getSelection()
        if (selection?.rangeCount) {
          const range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(img)
          
          // Move cursor after image
          range.setStartAfter(img)
          range.collapse(true)
          selection.removeAllRanges()
          selection.addRange(range)
        } else {
          editorRef.current.appendChild(img)
        }
        
        editorRef.current.focus()
        handleInput()
      }
    }
    reader.readAsDataURL(file)
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleInsertTable = () => {
    if (!editorRef.current) return

    const rows = prompt("Number of rows (1-10):", "3")
    const cols = prompt("Number of columns (1-10):", "3")
    
    if (!rows || !cols) return

    const rowCount = Math.min(Math.max(parseInt(rows) || 3, 1), 10)
    const colCount = Math.min(Math.max(parseInt(cols) || 3, 1), 10)

    const table = document.createElement("table")
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.margin = "1rem 0"

    // Create header row
    const thead = document.createElement("thead")
    const headerRow = document.createElement("tr")
    for (let i = 0; i < colCount; i++) {
      const th = document.createElement("th")
      th.textContent = `Header ${i + 1}`
      th.style.border = "1px solid hsl(var(--border))"
      th.style.padding = "0.5rem"
      th.style.backgroundColor = "hsl(var(--muted))"
      th.style.fontWeight = "600"
      headerRow.appendChild(th)
    }
    thead.appendChild(headerRow)
    table.appendChild(thead)

    // Create body rows
    const tbody = document.createElement("tbody")
    for (let i = 0; i < rowCount; i++) {
      const tr = document.createElement("tr")
      for (let j = 0; j < colCount; j++) {
        const td = document.createElement("td")
        td.textContent = `Cell ${i + 1},${j + 1}`
        td.style.border = "1px solid hsl(var(--border))"
        td.style.padding = "0.5rem"
        tr.appendChild(td)
      }
      tbody.appendChild(tr)
    }
    table.appendChild(tbody)

    // Insert table at cursor position
    const selection = window.getSelection()
    if (selection?.rangeCount) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      range.insertNode(table)
      
      // Add a paragraph after table for easier editing
      const p = document.createElement("p")
      p.innerHTML = "<br>"
      range.setStartAfter(table)
      range.insertNode(p)
      range.setStart(p, 0)
      range.collapse(true)
      selection.removeAllRanges()
      selection.addRange(range)
    } else {
      editorRef.current.appendChild(table)
      const p = document.createElement("p")
      p.innerHTML = "<br>"
      editorRef.current.appendChild(p)
    }

    editorRef.current.focus()
    handleInput()
  }

  const handleInsertHTML = () => {
    const html = prompt("Paste your HTML code:")
    if (!html) return

    if (editorRef.current) {
      const selection = window.getSelection()
      if (selection?.rangeCount) {
        const range = selection.getRangeAt(0)
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        const fragment = document.createDocumentFragment()
        while (tempDiv.firstChild) {
          fragment.appendChild(tempDiv.firstChild)
        }
        range.deleteContents()
        range.insertNode(fragment)
        
        // Move cursor to end
        range.setStartAfter(fragment.lastChild || fragment)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        while (tempDiv.firstChild) {
          editorRef.current.appendChild(tempDiv.firstChild)
        }
      }
      
      editorRef.current.focus()
      handleInput()
    }
  }

  return (
    <div
      className={cn(
        "rounded-md border border-input bg-background shadow-sm",
        "focus-within:ring-ring focus-within:ring-[3px] focus-within:ring-offset-0",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-input p-2">
        <button
          type="button"
          onClick={() => handleFormat("bold")}
          className="rounded px-2 py-1 text-sm font-bold hover:bg-accent transition-colors"
          title="Bold (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat("italic")}
          className="rounded px-2 py-1 text-sm italic hover:bg-accent transition-colors"
          title="Italic (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => handleFormat("underline")}
          className="rounded px-2 py-1 text-sm underline hover:bg-accent transition-colors"
          title="Underline (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button
          type="button"
          onClick={() => handleFormat("formatBlock", "h1")}
          className="rounded px-2 py-1 text-base font-bold hover:bg-accent transition-colors"
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => handleFormat("formatBlock", "h2")}
          className="rounded px-2 py-1 text-sm font-semibold hover:bg-accent transition-colors"
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => handleFormat("formatBlock", "h3")}
          className="rounded px-2 py-1 text-xs font-semibold hover:bg-accent transition-colors"
          title="Heading 3"
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => handleFormat("formatBlock", "p")}
          className="rounded px-2 py-1 text-sm hover:bg-accent transition-colors"
          title="Paragraph"
        >
          P
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button
          type="button"
          onClick={() => handleFormat("insertUnorderedList")}
          className="rounded px-2 py-1 text-sm hover:bg-accent transition-colors"
          title="Bullet List"
        >
          • List
        </button>
        <button
          type="button"
          onClick={() => handleFormat("insertOrderedList")}
          className="rounded px-2 py-1 text-sm hover:bg-accent transition-colors"
          title="Numbered List"
        >
          1. List
        </button>
        <div className="mx-1 h-6 w-px bg-border" />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="rounded px-2 py-1 text-sm hover:bg-accent transition-colors flex items-center gap-1"
          title="Insert Image"
        >
          <ImageIcon className="h-4 w-4" />
          <span>Image</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          aria-label="Upload image"
        />
        <div className="mx-1 h-6 w-px bg-border" />
        <button
          type="button"
          onClick={handleInsertTable}
          className="rounded px-2 py-1 text-sm hover:bg-accent transition-colors flex items-center gap-1"
          title="Insert Table"
        >
          <TableIcon className="h-4 w-4" />
          <span>Table</span>
        </button>
        <button
          type="button"
          onClick={handleInsertHTML}
          className="rounded px-2 py-1 text-sm hover:bg-accent transition-colors flex items-center gap-1"
          title="Insert Custom HTML"
        >
          <Code className="h-4 w-4" />
          <span>HTML</span>
        </button>
      </div>

      {/* Editor */}
      <div className="relative">
        <style dangerouslySetInnerHTML={{
          __html: `
            .rich-editor-content h1 {
              font-size: 2em !important;
              font-weight: bold !important;
              margin: 1em 0 0.5em 0 !important;
              line-height: 1.2 !important;
              display: block !important;
            }
            .rich-editor-content h2 {
              font-size: 1.5em !important;
              font-weight: bold !important;
              margin: 0.8em 0 0.4em 0 !important;
              line-height: 1.3 !important;
              display: block !important;
            }
            .rich-editor-content h3 {
              font-size: 1.25em !important;
              font-weight: 600 !important;
              margin: 0.6em 0 0.3em 0 !important;
              line-height: 1.4 !important;
              display: block !important;
            }
            .rich-editor-content ul,
            .rich-editor-content ol {
              margin: 0.5em 0 !important;
              padding-left: 2em !important;
              display: block !important;
            }
            .rich-editor-content ul {
              list-style-type: disc !important;
            }
            .rich-editor-content ol {
              list-style-type: decimal !important;
            }
            .rich-editor-content li {
              margin: 0.25em 0 !important;
              display: list-item !important;
            }
            .rich-editor-content img {
              max-width: 100% !important;
              height: auto !important;
              display: block !important;
              margin: 1rem 0 !important;
              border-radius: 0.375rem !important;
            }
            .rich-editor-content table {
              width: 100% !important;
              border-collapse: collapse !important;
              margin: 1.5rem 0 !important;
              border: 1px solid hsl(var(--border)) !important;
              border-radius: 0.375rem !important;
              overflow: hidden !important;
              box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
            }
            .rich-editor-content table thead {
              background-color: hsl(var(--muted)) !important;
            }
            .rich-editor-content table td,
            .rich-editor-content table th {
              border: 1px solid hsl(var(--border)) !important;
              padding: 0.75rem 0.625rem 0.75rem 1rem !important;
              text-align: left !important;
              vertical-align: top !important;
            }
            .rich-editor-content table th {
              background-color: hsl(var(--muted)) !important;
              font-weight: 600 !important;
              color: hsl(var(--foreground)) !important;
            }
            .rich-editor-content table tbody tr {
              transition: background-color 0.15s ease !important;
            }
            .rich-editor-content table tbody tr:hover {
              background-color: hsl(var(--muted) / 0.5) !important;
            }
            .rich-editor-content table tbody tr:nth-child(even) {
              background-color: hsl(var(--muted) / 0.3) !important;
            }
            .rich-editor-content table tbody tr:nth-child(even):hover {
              background-color: hsl(var(--muted) / 0.6) !important;
            }
            .rich-editor-content p {
              margin: 0.5em 0 !important;
              min-height: 1.5em !important;
            }
            .rich-editor-content p:first-child {
              margin-top: 0 !important;
            }
            .rich-editor-content p:last-child {
              margin-bottom: 0 !important;
            }
          `
        }} />
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={cn(
            "rich-editor-content min-h-[400px] w-full px-4 py-3 text-sm",
            "focus:outline-none",
            "[&_strong]:font-bold [&_b]:font-bold",
            "[&_em]:italic [&_i]:italic",
            "[&_u]:underline"
          )}
          data-placeholder={placeholder}
          suppressContentEditableWarning
        />
        {!value && !isFocused && (
          <div className="pointer-events-none absolute left-4 top-3 text-sm text-muted-foreground">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  )
}

