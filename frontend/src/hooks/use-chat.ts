'use client'

import { useCallback, useRef, useState } from 'react'

import { streamChat } from '@/lib/api'
import type { ChatMessage, Citation } from '@/types'

interface UseChatReturn {
  messages: ChatMessage[]
  isStreaming: boolean
  error: string | null
  sendMessage: (content: string) => Promise<void>
  clearMessages: () => void
}

let messageIdCounter = 0
function generateId(): string {
  messageIdCounter++
  return `msg-${Date.now()}-${messageIdCounter}`
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isStreaming) return

      setError(null)

      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: content.trim(),
        createdAt: new Date(),
      }

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: '',
        citations: [],
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, userMessage, assistantMessage])
      setIsStreaming(true)

      try {
        const chatHistory = [
          ...messages.map((m) => ({ role: m.role, content: m.content })),
          { role: 'user' as const, content: content.trim() },
        ]

        const stream = streamChat(chatHistory)
        const reader = stream.getReader()

        let fullContent = ''
        const citations: Citation[] = []

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          try {
            const parsed = JSON.parse(value)

            if (parsed.type === 'text' && parsed.content) {
              fullContent += parsed.content
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    content: fullContent,
                  }
                }
                return updated
              })
            } else if (parsed.type === 'citation') {
              citations.push({
                text: parsed.text || '',
                article: parsed.article || '',
              })
              setMessages((prev) => {
                const updated = [...prev]
                const last = updated[updated.length - 1]
                if (last.role === 'assistant') {
                  updated[updated.length - 1] = {
                    ...last,
                    citations: [...citations],
                  }
                }
                return updated
              })
            }
          } catch {
            fullContent += value
            setMessages((prev) => {
              const updated = [...prev]
              const last = updated[updated.length - 1]
              if (last.role === 'assistant') {
                updated[updated.length - 1] = {
                  ...last,
                  content: fullContent,
                }
              }
              return updated
            })
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to send message')
        setMessages((prev) =>
          prev.filter((m) => m.id !== assistantMessage.id),
        )
      } finally {
        setIsStreaming(false)
      }
    },
    [messages, isStreaming],
  )

  const clearMessages = useCallback(() => {
    abortRef.current?.abort()
    setMessages([])
    setError(null)
    setIsStreaming(false)
  }, [])

  return { messages, isStreaming, error, sendMessage, clearMessages }
}
