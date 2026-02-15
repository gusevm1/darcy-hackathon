'use client'

import { memo, useEffect, useRef } from 'react'

import {
  ChevronDown,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
} from 'lucide-react'

import { cn } from '@/lib/utils'
import type { DocumentStatus } from '@/types'
import type {
  FileTreeClientFolder,
  FileTreeDocument,
  FileTreeStageFolder,
} from '@/types/assistant'

const statusColors: Record<DocumentStatus, string> = {
  'not-started': 'bg-gray-400',
  uploaded: 'bg-blue-500',
  'under-review': 'bg-yellow-500',
  approved: 'bg-green-500',
  rejected: 'bg-red-500',
}

interface FileTreeNodeProps {
  node: FileTreeClientFolder | FileTreeStageFolder | FileTreeDocument
  depth: number
  expandedNodes: Set<string>
  highlightedDocumentId: string | null
  onToggle: (nodeId: string) => void
  onDocumentClick: (doc: FileTreeDocument) => void
  registerRef: (docId: string, el: HTMLDivElement | null) => void
}

export const FileTreeNode = memo(function FileTreeNode({
  node,
  depth,
  expandedNodes,
  highlightedDocumentId,
  onToggle,
  onDocumentClick,
  registerRef,
}: FileTreeNodeProps) {
  const elRef = useRef<HTMLDivElement>(null)
  const isDocument = node.type === 'document'
  const isHighlighted = isDocument && highlightedDocumentId === node.documentId

  useEffect(() => {
    if (isDocument) {
      registerRef(node.documentId, elRef.current)
      return () => registerRef(node.documentId, null)
    }
  }, [isDocument, node, registerRef])

  if (isDocument) {
    const doc = node as FileTreeDocument
    return (
      <div
        ref={elRef}
        className={cn(
          'flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-all duration-300 hover:bg-accent',
          isHighlighted &&
            'bg-yellow-200 dark:bg-yellow-400/25 ring-2 ring-yellow-400 font-medium shadow-[0_0_8px_rgba(250,204,21,0.4)]',
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onDocumentClick(doc)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onDocumentClick(doc)
          }
        }}
      >
        <FileText className={cn('h-4 w-4 shrink-0', isHighlighted ? 'text-yellow-600' : 'text-muted-foreground')} />
        <span className="truncate">{doc.fileName}</span>
        <span
          className={cn(
            'ml-auto h-2 w-2 shrink-0 rounded-full',
            statusColors[doc.status],
          )}
          title={doc.status}
        />
      </div>
    )
  }

  const folderId =
    node.type === 'client'
      ? (node as FileTreeClientFolder).clientId
      : (node as FileTreeStageFolder).stageId
  const isExpanded = expandedNodes.has(folderId)
  const children =
    node.type === 'client'
      ? (node as FileTreeClientFolder).children
      : (node as FileTreeStageFolder).children

  return (
    <div>
      <div
        className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-sm transition-colors hover:bg-accent"
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onToggle(folderId)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggle(folderId)
          }
        }}
      >
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 shrink-0" />
        ) : (
          <ChevronRight className="h-4 w-4 shrink-0" />
        )}
        {isExpanded ? (
          <FolderOpen className="text-muted-foreground h-4 w-4 shrink-0" />
        ) : (
          <Folder className="text-muted-foreground h-4 w-4 shrink-0" />
        )}
        <span className="truncate font-medium">{node.name}</span>
      </div>
      {isExpanded && (
        <div>
          {children.map((child) => (
            <FileTreeNode
              key={
                child.type === 'document'
                  ? child.documentId
                  : child.type === 'stage'
                    ? child.stageId
                    : (child as FileTreeClientFolder).clientId
              }
              node={child}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              highlightedDocumentId={highlightedDocumentId}
              onToggle={onToggle}
              onDocumentClick={onDocumentClick}
              registerRef={registerRef}
            />
          ))}
        </div>
      )}
    </div>
  )
}, (prev, next) => {
  if (prev.node !== next.node) return false
  if (prev.depth !== next.depth) return false
  if (prev.highlightedDocumentId !== next.highlightedDocumentId) return false
  if (prev.onToggle !== next.onToggle) return false
  if (prev.onDocumentClick !== next.onDocumentClick) return false
  if (prev.registerRef !== next.registerRef) return false
  // Custom Set comparison: check size and relevant entries
  if (prev.expandedNodes === next.expandedNodes) return true
  if (prev.expandedNodes.size !== next.expandedNodes.size) return false
  for (const key of prev.expandedNodes) {
    if (!next.expandedNodes.has(key)) return false
  }
  return true
})
