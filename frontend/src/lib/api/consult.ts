import type { ChatSession } from '@/types/assistant'

import { type SSECallbacks, resolveUrl, streamSSE } from './sse-client'
import type { GapAnalysis, NextStep } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

// ── Chat session persistence ──────────────────────────────

export async function createChatSession(
  clientId?: string,
): Promise<{ session_id: string }> {
  const res = await fetch(resolveUrl('/api/consult/sessions'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(clientId ? { client_id: clientId } : {}),
  })
  if (!res.ok) throw new Error('Failed to create session')
  return res.json()
}

export async function listChatSessions(
  clientId?: string,
): Promise<ChatSession[]> {
  const url = clientId
    ? `/api/consult/sessions?client_id=${clientId}`
    : '/api/consult/sessions'
  const res = await fetch(resolveUrl(url))
  if (!res.ok) return []
  const data = (await res.json()) as Array<{
    id: string
    client_id: string | null
    title: string
    messages: Array<{ role: string; content: string }>
    created_at: string
    updated_at: string
  }>
  return data.map((s) => ({
    id: s.id,
    title: s.title,
    messages: s.messages.map((m) => ({
      id: crypto.randomUUID(),
      role: m.role as 'user' | 'assistant',
      content: m.content,
      citations: [],
      timestamp: new Date(s.updated_at),
    })),
    createdAt: new Date(s.created_at),
    updatedAt: new Date(s.updated_at),
  }))
}

export async function getChatSession(
  sessionId: string,
): Promise<ChatSession | null> {
  const res = await fetch(
    resolveUrl(`/api/consult/sessions/${sessionId}`),
  )
  if (!res.ok) return null
  const s = (await res.json()) as {
    id: string
    title: string
    messages: Array<{ role: string; content: string }>
    created_at: string
    updated_at: string
  }
  return {
    id: s.id,
    title: s.title,
    messages: s.messages.map((m) => ({
      id: crypto.randomUUID(),
      role: m.role as 'user' | 'assistant',
      content: m.content,
      citations: [],
      timestamp: new Date(s.updated_at),
    })),
    createdAt: new Date(s.created_at),
    updatedAt: new Date(s.updated_at),
  }
}

export async function deleteChatSession(
  sessionId: string,
): Promise<void> {
  await fetch(resolveUrl(`/api/consult/sessions/${sessionId}`), {
    method: 'DELETE',
  })
}

export async function analyzeGaps(clientId: string): Promise<GapAnalysis> {
  if (!API_URL) {
    return {
      client_id: clientId,
      pathway: 'undetermined',
      readiness_score: 0,
      total_items: 0,
      completed_items: 0,
      gaps: [],
      next_steps: [],
      critical_blockers: [],
    }
  }
  const res = await fetch(resolveUrl(`/api/consult/analyze-gaps/${clientId}`), {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to analyze gaps')
  return res.json()
}

export async function getNextSteps(clientId: string): Promise<NextStep[]> {
  if (!API_URL) {
    return [
      {
        priority: 1,
        action: 'Upload missing documents',
        category: 'documentation',
        estimated_days: 14,
        depends_on: [],
        regulatory_reference: null,
      },
      {
        priority: 2,
        action: 'Review compliance checklist',
        category: 'compliance',
        estimated_days: 7,
        depends_on: [],
        regulatory_reference: null,
      },
      {
        priority: 3,
        action: 'Schedule FINMA consultation',
        category: 'regulatory',
        estimated_days: 30,
        depends_on: [],
        regulatory_reference: null,
      },
    ]
  }
  const res = await fetch(resolveUrl(`/api/consult/next-steps/${clientId}`), {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to get next steps')
  return res.json()
}

export interface ClientContext {
  name: string
  company: string
  licenseType: string
  currentStageName: string
  documentSummary: string
}

export function streamConsultChat(
  message: string,
  callbacks: SSECallbacks,
  clientId?: string,
  clientContext?: ClientContext,
  signal?: AbortSignal,
  conversationHistory?: Array<{ role: string; content: string }>,
  sessionId?: string,
) {
  return streamSSE(
    '/api/consult/chat',
    {
      message,
      ...(clientId ? { client_id: clientId } : {}),
      ...(clientContext ? { client_context: clientContext } : {}),
      ...(conversationHistory?.length
        ? { conversation_history: conversationHistory }
        : {}),
      ...(sessionId ? { session_id: sessionId } : {}),
    },
    callbacks,
    signal,
  )
}
