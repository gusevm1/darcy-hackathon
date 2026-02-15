import { type SSECallbacks, streamSSE } from './sse-client'
import type { ConsultMessage, ConsultResponse, GapAnalysis, NextStep } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function sendConsultMessage(
  message: string,
  history: ConsultMessage[],
  clientId?: string
): Promise<ConsultResponse> {
  if (!API_URL) {
    const { matchCannedResponse } = await import('./mock-data')
    const matched = matchCannedResponse(message)
    return {
      message: { role: 'assistant', content: matched.content },
      citations: matched.citationDocIds,
    }
  }
  const res = await fetch(`${API_URL}/api/consult/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, clientId }),
  })
  if (!res.ok) throw new Error('Failed to send consult message')
  return res.json()
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
  const res = await fetch(`${API_URL}/api/consult/analyze-gaps/${clientId}`, {
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
  const res = await fetch(`${API_URL}/api/consult/next-steps/${clientId}`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to get next steps')
  return res.json()
}

export function streamConsultChat(
  message: string,
  callbacks: SSECallbacks,
  clientId?: string,
  signal?: AbortSignal
) {
  return streamSSE(
    '/api/consult/chat',
    { message, ...(clientId ? { client_id: clientId } : {}) },
    callbacks,
    signal
  )
}
