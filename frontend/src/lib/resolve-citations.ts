import type { Client, LicenseDefinition } from '@/types'
import type { Citation } from '@/types/assistant'

export function resolveCitations(
  docIds: string[],
  clients: Client[],
  licenseDefinitions: LicenseDefinition[]
): Citation[] {
  return docIds
    .map((docId, idx) => {
      for (const client of clients) {
        const definition = licenseDefinitions.find((d) => d.type === client.licenseType)
        if (!definition) continue

        for (const stage of definition.stages) {
          const doc = stage.documents.find((d) => d.id === docId)
          if (doc) {
            return {
              index: idx + 1,
              documentId: doc.id,
              documentName: doc.name,
              clientName: client.company,
              stageName: stage.name,
              path: `${client.company} / ${stage.name} / ${doc.name}`,
            }
          }
        }
      }
      return null
    })
    .filter((c): c is Citation => c !== null)
}
