import type { Client, LicenseDefinition } from '@/types'
import type { FileTreeClientFolder, FileTreeDocument, FileTreeStageFolder } from '@/types/assistant'

export function buildFileTree(
  clients: Client[],
  licenseDefinitions: LicenseDefinition[]
): FileTreeClientFolder[] {
  return clients
    .map((client) => {
      const definition = licenseDefinitions.find((d) => d.type === client.licenseType)
      if (!definition) return null

      const stageFolders: FileTreeStageFolder[] = definition.stages
        .map((stage) => {
          const documents: FileTreeDocument[] = stage.documents.flatMap((doc) => {
            const state = client.documentStates.find((ds) => ds.documentId === doc.id)
            if (!state || state.status === 'not-started') return []

            const result: FileTreeDocument = {
              type: 'document',
              documentId: doc.id,
              name: doc.name,
              fileName: state.fileName ?? `${doc.id}.pdf`,
              status: state.status,
              clientId: client.id,
              clientName: client.company,
              stageId: stage.id,
              stageName: stage.name,
            }
            return [result]
          })

          return {
            type: 'stage' as const,
            stageId: stage.id,
            name: stage.name,
            children: documents,
          }
        })

      const folder: FileTreeClientFolder = {
        type: 'client',
        clientId: client.id,
        name: client.company,
        company: client.company,
        children: stageFolders,
        completedItems: client.completedItems,
        totalItems: client.totalItems,
      }
      return folder
    })
    .filter((c): c is FileTreeClientFolder => c !== null)
}
