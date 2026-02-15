'use client'

import { useCallback, useRef, useState } from 'react'

import { sendOnboardingMessage, startOnboarding } from '@/lib/api/onboard'
import type { ChatMessage } from '@/types/assistant'

function generateId() {
  return crypto.randomUUID()
}

const welcomeMessage: ChatMessage = {
  id: 'onboard-welcome',
  role: 'assistant',
  content:
    "Welcome to the FINMA license onboarding process. I'll help you determine which Swiss financial licenses you need and guide you through the initial requirements. Tell me about your company and the financial services you plan to offer.",
  citations: [],
  timestamp: new Date(),
}

export function useOnboardingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const sessionIdRef = useRef<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim()
    if (!trimmed) return

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      citations: [],
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)

    try {
      if (!sessionIdRef.current) {
        const { sessionId } = await startOnboarding()
        sessionIdRef.current = sessionId
      }

      const response = await sendOnboardingMessage(sessionIdRef.current, trimmed)

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: response.content,
        citations: [],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        citations: [],
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { messages, sendMessage, isLoading }
}
