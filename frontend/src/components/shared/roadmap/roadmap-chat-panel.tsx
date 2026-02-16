'use client'

import { ChatArea } from '@/components/shared/assistant/chat-area'
import { DocumentPreviewSheet } from '@/components/shared/assistant/document-preview-sheet'
import { useRoadmap } from '@/contexts/roadmap-context'

interface RoadmapChatPanelProps {
  title: string
}

export function RoadmapChatPanel({ title }: RoadmapChatPanelProps) {
  const {
    messages,
    chats,
    activeChatId,
    sendMessage,
    handleCitationClick,
    createNewChat,
    switchChat,
    previewDocument,
    previewOpen,
    handlePreviewOpenChange,
    isLoading,
  } = useRoadmap()

  return (
    <div className="flex h-full flex-col">
      <ChatArea
        title={title}
        messages={messages}
        chats={chats}
        activeChatId={activeChatId}
        onSendMessage={sendMessage}
        onCitationClick={handleCitationClick}
        onNewChat={createNewChat}
        onSelectChat={switchChat}
        placeholder="Ask about this client's compliance status..."
        isLoading={isLoading}
      />
      <DocumentPreviewSheet
        document={previewDocument}
        open={previewOpen}
        onOpenChange={handlePreviewOpenChange}
      />
    </div>
  )
}
