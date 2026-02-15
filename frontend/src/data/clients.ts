import type { Client, ClientDocumentState } from '@/types'
import { licenseDefinitions } from './license-stages'

function buildDocumentStates(
  licenseType: string,
  currentStageIndex: number,
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
  {
    id: 'sara-brunner',
    name: 'Sara Brunner',
    company: 'ZuriPay Fintech GmbH',
    licenseType: 'fintech',
    currentStageIndex: 1,
    documentStates: buildDocumentStates('fintech', 1),
    startDate: '2025-09-15',
    contactEmail: 'sara.brunner@zuripay.ch',
  },
  {
    id: 'marco-rossi',
    name: 'Marco Rossi',
    company: 'Helvetia Securities AG',
    licenseType: 'securities-firm',
    currentStageIndex: 4,
    documentStates: buildDocumentStates('securities-firm', 4),
    startDate: '2025-03-01',
    contactEmail: 'marco.rossi@helvetia-securities.ch',
  },
  {
    id: 'elena-fischer',
    name: 'Elena Fischer',
    company: 'Swiss Capital Funds AG',
    licenseType: 'fund-management',
    currentStageIndex: 3,
    documentStates: buildDocumentStates('fund-management', 3),
    startDate: '2025-05-10',
    contactEmail: 'elena.fischer@swisscapitalfunds.ch',
  },
  {
    id: 'lukas-weber',
    name: 'Lukas Weber',
    company: 'Edelweiss Insurance AG',
    licenseType: 'insurance',
    currentStageIndex: 0,
    documentStates: buildDocumentStates('insurance', 0),
    startDate: '2025-11-01',
    contactEmail: 'lukas.weber@edelweiss-insurance.ch',
  },
]

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}
