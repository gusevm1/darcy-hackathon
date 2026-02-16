'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { toast } from 'sonner'

import { startOnboarding, streamOnboardingChat } from '@/lib/api/onboard'
import { createSSECallbacks } from '@/lib/sse-callbacks'
import { validateChatMessage } from '@/lib/validation'
import type { ChatMessage } from '@/types/assistant'

function generateId() {
  return crypto.randomUUID()
}

const STORAGE_KEY = 'onboarding-client-id'

const welcomeMessage: ChatMessage = {
  id: 'onboard-welcome',
  role: 'assistant',
  content:
    "Welcome to the FINMA license onboarding process! I'm your regulatory intake specialist.\n\nI'll guide you through determining which Swiss financial license you need and set up your personalized application roadmap. I have deep knowledge of all FINMA license types including **Banking**, **FinTech**, **Securities Firm**, **Fund Management**, and **Insurance** licenses.\n\nTo get started, please tell me:\n1. **Your company name** and planned legal structure\n2. **What financial services** you plan to offer in Switzerland",
  citations: [],
  timestamp: new Date(),
}

export function useOnboardingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [onboardingComplete, setOnboardingComplete] = useState(false)
  const [clientId, setClientId] = useState<string | null>(null)
  const sessionIdRef = useRef<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Resume session from localStorage on mount
  useEffect(() => {
    const storedId = localStorage.getItem(STORAGE_KEY)
    if (storedId) {
      sessionIdRef.current = storedId
      setClientId(storedId)
    }
  }, [])

  const startNew = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    sessionIdRef.current = null
    setClientId(null)
    setOnboardingComplete(false)
    setMessages([welcomeMessage])
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim()
      if (!trimmed || isLoading) return

      const check = validateChatMessage(trimmed)
      if (!check.valid) {
        toast.error(check.error)
        return
      }

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
          setClientId(sessionId)
          localStorage.setItem(STORAGE_KEY, sessionId)
        }

        abortRef.current = new AbortController()

        const callbacks = createSSECallbacks(
          placeholderId,
          (updater) =>
            setMessages((prev) =>
              prev.map((m) =>
                m.id === placeholderId
                  ? { ...m, content: updater(m.content) }
                  : m,
              ),
            ),
          'Onboarding',
        )

        // Detect mark_intake_complete tool call
        const originalOnToolUse = callbacks.onToolUse
        callbacks.onToolUse = (tool, input) => {
          originalOnToolUse?.(tool, input)
          if (tool === 'mark_intake_complete') {
            setOnboardingComplete(true)
            localStorage.removeItem(STORAGE_KEY)
          }
        }

        await streamOnboardingChat(
          sessionIdRef.current,
          trimmed,
          callbacks,
          abortRef.current.signal,
        )
      } catch {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === placeholderId
              ? {
                  ...m,
                  content:
                    m.content ||
                    'Sorry, I encountered an error. Please try again.',
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

  return {
    messages,
    sendMessage,
    isLoading,
    onboardingComplete,
    clientId,
    startNew,
  }
}
