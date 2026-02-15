'use client'

import { useCallback, useMemo, useState } from 'react'

import { clients as allClients } from '@/data/clients'
import { licenseDefinitions } from '@/data/license-stages'
import type { ClientContext } from '@/lib/api/consult'
import type { Citation } from '@/types/assistant'

import { useChatSessions } from './use-chat-sessions'
import { useDocumentPreview } from './use-document-preview'
import { useDocumentState } from './use-document-state'

interface UseRoadmapStateOptions {
  role: 'client' | 'consultant'
}

export function useRoadmapState({ role }: UseRoadmapStateOptions) {
  const [selectedClientId, setSelectedClientId] = useState<string>(allClients[0]?.id ?? '')
  const [selectedStageIndex, setSelectedStageIndex] = useState<number>(-1)

  const client = useMemo(
    () => allClients.find((c) => c.id === selectedClientId) ?? allClients[0],
    [selectedClientId]
  )

  const definition = useMemo(
    () => licenseDefinitions.find((d) => d.type === client.licenseType),
    [client.licenseType]
  )

  const activeStageIndex = selectedStageIndex >= 0 ? selectedStageIndex : client.currentStageIndex

  const { documentStates, uploadDocument, resetDocument } = useDocumentState(client.documentStates)

  const clientContext = useMemo((): ClientContext => {
    const stageName = definition?.stages[client.currentStageIndex]?.name ?? 'Unknown'
    const approved = client.documentStates.filter((d) => d.status === 'approved').length
    const total = client.documentStates.length
    return {
      name: client.name,
      company: client.company,
      licenseType: client.licenseType,
      currentStageName: stageName,
      documentSummary: `${approved} of ${total} documents approved`,
    }
  }, [client, definition])

  const { chats, activeChatId, messages, createNewChat, switchChat, sendMessage, isLoading } =
    useChatSessions(client.id, clientContext)

  const {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange,
  } = useDocumentPreview()

  const handleCitationClick = useCallback(
    (citation: Citation) => {
      if (!definition) return
      for (const stage of definition.stages) {
        const doc = stage.documents.find((d) => d.id === citation.documentId)
        if (doc) {
          const state = documentStates.find((ds) => ds.documentId === doc.id)
          setPreviewDocument({
            documentId: doc.id,
            documentName: doc.name,
            clientName: client.name,
            company: client.company,
            stageName: stage.name,
            status: state?.status ?? 'not-started',
            fileName: state?.fileName ?? `${doc.id}.pdf`,
            category: doc.category,
            description: doc.description,
            summary: `Document for ${client.company}: ${doc.name} — ${stage.name} stage.`,
            content: `CONFIDENTIAL — ${client.company}\n${doc.name}\nPrepared for FINMA\n\nThis document covers the ${doc.name.toLowerCase()} requirements for the ${definition.label} application.`,
          })
          setPreviewOpen(true)
          break
        }
      }
    },
    [client, definition, documentStates, setPreviewDocument, setPreviewOpen]
  )

  const handleSelectClient = useCallback((clientId: string) => {
    setSelectedClientId(clientId)
    setSelectedStageIndex(-1)
  }, [])

  return {
    role,
    client,
    clients: allClients,
    definition,
    selectedStageIndex: activeStageIndex,
    setSelectedStageIndex,
    documentStates,
    uploadDocument,
    resetDocument,
    messages,
    chats,
    activeChatId,
    createNewChat,
    switchChat,
    sendMessage,
    isLoading,
    previewDocument,
    previewOpen,
    handlePreviewOpenChange,
    handleCitationClick,
    selectedClientId,
    handleSelectClient,
  }
}
