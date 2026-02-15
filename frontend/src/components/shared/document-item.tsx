'use client'

import { RefreshCw, Upload } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { statusConfig } from '@/lib/constants/status'
import { cn } from '@/lib/utils'
import type { ClientDocumentState, RequiredDocument } from '@/types'

interface DocumentItemProps {
  document: RequiredDocument
  state: ClientDocumentState | undefined
  onUpload: (docId: string, fileName: string) => void
  onReset: (docId: string) => void
}

export function DocumentItem({ document, state, onUpload, onReset }: DocumentItemProps) {
  const status = state?.status ?? 'not-started'
  const config = statusConfig[status]

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div className="min-w-0 flex-1 space-y-1">
        <p className="text-sm font-medium leading-tight">{document.name}</p>
        <p className="text-muted-foreground text-xs">{document.description}</p>
        {state?.fileName && (
          <p className="text-muted-foreground truncate text-xs">File: {state.fileName}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Badge variant="secondary" className={cn('text-xs', config.className)}>
          {config.label}
        </Badge>
        {status === 'not-started' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpload(document.id, `${document.id}-${Date.now()}.pdf`)}
          >
            <Upload className="mr-1 h-3 w-3" />
            Upload
          </Button>
        )}
        {(status === 'uploaded' || status === 'rejected') && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpload(document.id, `${document.id}-${Date.now()}.pdf`)}
          >
            <RefreshCw className="mr-1 h-3 w-3" />
            Replace
          </Button>
        )}
      </div>
    </div>
  )
}
