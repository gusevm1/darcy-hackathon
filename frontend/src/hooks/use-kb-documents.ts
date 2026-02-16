'use client'

import { useEffect, useState } from 'react'

import { listDocuments } from '@/lib/api/kb'
import type { KBDocument } from '@/lib/api/types'

export function useKBDocuments() {
  const [kbDocs, setKbDocs] = useState<KBDocument[]>([])
  const [kbLoading, setKbLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function fetchDocs() {
      setKbLoading(true)
      try {
        const result = await listDocuments(0, 100)
        if (!cancelled) setKbDocs(result.items)
      } catch (err) {
        console.error('Failed to fetch KB documents:', err)
      } finally {
        if (!cancelled) setKbLoading(false)
      }
    }
    fetchDocs()
    return () => {
      cancelled = true
    }
  }, [])

  return { kbDocs, kbLoading }
}
