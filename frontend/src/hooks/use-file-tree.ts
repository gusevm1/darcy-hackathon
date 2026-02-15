'use client'

import { useCallback, useRef, useState } from 'react'

import { clients as initialClients } from '@/data/clients'

export function useFileTree() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const set = new Set<string>()
    initialClients.forEach((c) => set.add(c.id))
    return set
  })
  const [highlightedDocumentId, setHighlightedDocumentId] = useState<
    string | null
  >(null)

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
