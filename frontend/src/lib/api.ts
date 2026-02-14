import type {
  Checklist,
  ClassificationResult,
  JurisdictionInfo,
  JurisdictionsResponse,
  WizardAnswers,
} from '@/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

function snakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

function camelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function keysToSnake(obj: JsonValue): JsonValue {
  if (Array.isArray(obj)) return obj.map(keysToSnake)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [snakeCase(k), keysToSnake(v)]),
    )
  }
  return obj
}

function keysToCamel(obj: JsonValue): JsonValue {
  if (Array.isArray(obj)) return obj.map(keysToCamel)
  if (obj !== null && typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([k, v]) => [camelCase(k), keysToCamel(v)]),
    )
  }
  return obj
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  })

  if (!res.ok) {
    const error = await res.text().catch(() => 'Unknown error')
    throw new Error(`API error ${res.status}: ${error}`)
  }

  const json: JsonValue = await res.json()
  return keysToCamel(json) as T
}

export async function classifyBusiness(
  answers: WizardAnswers,
): Promise<ClassificationResult> {
  const payload = {
    business_role: answers.businessRole,
    token_type: answers.tokenType || 'other',
    services: answers.serviceTypes || [],
    fiat_handling: answers.handlesFiat,
    target_jurisdictions: answers.targetJurisdictions.map((j) =>
      j.toLowerCase(),
    ),
    establishment: answers.establishmentLocation,
    existing_licenses: answers.existingLicenses,
  }

  return apiFetch<ClassificationResult>('/api/classify', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function getJurisdictions(): Promise<JurisdictionInfo[]> {
  const data = await apiFetch<JurisdictionsResponse>('/api/jurisdictions')
  return data.jurisdictions
}

export async function generateChecklist(
  classification: ClassificationResult,
): Promise<Checklist> {
  return apiFetch<Checklist>('/api/checklist', {
    method: 'POST',
    body: JSON.stringify(keysToSnake(classification as unknown as JsonValue)),
  })
}

export function streamChat(
  messages: { role: string; content: string }[],
): ReadableStream<string> {
  return new ReadableStream<string>({
    async start(controller) {
      try {
        const res = await fetch(`${API_URL}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages }),
        })

        if (!res.ok) {
          controller.error(new Error(`Chat API error: ${res.status}`))
          return
        }

        const reader = res.body?.getReader()
        if (!reader) {
          controller.error(new Error('No response body'))
          return
        }

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6).trim()
              if (data === '[DONE]') {
                controller.close()
                return
              }
              if (data) {
                controller.enqueue(data)
              }
            }
          }
        }

        controller.close()
      } catch (error) {
        controller.error(error)
      }
    },
  })
}
