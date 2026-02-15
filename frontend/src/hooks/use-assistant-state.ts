'use client'

import { useCallback, useMemo, useState } from 'react'

import { toast } from 'sonner'

import { clients as initialClients } from '@/data/clients'
import { licenseDefinitions } from '@/data/license-stages'
import { buildFileTree } from '@/lib/build-file-tree'
import type { Client } from '@/types'
import type { Citation } from '@/types/assistant'

import { useChatSessions } from './use-chat-sessions'
import { useDocumentPreview } from './use-document-preview'
import { useFileTree } from './use-file-tree'

export function useAssistantState() {
  const [clientsState, setClientsState] = useState<Client[]>(() =>
    structuredClone(initialClients),
  )

  const {
    expandedNodes,
    highlightedDocumentId,
    highlightTimerRef,
    setExpandedNodes,
    setHighlightedDocumentId,
    toggleNode,
  } = useFileTree()

  const {
    chats,
    activeChatId,
    messages,
    createNewChat,
    switchChat,
    sendMessage,
  } = useChatSessions(clientsState)

  const {
    previewDocument,
    previewOpen,
    setPreviewDocument,
    setPreviewOpen,
    handlePreviewOpenChange: baseHandlePreviewOpenChange,
  } = useDocumentPreview()

  const fileTree = useMemo(
    () => buildFileTree(clientsState, licenseDefinitions),
    [clientsState],
  )

  const handlePreviewOpenChange = useCallback(
    (open: boolean) => {
      baseHandlePreviewOpenChange(open)
      if (!open) {
        setHighlightedDocumentId(null)
        if (highlightTimerRef.current) {
          clearTimeout(highlightTimerRef.current)
          highlightTimerRef.current = null
        }
      }
    },
    [baseHandlePreviewOpenChange, setHighlightedDocumentId, highlightTimerRef],
  )

  const handleCitationClick = useCallback(
    (citation: Citation) => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current)
      }

      setHighlightedDocumentId(citation.documentId)

      setExpandedNodes((prev) => {
        const next = new Set(prev)
        for (const client of clientsState) {
          const definition = licenseDefinitions.find(
            (d) => d.type === client.licenseType,
          )
          if (!definition) continue

          for (const stage of definition.stages) {
            const doc = stage.documents.find(
              (d) => d.id === citation.documentId,
            )
            if (doc) {
              next.add(client.id)
              next.add(stage.id)
              return next
            }
          }
        }
        return next
      })

      for (const client of clientsState) {
        const definition = licenseDefinitions.find(
          (d) => d.type === client.licenseType,
        )
        if (!definition) continue

        for (const stage of definition.stages) {
          const doc = stage.documents.find(
            (d) => d.id === citation.documentId,
          )
          if (doc) {
            const state = client.documentStates.find(
              (ds) => ds.documentId === doc.id,
            )
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
              summary: `This ${doc.category.toLowerCase()} document for ${client.company} covers the ${doc.name.toLowerCase()} as required under ${definition.legalBasis}. It is part of the "${stage.name}" stage of the ${definition.label} application process. Current status: ${state?.status ?? 'not-started'}.`,
              mockContent: `CONFIDENTIAL — ${client.company}\n${doc.name}\nPrepared for: Swiss Financial Market Supervisory Authority (FINMA)\nLegal basis: ${definition.legalBasis}\nDate: ${state?.uploadedAt ? new Date(state.uploadedAt).toLocaleDateString('de-CH') : '—'}\n\n1. PURPOSE AND SCOPE\n\nThis document has been prepared by ${client.company} in fulfilment of the requirements set out under ${definition.legalBasis} for the ${definition.label} application. It addresses the regulatory expectations for the "${stage.name}" phase of the licensing process and covers all aspects of the ${doc.name.toLowerCase()} as specified in FINMA guidance.\n\n2. REGULATORY FRAMEWORK\n\nThe content of this document is aligned with the following Swiss regulatory provisions:\n\n- ${definition.legalBasis} and associated ordinances\n- FINMA Circular 2017/1 "Corporate Governance — Banks"\n- FINMA Circular 2008/21 "Operational Risks — Banks"\n- Anti-Money Laundering Act (AMLA) where applicable\n- Swiss Code of Obligations (CO), Art. 716a et seq.\n\nAll statements and representations made herein are accurate as of the date of submission and are subject to the ongoing supervisory oversight of FINMA.\n\n3. KEY PROVISIONS\n\n${doc.description}\n\nThe ${doc.category.toLowerCase()} framework documented herein has been reviewed by the compliance and legal departments of ${client.company}. It reflects the current organisational structure, risk appetite, and operational procedures of the applicant.\n\n3.1 Governance\nThe board of directors of ${client.company} has approved this document and takes ultimate responsibility for its contents. The designated compliance officer has verified adherence to all applicable regulatory standards.\n\n3.2 Implementation\nThe measures described in this document have been implemented in accordance with the project timeline submitted to FINMA. Regular internal audits will verify ongoing compliance.\n\n4. DECLARATIONS\n\nThe undersigned confirms that all information provided in this document is complete, accurate, and not misleading. ${client.company} undertakes to notify FINMA promptly of any material changes to the facts or circumstances described herein.\n\nAuthorised signatory: ${client.name}\nPosition: Designated responsible person\nDate: ${state?.uploadedAt ? new Date(state.uploadedAt).toLocaleDateString('de-CH') : '—'}`,
            })
            setPreviewOpen(true)
            break
          }
        }
      }

      highlightTimerRef.current = setTimeout(() => {
        setHighlightedDocumentId(null)
        highlightTimerRef.current = null
      }, 3000)
    },
    [clientsState, highlightTimerRef, setHighlightedDocumentId, setExpandedNodes, setPreviewDocument, setPreviewOpen],
  )

  const handleUploadFile = useCallback(
    (file: File) => {
      const candidates: { clientIndex: number; docId: string }[] = []

      clientsState.forEach((client, clientIndex) => {
        client.documentStates.forEach((ds) => {
          if (ds.status === 'not-started') {
            candidates.push({ clientIndex, docId: ds.documentId })
          }
        })
      })

      if (candidates.length === 0) {
        toast.info('All document slots are filled.')
        return
      }

      const pick = candidates[Math.floor(Math.random() * candidates.length)]

      setClientsState((prev) => {
        const next = structuredClone(prev)
        const client = next[pick.clientIndex]
        const docState = client.documentStates.find(
          (ds) => ds.documentId === pick.docId,
        )
        if (docState) {
          docState.status = 'uploaded'
          docState.fileName = file.name
          docState.uploadedAt = new Date().toISOString()
        }
        return next
      })

      let docName = pick.docId
      for (const def of licenseDefinitions) {
        for (const stage of def.stages) {
          const doc = stage.documents.find((d) => d.id === pick.docId)
          if (doc) {
            docName = doc.name
            break
          }
        }
      }

      const client = clientsState[pick.clientIndex]
      toast.success(
        `"${file.name}" classified as "${docName}" for ${client.company}`,
      )
    },
    [clientsState],
  )

  return {
    fileTree,
    expandedNodes,
    highlightedDocumentId,
    messages,
    chats,
    activeChatId,
    createNewChat,
    switchChat,
    previewDocument,
    previewOpen,
    handlePreviewOpenChange,
    sendMessage,
    handleCitationClick,
    handleUploadFile,
    toggleNode,
  }
}
