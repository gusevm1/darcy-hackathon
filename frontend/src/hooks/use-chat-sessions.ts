'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import { toast } from 'sonner'

import { type ClientContext, streamConsultChat } from '@/lib/api/consult'
import { createSSECallbacks } from '@/lib/sse-callbacks'
import { validateChatMessage } from '@/lib/validation'
import type { ChatMessage, ChatSession } from '@/types/assistant'

import { useChatStorage, welcomeMessage } from './use-chat-storage'

function generateId() {
  return crypto.randomUUID()
}

export function useChatSessions(clientId?: string, clientContext?: ClientContext) {
  const { chats, setChats, activeChatId, setActiveChatId } = useChatStorage()
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? chats[0],
    [chats, activeChatId]
  )
  const messages = activeChat.messages

  const createNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [
        {
          ...welcomeMessage,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(newChat.id)
  }, [setChats, setActiveChatId])

  const switchChat = useCallback(
    (chatId: string) => {
      setActiveChatId(chatId)
    },
    [setActiveChatId]
  )

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

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId) return chat
          const isFirstUserMessage = !chat.messages.some((m) => m.role === 'user')
          return {
            ...chat,
            messages: [...chat.messages, userMsg, placeholderMsg],
            title: isFirstUserMessage
              ? trimmed.slice(0, 50) + (trimmed.length > 50 ? '...' : '')
              : chat.title,
            updatedAt: new Date(),
          }
        })
      )
      setIsLoading(true)

      try {
        abortRef.current = new AbortController()

        // Build conversation history (last 10 messages, excluding welcome + current)
        const history = activeChat.messages
          .filter((m) => m.id !== 'welcome' && m.content.trim())
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }))

        const callbacks = createSSECallbacks(
          placeholderId,
          (updater) =>
            setChats((prev) =>
              prev.map((chat) => {
                if (chat.id !== activeChatId) return chat
                return {
                  ...chat,
                  messages: chat.messages.map((m) =>
                    m.id === placeholderId ? { ...m, content: updater(m.content) } : m
                  ),
                }
              })
            ),
          'Consult',
        )

        await streamConsultChat(
          trimmed,
          callbacks,
          clientId,
          clientContext,
          abortRef.current.signal,
          history
        )
      } catch {
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id !== activeChatId) return chat
            return {
              ...chat,
              messages: chat.messages.map((m) =>
                m.id === placeholderId
                  ? { ...m, content: m.content || 'Sorry, I encountered an error. Please try again.' }
                  : m
              ),
            }
          })
        )
      } finally {
        setIsLoading(false)
        abortRef.current = null
      }
    },
    [activeChatId, clientId, clientContext, isLoading, activeChat.messages, setChats]
  )

  return {
    chats,
    activeChatId,
    messages,
    createNewChat,
    switchChat,
    sendMessage,
    isLoading,
  }
}
