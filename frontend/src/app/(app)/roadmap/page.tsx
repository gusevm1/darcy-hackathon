'use client'

import { Loader2 } from 'lucide-react'

import { RoadmapChatPanel } from '@/components/shared/roadmap/roadmap-chat-panel'
import { RoadmapLayout } from '@/components/shared/roadmap/roadmap-layout'
import { RoadmapVisualization } from '@/components/shared/roadmap/roadmap-visualization'
import { RoadmapProvider, useRoadmap } from '@/contexts/roadmap-context'

function RoadmapContent() {
  const state = useRoadmap()

  if (state.loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <RoadmapLayout
      visualization={<RoadmapVisualization />}
      chatPanel={<RoadmapChatPanel title="Consultant Assistant" />}
    />
  )
}

export default function RoadmapPage() {
  return (
    <RoadmapProvider role="consultant">
      <RoadmapContent />
    </RoadmapProvider>
  )
}
