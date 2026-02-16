import { toast } from 'sonner'

import type { SSECallbacks } from '@/lib/api/sse-client'

const SSE_ERROR_MESSAGE = 'Sorry, I encountered an error. Please try again.'

/**
 * Build SSE callbacks that accumulate text chunks into a placeholder message
 * and handle errors with a user-friendly fallback.
 *
 * @param placeholderId - ID of the assistant placeholder message to update
 * @param updateMessage - Setter that maps over messages and updates the matching one
 * @param label - Log label for errors (e.g. "Onboarding" or "Consult")
 */
export function createSSECallbacks(
  placeholderId: string,
  updateMessage: (
    updater: (content: string) => string,
  ) => void,
  label: string,
): SSECallbacks {
  return {
    onText(chunk) {
      updateMessage((prev) => prev + chunk)
    },
    onError(err) {
      updateMessage(() => SSE_ERROR_MESSAGE)
      console.error(`${label} SSE error:`, err)
      toast.error('Chat connection error. Please try again.')
    },
  }
}
