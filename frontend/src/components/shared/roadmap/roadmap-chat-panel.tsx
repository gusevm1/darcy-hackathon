'use client'

import { ChatArea } from '@/components/shared/assistant/chat-area'
import { DocumentPreviewSheet } from '@/components/shared/assistant/document-preview-sheet'
import type { ChatMessage, ChatSession, Citation, DocumentPreview } from '@/types/assistant'

interface RoadmapChatPanelProps {
  title: string
  messages: ChatMessage[]
  chats: ChatSession[]
  activeChatId: string
  onSendMessage: (content: string) => void
  onCitationClick: (citation: Citation) => void
  onNewChat: () => void
  onSelectChat: (chatId: string) => void
  previewDocument: DocumentPreview | null
  previewOpen: boolean
  onPreviewOpenChange: (open: boolean) => void
  isLoading?: boolean
}

export function RoadmapChatPanel({
  title,
  messages,
  chats,
  activeChatId,
  onSendMessage,
  onCitationClick,
  onNewChat,
  onSelectChat,
  previewDocument,
  previewOpen,
  onPreviewOpenChange,
  isLoading,
}: RoadmapChatPanelProps) {
  return (
    <div className="flex h-full flex-col">
      <ChatArea
        title={title}
        messages={messages}
        chats={chats}
        activeChatId={activeChatId}
        onSendMessage={onSendMessage}
        onCitationClick={onCitationClick}
        onNewChat={onNewChat}
        onSelectChat={onSelectChat}
        placeholder="Ask about this client's compliance status..."
        isLoading={isLoading}
      />
      <DocumentPreviewSheet
        document={previewDocument}
        open={previewOpen}
        onOpenChange={onPreviewOpenChange}
      />
    </div>
  )
}
