'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { licenseDefinitions } from '@/data/license-stages'
import { listDocuments as listClientDocuments } from '@/lib/api/client-documents'
import { searchKB } from '@/lib/api/kb'
import { buildFileTree } from '@/lib/build-file-tree'
import { buildInternalKBTreeFromDocs, buildRegulatoryTreeFromDocs } from '@/lib/tree-builders'
import type { Client } from '@/types'
import type { DocumentPreview, FileTreeDocument } from '@/types/assistant'

import { useClients } from './use-clients'
import { useDocumentPreview } from './use-document-preview'
import { useFileTree } from './use-file-tree'
import { useKBDocuments } from './use-kb-documents'

type KnowledgeTab = 'clients' | 'general' | 'internal'

export function useKnowledgeState() {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>('clients')
  const { clients: fetchedClients } = useClients()
  const { kbDocs, kbLoading } = useKBDocuments()
  const [liveClients, setLiveClients] = useState<Client[]>([])

  const { expandedNodes, setExpandedNodes, highlightedDocumentId, toggleNode } = useFileTree()

  const {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange,
  } = useDocumentPreview()

  // Sync fetched clients into local state for live updates
  useEffect(() => {
    if (fetchedClients.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncs external async data into local state
      setLiveClients(fetchedClients)
      setExpandedNodes((prev) => {
        const next = new Set(prev)
        fetchedClients.forEach((c) => next.add(c.id))
        return next
      })
    }
  }, [fetchedClients, setExpandedNodes])

  // Sync client document states with backend
  useEffect(() => {
    if (fetchedClients.length === 0) return
    let cancelled = false
    async function syncClients() {
      const updated = await Promise.all(
        fetchedClients.map(async (client) => {
          try {
            const backendDocs = await listClientDocuments(client.id)
            const backendMap = new Map(backendDocs.map((d) => [d.document_id, d]))
            const mergedStates = client.documentStates.map((s) => {
              const bd = backendMap.get(s.documentId)
              if (bd) {
                return {
                  documentId: s.documentId,
                  status: bd.status === 'pending' ? ('uploaded' as const) : (bd.status as typeof s.status),
                  fileName: bd.file_name,
                  uploadedAt: bd.uploaded_at,
                }
              }
              return s
            })
            return { ...client, documentStates: mergedStates }
          } catch {
            return client
          }
        })
      )
      if (!cancelled) setLiveClients(updated)
    }
    syncClients()
    return () => { cancelled = true }
  }, [fetchedClients])

  const clientTree = useMemo(() => buildFileTree(liveClients, licenseDefinitions), [liveClients])
  const generalTree = useMemo(() => buildRegulatoryTreeFromDocs(kbDocs), [kbDocs])
  const internalTree = useMemo(() => buildInternalKBTreeFromDocs(kbDocs), [kbDocs])

  const activeTree = useMemo(() => {
    switch (activeTab) {
      case 'clients':
        return clientTree
      case 'general':
        return generalTree
      case 'internal':
        return internalTree
    }
  }, [activeTab, clientTree, generalTree, internalTree])

  const handleDocumentClick = useCallback(
    (doc: FileTreeDocument) => {
      const definition = licenseDefinitions.find((d) =>
        d.stages.some((s) => s.documents.some((dd) => dd.id === doc.documentId))
      )
      const reqDoc = definition?.stages
        .flatMap((s) => s.documents)
        .find((dd) => dd.id === doc.documentId)

      // Show preview immediately with loading content
      const preview: DocumentPreview = {
        documentId: doc.documentId,
        documentName: doc.name,
        clientName: doc.clientName,
        company: doc.clientName,
        stageName: doc.stageName,
        status: doc.status,
        fileName: doc.fileName,
        category: reqDoc?.category ?? 'General',
        description: reqDoc?.description ?? `${doc.name} — part of the ${doc.stageName} stage.`,
        summary: `This document covers ${doc.name.toLowerCase()} requirements${definition ? ` under ${definition.legalBasis}` : ''}.`,
        content: 'Loading document content…',
      }
      setPreviewDocument(preview)
      setPreviewOpen(true)

      // Fetch content based on document source
      const isGeneralInfo = licenseDefinitions.some((d) => d.type === doc.clientId)

      if (isGeneralInfo) {
        // General Information tab: show description + FINMA reference, then search KB
        const lines = [reqDoc?.description ?? doc.name]
        if (reqDoc?.finmaReference) lines.push(`\nFINMA Reference: ${reqDoc.finmaReference}`)
        lines.push(`\nCategory: ${reqDoc?.category ?? 'General'}`)
        lines.push(`License Type: ${definition?.label ?? doc.clientName}`)
        lines.push(`Stage: ${doc.stageName}`)
        const baseContent = lines.join('\n')

        // Search KB for relevant regulatory content
        searchKB(doc.name, 3)
          .then((results) => {
            if (results.length === 0) {
              setPreviewDocument((prev) =>
                prev?.documentId === doc.documentId ? { ...prev, content: baseContent } : prev
              )
              return
            }
            const kbSection = results
              .map((r) => `--- ${r.title} (${r.source}) ---\n${r.text}`)
              .join('\n\n')
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId
                ? { ...prev, content: `${baseContent}\n\n════════════════════════════════\nRelated Knowledge Base Content:\n════════════════════════════════\n\n${kbSection}` }
                : prev
            )
          })
          .catch(() => {
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId ? { ...prev, content: baseContent } : prev
            )
          })
      } else if (doc.clientId === 'internal-kb' || doc.clientId === 'regulatory-kb') {
        // Internal KB tab: search for the document content by title
        searchKB(doc.name, 1)
          .then((results) => {
            const text = results.length > 0 ? results[0].text : 'No content available for this document.'
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId ? { ...prev, content: text } : prev
            )
          })
          .catch(() => {
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId
                ? { ...prev, content: 'Failed to load document content.' }
                : prev
            )
          })
      } else if (doc.clientId) {
        // Client tab: retrieve text content from KB (documents are indexed in Qdrant)
        searchKB(doc.name, 1)
          .then((results) => {
            const text =
              results.length > 0
                ? results[0].text
                : 'Document content not yet indexed. Please try again after the document has been processed.'
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId ? { ...prev, content: text } : prev,
            )
          })
          .catch(() => {
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId
                ? { ...prev, content: 'Failed to load document content.' }
                : prev,
            )
          })
      }
    },
    [setPreviewDocument, setPreviewOpen]
  )

  const handleUploadFile = useCallback(() => {}, [])

  return {
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
    kbLoading,
  }
}
