import type { ClientDocumentState, LicenseType } from '@/types'

export interface ApiClient {
  id: string
  name: string
  company: string
  licenseType: LicenseType
  currentStageIndex: number
  documentStates: ClientDocumentState[]
  startDate: string
  contactEmail: string
}

export interface KBDocument {
  id: string
  title: string
  content: string
  metadata: Record<string, string>
}

export interface KBSearchResult {
  document: KBDocument
  score: number
}

export interface GapAnalysis {
  clientId: string
  missingDocuments: string[]
  recommendations: string[]
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

export interface OnboardingSession {
  id: string
  clientId?: string
  messages: OnboardingMessage[]
}

export interface OnboardingMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ConsultMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ConsultResponse {
  message: ConsultMessage
  citations?: string[]
}

export interface NextStep {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}
