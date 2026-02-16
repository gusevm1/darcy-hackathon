'use client'

import Link from 'next/link'

import { ArrowRight, RotateCcw } from 'lucide-react'

import { ChatArea } from '@/components/shared/assistant/chat-area'
import { Button } from '@/components/ui/button'
import { useOnboardingChat } from '@/hooks/use-onboarding-chat'

export function OnboardingChat() {
  const {
    messages,
    sendMessage,
    isLoading,
    onboardingComplete,
    clientId,
    startNew,
  } = useOnboardingChat()

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col">
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div>
          <h1 className="text-lg font-semibold">License Onboarding</h1>
          <p className="text-muted-foreground text-sm">
            AI-guided interview to determine your FINMA licensing
            requirements and set up your application roadmap
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={startNew} className="gap-1">
          <RotateCcw className="h-3.5 w-3.5" />
          Start New
        </Button>
      </div>

      <ChatArea
        title="Onboarding Assistant"
        messages={messages}
        onSendMessage={sendMessage}
        placeholder="Tell us about your company and financial services..."
        isLoading={isLoading}
      />

      {onboardingComplete && clientId && (
        <div className="border-t bg-muted/50 px-6 py-4">
          <div className="mx-auto flex max-w-2xl items-center justify-between rounded-lg border bg-background p-4">
            <div>
              <p className="font-medium">Onboarding complete!</p>
              <p className="text-muted-foreground text-sm">
                Your personalized roadmap is ready.
              </p>
            </div>
            <Button asChild className="gap-2">
              <Link href={`/roadmap?client=${clientId}`}>
                View Roadmap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
