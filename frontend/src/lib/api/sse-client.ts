const API_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export interface SSECallbacks {
  onText?: (chunk: string) => void
  onToolUse?: (tool: string, input: Record<string, unknown>) => void
  onDone?: () => void
  onError?: (error: Error) => void
}

export async function streamSSE(
  path: string,
  body: Record<string, unknown>,
  callbacks: SSECallbacks,
  signal?: AbortSignal
): Promise<void> {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  })

  if (!res.ok) {
    callbacks.onError?.(new Error(`SSE request failed: ${res.status}`))
    return
  }

  const reader = res.body?.getReader()
  if (!reader) {
    callbacks.onError?.(new Error('No response body'))
    return
  }

  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data:')) continue
        const data = line.slice(5).trim()
        if (!data || data === '[DONE]') continue

        try {
          const event = JSON.parse(data) as {
            type: string
            content?: string
            tool?: string
            input?: Record<string, unknown>
          }
          switch (event.type) {
            case 'text':
              callbacks.onText?.(event.content ?? '')
              break
            case 'tool_use':
              callbacks.onToolUse?.(event.tool ?? '', event.input ?? {})
              break
            case 'done':
              callbacks.onDone?.()
              break
          }
        } catch {
          // skip malformed JSON lines
        }
      }
    }
    callbacks.onDone?.()
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      callbacks.onError?.(err as Error)
    }
  }
}
