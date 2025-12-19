"use client"

import { cn } from "@/lib/utils"

interface ReadOnlyEditorProps {
  content?: string | null
  className?: string
  maxHeight?: string
}

export function ReadOnlyEditor({
  content,
  className,
  maxHeight,
}: ReadOnlyEditorProps) {
  if (!content) return null

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .readonly-editor-content h1 {
            font-size: 2em !important;
            font-weight: bold !important;
            margin: 1em 0 0.5em 0 !important;
            line-height: 1.2 !important;
          }
          .readonly-editor-content h2 {
            font-size: 1.5em !important;
            font-weight: bold !important;
            margin: 0.8em 0 0.4em 0 !important;
            line-height: 1.3 !important;
          }
          .readonly-editor-content h3 {
            font-size: 1.25em !important;
            font-weight: 600 !important;
            margin: 0.6em 0 0.3em 0 !important;
            line-height: 1.4 !important;
          }
          .readonly-editor-content ul,
          .readonly-editor-content ol {
            margin: 0.5em 0 !important;
            padding-left: 2em !important;
          }
          .readonly-editor-content ul {
            list-style-type: disc !important;
          }
          .readonly-editor-content ol {
            list-style-type: decimal !important;
          }
          .readonly-editor-content li {
            margin: 0.25em 0 !important;
          }
          .readonly-editor-content img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 1rem 0 !important;
            border-radius: 0.375rem !important;
          }
          .readonly-editor-content table {
            width: 100% !important;
            border-collapse: collapse !important;
            margin: 1.5rem 0 !important;
            border: 1px solid hsl(var(--border)) !important;
            border-radius: 0.375rem !important;
            overflow: hidden !important;
            box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1) !important;
          }
          .readonly-editor-content table thead {
            background-color: hsl(var(--muted)) !important;
          }
          .readonly-editor-content table td,
          .readonly-editor-content table th {
            border: 1px solid hsl(var(--border)) !important;
            padding: 0.75rem 0.625rem 0.75rem 1rem !important;
            text-align: left !important;
            vertical-align: top !important;
          }
          .readonly-editor-content table th {
            background-color: hsl(var(--muted)) !important;
            font-weight: 600 !important;
            color: hsl(var(--foreground)) !important;
          }
          .readonly-editor-content table tbody tr {
            transition: background-color 0.15s ease !important;
          }
          .readonly-editor-content table tbody tr:hover {
            background-color: hsl(var(--muted) / 0.5) !important;
          }
          .readonly-editor-content table tbody tr:nth-child(even) {
            background-color: hsl(var(--muted) / 0.3) !important;
          }
          .readonly-editor-content table tbody tr:nth-child(even):hover {
            background-color: hsl(var(--muted) / 0.6) !important;
          }
          .readonly-editor-content p {
            margin: 0.5em 0 !important;
          }
          .readonly-editor-content p:first-child {
            margin-top: 0 !important;
          }
          .readonly-editor-content p:last-child {
            margin-bottom: 0 !important;
          }
        `
      }} />
      <div
        className={cn("readonly-editor-content text-sm", className, maxHeight && "overflow-auto")}
        {...(maxHeight ? { style: { maxHeight } } : {})}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  )
}

