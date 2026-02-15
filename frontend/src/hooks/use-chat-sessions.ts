'use client'

import { useCallback, useMemo, useState } from 'react'

import { matchCannedResponse } from '@/data/canned-responses'
import { licenseDefinitions } from '@/data/license-stages'
import { resolveCitations } from '@/lib/resolve-citations'
import type { Client } from '@/types'
import type { ChatMessage, ChatSession } from '@/types/assistant'

function generateId() {
  return crypto.randomUUID()
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello! I\'m your FINMA compliance assistant. I can help you navigate the licensing process, review document status, and answer questions about regulatory requirements. Try asking about **AML/KYC policies**, **capital requirements**, or the **status** of your applications.',
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

export function useChatSessions(clientsState: Client[]) {
  const [chats, setChats] = useState<ChatSession[]>(() => [createDefaultChat()])
  const [activeChatId, setActiveChatId] = useState('default')

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? chats[0],
    [chats, activeChatId],
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
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        citations: [],
        timestamp: new Date(),
      }

      const matched = matchCannedResponse(trimmed)
      const citations = resolveCitations(
        matched.citationDocIds,
        clientsState,
        licenseDefinitions,
      )

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: matched.content,
        citations,
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId) return chat

          const isFirstUserMessage =
            !chat.messages.some((m) => m.role === 'user')
          return {
            ...chat,
            messages: [...chat.messages, userMsg, assistantMsg],
            title: isFirstUserMessage
              ? trimmed.slice(0, 50) + (trimmed.length > 50 ? '...' : '')
              : chat.title,
            updatedAt: new Date(),
          }
        }),
      )
    },
    [clientsState, activeChatId],
  )

  return {
    chats,
    activeChatId,
    messages,
    createNewChat,
    switchChat,
    sendMessage,
  }
}
