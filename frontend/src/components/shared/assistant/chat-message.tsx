'use client'

import { memo, useMemo } from 'react'

import { Bot, User } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { cn } from '@/lib/utils'
import type { ChatMessage as ChatMessageType, Citation } from '@/types/assistant'

import { CitationBadge } from './citation-badge'
import { SourceList } from './source-list'

interface ChatMessageProps {
  message: ChatMessageType
  onCitationClick?: (citation: Citation) => void
}

/**
 * Pre-process content to protect [N] citation badges from being
 * interpreted as markdown links, then render markdown, then restore
 * citation badges as React components.
 */
function MarkdownContent({
  content,
  citations,
  onCitationClick,
}: {
  content: string
  citations: Citation[]
  onCitationClick?: (citation: Citation) => void
}) {
  // Replace [N] patterns with unique placeholders
  const { processed, placeholders } = useMemo(() => {
    const phs: Map<string, number> = new Map()
    const result = content.replace(/\[(\d+)\]/g, (_match, num) => {
      const index = parseInt(num, 10)
      const key = `%%CITE_${index}%%`
      phs.set(key, index)
      return key
    })
    return { processed: result, placeholders: phs }
  }, [content])

  // Custom components for react-markdown
  const components = useMemo(
    () => ({
      p: ({ children }: { children?: React.ReactNode }) => {
        return <p className="mb-2 last:mb-0">{restoreCitations(children)}</p>
      },
      li: ({ children }: { children?: React.ReactNode }) => {
        return <li className="ml-4">{restoreCitations(children)}</li>
      },
      ul: ({ children }: { children?: React.ReactNode }) => {
        return <ul className="mb-2 list-disc pl-2">{children}</ul>
      },
      ol: ({ children }: { children?: React.ReactNode }) => {
        return <ol className="mb-2 list-decimal pl-2">{children}</ol>
      },
      strong: ({ children }: { children?: React.ReactNode }) => {
        return <strong className="font-semibold">{children}</strong>
      },
      h1: ({ children }: { children?: React.ReactNode }) => {
        return <h3 className="mb-1 mt-2 font-semibold">{children}</h3>
      },
      h2: ({ children }: { children?: React.ReactNode }) => {
        return <h3 className="mb-1 mt-2 font-semibold">{children}</h3>
      },
      h3: ({ children }: { children?: React.ReactNode }) => {
        return <h3 className="mb-1 mt-2 font-semibold">{children}</h3>
      },
      code: ({
        className,
        children,
      }: {
        className?: string
        children?: React.ReactNode
      }) => {
        const isBlock = className?.startsWith('language-')
        if (isBlock) {
          return (
            <pre className="my-2 overflow-x-auto rounded bg-black/5 p-2 text-xs dark:bg-white/5">
              <code>{children}</code>
            </pre>
          )
        }
        return (
          <code className="rounded bg-black/5 px-1 py-0.5 text-xs dark:bg-white/5">
            {children}
          </code>
        )
      },
      a: ({
        href,
        children,
      }: {
        href?: string
        children?: React.ReactNode
      }) => {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            {children}
          </a>
        )
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [citations, onCitationClick],
  )

  function restoreCitations(children: React.ReactNode): React.ReactNode {
    if (typeof children === 'string') {
      return restoreCitationsInString(children)
    }
    if (Array.isArray(children)) {
      return children.map((child, i) => {
        if (typeof child === 'string') {
          return (
            <span key={i}>{restoreCitationsInString(child)}</span>
          )
        }
        return child
      })
    }
    return children
  }

  function restoreCitationsInString(text: string): React.ReactNode {
    const parts = text.split(/(%%CITE_\d+%%)/)
    if (parts.length === 1) return text
    return parts.map((part, i) => {
      const index = placeholders.get(part)
      if (index !== undefined) {
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
        return <span key={i}>[{index}]</span>
      }
      return <span key={i}>{part}</span>
    })
  }

  return (
    <Markdown remarkPlugins={[remarkGfm]} components={components}>
      {processed}
    </Markdown>
  )
}

export const ChatMessage = memo(function ChatMessage({
  message,
  onCitationClick,
}: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}>
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted',
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
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
          {isUser ? (
            message.content
          ) : (
            <MarkdownContent
              content={message.content}
              citations={message.citations}
              onCitationClick={onCitationClick}
            />
          )}
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
