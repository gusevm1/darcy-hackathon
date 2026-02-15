'use client'

import { useState, useCallback } from 'react'
import type { ClientDocumentState } from '@/types'

export function useDocumentState(initialStates: ClientDocumentState[]) {
  const [documentStates, setDocumentStates] =
    useState<ClientDocumentState[]>(initialStates)

  const uploadDocument = useCallback((docId: string, fileName: string) => {
    setDocumentStates((prev) =>
      prev.map((s) =>
        s.documentId === docId
          ? {
              ...s,
              status: 'uploaded' as const,
              fileName,
              uploadedAt: new Date().toISOString(),
            }
          : s,
      ),
    )
  }, [])

  const resetDocument = useCallback((docId: string) => {
    setDocumentStates((prev) =>
      prev.map((s) =>
        s.documentId === docId
          ? {
              documentId: s.documentId,
              status: 'not-started' as const,
            }
          : s,
      ),
    )
  }, [])

  return { documentStates, uploadDocument, resetDocument }
}
