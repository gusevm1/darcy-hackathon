'use client'

import { useRef } from 'react'
import { CheckCircle2, Eye, Loader2, RefreshCw, Upload, XCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
  const status = state?.status ?? 'not-started'
  const config = statusConfig[status]

  const handleView = async () => {
    try {
      const blob = await downloadDocument(clientId, document.id)
      const url = URL.createObjectURL(blob)
      window.open(url, '_blank')
    } catch {
      // Download failed — ignore silently
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
  )
}
