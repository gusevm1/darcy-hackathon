'use client'

import dynamic from 'next/dynamic'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  MessageSquare,
  Upload,
  XCircle,
} from 'lucide-react'

const PdfViewer = dynamic(
  () => import('./pdf-viewer').then((mod) => mod.PdfViewer),
  { ssr: false, loading: () => <Loader2 className="h-6 w-6 animate-spin" /> },
)

import { EHPCommentThread } from '@/components/shared/ehp-comment-thread'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { listComments } from '@/lib/api/ehp'
import { downloadDocument } from '@/lib/api/client-documents'
import { statusConfig } from '@/lib/constants/status'
import { cn } from '@/lib/utils'
import type { ClientDocumentState, DocumentStatus, EHPComment, RequiredDocument } from '@/types'

interface DocumentItemProps {
  document: RequiredDocument
  state: ClientDocumentState | undefined
  onUpload: (docId: string, file: File) => void
  onReset: (docId: string) => void
  isUploading?: boolean
  clientId: string
}

export function DocumentItem({
  document,
  state,
  onUpload,
  onReset,
  isUploading,
  clientId,
}: DocumentItemProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [viewerOpen, setViewerOpen] = useState(false)
  const [viewerContent, setViewerContent] = useState<string | null>(null)
  const [viewerLoading, setViewerLoading] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [comments, setComments] = useState<EHPComment[]>([])
  const [commentsLoading, setCommentsLoading] = useState(true)

  const rawStatus = state?.status ?? 'not-started'

  // Fetch comments from backend
  useEffect(() => {
    let cancelled = false
    setCommentsLoading(true)
    listComments(clientId, document.id)
      .then((data) => {
        if (!cancelled) {
          // Map backend field names to frontend
          setComments(
            data.map((c) => ({
              ...c,
              documentId: c.document_id ?? c.documentId ?? document.id,
            })),
          )
        }
      })
      .catch(() => {
        // Backend unavailable — empty comments
      })
      .finally(() => {
        if (!cancelled) setCommentsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [clientId, document.id])

  const handleCommentAdded = useCallback((comment: EHPComment) => {
    setComments((prev) => [
      ...prev,
      { ...comment, documentId: comment.document_id ?? comment.documentId },
    ])
  }, [])

  const handleCommentToggled = useCallback(
    (commentId: string, resolved: boolean) => {
      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? { ...c, resolved } : c)),
      )
    },
    [],
  )

  const unresolvedCount = comments.filter((c) => !c.resolved).length
  const hasComments = comments.length > 0

  // Derive display status from EHP comment feedback
  const status: DocumentStatus =
    hasComments && unresolvedCount === 0
      ? 'approved'
      : hasComments && unresolvedCount > 0
        ? 'under-review'
        : rawStatus
  const config = statusConfig[status]

  const isPdf = state?.fileName?.toLowerCase().endsWith('.pdf')

  const handleView = async () => {
    setViewerOpen(true)
    setViewerLoading(true)
    setViewerContent(null)
    setPdfUrl(null)
    try {
      const blob = await downloadDocument(clientId, document.id)
      if (isPdf) {
        const url = URL.createObjectURL(blob)
        setPdfUrl(url)
      } else {
        const text = await blob.text()
        setViewerContent(text)
      }
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
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const triggerFilePicker = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className="rounded-lg border">
        <div className="flex items-start justify-between gap-4 p-4">
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-sm font-medium leading-tight">{document.name}</p>
            <p className="text-muted-foreground text-xs">
              {document.description}
            </p>
            {document.finmaReference && (
              <p className="text-muted-foreground text-xs italic">
                {document.finmaReference}
              </p>
            )}
            {state?.fileName && (
              <p className="text-muted-foreground truncate text-xs">
                File: {state.fileName}
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {status === 'verified' && (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            {status === 'rejected' && (
              <XCircle className="h-4 w-4 text-red-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-4 w-4 text-red-600" />
            )}

            <Badge
              variant="secondary"
              className={cn('text-xs', config.className)}
            >
              {isUploading || status === 'pending' ? (
                <span className="flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  {isUploading ? 'Uploading\u2026' : config.label}
                </span>
              ) : (
                config.label
              )}
            </Badge>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.txt,.md,.csv,.doc,.docx"
              onChange={handleFileChange}
            />

            {/* Comments toggle button */}
            {!commentsLoading && hasComments && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommentsOpen(!commentsOpen)}
                className={cn(
                  'relative',
                  unresolvedCount > 0 && 'border-amber-300',
                )}
              >
                <MessageSquare className="mr-1 h-3 w-3" />
                {comments.length}
                {unresolvedCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-bold text-white">
                    {unresolvedCount}
                  </span>
                )}
                {commentsOpen ? (
                  <ChevronUp className="ml-1 h-3 w-3" />
                ) : (
                  <ChevronDown className="ml-1 h-3 w-3" />
                )}
              </Button>
            )}

            {status !== 'not-started' && (
              <Button variant="outline" size="sm" onClick={handleView}>
                <Eye className="mr-1 h-3 w-3" />
                View
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={triggerFilePicker}
              disabled={isUploading || status === 'approved'}
              className={cn(
                status === 'approved' && 'cursor-not-allowed opacity-50',
              )}
            >
              <Upload className="mr-1 h-3 w-3" />
              Upload
            </Button>
          </div>
        </div>

        {/* EHP Comment Thread (collapsible) */}
        {hasComments && commentsOpen && (
          <div className="border-t bg-muted/20 px-4 py-3">
            <EHPCommentThread
              comments={comments}
              documentName={document.name}
              clientId={clientId}
              documentId={document.id}
              onCommentAdded={handleCommentAdded}
              onCommentToggled={handleCommentToggled}
            />
          </div>
        )}
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
                <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
              </div>
            ) : pdfUrl ? (
              <PdfViewer url={pdfUrl} />
            ) : (
              <pre className="bg-muted/50 whitespace-pre-wrap break-words rounded-md p-4 font-mono text-sm leading-relaxed">
                {viewerContent}
              </pre>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  )
}
