import { licenseDefinitions } from '@/data/license-stages'
import type { Client, ClientDocumentState, LicenseType } from '@/types'

import { resolveUrl } from './sse-client'
import type { ApiClient, PaginatedResponse } from './types'

const LICENSE_TYPE_MAP: Record<string, LicenseType> = {
  banking: 'banking',
  fintech: 'fintech',
  securities_firm: 'securities-firm',
  fund_management: 'fund-management',
  insurance: 'insurance',
}

function buildDefaultDocumentStates(licenseType: LicenseType): ClientDocumentState[] {
  const definition = licenseDefinitions.find((d) => d.type === licenseType)
  if (!definition) return []
  return definition.stages.flatMap((stage) =>
    stage.documents.map((doc) => ({
      documentId: doc.id,
      status: 'not-started' as const,
    }))
  )
}

export function apiClientToClient(ac: ApiClient): Client {
  const licenseType: LicenseType =
    LICENSE_TYPE_MAP[ac.finma_license_type ?? ''] ??
    LICENSE_TYPE_MAP[ac.pathway?.replace('finma_', '') ?? ''] ??
    'banking'

  return {
    id: ac.id,
    name: ac.contact_name || ac.company_name,
    company: ac.company_name,
    licenseType,
    currentStageIndex: ac.current_stage_index,
    documentStates: buildDefaultDocumentStates(licenseType),
    startDate: ac.created_at.split('T')[0],
    contactEmail: ac.contact_email,
  }
}

export async function listClients(): Promise<PaginatedResponse<ApiClient>> {
  const url = resolveUrl('/api/clients')
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch clients')
  return res.json()
}

export async function getApiClient(id: string): Promise<ApiClient | undefined> {
  const url = resolveUrl(`/api/clients/${id}`)
  const res = await fetch(url)
  if (!res.ok) return undefined
  return res.json()
}
