'use client'

import { memo } from 'react'

import { Bot, User } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType, Citation } from '@/types/assistant'

import { CitationBadge } from './citation-badge'
import { SourceList } from './source-list'

interface ChatMessageProps {
  message: ChatMessageType
  onCitationClick?: (citation: Citation) => void
}

function renderContent(
  content: string,
  citations: Citation[],
  onCitationClick?: (citation: Citation) => void,
) {
  const parts = content.split(/(\[\d+\])/)
  return parts.map((part, i) => {
    const match = part.match(/^\[(\d+)\]$/)
    if (match) {
      const index = parseInt(match[1], 10)
      const citation = citations.find((c) => c.index === index)
      if (citation) {
        return (
          <CitationBadge
            key={i}
            citation={citation}
            onCitationClick={onCitationClick}
          />
        )
      }
    }
    // Handle markdown bold and newlines
    const segments = part.split(/(\*\*[^*]+\*\*|\n)/)
    return segments.map((seg, j) => {
      if (seg === '\n') return <br key={`${i}-${j}`} />
      const boldMatch = seg.match(/^\*\*(.+)\*\*$/)
      if (boldMatch) {
        return (
          <strong key={`${i}-${j}`} className="font-semibold">
            {boldMatch[1]}
          </strong>
        )
      }
      return <span key={`${i}-${j}`}>{seg}</span>
    })
  })
}

export const ChatMessage = memo(function ChatMessage({ message, onCitationClick }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        <div className="leading-relaxed">
          {renderContent(message.content, message.citations, onCitationClick)}
        </div>
        {!isUser && message.citations.length > 0 && (
          <SourceList
            citations={message.citations}
            onCitationClick={onCitationClick}
          />
        )}
      </div>
    </div>
  )
})
