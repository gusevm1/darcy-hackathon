import type { BackendDocument } from '@/lib/api/client-documents'
import type { ClientDocumentState, DocumentStatus } from '@/types'

export function backendStatusToFrontend(status: string): DocumentStatus {
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

export function mergeBackendDocs(
  localStates: ClientDocumentState[],
  backendDocs: BackendDocument[],
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
