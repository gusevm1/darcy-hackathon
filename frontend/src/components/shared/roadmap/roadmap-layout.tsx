'use client'

import type { ReactNode } from 'react'

interface RoadmapLayoutProps {
  visualization: ReactNode
  chatPanel: ReactNode
}

export function RoadmapLayout({ visualization, chatPanel }: RoadmapLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
      <div className="flex flex-1 flex-col overflow-y-auto border-r lg:w-3/5">
        {visualization}
      </div>
      <div className="hidden w-2/5 flex-col lg:flex">{chatPanel}</div>
    </div>
  )
}
