'use client'

import { useState } from 'react'

import { PanelLeft } from 'lucide-react'
import { Toaster } from 'sonner'

import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useAssistantState } from '@/hooks/use-assistant-state'
import type { Citation, FileTreeDocument } from '@/types/assistant'

import { ChatArea } from './chat-area'
import { DocumentPreviewSheet } from './document-preview-sheet'
import { FileTree } from './file-tree'

export function AssistantLayout() {
  const {
    fileTree,
    expandedNodes,
    highlightedDocumentId,
    messages,
    chats,
    activeChatId,
    createNewChat,
    switchChat,
    previewDocument,
    previewOpen,
    handlePreviewOpenChange,
    sendMessage,
    handleCitationClick,
    handleUploadFile,
    toggleNode,
  } = useAssistantState()

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  function handleDocumentClick(doc: FileTreeDocument) {
    // Find the document details to build a citation for preview
    const citation: Citation = {
      index: 0,
      documentId: doc.documentId,
      documentName: doc.name,
      clientName: doc.clientName,
      stageName: doc.stageName,
      path: `${doc.clientName} / ${doc.stageName} / ${doc.name}`,
    }
    handleCitationClick(citation)
  }

  const fileTreeContent = (
    <FileTree
      tree={fileTree}
      expandedNodes={expandedNodes}
      highlightedDocumentId={highlightedDocumentId}
      onToggle={toggleNode}
      onUploadFile={handleUploadFile}
      onDocumentClick={handleDocumentClick}
    />
  )

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* Desktop sidebar */}
      <div className="hidden w-80 shrink-0 flex-col border-r md:flex">
        {fileTreeContent}
      </div>

      {/* Mobile sidebar toggle */}
      <div className="flex items-start border-r p-2 md:hidden">
        <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <PanelLeft className="h-4 w-4" />
              <span className="sr-only">Toggle documents</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0" showCloseButton={false}>
            {fileTreeContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Chat area */}
      <ChatArea
        messages={messages}
        chats={chats}
        activeChatId={activeChatId}
        onSendMessage={sendMessage}
        onCitationClick={handleCitationClick}
        onNewChat={createNewChat}
        onSelectChat={switchChat}
      />

      {/* Document preview */}
      <DocumentPreviewSheet
        document={previewDocument}
        open={previewOpen}
        onOpenChange={handlePreviewOpenChange}
      />

      <Toaster />
    </div>
  )
}
