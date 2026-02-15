import type { KBDocument, KBSearchResult, PaginatedResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const MOCK_KB_DOCUMENTS: KBDocument[] = [
  {
    id: 'kb-1',
    title: 'FINMA Licensing Overview',
    content: 'Overview of FINMA licensing requirements...',
    metadata: { category: 'regulation', source: 'FINMA' },
  },
  {
    id: 'kb-2',
    title: 'Banking Act (BankA) Summary',
    content: 'Summary of Swiss Banking Act requirements...',
    metadata: { category: 'legislation', source: 'Federal Assembly' },
  },
  {
    id: 'kb-3',
    title: 'AML/KYC Best Practices',
    content: 'Anti-money laundering and know-your-customer guidelines...',
    metadata: { category: 'compliance', source: 'FINMA' },
  },
  {
    id: 'kb-4',
    title: 'Capital Adequacy Requirements',
    content: 'Minimum capital requirements for different license types...',
    metadata: { category: 'regulation', source: 'FINMA' },
  },
  {
    id: 'kb-5',
    title: 'Insurance Supervision Act (ISA)',
    content: 'Overview of insurance licensing under ISA...',
    metadata: { category: 'legislation', source: 'Federal Assembly' },
  },
  {
    id: 'kb-6',
    title: 'FinTech License Guide',
    content: 'Guide to obtaining a fintech license under Art. 1b BankA...',
    metadata: { category: 'guide', source: 'FINMA' },
  },
  {
    id: 'kb-7',
    title: 'Risk Management Framework Template',
    content: 'Template for establishing a risk management framework...',
    metadata: { category: 'template', source: 'Internal' },
  },
  {
    id: 'kb-8',
    title: 'Corporate Governance Circular 2017/1',
    content: 'FINMA circular on corporate governance requirements...',
    metadata: { category: 'circular', source: 'FINMA' },
  },
  {
    id: 'kb-9',
    title: 'Outsourcing Guidelines',
    content:
      'Requirements for outsourcing arrangements in regulated entities...',
    metadata: { category: 'guideline', source: 'FINMA' },
  },
  {
    id: 'kb-10',
    title: 'Swiss Solvency Test (SST)',
    content: 'Overview of the Swiss Solvency Test for insurance companies...',
    metadata: { category: 'regulation', source: 'FINMA' },
  },
]

export async function searchKB(
  query: string,
  topK = 5,
): Promise<KBSearchResult[]> {
  if (!API_URL) {
    const lower = query.toLowerCase()
    return MOCK_KB_DOCUMENTS.map((doc) => ({
      document: doc,
      score:
        (doc.title.toLowerCase().includes(lower) ? 0.8 : 0) +
        (doc.content.toLowerCase().includes(lower) ? 0.5 : 0) +
        Math.random() * 0.2,
    }))
      .filter((r) => r.score > 0.1)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK)
  }
  const res = await fetch(`${API_URL}/api/kb/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, top_k: topK }),
  })
  if (!res.ok) throw new Error('Failed to search knowledge base')
  return res.json()
}

export async function listDocuments(
  skip = 0,
  limit = 20,
): Promise<PaginatedResponse<KBDocument>> {
  if (!API_URL) {
    const items = MOCK_KB_DOCUMENTS.slice(skip, skip + limit)
    return { items, total: MOCK_KB_DOCUMENTS.length, skip, limit }
  }
  const res = await fetch(
    `${API_URL}/api/kb/documents?skip=${skip}&limit=${limit}`,
  )
  if (!res.ok) throw new Error('Failed to list documents')
  return res.json()
}
