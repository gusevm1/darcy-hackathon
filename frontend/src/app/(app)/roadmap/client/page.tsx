'use client'

import { RoadmapChatPanel } from '@/components/shared/roadmap/roadmap-chat-panel'
import { RoadmapLayout } from '@/components/shared/roadmap/roadmap-layout'
import { RoadmapVisualization } from '@/components/shared/roadmap/roadmap-visualization'
import { useRoadmapState } from '@/hooks/use-roadmap-state'

export default function ClientRoadmapPage() {
  const state = useRoadmapState({ role: 'client' })

  return (
    <RoadmapLayout
      visualization={
        <RoadmapVisualization
          client={state.client}
          definition={state.definition}
          selectedStageIndex={state.selectedStageIndex}
          onSelectStage={state.setSelectedStageIndex}
          documentStates={state.documentStates}
          onUpload={state.uploadDocument}
          onReset={state.resetDocument}
        />
      }
      chatPanel={
        <RoadmapChatPanel
          title="Client Assistant"
          messages={state.messages}
          chats={state.chats}
          activeChatId={state.activeChatId}
          onSendMessage={state.sendMessage}
          onCitationClick={state.handleCitationClick}
          onNewChat={state.createNewChat}
          onSelectChat={state.switchChat}
          previewDocument={state.previewDocument}
          previewOpen={state.previewOpen}
          onPreviewOpenChange={state.handlePreviewOpenChange}
        />
      }
    />
  )
}
