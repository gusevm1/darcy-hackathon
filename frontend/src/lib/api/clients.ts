import type { ApiClient } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function listClients(): Promise<ApiClient[]> {
  if (!API_URL) {
    const { clients } = await import('./mock-data')
    return clients
  }
  const res = await fetch(`${API_URL}/api/clients`)
  if (!res.ok) throw new Error('Failed to fetch clients')
  return res.json()
}

export async function getApiClient(
  id: string,
): Promise<ApiClient | undefined> {
  if (!API_URL) {
    const { getClient } = await import('./mock-data')
    return getClient(id)
  }
  const res = await fetch(`${API_URL}/api/clients/${id}`)
  if (!res.ok) return undefined
  return res.json()
}
