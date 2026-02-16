import type { EHPComment } from '@/types'

import { resolveUrl } from './sse-client'

export async function listComments(
  clientId: string,
  documentId: string,
): Promise<EHPComment[]> {
  const res = await fetch(
    resolveUrl(`/api/ehp/${clientId}/${documentId}`),
  )
  if (!res.ok) return []
  return res.json()
}

export async function addComment(
  clientId: string,
  documentId: string,
  body: { author: string; role: string; content: string },
): Promise<EHPComment> {
  const res = await fetch(
    resolveUrl(`/api/ehp/${clientId}/${documentId}`),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    },
  )
  if (!res.ok) throw new Error('Failed to add comment')
  return res.json()
}

export async function resolveComment(
  commentId: string,
): Promise<EHPComment> {
  const res = await fetch(
    resolveUrl(`/api/ehp/${commentId}/resolve`),
    { method: 'PATCH' },
  )
  if (!res.ok) throw new Error('Failed to resolve comment')
  return res.json()
}

export async function generateComments(
  clientId: string,
  documentId: string,
  documentName?: string,
  documentDescription?: string,
): Promise<EHPComment[]> {
  const res = await fetch(
    resolveUrl(`/api/ehp/${clientId}/${documentId}/generate`),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        document_name: documentName ?? documentId,
        document_description: documentDescription ?? '',
      }),
    },
  )
  if (!res.ok) return []
  return res.json()
}
