import { type SSECallbacks, streamSSE } from './sse-client'
import type { OnboardingMessage } from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function startOnboarding(): Promise<{ sessionId: string }> {
  if (!API_URL) {
    return { sessionId: crypto.randomUUID() }
  }
  const res = await fetch(`${API_URL}/api/onboard/start`, { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start onboarding')
  const data = (await res.json()) as { client_id: string }
  return { sessionId: data.client_id }
}

export async function sendOnboardingMessage(
  sessionId: string,
  message: string
): Promise<OnboardingMessage> {
  if (!API_URL) {
    const responses = [
      'Thank you for your interest in obtaining a Swiss financial license. To get started, could you tell me about your company and the type of financial services you plan to offer?',
      "Based on what you've described, it sounds like you may need a banking license under the Banking Act (BankA). This requires minimum capital of CHF 10 million and a comprehensive organizational structure. Shall I walk you through the key requirements?",
      "Great. The first step is the Pre-Consultation phase where we'll prepare a preliminary assessment. You'll need to gather your business plan, organizational chart, and proof of capital. Would you like me to create a checklist of required documents?",
      "I've noted your requirements. The typical licensing process takes 6-12 months. I'll help you track progress through each stage. Is there anything specific about the regulatory requirements you'd like to discuss?",
    ]
    const response = responses[Math.floor(Math.random() * responses.length)]
    return { role: 'assistant', content: response }
  }
  const res = await fetch(`${API_URL}/api/onboard/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, message }),
  })
  if (!res.ok) throw new Error('Failed to send onboarding message')
  return res.json()
}

export function streamOnboardingChat(
  clientId: string,
  message: string,
  callbacks: SSECallbacks,
  signal?: AbortSignal
) {
  return streamSSE('/api/onboard/chat', { client_id: clientId, message }, callbacks, signal)
}
