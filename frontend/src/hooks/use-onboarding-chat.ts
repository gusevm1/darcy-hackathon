'use client'

import { useCallback, useRef, useState } from 'react'

import { startOnboarding, streamOnboardingChat } from '@/lib/api/onboard'
import type { ChatMessage } from '@/types/assistant'

function generateId() {
  return crypto.randomUUID()
}

const welcomeMessage: ChatMessage = {
  id: 'onboard-welcome',
  role: 'assistant',
  content:
    "Welcome to the FINMA license onboarding process! I'm DarcyAI, your regulatory intake specialist.\n\nI'll guide you through determining which Swiss financial license you need and set up your personalized application roadmap. I have deep knowledge of all FINMA license types including **Banking**, **FinTech**, **Securities Firm**, **Fund Management**, and **Insurance** licenses.\n\nTo get started, please tell me:\n1. **Your company name** and planned legal structure\n2. **What financial services** you plan to offer in Switzerland",
  citations: [],
  timestamp: new Date(),
}

export function useOnboardingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const sessionIdRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isLoading) return

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        citations: [],
        timestamp: new Date(),
      }

      const placeholderId = generateId()
      const placeholderMsg: ChatMessage = {
        id: placeholderId,
        role: 'assistant',
        content: '',
        citations: [],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMsg, placeholderMsg])
      setIsLoading(true)

      try {
        if (!sessionIdRef.current) {
          const { sessionId } = await startOnboarding()
          sessionIdRef.current = sessionId
        }

        abortRef.current = new AbortController()

        await streamOnboardingChat(
          sessionIdRef.current,
          trimmed,
          {
            onText(chunk) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === placeholderId ? { ...m, content: m.content + chunk } : m,
                ),
              )
            },
            onError(err) {
              setMessages((prev) =>
                prev.map((m) =>
                  m.id === placeholderId
                    ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
                    : m,
                ),
              )
              console.error('Onboarding SSE error:', err)
            },
          },
          abortRef.current.signal,
        )
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? {
                  ...m,
                  content: m.content || 'Sorry, I encountered an error. Please try again.',
                }
              : m,
          ),
        )
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [isLoading],
  )

  return { messages, sendMessage, isLoading }
}
