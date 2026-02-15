'use client'

import { Check } from 'lucide-react'

import { cn } from '@/lib/utils'
import type { LicenseStage, StageStatus } from '@/types'

interface TimelineStepperProps {
  stages: LicenseStage[]
  currentStageIndex: number
  selectedStageIndex: number
  onSelectStage: (index: number) => void
}

function getStageStatus(stageIndex: number, currentStageIndex: number): StageStatus {
  if (stageIndex < currentStageIndex) return 'completed'
  if (stageIndex === currentStageIndex) return 'in-progress'
  return 'not-started'
}

export function TimelineStepper({
  stages,
  currentStageIndex,
  selectedStageIndex,
  onSelectStage,
}: TimelineStepperProps) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex min-w-max items-start">
        {stages.map((stage, index) => {
          const status = getStageStatus(index, currentStageIndex)
          const isSelected = index === selectedStageIndex
          const isLast = index === stages.length - 1

          return (
            <div key={stage.id} className="flex items-start">
              <button
                type="button"
                onClick={() => onSelectStage(index)}
                className="group flex flex-col items-center gap-2"
              >
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-medium transition-all',
                    status === 'completed' && 'border-primary bg-primary text-primary-foreground',
                    status === 'in-progress' &&
                      'border-primary text-primary animate-pulse ring-2 ring-primary/20',
                    status === 'not-started' && 'border-muted-foreground/30 text-muted-foreground',
                    isSelected && 'ring-primary/40 ring-2',
                    'group-hover:ring-primary/40 group-hover:ring-2 cursor-pointer'
                  )}
                >
                  {status === 'completed' ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    'max-w-[5rem] text-center text-xs leading-tight',
                    status === 'completed' && 'text-foreground font-medium',
                    status === 'in-progress' && 'text-primary font-medium',
                    status === 'not-started' && 'text-muted-foreground',
                    isSelected && 'font-semibold'
                  )}
                >
                  {stage.shortName}
                </span>
              </button>

              {!isLast && (
                <div className="mt-5 flex items-center px-1 sm:px-2">
                  <div
                    className={cn(
                      'h-0.5 w-8 sm:w-12',
                      index < currentStageIndex
                        ? 'bg-primary'
                        : 'border-muted-foreground/30 border-t-2 border-dashed'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
