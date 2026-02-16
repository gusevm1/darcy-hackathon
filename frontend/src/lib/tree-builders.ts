import { licenseDefinitions } from '@/data/license-stages'
import type { KBDocument } from '@/lib/api/types'
import type { FileTreeClientFolder } from '@/types/assistant'

export function buildGeneralInfoTree(): FileTreeClientFolder[] {
  return licenseDefinitions.map((def) => ({
    type: 'client' as const,
    clientId: def.type,
    name: def.label,
    company: def.legalBasis,
    children: def.stages.map((stage) => ({
      type: 'stage' as const,
      stageId: stage.id,
      name: stage.name,
      children: stage.documents.map((doc) => ({
        type: 'document' as const,
        documentId: doc.id,
        name: doc.name,
        fileName: `${doc.id}.pdf`,
        status: 'approved' as const,
        clientId: def.type,
        clientName: def.label,
        stageId: stage.id,
        stageName: stage.name,
      })),
    })),
  }))
}

export function buildInternalKBTreeFromDocs(docs: KBDocument[]): FileTreeClientFolder[] {
  const grouped = new Map<string, KBDocument[]>()
  for (const doc of docs) {
    const source = doc.source || 'Other'
    if (!grouped.has(source)) grouped.set(source, [])
    grouped.get(source)!.push(doc)
  }

  return [
    {
      type: 'client' as const,
      clientId: 'internal-kb',
      name: 'Internal Knowledge Base',
      company: 'FINMA Comply',
      children: Array.from(grouped.entries()).map(([source, sourceDocs]) => ({
        type: 'stage' as const,
        stageId: source.toLowerCase().replace(/\s+/g, '-'),
        name: source,
        children: sourceDocs.map((doc) => ({
          type: 'document' as const,
          documentId: doc.doc_id,
          name: doc.title,
          fileName: `${doc.doc_id}.pdf`,
          status: 'approved' as const,
          clientId: 'internal-kb',
          clientName: 'Internal Knowledge Base',
          stageId: source.toLowerCase().replace(/\s+/g, '-'),
          stageName: source,
        })),
      })),
    },
  ]
}
