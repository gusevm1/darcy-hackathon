import type { ApiClient, PaginatedResponse } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

const MOCK_CLIENTS: ApiClient[] = [
  {
    id: 'thomas-muller',
    company_name: 'Alpine Digital Bank AG',
    status: 'in_progress',
    pathway: 'finma_banking',
    created_at: '2025-06-01T00:00:00Z',
    updated_at: '2025-10-15T00:00:00Z',
  },
  {
    id: 'sara-brunner',
    company_name: 'ZuriPay Fintech GmbH',
    status: 'in_progress',
    pathway: 'finma_fintech',
    created_at: '2025-09-15T00:00:00Z',
    updated_at: '2025-10-10T00:00:00Z',
  },
  {
    id: 'marco-rossi',
    company_name: 'Helvetia Securities AG',
    status: 'in_progress',
    pathway: 'finma_securities',
    created_at: '2025-03-01T00:00:00Z',
    updated_at: '2025-10-01T00:00:00Z',
  },
  {
    id: 'elena-fischer',
    company_name: 'Swiss Capital Funds AG',
    status: 'in_progress',
    pathway: 'finma_fund_management',
    created_at: '2025-05-10T00:00:00Z',
    updated_at: '2025-09-20T00:00:00Z',
  },
  {
    id: 'lukas-weber',
    company_name: 'Edelweiss Insurance AG',
    status: 'intake',
    pathway: 'finma_insurance',
    created_at: '2025-11-01T00:00:00Z',
    updated_at: '2025-11-01T00:00:00Z',
  },
]

export async function listClients(): Promise<PaginatedResponse<ApiClient>> {
  if (!API_URL) {
    return {
      items: MOCK_CLIENTS,
      total: MOCK_CLIENTS.length,
      skip: 0,
      limit: 50,
    }
  }
  const res = await fetch(`${API_URL}/api/clients`)
  if (!res.ok) throw new Error('Failed to fetch clients')
  return res.json()
}

export async function getApiClient(id: string): Promise<ApiClient | undefined> {
  if (!API_URL) {
    return MOCK_CLIENTS.find((c) => c.id === id)
  }
  const res = await fetch(`${API_URL}/api/clients/${id}`)
  if (!res.ok) return undefined
  return res.json()
}
