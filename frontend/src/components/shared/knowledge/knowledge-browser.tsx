'use client'

import { DocumentPreviewSheet } from '@/components/shared/assistant/document-preview-sheet'
import { FileTree } from '@/components/shared/assistant/file-tree'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKnowledgeState } from '@/hooks/use-knowledge-state'

export function KnowledgeBrowser() {
  const {
    activeTab,
    setActiveTab,
    activeTree,
    expandedNodes,
    highlightedDocumentId,
    toggleNode,
    previewDocument,
    previewOpen,
    handlePreviewOpenChange,
    handleDocumentClick,
    handleUploadFile,
  } = useKnowledgeState()

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Knowledge Base</h1>
        <p className="text-muted-foreground text-sm">
          Browse legislation, client documents, and compliance resources
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as typeof activeTab)}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="border-b px-6">
          <TabsList>
            <TabsTrigger value="clients">Client Folders</TabsTrigger>
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="internal">Internal Knowledge</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0 min-h-0 flex-1">
          <FileTree
            tree={activeTree}
            expandedNodes={expandedNodes}
            highlightedDocumentId={highlightedDocumentId}
            onToggle={toggleNode}
            onUploadFile={handleUploadFile}
            onDocumentClick={handleDocumentClick}
            showUpload={false}
          />
        </TabsContent>
      </Tabs>

      <DocumentPreviewSheet
        document={previewDocument}
        open={previewOpen}
        onOpenChange={handlePreviewOpenChange}
      />
    </div>
  )
}
