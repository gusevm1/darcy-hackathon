'use client'

import { RoadmapChatPanel } from '@/components/shared/roadmap/roadmap-chat-panel'
import { RoadmapLayout } from '@/components/shared/roadmap/roadmap-layout'
import { RoadmapVisualization } from '@/components/shared/roadmap/roadmap-visualization'
import { useRoadmapState } from '@/hooks/use-roadmap-state'

export default function ConsultantRoadmapPage() {
  const state = useRoadmapState({ role: 'consultant' })

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
          showClientSelector
          clients={state.clients}
          selectedClientId={state.selectedClientId}
          onSelectClient={state.handleSelectClient}
        />
      }
      chatPanel={
        <RoadmapChatPanel
          title="Consultant Assistant"
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
