'use client'

import { useRef, useState } from 'react'
import { CheckCircle2, Eye, Loader2, RefreshCw, Upload, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { downloadDocument } from '@/lib/api/client-documents'
import { statusConfig } from '@/lib/constants/status'
import { cn } from '@/lib/utils'
import type { ClientDocumentState, RequiredDocument } from '@/types'

interface DocumentItemProps {
  document: RequiredDocument
  state: ClientDocumentState | undefined
  onUpload: (docId: string, file: File) => void
  onReset: (docId: string) => void
  isUploading?: boolean
  clientId: string
}

export function DocumentItem({ document, state, onUpload, onReset, isUploading, clientId }: DocumentItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerContent, setViewerContent] = useState<string | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)
  const status = state?.status ?? 'not-started'
  const config = statusConfig[status]

  const handleView = async () => {
    setViewerOpen(true)
    setViewerLoading(true)
    setViewerContent(null)
    try {
      const blob = await downloadDocument(clientId, document.id)
      const text = await blob.text()
      setViewerContent(text)
    } catch {
      setViewerContent('Failed to load document.')
    } finally {
      setViewerLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload(document.id, file)
    }
    // Reset input so same file can be re-selected
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium leading-tight">{document.name}</p>
          <p className="text-muted-foreground text-xs">{document.description}</p>
          {document.finmaReference && (
            <p className="text-muted-foreground text-xs italic">{document.finmaReference}</p>
          )}
          {state?.fileName && (
            <p className="text-muted-foreground truncate text-xs">File: {state.fileName}</p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {/* Status icon for verified/rejected/error */}
          {status === 'verified' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
          {status === 'rejected' && <XCircle className="h-4 w-4 text-red-600" />}
          {status === 'error' && <XCircle className="h-4 w-4 text-red-600" />}

          <Badge variant="secondary" className={cn('text-xs', config.className)}>
            {isUploading || status === 'pending' ? (
              <span className="flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                {isUploading ? 'Uploading…' : config.label}
              </span>
            ) : (
              config.label
            )}
          </Badge>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.md,.csv,.doc,.docx"
            onChange={handleFileChange}
          />

          {status !== 'not-started' && (
            <Button variant="outline" size="sm" onClick={handleView}>
              <Eye className="mr-1 h-3 w-3" />
              View
            </Button>
          )}

          {status === 'not-started' && (
            <Button variant="outline" size="sm" onClick={triggerFilePicker} disabled={isUploading}>
              <Upload className="mr-1 h-3 w-3" />
              Upload
            </Button>
          )}
          {(status === 'uploaded' || status === 'rejected' || status === 'error' || status === 'verified') && (
            <Button variant="outline" size="sm" onClick={triggerFilePicker} disabled={isUploading}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Replace
            </Button>
          )}
        </div>
      </div>

      <Dialog open={viewerOpen} onOpenChange={setViewerOpen}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>{document.name}</DialogTitle>
            <DialogDescription>{state?.fileName}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[65vh]">
            {viewerLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed font-mono p-4 bg-muted/50 rounded-md">
                {viewerContent}
              </pre>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
