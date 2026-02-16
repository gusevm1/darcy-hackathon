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
  // Filter to only internal knowledge docs
  const internalDocs = docs.filter((d) => d.source.startsWith('internal:'))

  const grouped = new Map<string, KBDocument[]>()
  for (const doc of internalDocs) {
    // Extract category from source (e.g., "internal:Email Archives" → "Email Archives")
    const category = doc.source.replace('internal:', '') || 'Other'
    if (!grouped.has(category)) grouped.set(category, [])
    grouped.get(category)!.push(doc)
  }

  return [
    {
      type: 'client' as const,
      clientId: 'internal-kb',
      name: 'Consultant Knowledge Base',
      company: 'JayBee Consulting',
      children: Array.from(grouped.entries()).map(([category, categoryDocs]) => ({
        type: 'stage' as const,
        stageId: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        children: categoryDocs.map((doc) => ({
          type: 'document' as const,
          documentId: doc.doc_id,
          name: doc.title,
          fileName: `${doc.doc_id}.pdf`,
          status: 'approved' as const,
          clientId: 'internal-kb',
          clientName: 'Consultant Knowledge Base',
          stageId: category.toLowerCase().replace(/\s+/g, '-'),
          stageName: category,
        })),
      })),
    },
  ]
}

export function buildRegulatoryTreeFromDocs(docs: KBDocument[]): FileTreeClientFolder[] {
  // Filter to only regulatory docs (not internal knowledge)
  const regulatoryDocs = docs.filter((d) => !d.source.startsWith('internal:'))

  const grouped = new Map<string, KBDocument[]>()
  for (const doc of regulatoryDocs) {
    const source = doc.source || 'Other'
    if (!grouped.has(source)) grouped.set(source, [])
    grouped.get(source)!.push(doc)
  }

  return [
    {
      type: 'client' as const,
      clientId: 'regulatory-kb',
      name: 'Regulatory Library',
      company: 'FINMA & Swiss Regulations',
      children: Array.from(grouped.entries()).map(([source, sourceDocs]) => ({
        type: 'stage' as const,
        stageId: source.toLowerCase().replace(/\s+/g, '-'),
        name: source
          .replace('.txt', '')
          .replace('.pdf', '')
          .replace(/_/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        children: sourceDocs.map((doc) => ({
          type: 'document' as const,
          documentId: doc.doc_id,
          name: doc.title,
          fileName: `${doc.doc_id}.pdf`,
          status: 'approved' as const,
          clientId: 'regulatory-kb',
          clientName: 'Regulatory Library',
          stageId: source.toLowerCase().replace(/\s+/g, '-'),
          stageName: source,
        })),
      })),
    },
  ]
}
