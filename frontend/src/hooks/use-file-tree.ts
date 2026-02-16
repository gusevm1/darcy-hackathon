'use client'

import { useCallback, useRef, useState } from 'react'

export function useFileTree() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => new Set<string>())
  const [highlightedDocumentId, setHighlightedDocumentId] = useState<string | null>(null)

  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev)
      if (next.has(nodeId)) {
        next.delete(nodeId)
      } else {
        next.add(nodeId)
      }
      return next
    })
  }, [])

  return {
    expandedNodes,
    highlightedDocumentId,
    highlightTimerRef,
    setExpandedNodes,
    setHighlightedDocumentId,
    toggleNode,
  }
}
