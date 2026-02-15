'use client'

import { useCallback, useMemo, useRef, useState } from 'react'

import { toast } from 'sonner'

import { clients as initialClients } from '@/data/clients'
import { matchCannedResponse } from '@/data/canned-responses'
import { licenseDefinitions } from '@/data/license-stages'
import { buildFileTree } from '@/lib/build-file-tree'
import { resolveCitations } from '@/lib/resolve-citations'
import type { Client } from '@/types'
import type {
  ChatMessage,
  ChatSession,
  Citation,
  DocumentPreview,
} from '@/types/assistant'

function generateId() {
  return Math.random().toString(36).slice(2, 11)
}

const welcomeMessage: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    'Hello! I\'m your FINMA compliance assistant. I can help you navigate the licensing process, review document status, and answer questions about regulatory requirements. Try asking about **AML/KYC policies**, **capital requirements**, or the **status** of your applications.',
  citations: [],
  timestamp: new Date(),
}

function createDefaultChat(): ChatSession {
  return {
    id: 'default',
    title: 'Welcome',
    messages: [welcomeMessage],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export function useAssistantState() {
  const [clientsState, setClientsState] = useState<Client[]>(() =>
    JSON.parse(JSON.stringify(initialClients)),
  )
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const set = new Set<string>()
    initialClients.forEach((c) => set.add(c.id))
    return set
  })
  const [highlightedDocumentId, setHighlightedDocumentId] = useState<
    string | null
  >(null)
  const [chats, setChats] = useState<ChatSession[]>(() => [createDefaultChat()])
  const [activeChatId, setActiveChatId] = useState('default')
  const [previewDocument, setPreviewDocument] =
    useState<DocumentPreview | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fileTree = useMemo(
    () => buildFileTree(clientsState, licenseDefinitions),
    [clientsState],
  )

  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) ?? chats[0],
    [chats, activeChatId],
  )
  const messages = activeChat.messages

  const createNewChat = useCallback(() => {
    const newChat: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [
        {
          ...welcomeMessage,
          id: generateId(),
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setChats((prev) => [newChat, ...prev])
    setActiveChatId(newChat.id)
  }, [])

  const switchChat = useCallback((chatId: string) => {
    setActiveChatId(chatId)
  }, [])

  const sendMessage = useCallback(
    (content: string) => {
      const trimmed = content.trim()
      if (!trimmed) return

      const userMsg: ChatMessage = {
        id: generateId(),
        role: 'user',
        content: trimmed,
        citations: [],
        timestamp: new Date(),
      }

      const matched = matchCannedResponse(trimmed)
      const citations = resolveCitations(
        matched.citationDocIds,
        clientsState,
        licenseDefinitions,
      )

      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: matched.content,
        citations,
        timestamp: new Date(),
      }

      setChats((prev) =>
        prev.map((chat) => {
          if (chat.id !== activeChatId) return chat

          const isFirstUserMessage =
            !chat.messages.some((m) => m.role === 'user')
          return {
            ...chat,
            messages: [...chat.messages, userMsg, assistantMsg],
            title: isFirstUserMessage
              ? trimmed.slice(0, 50) + (trimmed.length > 50 ? '...' : '')
              : chat.title,
            updatedAt: new Date(),
          }
        }),
      )
    },
    [clientsState, activeChatId],
  )

  const handleCitationClick = useCallback(
    (citation: Citation) => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current)
      }

      setHighlightedDocumentId(citation.documentId)

      // Auto-expand parent nodes
      setExpandedNodes((prev) => {
        const next = new Set(prev)
        // Find client and stage for this document
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

      // Build preview
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
    [clientsState],
  )

  const handlePreviewOpenChange = useCallback(
    (open: boolean) => {
      setPreviewOpen(open)
      if (!open) {
        setHighlightedDocumentId(null)
        if (highlightTimerRef.current) {
          clearTimeout(highlightTimerRef.current)
          highlightTimerRef.current = null
        }
      }
    },
    [],
  )

  const handleUploadFile = useCallback(
    (file: File) => {
      // Find a random not-started document across all clients
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
        const next = JSON.parse(JSON.stringify(prev)) as Client[]
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

      // Find the document name for the toast
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
