import {
  CheckCircle,
  Clock,
  Globe,
  Landmark,
  Shield,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { JurisdictionInfo } from '@/types'

interface JurisdictionCardProps {
  info: JurisdictionInfo
}

export function JurisdictionCard({ info }: JurisdictionCardProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle>{info.name}</CardTitle>
        <CardDescription>{info.framework}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex items-center gap-2 text-sm">
          <Landmark className="text-muted-foreground h-4 w-4 shrink-0" />
          <span className="text-muted-foreground">Regulator:</span>
          <span className="font-medium">{info.regulatoryBody}</span>
        </div>

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium uppercase tracking-wide">
            License Types
          </p>
          <div className="flex flex-wrap gap-1">
            {info.licenseTypes.map((lt) => (
              <Badge key={lt.type} variant="secondary" className="text-xs">
                {lt.type}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          {info.capitalRequirements.length > 0 && (
            <div className="flex items-start gap-2">
              <Shield className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <span className="text-muted-foreground">Capital: </span>
                {info.capitalRequirements.map((cr, i) => (
                  <span key={i}>
                    {cr.amount}
                    {i < info.capitalRequirements.length - 1 ? ', ' : ''}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="text-muted-foreground">Timeline:</span>
            <span>{info.timeline}</span>
          </div>
          <div className="flex items-center gap-2">
            <Globe className="text-muted-foreground h-4 w-4 shrink-0" />
            <span className="text-muted-foreground">Passporting:</span>
            <span>{info.passporting}</span>
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-muted-foreground mb-1.5 text-xs font-medium uppercase tracking-wide">
            Key Obligations
          </p>
          <ul className="space-y-1">
            {info.keyObligations.map((obligation, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                {obligation}
              </li>
            ))}
          </ul>
        </div>

        {info.transitionalProvisions && (
          <div className="mt-auto pt-2">
            <p className="text-muted-foreground text-xs font-medium">
              Transitional Provisions
            </p>
            <p className="mt-1 text-xs">{info.transitionalProvisions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
