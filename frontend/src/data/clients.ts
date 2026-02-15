import type { Client, ClientDocumentState } from '@/types'

import { licenseDefinitions } from './license-stages'

function buildDocumentStates(
  licenseType: string,
  currentStageIndex: number
): ClientDocumentState[] {
  const definition = licenseDefinitions.find((d) => d.type === licenseType)
  if (!definition) return []

  const states: ClientDocumentState[] = []

  definition.stages.forEach((stage, stageIndex) => {
    stage.documents.forEach((doc, docIndex) => {
      if (stageIndex < currentStageIndex) {
        states.push({
          documentId: doc.id,
          status: 'approved',
          fileName: `${doc.id}-approved.pdf`,
          uploadedAt: '2025-08-15T10:00:00Z',
        })
      } else if (stageIndex === currentStageIndex) {
        if (docIndex === 0) {
          states.push({
            documentId: doc.id,
            status: 'approved',
            fileName: `${doc.id}-approved.pdf`,
            uploadedAt: '2025-10-01T10:00:00Z',
          })
        } else if (docIndex === 1) {
          states.push({
            documentId: doc.id,
            status: 'under-review',
            fileName: `${doc.id}-review.pdf`,
            uploadedAt: '2025-10-10T10:00:00Z',
          })
        } else if (docIndex === 2) {
          states.push({
            documentId: doc.id,
            status: 'uploaded',
            fileName: `${doc.id}-uploaded.pdf`,
            uploadedAt: '2025-10-15T10:00:00Z',
          })
        } else {
          states.push({
            documentId: doc.id,
            status: 'not-started',
          })
        }
      } else {
        states.push({
          documentId: doc.id,
          status: 'not-started',
        })
      }
    })
  })

  return states
}

export const clients: Client[] = [
  {
    id: 'thomas-muller',
    name: 'Thomas Müller',
    company: 'Alpine Digital Bank AG',
    licenseType: 'banking',
    currentStageIndex: 2,
    documentStates: buildDocumentStates('banking', 2),
    startDate: '2025-06-01',
    contactEmail: 'thomas.muller@alpinedigital.ch',
  },
]

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}
