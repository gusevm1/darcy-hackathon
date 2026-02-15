import { resolveUrl } from './sse-client'

export interface BackendDocument {
  id: string
  client_id: string
  document_id: string
  file_name: string
  file_path: string
  content_type: string
  file_size: number
  status: 'pending' | 'verified' | 'rejected' | 'error'
  verification_result: string | null
  uploaded_at: string
  verified_at: string | null
}

export async function uploadDocument(
  clientId: string,
  documentId: string,
  file: File
): Promise<BackendDocument> {
  const form = new FormData()
  form.append('file', file)
  form.append('document_id', documentId)

  const url = resolveUrl(`/api/client-documents/${clientId}/upload`)
  const res = await fetch(url, { method: 'POST', body: form })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Upload failed (${res.status}): ${text}`)
  }
  return res.json()
}

export async function listDocuments(clientId: string): Promise<BackendDocument[]> {
  const url = resolveUrl(`/api/client-documents/${clientId}`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`List failed: ${res.status}`)
  return res.json()
}

export async function deleteDocument(
  clientId: string,
  documentId: string
): Promise<void> {
  const url = resolveUrl(`/api/client-documents/${clientId}/${documentId}`)
  const res = await fetch(url, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`)
}

export async function downloadDocument(
  clientId: string,
  documentId: string
): Promise<Blob> {
  const url = resolveUrl(`/api/client-documents/${clientId}/${documentId}/download`)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download failed: ${res.status}`)
  return res.blob()
}

export async function verifyDocument(
  clientId: string,
  documentId: string
): Promise<BackendDocument> {
  const url = resolveUrl(`/api/client-documents/${clientId}/${documentId}/verify`)
  const res = await fetch(url, { method: 'POST' })
  if (!res.ok) throw new Error(`Verify failed: ${res.status}`)
  return res.json()
}
