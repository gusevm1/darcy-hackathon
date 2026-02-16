'use client'

import { useEffect, useState } from 'react'

import type { ChatMessage, ChatSession } from '@/types/assistant'

const STORAGE_KEY = 'darcy-chat-sessions'
const ACTIVE_CHAT_KEY = 'darcy-active-chat'

const isBrowser = typeof window !== 'undefined'

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm your FINMA compliance assistant. I can help you navigate the licensing process, review document status, and answer questions about regulatory requirements. Try asking about **AML/KYC policies**, **capital requirements**, or the **status** of your applications.",
  citations: [],
  timestamp: new Date(),
}

export function createDefaultChat(): ChatSession {
  return {
    id: 'default',
    title: 'Welcome',
    messages: [welcomeMessage],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export { welcomeMessage }

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

export function useChatStorage() {
  const [chats, setChats] = useState<ChatSession[]>(loadChatsFromStorage)
  const [activeChatId, setActiveChatId] = useState(() => {
    if (!isBrowser) return 'default'
    return localStorage.getItem(ACTIVE_CHAT_KEY) ?? 'default'
  })

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

  return { chats, setChats, activeChatId, setActiveChatId }
}
