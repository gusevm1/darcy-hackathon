import type {
  ConsultMessage,
  ConsultResponse,
  GapAnalysis,
  NextStep,
} from './types'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export async function sendConsultMessage(
  message: string,
  history: ConsultMessage[],
  clientId?: string,
): Promise<ConsultResponse> {
  if (!API_URL) {
    const { matchCannedResponse } = await import('./mock-data')
    const matched = matchCannedResponse(message)
    return {
      message: { role: 'assistant', content: matched.content },
      citations: matched.citationDocIds,
    }
  }
  const res = await fetch(`${API_URL}/api/consult/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history, clientId }),
  })
  if (!res.ok) throw new Error('Failed to send consult message')
  return res.json()
}

export async function analyzeGaps(clientId: string): Promise<GapAnalysis> {
  if (!API_URL) {
    const { clients, licenseDefinitions } = await import('./mock-data')
    const client = clients.find((c) => c.id === clientId)
    if (!client) throw new Error('Client not found')
    const definition = licenseDefinitions.find(
      (d) => d.type === client.licenseType,
    )
    if (!definition) throw new Error('License definition not found')

    const missingDocuments = definition.stages.flatMap((stage) =>
      stage.documents
        .filter((doc) => {
          const state = client.documentStates.find(
            (s) => s.documentId === doc.id,
          )
          return !state || state.status === 'not-started'
        })
        .map((doc) => doc.name),
    )

    return {
      clientId,
      missingDocuments: missingDocuments.slice(0, 5),
      recommendations: [
        'Prioritize uploading documents for the current stage',
        'Ensure all corporate governance documents are up to date',
        'Schedule a review meeting with the compliance team',
      ],
    }
  }
  const res = await fetch(`${API_URL}/api/consult/gaps/${clientId}`)
  if (!res.ok) throw new Error('Failed to analyze gaps')
  return res.json()
}

export async function getNextSteps(clientId: string): Promise<NextStep[]> {
  if (!API_URL) {
    return [
      {
        id: '1',
        title: 'Upload missing documents',
        description:
          'Complete document uploads for the current licensing stage',
        priority: 'high',
      },
      {
        id: '2',
        title: 'Review compliance checklist',
        description: 'Ensure all regulatory requirements are addressed',
        priority: 'medium',
      },
      {
        id: '3',
        title: 'Schedule FINMA consultation',
        description: 'Book a pre-consultation meeting with FINMA',
        priority: 'low',
      },
    ]
  }
  const res = await fetch(`${API_URL}/api/consult/next-steps/${clientId}`)
  if (!res.ok) throw new Error('Failed to get next steps')
  return res.json()
}
