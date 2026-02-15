'use client'

import { DocumentItem } from '@/components/shared/document-item'
import { Progress } from '@/components/ui/progress'
import type { ClientDocumentState, LicenseStage } from '@/types'

interface StageDetailProps {
  stage: LicenseStage
  documentStates: ClientDocumentState[]
  onUpload: (docId: string, file: File) => void
  onReset: (docId: string) => void
  uploading?: Set<string>
  clientId: string
}

export function StageDetail({ stage, documentStates, onUpload, onReset, uploading, clientId }: StageDetailProps) {
  const stageDocIds = new Set(stage.documents.map((d) => d.id))
  const stageStates = documentStates.filter((s) => stageDocIds.has(s.documentId))
  const completedCount = stageStates.filter(
    (s) => s.status === 'approved' || s.status === 'verified'
  ).length
  const totalCount = stage.documents.length
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const categories = Array.from(new Set(stage.documents.map((d) => d.category)))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{stage.name}</h3>
        <p className="text-muted-foreground text-sm">{stage.description}</p>
        <div className="flex items-center gap-3">
          <Progress value={progress} className="h-2 max-w-xs" />
          <span className="text-muted-foreground text-sm">
            {completedCount} of {totalCount} approved
          </span>
        </div>
      </div>

      {categories.map((category) => {
        const categoryDocs = stage.documents.filter((d) => d.category === category)
        return (
          <div key={category} className="space-y-3">
            <h4 className="text-muted-foreground text-sm font-medium uppercase tracking-wide">
              {category}
            </h4>
            <div className="space-y-2">
              {categoryDocs.map((doc) => (
                <DocumentItem
                  key={doc.id}
                  document={doc}
                  state={documentStates.find((s) => s.documentId === doc.id)}
                  onUpload={onUpload}
                  onReset={onReset}
                  isUploading={uploading?.has(doc.id)}
                  clientId={clientId}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
