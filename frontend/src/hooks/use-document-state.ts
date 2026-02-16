'use client'

import { useCallback, useEffect, useState } from 'react'

import { toast } from 'sonner'

import {
  listDocuments,
  uploadDocument,
  deleteDocument as apiDeleteDocument,
  verifyDocument,
} from '@/lib/api/client-documents'
import { backendStatusToFrontend, mergeBackendDocs } from '@/lib/mappers'
import { validateUploadFile } from '@/lib/validation'
import type { ClientDocumentState } from '@/types'

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
      const check = validateUploadFile(file)
      if (!check.valid) {
        toast.error(check.error)
        return
      }
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
