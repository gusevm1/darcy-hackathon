import type { DocumentStatus } from '@/types'

export interface FileTreeDocument {
  type: 'document'
  documentId: string
  name: string
  fileName: string
  status: DocumentStatus
  clientId: string
  clientName: string
  stageId: string
  stageName: string
}

export interface FileTreeStageFolder {
  type: 'stage'
  stageId: string
  name: string
  children: FileTreeDocument[]
}

export interface FileTreeClientFolder {
  type: 'client'
  clientId: string
  name: string
  company: string
  children: FileTreeStageFolder[]
}

export interface Citation {
  index: number
  documentId: string
  documentName: string
  clientName: string
  stageName: string
  path: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations: Citation[]
  timestamp: Date
}

export interface CannedResponse {
  keywords: string[]
  content: string
  citationDocIds: string[]
}

export interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
}

export interface DocumentPreview {
  documentId: string
  documentName: string
  clientName: string
  company: string
  stageName: string
  status: DocumentStatus
  fileName: string
  category: string
  description: string
  summary: string
  content: string
}
