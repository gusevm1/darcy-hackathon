'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { StageDetail } from '@/components/shared/stage-detail'
import { TimelineStepper } from '@/components/shared/timeline-stepper'
import { useDocumentState } from '@/hooks/use-document-state'
import { getClient } from '@/data/clients'
import { getLicenseDefinition } from '@/data/license-stages'
import { licenseColors } from '@/lib/constants/license'
import { cn } from '@/lib/utils'

export default function ClientTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const client = getClient(id)

  if (!client) {
    notFound()
  }

  const definition = getLicenseDefinition(client.licenseType)

  if (!definition) {
    notFound()
  }

  const [selectedStageIndex, setSelectedStageIndex] = useState(
    client.currentStageIndex,
  )
  const { documentStates, uploadDocument, resetDocument } = useDocumentState(
    client.documentStates,
  )

  const selectedStage = definition.stages[selectedStageIndex]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/clients">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Clients
          </Link>
        </Button>
      </div>

      <div className="mb-8 space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            {client.company}
          </h1>
          <Badge
            variant="secondary"
            className={cn('text-xs', licenseColors[client.licenseType])}
          >
            {definition.label}
          </Badge>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span>{client.name}</span>
          <span>{client.contactEmail}</span>
          <span>Legal basis: {definition.legalBasis}</span>
        </div>
      </div>

      <div className="mb-8">
        <TimelineStepper
          stages={definition.stages}
          currentStageIndex={client.currentStageIndex}
          selectedStageIndex={selectedStageIndex}
          onSelectStage={setSelectedStageIndex}
        />
      </div>

      <Separator className="mb-8" />

      {selectedStage && (
        <StageDetail
          stage={selectedStage}
          documentStates={documentStates}
          onUpload={uploadDocument}
          onReset={resetDocument}
        />
      )}
    </div>
  )
}
