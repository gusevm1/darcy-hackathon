'use client'

import { useEffect, useState } from 'react'

import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  Target,
} from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { analyzeGaps } from '@/lib/api/consult'
import { cn } from '@/lib/utils'
import type { Gap, GapAnalysis, NextStep } from '@/lib/api/types'

interface GapAnalysisPanelProps {
  clientId: string
}

const severityConfig = {
  missing: { label: 'Missing', className: 'bg-red-100 text-red-700' },
  incomplete: {
    label: 'Incomplete',
    className: 'bg-amber-100 text-amber-700',
  },
  needs_review: {
    label: 'Needs Review',
    className: 'bg-blue-100 text-blue-700',
  },
}

export function GapAnalysisPanel({ clientId }: GapAnalysisPanelProps) {
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (!clientId) return
    let cancelled = false
    // eslint-disable-next-line react-hooks/set-state-in-effect -- initializes from async fetch
    setLoading(true)
    analyzeGaps(clientId)
      .then((data) => {
        if (!cancelled) setAnalysis(data)
      })
      .catch(() => {
        // API unavailable
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [clientId])

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-muted-foreground text-sm">
          Analyzing readiness...
        </span>
      </div>
    )
  }

  if (!analysis) return null

  const { readiness_score, gaps, next_steps, critical_blockers } =
    analysis

  // Group gaps by category
  const gapsByCategory = gaps.reduce(
    (acc, gap) => {
      const cat = gap.category
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(gap)
      return acc
    },
    {} as Record<string, Gap[]>,
  )

  return (
    <div className="space-y-2 rounded-lg border bg-muted/10 p-4">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Target className="h-4 w-4" />
          <span className="text-sm font-semibold">Readiness</span>
          <div className="flex items-center gap-2">
            <Progress
              value={readiness_score}
              className="h-2 w-24"
            />
            <span className="text-sm font-medium">
              {Math.round(readiness_score)}%
            </span>
          </div>
          {critical_blockers.length > 0 && (
            <Badge
              variant="destructive"
              className="text-[10px]"
            >
              {critical_blockers.length} blocker
              {critical_blockers.length > 1 ? 's' : ''}
            </Badge>
          )}
          {gaps.length > 0 && (
            <span className="text-muted-foreground text-xs">
              {gaps.length} gap{gaps.length > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>

      {expanded && (
        <div className="space-y-4 pt-2">
          {/* Critical Blockers */}
          {critical_blockers.length > 0 && (
            <div className="space-y-1">
              <h4 className="flex items-center gap-1 text-xs font-semibold text-red-600">
                <AlertTriangle className="h-3 w-3" />
                Critical Blockers
              </h4>
              {critical_blockers.map((blocker, i) => (
                <p
                  key={i}
                  className="rounded bg-red-50 px-2 py-1 text-xs text-red-700 dark:bg-red-950/20"
                >
                  {blocker}
                </p>
              ))}
            </div>
          )}

          {/* Gaps by category */}
          {Object.entries(gapsByCategory).length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold">Gaps</h4>
              {Object.entries(gapsByCategory).map(
                ([category, categoryGaps]) => (
                  <div key={category} className="space-y-1">
                    <span className="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
                      {category}
                    </span>
                    {categoryGaps.map((gap, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-2 rounded border px-2 py-1.5"
                      >
                        <Badge
                          variant="secondary"
                          className={cn(
                            'shrink-0 text-[10px]',
                            severityConfig[gap.severity]
                              .className,
                          )}
                        >
                          {severityConfig[gap.severity].label}
                        </Badge>
                        <span className="text-xs">
                          {gap.description}
                        </span>
                      </div>
                    ))}
                  </div>
                ),
              )}
            </div>
          )}

          {/* Next Steps */}
          {next_steps.length > 0 && (
            <div className="space-y-1">
              <h4 className="text-xs font-semibold">
                Next Steps
              </h4>
              {next_steps.slice(0, 5).map(
                (step: NextStep, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs"
                  >
                    <ArrowRight className="text-muted-foreground h-3 w-3 shrink-0" />
                    <span>{step.action}</span>
                    {step.estimated_days && (
                      <span className="text-muted-foreground ml-auto shrink-0">
                        ~{step.estimated_days}d
                      </span>
                    )}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
