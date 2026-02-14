'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { ChecklistItemRow } from '@/components/shared/checklist-item'
import type { ChecklistPhase } from '@/types'

interface ChecklistSectionProps {
  phase: ChecklistPhase
  onToggle: (itemIdx: number) => void
}

export function ChecklistSection({
  phase,
  onToggle,
}: ChecklistSectionProps) {
  const completed = phase.items.filter((i) => i.completed).length
  const total = phase.items.length

  return (
    <Accordion type="single" collapsible defaultValue={phase.phase}>
      <AccordionItem value={phase.phase}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center gap-3">
            <span className="font-semibold">{phase.label}</span>
            <Badge variant="secondary" className="text-xs">
              {completed}/{total}
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="divide-y">
            {phase.items.map((item, idx) => (
              <ChecklistItemRow
                key={idx}
                item={item}
                onToggle={() => onToggle(idx)}
              />
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
