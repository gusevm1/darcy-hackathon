import type { Client, ClientDocumentState } from '@/types'

import { licenseDefinitions } from './license-stages'

/**
 * Build document states for Alpine Digital Bank AG (thomas-muller).
 *
 * The statuses are aligned with the EHP comment feedback:
 * - All Stage 1 (Pre-Consultation) resolved → approved
 * - Stage 2 (Application Preparation) mixed:
 *   - Docs with only resolved comments → approved
 *   - Docs with unresolved feedback → under-review
 * - Stage 3 (Submission) early progress:
 *   - A few docs uploaded/under-review
 *   - Rest not-started
 * - Stages 4-6: All not-started
 */
function buildAlpineBankStates(): ClientDocumentState[] {
  const definition = licenseDefinitions.find((d) => d.type === 'banking')
  if (!definition) return []

  // Docs where all comments are resolved → approved
  const approved = new Set([
    // Stage 1: all resolved
    'banking-1-1',
    'banking-1-2',
    'banking-1-3',
    'banking-1-4',
    'banking-1-5',
    'banking-1-6',
    // Stage 2: resolved-only threads
    'banking-2-1', // business plan — resolved after sensitivity analysis
    'banking-2-2', // articles — resolved (minor fix done)
    'banking-2-4', // org chart — approved, no further action
    'banking-2-5', // capital plan — resolved
    // Stage 3: audit firm confirmed
    'banking-3-3',
  ])

  // Docs with unresolved FINMA feedback → under-review
  const underReview = new Set([
    'banking-2-3', // org regulations — delegation matrix needed
    'banking-2-6', // board dossiers — CV issue
    'banking-2-7', // exec dossiers — reference letters needed
    'banking-2-8', // risk mgmt — operational resilience + climate risk
    'banking-2-9', // internal controls — compliance reporting line
    'banking-2-10', // AML/KYC — threshold correction
    'banking-2-11', // remuneration — deferral period
    'banking-2-12', // qualified participants — pending UBO declaration
    'banking-3-1', // application form — completeness check in progress
  ])

  // Docs uploaded but no comments yet
  const uploaded = new Set([
    'banking-3-2', // notarized articles — submitted
  ])

  const states: ClientDocumentState[] = []

  for (const stage of definition.stages) {
    for (const doc of stage.documents) {
      if (approved.has(doc.id)) {
        states.push({
          documentId: doc.id,
          status: 'approved',
          fileName: `${doc.id}.txt`,
          uploadedAt: '2025-08-15T10:00:00Z',
        })
      } else if (underReview.has(doc.id)) {
        states.push({
          documentId: doc.id,
          status: 'under-review',
          fileName: `${doc.id}.txt`,
          uploadedAt: '2025-09-15T10:00:00Z',
        })
      } else if (uploaded.has(doc.id)) {
        states.push({
          documentId: doc.id,
          status: 'uploaded',
          fileName: `${doc.id}.txt`,
          uploadedAt: '2025-10-20T10:00:00Z',
        })
      } else {
        states.push({
          documentId: doc.id,
          status: 'not-started',
        })
      }
    }
  }

  return states
}

export const clients: Client[] = [
  {
    id: 'thomas-muller',
    name: 'Thomas Müller',
    company: 'Alpine Digital Bank AG',
    licenseType: 'banking',
    currentStageIndex: 2,
    documentStates: buildAlpineBankStates(),
    startDate: '2025-06-01',
    contactEmail: 'thomas.muller@alpinedigital.ch',
  },
]

export function getClient(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}
