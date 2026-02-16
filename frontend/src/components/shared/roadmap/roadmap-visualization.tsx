'use client'

import { GapAnalysisPanel } from '@/components/shared/roadmap/gap-analysis-panel'
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
import { useRoadmap } from '@/contexts/roadmap-context'

export function RoadmapVisualization() {
  const {
    client,
    definition,
    selectedStageIndex,
    setSelectedStageIndex,
    documentStates,
    uploadDocument,
    resetDocument,
    uploading,
    clients,
    selectedClientId,
    handleSelectClient,
  } = useRoadmap()

  if (!definition) return null

  const stage = definition.stages[selectedStageIndex]

  return (
    <div className="flex h-full flex-col">
      <div className="space-y-4 border-b px-6 py-4">
        {clients && handleSelectClient && (
          <Select value={selectedClientId} onValueChange={handleSelectClient}>
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
        <GapAnalysisPanel clientId={client.id} />
        <TimelineStepper
          stages={definition.stages}
          currentStageIndex={client.currentStageIndex}
          selectedStageIndex={selectedStageIndex}
          onSelectStage={setSelectedStageIndex}
        />
      </div>
      <ScrollArea className="flex-1 p-6">
        {stage && (
          <StageDetail
            stage={stage}
            documentStates={documentStates}
            onUpload={uploadDocument}
            onReset={resetDocument}
            uploading={uploading}
            clientId={client.id}
          />
        )}
      </ScrollArea>
    </div>
  )
}
