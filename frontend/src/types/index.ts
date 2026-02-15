export type LicenseType =
  | 'banking'
  | 'fintech'
  | 'securities-firm'
  | 'fund-management'
  | 'insurance'

export type DocumentStatus =
  | 'not-started'
  | 'uploaded'
  | 'under-review'
  | 'approved'
  | 'rejected'

export type StageStatus = 'not-started' | 'in-progress' | 'completed'

export interface RequiredDocument {
  id: string
  name: string
  description: string
  category: string
}

export interface LicenseStage {
  id: string
  name: string
  shortName: string
  description: string
  documents: RequiredDocument[]
}

export interface LicenseDefinition {
  type: LicenseType
  label: string
  legalBasis: string
  stages: LicenseStage[]
}

export interface ClientDocumentState {
  documentId: string
  status: DocumentStatus
  fileName?: string
  uploadedAt?: string
}

export interface Client {
  id: string
  name: string
  company: string
  licenseType: LicenseType
  currentStageIndex: number
  documentStates: ClientDocumentState[]
  startDate: string
  contactEmail: string
}
