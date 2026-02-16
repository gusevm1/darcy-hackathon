'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Send, Sparkles } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { addComment, resolveComment } from '@/lib/api/ehp'
import { cn } from '@/lib/utils'
import type { EHPComment } from '@/types'

const roleConfig: Record<
  EHPComment['role'],
  { label: string; color: string; bgColor: string }
> = {
  'finma-reviewer': {
    label: 'FINMA',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  applicant: {
    label: 'Applicant',
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-100',
  },
  consultant: {
    label: 'Consultant',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
  },
  auditor: {
    label: 'Auditor',
    color: 'text-amber-700',
    bgColor: 'bg-amber-100',
  },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface EHPCommentThreadProps {
  comments: EHPComment[]
  documentName: string
  clientId: string
  documentId: string
  onCommentAdded?: (comment: EHPComment) => void
  onCommentToggled?: (commentId: string, resolved: boolean) => void
}

export function EHPCommentThread({
  comments,
  documentName,
  clientId,
  documentId,
  onCommentAdded,
  onCommentToggled,
}: EHPCommentThreadProps) {
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)

  const unresolvedCount = comments.filter((c) => !c.resolved).length

  const handleReply = async () => {
    const trimmed = replyText.trim()
    if (!trimmed || sending) return

    setSending(true)
    try {
      const comment = await addComment(clientId, documentId, {
        author: 'Consultant',
        role: 'consultant',
        content: trimmed,
      })
      onCommentAdded?.(comment)
      setReplyText('')
    } catch {
      // Silently fail — could add toast
    } finally {
      setSending(false)
    }
  }

  const handleToggleResolve = async (commentId: string) => {
    try {
      const updated = await resolveComment(commentId)
      onCommentToggled?.(commentId, updated.resolved)
    } catch {
      // Silently fail
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">
            EHP Comments
          </span>
          {unresolvedCount > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              <Clock className="h-3 w-3" />
              {unresolvedCount} open
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {comments.map((comment) => {
          const config = roleConfig[comment.role]
          return (
            <div
              key={comment.id}
              className={cn(
                'rounded-lg border p-3 text-sm',
                comment.resolved
                  ? 'border-muted bg-muted/30'
                  : 'border-border bg-background',
              )}
            >
              <div className="flex items-start gap-2.5">
                <Avatar className="h-7 w-7 shrink-0">
                  <AvatarFallback
                    className={cn(
                      'text-[10px] font-semibold',
                      config.bgColor,
                      config.color,
                    )}
                  >
                    {getInitials(comment.author)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">
                      {comment.author}
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px] font-medium',
                        config.bgColor,
                        config.color,
                      )}
                    >
                      {config.label}
                    </span>
                    {comment.ai_generated && (
                      <span className="text-muted-foreground flex items-center gap-0.5 text-[10px] italic">
                        <Sparkles className="h-2.5 w-2.5" />
                        simulated
                      </span>
                    )}
                    <button
                      onClick={() => handleToggleResolve(comment.id)}
                      className="ml-auto flex items-center gap-0.5"
                      title={
                        comment.resolved
                          ? 'Mark as unresolved'
                          : 'Mark as resolved'
                      }
                    >
                      <CheckCircle2
                        className={cn(
                          'h-3 w-3',
                          comment.resolved
                            ? 'text-emerald-500'
                            : 'text-muted-foreground/40 hover:text-emerald-400',
                        )}
                      />
                    </button>
                    <span className="text-muted-foreground text-[10px]">
                      {formatDate(comment.timestamp)}
                    </span>
                  </div>
                  <p
                    className={cn(
                      'text-xs leading-relaxed',
                      comment.resolved
                        ? 'text-muted-foreground'
                        : 'text-foreground',
                    )}
                  >
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Reply input */}
      <div className="flex gap-2">
        <Textarea
          placeholder={`Reply to ${documentName} thread...`}
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          className="min-h-[60px] resize-none text-xs"
          rows={2}
        />
        <Button
          size="sm"
          variant="outline"
          className="shrink-0 self-end"
          disabled={!replyText.trim() || sending}
          onClick={handleReply}
        >
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
