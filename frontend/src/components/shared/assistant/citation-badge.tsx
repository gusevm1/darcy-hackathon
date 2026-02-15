'use client'

import { memo } from 'react'

import type { Citation } from '@/types/assistant'

interface CitationBadgeProps {
  citation: Citation
  onCitationClick: (citation: Citation) => void
}

export const CitationBadge = memo(function CitationBadge({
  citation,
  onCitationClick,
}: CitationBadgeProps) {
  return (
    <button
      type="button"
      className="text-primary cursor-pointer text-sm font-medium underline underline-offset-2 hover:opacity-80"
      onClick={() => onCitationClick(citation)}
      title={citation.path}
    >
      [{citation.index}]
    </button>
  )
})
