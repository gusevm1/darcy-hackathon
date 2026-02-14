'use client'

import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { Citation } from '@/types'

interface CitationBadgeProps {
  citation: Citation
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="outline"
          className="cursor-help text-xs font-normal"
        >
          {citation.article || 'Source'}
        </Badge>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-sm">
        <p className="text-xs font-medium">{citation.article}</p>
        {citation.text && (
          <p className="mt-1 text-xs">{citation.text}</p>
        )}
      </TooltipContent>
    </Tooltip>
  )
}
