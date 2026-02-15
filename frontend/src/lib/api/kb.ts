import { resolveUrl } from './sse-client'
import type { KBDocument, KBSearchResult, PaginatedResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const MOCK_KB_DOCUMENTS: KBDocument[] = [
  { doc_id: 'kb-1', title: 'FINMA Licensing Overview', source: 'FINMA' },
  { doc_id: 'kb-2', title: 'Banking Act (BankA) Summary', source: 'Federal Assembly' },
  { doc_id: 'kb-3', title: 'AML/KYC Best Practices', source: 'FINMA' },
  { doc_id: 'kb-4', title: 'Capital Adequacy Requirements', source: 'FINMA' },
  { doc_id: 'kb-5', title: 'Insurance Supervision Act (ISA)', source: 'Federal Assembly' },
  { doc_id: 'kb-6', title: 'FinTech License Guide', source: 'FINMA' },
  { doc_id: 'kb-7', title: 'Risk Management Framework Template', source: 'Internal' },
  { doc_id: 'kb-8', title: 'Corporate Governance Circular 2017/1', source: 'FINMA' },
  { doc_id: 'kb-9', title: 'Outsourcing Guidelines', source: 'FINMA' },
  { doc_id: 'kb-10', title: 'Swiss Solvency Test (SST)', source: 'FINMA' },
]

export async function searchKB(query: string, topK = 5): Promise<KBSearchResult[]> {
  if (!API_URL) {
    const lower = query.toLowerCase()
    return MOCK_KB_DOCUMENTS.map((doc) => ({
      text: `Summary content for ${doc.title}...`,
      title: doc.title,
      source: doc.source,
      doc_id: doc.doc_id,
      score: (doc.title.toLowerCase().includes(lower) ? 0.8 : 0) + Math.random() * 0.2,
    }))
      .filter((r) => r.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }
  const res = await fetch(resolveUrl('/api/kb/search'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: topK }),
  })
  if (!res.ok) throw new Error('Failed to search knowledge base')
  return res.json()
}

export async function listDocuments(skip = 0, limit = 20): Promise<PaginatedResponse<KBDocument>> {
  if (!API_URL) {
    const items = MOCK_KB_DOCUMENTS.slice(skip, skip + limit)
    return { items, total: MOCK_KB_DOCUMENTS.length, skip, limit }
  }
  const url = `${resolveUrl('/api/kb/documents')}?skip=${skip}&limit=${limit}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to list documents')
  return res.json()
}
