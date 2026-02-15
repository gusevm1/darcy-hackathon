'use client'

import { Separator } from '@/components/ui/separator'
import type { Citation } from '@/types/assistant'

interface SourceListProps {
  citations: Citation[]
  onCitationClick: (citation: Citation) => void
}

export function SourceList({ citations, onCitationClick }: SourceListProps) {
  if (citations.length === 0) return null

  return (
    <div className="mt-2">
      <Separator className="mb-2" />
      <p className="text-muted-foreground mb-1 text-xs font-medium">Sources</p>
      <ul className="space-y-0.5">
        {citations.map((citation) => (
          <li key={citation.documentId}>
            <button
              type="button"
              className="text-muted-foreground hover:text-foreground cursor-pointer text-left text-xs transition-colors"
              onClick={() => onCitationClick(citation)}
            >
              [{citation.index}] {citation.documentName} —{' '}
              {citation.clientName} / {citation.stageName}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
