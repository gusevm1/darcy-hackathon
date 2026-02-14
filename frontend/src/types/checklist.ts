export interface ChecklistItem {
  description: string
  regulatoryReference: string
  timeline: string
  priority: string
  completed?: boolean
}

export interface ChecklistPhase {
  phase: string
  label: string
  items: ChecklistItem[]
}

export interface Checklist {
  tokenClassification: string
  requiredLicenses: string[]
  phases: ChecklistPhase[]
}
