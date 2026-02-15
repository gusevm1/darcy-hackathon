'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

import { clients as staticClients } from '@/data/clients'
import { licenseDefinitions } from '@/data/license-stages'
import {
  downloadDocument,
  listDocuments as listClientDocuments,
} from '@/lib/api/client-documents'
import { listDocuments } from '@/lib/api/kb'
import type { KBDocument } from '@/lib/api/types'
import { buildFileTree } from '@/lib/build-file-tree'
import type { Client } from '@/types'
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
  const [liveClients, setLiveClients] = useState<Client[]>(staticClients)

  const { expandedNodes, highlightedDocumentId, toggleNode } = useFileTree()

  const {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange,
  } = useDocumentPreview()

  // Sync client document states with backend
  useEffect(() => {
    let cancelled = false
    async function syncClients() {
      const updated = await Promise.all(
        staticClients.map(async (client) => {
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
  }, [])

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

  const clientTree = useMemo(() => buildFileTree(liveClients, licenseDefinitions), [liveClients])
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

      // Fetch actual content from backend
      if (doc.clientId && doc.clientId !== 'internal-kb') {
        downloadDocument(doc.clientId, doc.documentId)
          .then((blob) => blob.text())
          .then((text) => {
            setPreviewDocument((prev) => (prev?.documentId === doc.documentId ? { ...prev, content: text } : prev))
          })
          .catch(() => {
            setPreviewDocument((prev) =>
              prev?.documentId === doc.documentId
                ? { ...prev, content: 'Failed to load document content.' }
                : prev
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
