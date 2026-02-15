import type { Metadata } from 'next'

import { AssistantLayout } from '@/components/shared/assistant/assistant-layout'

export const metadata: Metadata = {
  title: 'Assistant',
}

export default function AssistantPage() {
  return <AssistantLayout />
}
