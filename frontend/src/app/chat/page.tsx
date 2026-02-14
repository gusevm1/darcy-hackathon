'use client'

import { useEffect, useRef } from 'react'

import { MessageCircle, Trash2 } from 'lucide-react'

import { ChatInput } from '@/components/shared/chat-input'
import { ChatMessage } from '@/components/shared/chat-message'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useChat } from '@/hooks/use-chat'

const SUGGESTED_QUESTIONS = [
  'What licenses do I need to operate a crypto exchange in the EU?',
  'What are the capital requirements under MiCAR for CASPs?',
  'How does FCA regulate crypto custody services?',
  'What is the difference between ART and EMT under MiCAR?',
]

export default function ChatPage() {
  const { messages, isStreaming, error, sendMessage, clearMessages } = useChat()
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  return (
    <div className="container mx-auto flex h-[calc(100vh-3.5rem)] flex-col px-4 py-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Regulatory Assistant</h1>
          <p className="text-muted-foreground text-sm">
            Ask questions about European crypto licensing regulations
          </p>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearMessages}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto rounded-lg border p-4"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <MessageCircle className="text-muted-foreground h-12 w-12" />
            <p className="text-muted-foreground text-center text-sm">
              Ask a question about crypto licensing regulations
            </p>
            <div className="flex max-w-lg flex-wrap justify-center gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <Badge
                  key={q}
                  variant="outline"
                  className="cursor-pointer px-3 py-1.5 text-xs hover:bg-accent"
                  onClick={() => sendMessage(q)}
                >
                  {q}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
          </div>
        )}
      </div>

      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="mt-4">
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  )
}
