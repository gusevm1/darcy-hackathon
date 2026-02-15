'use client'

import { useEffect, useRef, useState } from 'react'

import { MessageSquare, MessageSquarePlus, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { ChatMessage as ChatMessageType, ChatSession, Citation } from '@/types/assistant'

import { ChatHistoryDropdown } from './chat-history-dropdown'
import { ChatMessage } from './chat-message'

interface ChatAreaProps {
  messages: ChatMessageType[]
  onSendMessage: (content: string) => void
  chats?: ChatSession[]
  activeChatId?: string
  onCitationClick?: (citation: Citation) => void
  onNewChat?: () => void
  onSelectChat?: (chatId: string) => void
  title?: string
  placeholder?: string
}

export function ChatArea({
  messages,
  onSendMessage,
  chats,
  activeChatId,
  onCitationClick,
  onNewChat,
  onSelectChat,
  title = 'Compliance Assistant',
  placeholder = 'Ask about documents, compliance, or status...',
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]')
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' })
    }
  }, [messages])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!inputValue.trim()) return
    onSendMessage(inputValue)
    setInputValue('')
  }

  const showChatHistory = chats && activeChatId && onNewChat && onSelectChat

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="text-muted-foreground h-4 w-4" />
            <h2 className="text-sm font-semibold">{title}</h2>
          </div>
          {showChatHistory && (
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" onClick={onNewChat}>
                <MessageSquarePlus className="h-4 w-4" />
                <span className="sr-only">New chat</span>
              </Button>
              <ChatHistoryDropdown
                chats={chats}
                activeChatId={activeChatId}
                onNewChat={onNewChat}
                onSelectChat={onSelectChat}
              />
            </div>
          )}
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="min-h-0 flex-1 p-4">
        <div className="space-y-4" role="log" aria-live="polite">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} onCitationClick={onCitationClick} />
          ))}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!inputValue.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
