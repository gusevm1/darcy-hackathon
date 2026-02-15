import { type SSECallbacks, resolveUrl, streamSSE } from './sse-client'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function startOnboarding(): Promise<{ sessionId: string }> {
  if (!API_URL) {
    return { sessionId: crypto.randomUUID() }
  }
  const res = await fetch(resolveUrl('/api/onboard/start'), { method: 'POST' })
  if (!res.ok) throw new Error('Failed to start onboarding')
  const data = (await res.json()) as { client_id: string }
  return { sessionId: data.client_id }
}

export function streamOnboardingChat(
  clientId: string,
  message: string,
  callbacks: SSECallbacks,
  signal?: AbortSignal
) {
  return streamSSE('/api/onboard/chat', { client_id: clientId, message }, callbacks, signal)
}
