'use client'

import { StageDetail } from '@/components/shared/stage-detail'
import { TimelineStepper } from '@/components/shared/timeline-stepper'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Client, ClientDocumentState, LicenseDefinition } from '@/types'

interface RoadmapVisualizationProps {
  client: Client
  definition: LicenseDefinition | undefined
  selectedStageIndex: number
  onSelectStage: (index: number) => void
  documentStates: ClientDocumentState[]
  onUpload: (docId: string, file: File) => void
  onReset: (docId: string) => void
  uploading?: Set<string>
  showClientSelector?: boolean
  clients?: Client[]
  selectedClientId?: string
  onSelectClient?: (clientId: string) => void
}

export function RoadmapVisualization({
  client,
  definition,
  selectedStageIndex,
  onSelectStage,
  documentStates,
  onUpload,
  onReset,
  uploading,
  showClientSelector,
  clients,
  selectedClientId,
  onSelectClient,
}: RoadmapVisualizationProps) {
  if (!definition) return null

  const stage = definition.stages[selectedStageIndex]

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b px-6 py-4">
        {showClientSelector && clients && onSelectClient && (
          <Select value={selectedClientId} onValueChange={onSelectClient}>
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue placeholder="Select a client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.company} — {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        <div>
          <h1 className="text-lg font-semibold">{client.company}</h1>
          <p className="text-muted-foreground text-sm">
            {definition.label} — {definition.legalBasis}
          </p>
        </div>
        <TimelineStepper
          stages={definition.stages}
          currentStageIndex={client.currentStageIndex}
          selectedStageIndex={selectedStageIndex}
          onSelectStage={onSelectStage}
        />
      </div>
      <ScrollArea className="flex-1 p-6">
        {stage && (
          <StageDetail
            stage={stage}
            documentStates={documentStates}
            onUpload={onUpload}
            onReset={onReset}
            uploading={uploading}
            clientId={client.id}
          />
        )}
      </ScrollArea>
    </div>
  )
}
