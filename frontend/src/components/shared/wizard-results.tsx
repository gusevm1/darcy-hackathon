import Link from 'next/link'

import { ArrowRight, CheckCircle, Clock, DollarSign, Shield } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { ClassificationResult } from '@/types'

interface WizardResultsProps {
  result: ClassificationResult
  onReset: () => void
}

export function WizardResults({ result, onReset }: WizardResultsProps) {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Classification Result</CardTitle>
          <CardDescription>
            {result.tokenClassification} &mdash;{' '}
            {result.tokenClassificationDetails}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Clock className="text-muted-foreground h-4 w-4" />
            <span className="text-muted-foreground">Timeline:</span>
            <span className="font-medium">{result.timelineEstimate}</span>
          </div>
          {result.simplifiedPathway && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-800">
              <p className="font-medium">Simplified pathway available</p>
              <p className="mt-1 text-green-700">
                {result.simplifiedPathwayDetails}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {result.requiredLicenses.map((license, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{license.licenseType}</CardTitle>
            <CardDescription>{license.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Article:</span>
                <Badge variant="secondary">{license.article}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">Timeline:</span>
                <span className="font-medium">{license.timeline}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {result.capitalRequirements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Capital Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.capitalRequirements.map((cap, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between gap-2 text-sm"
                >
                  <div className="flex items-start gap-2">
                    <DollarSign className="text-muted-foreground mt-0.5 h-3.5 w-3.5 shrink-0" />
                    <span>{cap.description}</span>
                  </div>
                  <Badge variant="outline">
                    &euro;{cap.minimumEur.toLocaleString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Key Obligations</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {result.keyObligations.map((obligation, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <CheckCircle className="text-primary mt-0.5 h-3.5 w-3.5 shrink-0" />
                {obligation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/checklist">View Checklist</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/chat">
            <ArrowRight className="mr-2 h-4 w-4" />
            Ask Questions
          </Link>
        </Button>
        <Button variant="ghost" onClick={onReset}>
          Start Over
        </Button>
      </div>
    </div>
  )
}
