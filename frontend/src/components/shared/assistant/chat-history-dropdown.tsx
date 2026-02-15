'use client'

import { History, MessageSquarePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { ChatSession } from '@/types/assistant'

function relativeTime(date: Date): string {
  const now = Date.now()
  const diff = now - date.getTime()
  const seconds = Math.floor(diff / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface ChatHistoryDropdownProps {
  chats: ChatSession[]
  activeChatId: string
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
}

export function ChatHistoryDropdown({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
}: ChatHistoryDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <History className="h-4 w-4" />
          <span className="sr-only">Chat history</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Chat History</DropdownMenuLabel>
        <DropdownMenuItem onClick={onNewChat}>
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          New Chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {chats.map((chat) => (
          <DropdownMenuItem
            key={chat.id}
            className={cn(
              'flex flex-col items-start gap-0.5',
              chat.id === activeChatId && 'bg-accent'
            )}
            onClick={() => onSelectChat(chat.id)}
          >
            <span className="truncate text-sm font-medium">{chat.title}</span>
            <span className="text-muted-foreground text-xs">{relativeTime(chat.updatedAt)}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
