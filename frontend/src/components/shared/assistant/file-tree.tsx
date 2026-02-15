'use client'

import { useCallback, useEffect, useRef } from 'react'

import { FolderTree, Upload } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { FileTreeClientFolder, FileTreeDocument } from '@/types/assistant'

import { FileTreeNode } from './file-tree-node'
import { StatusLegend } from './status-legend'

interface FileTreeProps {
  tree: FileTreeClientFolder[]
  expandedNodes: Set<string>
  highlightedDocumentId: string | null
  onToggle: (nodeId: string) => void
  onUploadFile: (file: File) => void
  onDocumentClick: (doc: FileTreeDocument) => void
  showUpload?: boolean
}

export function FileTree({
  tree,
  expandedNodes,
  highlightedDocumentId,
  onToggle,
  onUploadFile,
  onDocumentClick,
  showUpload = true,
}: FileTreeProps) {
  const docRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const registerRef = useCallback((docId: string, el: HTMLDivElement | null) => {
    if (el) {
      docRefs.current.set(docId, el)
    } else {
      docRefs.current.delete(docId)
    }
  }, [])

  useEffect(() => {
    if (highlightedDocumentId) {
      const el = docRefs.current.get(highlightedDocumentId)
      const viewport = scrollAreaRef.current?.querySelector('[data-slot="scroll-area-viewport"]')
      if (el && viewport) {
        const elRect = el.getBoundingClientRect()
        const vpRect = viewport.getBoundingClientRect()
        const offset = elRect.top - vpRect.top - vpRect.height / 2 + elRect.height / 2
        viewport.scrollBy({ top: offset, behavior: 'smooth' })
      }
    }
  }, [highlightedDocumentId])

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    e.stopPropagation()
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onUploadFile(files[0])
    }
  }

  function handleUploadClick() {
    fileInputRef.current?.click()
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (files && files.length > 0) {
      onUploadFile(files[0])
      e.target.value = ''
    }
  }

  return (
    <div className="flex h-full flex-col" onDragOver={handleDragOver} onDrop={handleDrop}>
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <FolderTree className="text-muted-foreground h-4 w-4" />
          <h2 className="text-sm font-semibold">Documents</h2>
        </div>
        {showUpload && (
          <>
            <Button variant="ghost" size="icon" onClick={handleUploadClick}>
              <Upload className="h-4 w-4" />
              <span className="sr-only">Upload file</span>
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.txt"
            />
          </>
        )}
      </div>

      <ScrollArea ref={scrollAreaRef} className="flex-1">
        <div className="p-2">
          {tree.map((clientFolder) => (
            <FileTreeNode
              key={clientFolder.clientId}
              node={clientFolder}
              depth={0}
              expandedNodes={expandedNodes}
              highlightedDocumentId={highlightedDocumentId}
              onToggle={onToggle}
              onDocumentClick={onDocumentClick}
              registerRef={registerRef}
            />
          ))}
        </div>
      </ScrollArea>

      <StatusLegend />
    </div>
  )
}
