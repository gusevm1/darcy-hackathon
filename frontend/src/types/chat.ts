export interface Citation {
  text: string
  article: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  createdAt: Date
}

export type StreamEventType = 'text' | 'citation' | 'done' | 'error'

export interface StreamEvent {
  type: StreamEventType
  content?: string
  text?: string
  article?: string
}
