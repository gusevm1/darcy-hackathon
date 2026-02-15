import type { Metadata } from 'next'

import { ClientCard } from '@/components/shared/client-card'
import { clients } from '@/data/clients'

export const metadata: Metadata = {
  title: 'Clients',
}

export default function ClientsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground mt-1">
          Manage FINMA licence applications for your clients.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <ClientCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  )
}
