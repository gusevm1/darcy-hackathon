'use client'

import { Construction } from 'lucide-react'

import { ChatArea } from '@/components/shared/assistant/chat-area'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useOnboardingChat } from '@/hooks/use-onboarding-chat'

export function OnboardingChat() {
  const { messages, sendMessage, isLoading } = useOnboardingChat()

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="border-b px-6 py-4">
        <h1 className="text-lg font-semibold">License Onboarding</h1>
        <p className="text-muted-foreground text-sm">
          AI-guided interview to determine your licensing requirements
        </p>
      </div>

      <div className="px-6 py-3">
        <Alert>
          <Construction className="h-4 w-4" />
          <AlertTitle>Under Construction</AlertTitle>
          <AlertDescription>
            This onboarding flow is a preview. Full AI-powered onboarding with document generation
            is coming soon.
          </AlertDescription>
        </Alert>
      </div>

      <ChatArea
        title="Onboarding Assistant"
        messages={messages}
        onSendMessage={sendMessage}
        placeholder="Tell us about your company and financial services..."
        isLoading={isLoading}
      />
    </div>
  )
}
