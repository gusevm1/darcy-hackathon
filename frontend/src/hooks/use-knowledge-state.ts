'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { clients } from '@/data/clients'
import { licenseDefinitions } from '@/data/license-stages'
import { listDocuments } from '@/lib/api/kb'
import type { KBDocument } from '@/lib/api/types'
import { buildFileTree } from '@/lib/build-file-tree'
import type { DocumentPreview, FileTreeClientFolder, FileTreeDocument } from '@/types/assistant'

import { useDocumentPreview } from './use-document-preview'
import { useFileTree } from './use-file-tree'

type KnowledgeTab = 'clients' | 'general' | 'internal'

function buildGeneralInfoTree(): FileTreeClientFolder[] {
  return licenseDefinitions.map((def) => ({
    type: 'client' as const,
    clientId: def.type,
    name: def.label,
    company: def.legalBasis,
    children: def.stages.map((stage) => ({
      type: 'stage' as const,
      stageId: stage.id,
      name: stage.name,
      children: stage.documents.map((doc) => ({
        type: 'document' as const,
        documentId: doc.id,
        name: doc.name,
        fileName: `${doc.id}.pdf`,
        status: 'approved' as const,
        clientId: def.type,
        clientName: def.label,
        stageId: stage.id,
        stageName: stage.name,
      })),
    })),
  }))
}

function buildInternalKBTreeFromDocs(docs: KBDocument[]): FileTreeClientFolder[] {
  const grouped = new Map<string, KBDocument[]>()
  for (const doc of docs) {
    const source = doc.source || 'Other'
    if (!grouped.has(source)) grouped.set(source, [])
    grouped.get(source)!.push(doc)
  }

  return [
    {
      type: 'client' as const,
      clientId: 'internal-kb',
      name: 'Internal Knowledge Base',
      company: 'FINMA Comply',
      children: Array.from(grouped.entries()).map(([source, sourceDocs]) => ({
        type: 'stage' as const,
        stageId: source.toLowerCase().replace(/\s+/g, '-'),
        name: source,
        children: sourceDocs.map((doc) => ({
          type: 'document' as const,
          documentId: doc.doc_id,
          name: doc.title,
          fileName: `${doc.doc_id}.pdf`,
          status: 'approved' as const,
          clientId: 'internal-kb',
          clientName: 'Internal Knowledge Base',
          stageId: source.toLowerCase().replace(/\s+/g, '-'),
          stageName: source,
        })),
      })),
    },
  ]
}

export function useKnowledgeState() {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>('clients')
  const [kbDocs, setKbDocs] = useState<KBDocument[]>([])
  const [kbLoading, setKbLoading] = useState(false)

  const { expandedNodes, highlightedDocumentId, toggleNode } = useFileTree()

  const {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange,
  } = useDocumentPreview()

  useEffect(() => {
    let cancelled = false
    async function fetchDocs() {
      setKbLoading(true)
      try {
        const result = await listDocuments(0, 100)
        if (!cancelled) setKbDocs(result.items)
      } catch (err) {
        console.error('Failed to fetch KB documents:', err)
      } finally {
        if (!cancelled) setKbLoading(false)
      }
    }
    fetchDocs()
    return () => {
      cancelled = true
    }
  }, [])

  const clientTree = useMemo(() => buildFileTree(clients, licenseDefinitions), [])
  const generalTree = useMemo(() => buildGeneralInfoTree(), [])
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
      const preview: DocumentPreview = {
        documentId: doc.documentId,
        documentName: doc.name,
        clientName: doc.clientName,
        company: doc.clientName,
        stageName: doc.stageName,
        status: doc.status,
        fileName: doc.fileName,
        category: 'General',
        description: `${doc.name} — part of the ${doc.stageName} stage.`,
        summary: `This document covers ${doc.name.toLowerCase()} requirements${definition ? ` under ${definition.legalBasis}` : ''}.`,
        content: `DOCUMENT: ${doc.name}\n\nCategory: ${doc.stageName}\nSource: ${doc.clientName}\n\nThis is a placeholder document for the knowledge base viewer. In production, this would display the actual document content retrieved from the backend.`,
      }
      setPreviewDocument(preview)
      setPreviewOpen(true)
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
