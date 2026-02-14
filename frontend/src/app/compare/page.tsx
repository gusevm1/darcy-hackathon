'use client'

import { useEffect, useState } from 'react'

import { JurisdictionCard } from '@/components/shared/jurisdiction-card'
import { Skeleton } from '@/components/ui/skeleton'
import { getJurisdictions } from '@/lib/api'
import type { JurisdictionInfo } from '@/types'

export default function ComparePage() {
  const [jurisdictions, setJurisdictions] = useState<JurisdictionInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const data = await getJurisdictions()
        setJurisdictions(data)
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Failed to load jurisdictions',
        )
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Compare Jurisdictions</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Side-by-side comparison of EU (MiCAR), UK (FCA), and Swiss (FINMA)
          crypto regulatory frameworks
        </p>
      </div>

      {error && (
        <div className="text-destructive rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-4 rounded-lg border p-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          {jurisdictions.map((info) => (
            <JurisdictionCard key={info.name} info={info} />
          ))}
        </div>
      )}
    </div>
  )
}
