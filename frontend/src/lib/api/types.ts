// --- SSE Event Types (matching backend SSE JSON format) ---

export interface SSETextEvent {
  type: 'text'
  content: string
}

export interface SSEToolUseEvent {
  type: 'tool_use'
  tool: string
  input: Record<string, unknown>
}

export interface SSEDoneEvent {
  type: 'done'
}

export type SSEEvent = SSETextEvent | SSEToolUseEvent | SSEDoneEvent

// --- Knowledge Base (matching backend kb.py models) ---

export interface KBDocument {
  doc_id: string
  title: string
  source: string
}

export interface KBSearchResult {
  text: string
  title: string
  source: string
  doc_id: string
  score: number
}

// --- Client (matching backend clients.py ClientListItem) ---

export interface ApiClient {
  id: string
  company_name: string
  status: string
  pathway: string | null
  finma_license_type: string | null
  contact_name: string
  contact_email: string
  current_stage_index: number
  created_at: string
  updated_at: string
}

// --- Pagination (matching backend pagination.py) ---

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
}

// --- Gap Analysis (matching backend client.py GapAnalysis) ---

export interface Gap {
  category: string
  field_or_item: string
  description: string
  severity: 'missing' | 'incomplete' | 'needs_review'
}

export interface NextStep {
  priority: number
  action: string
  category: string
  estimated_days: number | null
  depends_on: string[]
  regulatory_reference: string | null
}

export interface GapAnalysis {
  client_id: string
  pathway: string
  readiness_score: number
  total_items: number
  completed_items: number
  gaps: Gap[]
  next_steps: NextStep[]
  critical_blockers: string[]
}

// --- Chat Messages ---

export interface OnboardingMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface OnboardingSession {
  id: string
  clientId?: string
  messages: OnboardingMessage[]
}

