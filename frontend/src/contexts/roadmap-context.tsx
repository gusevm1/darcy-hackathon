'use client'

import { createContext, useContext } from 'react'

import { useRoadmapState } from '@/hooks/use-roadmap-state'

type RoadmapContextValue = ReturnType<typeof useRoadmapState>

const RoadmapContext = createContext<RoadmapContextValue | null>(null)

export function RoadmapProvider({
  role,
  children,
}: {
  role: 'client' | 'consultant'
  children: React.ReactNode
}) {
  const state = useRoadmapState({ role })
  return <RoadmapContext.Provider value={state}>{children}</RoadmapContext.Provider>
}

export function useRoadmap(): RoadmapContextValue {
  const ctx = useContext(RoadmapContext)
  if (!ctx) {
    throw new Error('useRoadmap must be used within a RoadmapProvider')
  }
  return ctx
}
