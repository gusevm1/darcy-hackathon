'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { type ClientContext, streamConsultChat } from '@/lib/api/consult'
import type { ChatMessage, ChatSession } from '@/types/assistant'

const STORAGE_KEY = 'darcy-chat-sessions'
const ACTIVE_CHAT_KEY = 'darcy-active-chat'

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

const isBrowser = typeof window !== 'undefined'

function loadChatsFromStorage(): ChatSession[] {
  if (!isBrowser) return [createDefaultChat()]
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [createDefaultChat()]
    const parsed = JSON.parse(raw) as ChatSession[]
    return parsed.map((chat) => ({
      ...chat,
      createdAt: new Date(chat.createdAt),
      updatedAt: new Date(chat.updatedAt),
      messages: chat.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })),
    }))
  } catch {
    return [createDefaultChat()]
  }
}

function saveChatsToStorage(chats: ChatSession[]) {
  if (!isBrowser) return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats))
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function useChatSessions(clientId?: string, clientContext?: ClientContext) {
  const [chats, setChats] = useState<ChatSession[]>(loadChatsFromStorage)
  const [activeChatId, setActiveChatId] = useState(() => {
    if (!isBrowser) return 'default'
    return localStorage.getItem(ACTIVE_CHAT_KEY) ?? 'default'
  })
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // Persist chats to localStorage whenever they change
  useEffect(() => {
    saveChatsToStorage(chats)
  }, [chats])

  // Persist active chat ID
  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_CHAT_KEY, activeChatId)
    } catch {
      // ignore
    }
  }, [activeChatId])

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

        // Build conversation history (last 10 messages, excluding welcome + current)
        const history = activeChat.messages
          .filter((m) => m.id !== 'welcome' && m.content.trim())
          .slice(-10)
          .map((m) => ({ role: m.role, content: m.content }))

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
