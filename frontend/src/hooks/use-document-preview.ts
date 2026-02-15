'use client'

import { useCallback, useState } from 'react'

import type { DocumentPreview } from '@/types/assistant'

export function useDocumentPreview() {
  const [previewDocument, setPreviewDocument] =
    useState<DocumentPreview | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const handlePreviewOpenChange = useCallback((open: boolean) => {
    setPreviewOpen(open)
  }, [])

  return {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange,
  }
}
