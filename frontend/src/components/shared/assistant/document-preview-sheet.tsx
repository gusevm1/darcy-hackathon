'use client'

import { FileText } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { statusLabel, statusVariant } from '@/lib/constants/status'
import type { DocumentPreview } from '@/types/assistant'

import { PdfPage } from './pdf-page'

function splitIntoPages(content: string, charsPerPage = 1200): string[] {
  const paragraphs = content.split('\n\n')
  const pages: string[] = []
  let current = ''

  for (const paragraph of paragraphs) {
    if (current.length + paragraph.length > charsPerPage && current.length > 0) {
      pages.push(current.trim())
      current = paragraph
    } else {
      current = current ? `${current}\n\n${paragraph}` : paragraph
    }
  }

  if (current.trim()) {
    pages.push(current.trim())
  }

  return pages.length > 0 ? pages : ['']
}

interface DocumentPreviewSheetProps {
  document: DocumentPreview | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentPreviewSheet({ document, open, onOpenChange }: DocumentPreviewSheetProps) {
  if (!document) return null

  const pages = splitIntoPages(document.content)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col p-0 sm:max-w-2xl">
        <SheetHeader className="sr-only">
          <SheetTitle>{document.documentName}</SheetTitle>
          <SheetDescription>{document.description}</SheetDescription>
        </SheetHeader>

        {/* PDF toolbar */}
        <div className="bg-muted/50 flex shrink-0 items-center justify-between border-b px-4 py-2">
          <div className="flex items-center gap-2 pr-6">
            <FileText className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="truncate text-sm font-medium">{document.fileName}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground text-xs">
              {pages.length} {pages.length === 1 ? 'page' : 'pages'}
            </span>
            <span className="text-muted-foreground text-xs">100%</span>
            <Badge variant={statusVariant[document.status] ?? 'outline'} className="shrink-0">
              {statusLabel[document.status] ?? document.status}
            </Badge>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <div className="space-y-6 p-6">
            {/* Metadata card */}
            <div className="mx-auto max-w-[612px] rounded-sm border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-50">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Details
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Client</span>
                  <span className="font-medium text-gray-800">{document.clientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Company</span>
                  <span className="font-medium text-gray-800">{document.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Stage</span>
                  <span className="font-medium text-gray-800">{document.stageName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Category</span>
                  <span className="font-medium text-gray-800">{document.category}</span>
                </div>
              </div>
            </div>

            {/* Summary card */}
            <div className="mx-auto max-w-[612px] rounded-sm border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-50">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Summary
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">{document.summary}</p>
            </div>

            {/* Document pages */}
            {pages.map((pageContent, i) => (
              <PdfPage key={i} content={pageContent} pageNumber={i + 1} totalPages={pages.length} />
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
