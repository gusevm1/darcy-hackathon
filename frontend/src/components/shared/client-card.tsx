import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { licenseColors, licenseLabels } from '@/lib/constants/license'
import { cn } from '@/lib/utils'
import type { Client } from '@/types'
import { getLicenseDefinition } from '@/data/license-stages'

export function ClientCard({ client }: { client: Client }) {
  const definition = getLicenseDefinition(client.licenseType)
  const totalStages = definition?.stages.length ?? 6
  const progress = Math.round((client.currentStageIndex / totalStages) * 100)
  const currentStageName =
    definition?.stages[client.currentStageIndex]?.name ?? 'Unknown'

  return (
    <Link href={`/clients/${client.id}`}>
      <Card className="hover:border-primary/50 h-full transition-colors hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <CardTitle className="truncate text-base">
                {client.company}
              </CardTitle>
              <CardDescription className="truncate">
                {client.name}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={cn(
                'shrink-0 text-xs',
                licenseColors[client.licenseType],
              )}
            >
              {licenseLabels[client.licenseType]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {client.currentStageIndex} / {totalStages}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <p className="text-muted-foreground text-sm">
            Current: {currentStageName}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}
