'use client'

import { useCallback, useState } from 'react'

import { Search } from 'lucide-react'
import { toast } from 'sonner'

import { DocumentPreviewSheet } from '@/components/shared/assistant/document-preview-sheet'
import { FileTree } from '@/components/shared/assistant/file-tree'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useKnowledgeState } from '@/hooks/use-knowledge-state'
import { searchKB } from '@/lib/api/kb'
import type { KBSearchResult } from '@/lib/api/types'
import { validateSearchQuery } from '@/lib/validation'

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

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<KBSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (!q) {
        setSearchResults([])
        return
      }
      const check = validateSearchQuery(q)
      if (!check.valid) {
        toast.error(check.error)
        return
      }
      setIsSearching(true)
      try {
        const results = await searchKB(q, 5)
        setSearchResults(results)
      } catch (err) {
        console.error('Search failed:', err)
        toast.error('Search failed. Please check your connection and try again.')
      } finally {
        setIsSearching(false)
      }
    },
    [searchQuery]
  )

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">Knowledge Base</h1>
        <p className="text-muted-foreground text-sm">
          Browse legislation, client documents, and compliance resources
        </p>
      </div>

      <div className="border-b px-6 py-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search regulatory knowledge base..."
              className="pl-9"
            />
          </div>
        </form>
        {searchResults.length > 0 && (
          <div className="mt-2 space-y-2">
            <p className="text-muted-foreground text-xs font-medium">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
            </p>
            {searchResults.map((result) => (
              <div
                key={result.doc_id}
                className="rounded-md border p-3 text-sm hover:bg-accent cursor-pointer"
                onClick={() =>
                  handleDocumentClick({
                    type: 'document',
                    documentId: result.doc_id,
                    name: result.title,
                    fileName: `${result.doc_id}.pdf`,
                    status: 'approved',
                    clientId: 'internal-kb',
                    clientName: result.source,
                    stageId: 'search',
                    stageName: 'Search Results',
                  })
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{result.title}</span>
                  <span className="text-muted-foreground text-xs">
                    {Math.round(result.score * 100)}%
                  </span>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">{result.source}</p>
                {result.text && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{result.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
        {isSearching && (
          <p className="text-muted-foreground mt-2 text-xs">Searching...</p>
        )}
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
