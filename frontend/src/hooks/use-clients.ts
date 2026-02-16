'use client'

import { useEffect, useState } from 'react'

import { apiClientToClient, listClients } from '@/lib/api/clients'
import type { Client } from '@/types'

export function useClients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function fetchClients() {
      try {
        const result = await listClients()
        if (!cancelled) {
          setClients(result.items.map(apiClientToClient))
        }
      } catch (err) {
        console.error('Failed to fetch clients:', err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchClients()
    return () => {
      cancelled = true
    }
  }, [])

  return { clients, loading }
}
