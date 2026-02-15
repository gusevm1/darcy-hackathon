'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import { type ClientContext, streamConsultChat } from '@/lib/api/consult'
import type { ChatMessage, ChatSession } from '@/types/assistant'

function generateId() {
  return crypto.randomUUID()
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your FINMA compliance assistant. I can help you navigate the licensing process, review document status, and answer questions about regulatory requirements. Try asking about **AML/KYC policies**, **capital requirements**, or the **status** of your applications.",
  citations: [],
  timestamp: new Date(),
}

function createDefaultChat(): ChatSession {
  return {
    id: 'default',
    title: 'Welcome',
    messages: [welcomeMessage],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function useChatSessions(clientId?: string, clientContext?: ClientContext) {
  const [chats, setChats] = useState<ChatSession[]>(() => [createDefaultChat()])
  const [activeChatId, setActiveChatId] = useState('default')
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
  }, [])

  const switchChat = useCallback((chatId: string) => {
    setActiveChatId(chatId)
  }, [])

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

        await streamConsultChat(
          trimmed,
          {
            onText(chunk) {
              setChats((prev) =>
                prev.map((chat) => {
                  if (chat.id !== activeChatId) return chat
                  return {
                    ...chat,
                    messages: chat.messages.map((m) =>
                      m.id === placeholderId ? { ...m, content: m.content + chunk } : m
                    ),
                  }
                })
              )
            },
            onError(err) {
              setChats((prev) =>
                prev.map((chat) => {
                  if (chat.id !== activeChatId) return chat
                  return {
                    ...chat,
                    messages: chat.messages.map((m) =>
                      m.id === placeholderId
                        ? { ...m, content: 'Sorry, I encountered an error. Please try again.' }
                        : m
                    ),
                  }
                })
              )
              console.error('Consult SSE error:', err)
            },
          },
          clientId,
          clientContext,
          abortRef.current.signal
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
    [activeChatId, clientId, clientContext, isLoading]
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
