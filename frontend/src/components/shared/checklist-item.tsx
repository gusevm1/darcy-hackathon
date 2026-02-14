'use client'

import { Clock } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import type { ChecklistItem } from '@/types'

interface ChecklistItemRowProps {
  item: ChecklistItem
  onToggle: () => void
}

export function ChecklistItemRow({ item, onToggle }: ChecklistItemRowProps) {
  const id = `checklist-${item.regulatoryReference}-${item.description.slice(0, 20)}`

  return (
    <div className="flex items-start gap-3 py-2">
      <Checkbox
        id={id}
        checked={item.completed || false}
        onCheckedChange={onToggle}
        className="mt-0.5"
      />
      <div className="flex-1 space-y-1">
        <label
          htmlFor={id}
          className="cursor-pointer text-sm font-medium leading-tight"
        >
          {item.description}
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {item.timeline && (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {item.timeline}
            </span>
          )}
          {item.regulatoryReference && (
            <Badge variant="outline" className="text-xs font-normal">
              {item.regulatoryReference}
            </Badge>
          )}
          {item.priority && (
            <Badge
              variant={item.priority === 'high' ? 'destructive' : 'secondary'}
              className="text-xs"
            >
              {item.priority}
            </Badge>
          )}
        </div>
      </div>
    </div>
  )
}
