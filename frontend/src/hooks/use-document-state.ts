'use client'

import { useCallback, useEffect, useState } from 'react'

import { toast } from 'sonner'

import {
  type BackendDocument,
  listDocuments,
  uploadDocument,
  deleteDocument as apiDeleteDocument,
  verifyDocument,
} from '@/lib/api/client-documents'
import type { ClientDocumentState, DocumentStatus } from '@/types'

function backendStatusToFrontend(status: string): DocumentStatus {
  switch (status) {
    case 'pending':
      return 'pending'
    case 'verified':
      return 'verified'
    case 'rejected':
      return 'rejected'
    case 'error':
      return 'error'
    default:
      return 'uploaded'
  }
}

function mergeBackendDocs(
  localStates: ClientDocumentState[],
  backendDocs: BackendDocument[]
): ClientDocumentState[] {
  const backendMap = new Map(backendDocs.map((d) => [d.document_id, d]))
  return localStates.map((s) => {
    const bd = backendMap.get(s.documentId)
    if (bd) {
      return {
        documentId: s.documentId,
        status: backendStatusToFrontend(bd.status),
        fileName: bd.file_name,
        uploadedAt: bd.uploaded_at,
      }
    }
    return s
  })
}

export function useDocumentState(initialStates: ClientDocumentState[], clientId: string) {
  const [documentStates, setDocumentStates] = useState<ClientDocumentState[]>(initialStates)
  const [uploading, setUploading] = useState<Set<string>>(new Set())

  // Sync with backend on mount and when clientId changes
  useEffect(() => {
    let cancelled = false
    listDocuments(clientId)
      .then((backendDocs) => {
        if (!cancelled) {
          setDocumentStates((prev) => mergeBackendDocs(prev, backendDocs))
        }
      })
      .catch(() => {
        // Backend unavailable — keep local state
      })
    return () => {
      cancelled = true
    }
  }, [clientId])

  const handleUpload = useCallback(
    async (docId: string, file: File) => {
      setUploading((prev) => new Set(prev).add(docId))
      // Optimistic local update
      setDocumentStates((prev) =>
        prev.map((s) =>
          s.documentId === docId
            ? { ...s, status: 'pending' as const, fileName: file.name }
            : s
        )
      )
      try {
        const uploaded = await uploadDocument(clientId, docId, file)
        // Trigger verification
        verifyDocument(clientId, docId)
          .then((verified) => {
            setDocumentStates((prev) =>
              prev.map((s) =>
                s.documentId === docId
                  ? {
                      documentId: s.documentId,
                      status: backendStatusToFrontend(verified.status),
                      fileName: verified.file_name,
                      uploadedAt: verified.uploaded_at,
                    }
                  : s
              )
            )
          })
          .catch(() => {
            // If verify call fails, mark as uploaded (file is still stored)
            setDocumentStates((prev) =>
              prev.map((s) =>
                s.documentId === docId
                  ? { ...s, status: 'uploaded' as const }
                  : s
              )
            )
            toast.error('Document verification failed. The file was uploaded but could not be verified.')
          })

        // Update with upload response immediately
        setDocumentStates((prev) =>
          prev.map((s) =>
            s.documentId === docId
              ? {
                  documentId: s.documentId,
                  status: 'pending' as const,
                  fileName: uploaded.file_name,
                  uploadedAt: uploaded.uploaded_at,
                }
              : s
          )
        )
      } catch {
        // Revert on failure
        setDocumentStates((prev) =>
          prev.map((s) =>
            s.documentId === docId ? { documentId: s.documentId, status: 'not-started' as const } : s
          )
        )
        toast.error('Document upload failed. Please try again.')
      } finally {
        setUploading((prev) => {
          const next = new Set(prev)
          next.delete(docId)
          return next
        })
      }
    },
    [clientId]
  )

  const resetDocument = useCallback(
    async (docId: string) => {
      setDocumentStates((prev) =>
        prev.map((s) =>
          s.documentId === docId ? { documentId: s.documentId, status: 'not-started' as const } : s
        )
      )
      try {
        await apiDeleteDocument(clientId, docId)
      } catch {
        // Ignore — local state is already reset
      }
    },
    [clientId]
  )

  return { documentStates, uploadDocument: handleUpload, resetDocument, uploading }
}
