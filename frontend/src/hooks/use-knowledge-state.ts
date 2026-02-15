'use client'

import { useCallback, useMemo, useState } from 'react'

import { clients } from '@/data/clients'
import { licenseDefinitions } from '@/data/license-stages'
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

function buildInternalKBTree(): FileTreeClientFolder[] {
  const categories = [
    {
      id: 'regulation',
      name: 'Regulations',
      docs: [
        { id: 'kb-1', name: 'FINMA Licensing Overview' },
        { id: 'kb-4', name: 'Capital Adequacy Requirements' },
        { id: 'kb-10', name: 'Swiss Solvency Test (SST)' },
      ],
    },
    {
      id: 'legislation',
      name: 'Legislation',
      docs: [
        { id: 'kb-2', name: 'Banking Act (BankA) Summary' },
        { id: 'kb-5', name: 'Insurance Supervision Act (ISA)' },
      ],
    },
    {
      id: 'compliance',
      name: 'Compliance & Guides',
      docs: [
        { id: 'kb-3', name: 'AML/KYC Best Practices' },
        { id: 'kb-6', name: 'FinTech License Guide' },
        { id: 'kb-8', name: 'Corporate Governance Circular 2017/1' },
        { id: 'kb-9', name: 'Outsourcing Guidelines' },
      ],
    },
    {
      id: 'templates',
      name: 'Templates',
      docs: [{ id: 'kb-7', name: 'Risk Management Framework Template' }],
    },
  ]

  return [
    {
      type: 'client' as const,
      clientId: 'internal-kb',
      name: 'Internal Knowledge Base',
      company: 'FINMA Comply',
      children: categories.map((cat) => ({
        type: 'stage' as const,
        stageId: cat.id,
        name: cat.name,
        children: cat.docs.map((doc) => ({
          type: 'document' as const,
          documentId: doc.id,
          name: doc.name,
          fileName: `${doc.id}.pdf`,
          status: 'approved' as const,
          clientId: 'internal-kb',
          clientName: 'Internal Knowledge Base',
          stageId: cat.id,
          stageName: cat.name,
        })),
      })),
    },
  ]
}

export function useKnowledgeState() {
  const [activeTab, setActiveTab] = useState<KnowledgeTab>('clients')

  const { expandedNodes, highlightedDocumentId, toggleNode } = useFileTree()

  const {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange,
  } = useDocumentPreview()

  const clientTree = useMemo(() => buildFileTree(clients, licenseDefinitions), [])
  const generalTree = useMemo(() => buildGeneralInfoTree(), [])
  const internalTree = useMemo(() => buildInternalKBTree(), [])

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
        mockContent: `DOCUMENT: ${doc.name}\n\nCategory: ${doc.stageName}\nSource: ${doc.clientName}\n\nThis is a placeholder document for the knowledge base viewer. In production, this would display the actual document content retrieved from the backend.`,
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
  }
}
