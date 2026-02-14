'use client'

import { useCallback, useEffect, useState } from 'react'

import { ClipboardCopy } from 'lucide-react'

import { ChecklistSection } from '@/components/shared/checklist-section'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { generateChecklist } from '@/lib/api'
import type { Checklist, ClassificationResult } from '@/types'

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState<Checklist | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('classificationResult')
    if (!stored) return

    async function load() {
      setLoading(true)
      try {
        const classification = JSON.parse(stored!) as ClassificationResult
        const data = await generateChecklist(classification)
        setChecklist(data)
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to generate checklist',
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleItem = useCallback(
    (phaseKey: string, itemIdx: number) => {
      setChecklist((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          phases: prev.phases.map((phase) =>
            phase.phase === phaseKey
              ? {
                  ...phase,
                  items: phase.items.map((item, i) =>
                    i === itemIdx
                      ? { ...item, completed: !item.completed }
                      : item,
                  ),
                }
              : phase,
          ),
        }
      })
    },
    [],
  )

  async function handleCopy() {
    if (!checklist) return
    const text = checklist.phases
      .map(
        (phase) =>
          `## ${phase.label}\n${phase.items
            .map(
              (item) =>
                `${item.completed ? '[x]' : '[ ]'} ${item.description} (${item.regulatoryReference})`,
            )
            .join('\n')}`,
      )
      .join('\n\n')

    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!loading && !checklist && !error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-4 text-2xl font-bold">Requirements Checklist</h1>
        <Alert>
          <AlertDescription>
            Complete the classification wizard first to generate your
            personalized checklist. Go to the{' '}
            <a href="/wizard" className="text-primary underline">
              Wizard
            </a>{' '}
            to get started.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Requirements Checklist</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Step-by-step guide for your licensing application
          </p>
          {checklist && (
            <p className="text-muted-foreground mt-1 text-xs">
              Classification: {checklist.tokenClassification} &middot;
              Licenses: {checklist.requiredLicenses.join(', ')}
            </p>
          )}
        </div>
        {checklist && (
          <Button variant="outline" size="sm" onClick={handleCopy}>
            <ClipboardCopy className="mr-2 h-4 w-4" />
            {copied ? 'Copied!' : 'Copy All'}
          </Button>
        )}
      </div>

      {loading && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-3 rounded-lg border p-4">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {checklist && (
        <div className="space-y-2">
          {checklist.phases.map((phase) => (
            <ChecklistSection
              key={phase.phase}
              phase={phase}
              onToggle={(itemIdx) => toggleItem(phase.phase, itemIdx)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
