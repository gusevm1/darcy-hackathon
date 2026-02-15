import Link from 'next/link'

import { ArrowRight, Building2 } from 'lucide-react'

import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 lg:py-40">
      <div className="mb-6 flex items-center gap-2">
        <Building2 className="h-10 w-10" />
        <span className="text-3xl font-bold tracking-tight">FINMA Comply</span>
      </div>
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
        Swiss Financial Licensing,{' '}
        <span className="text-primary">Simplified</span>
      </h1>
      <p className="text-muted-foreground mt-6 max-w-2xl text-lg sm:text-xl">
        AI-powered compliance management for Swiss financial license procurement.
        From onboarding to approval, we guide you through every step.
      </p>
      <div className="mt-10 flex flex-col gap-4 sm:flex-row">
        <Button asChild size="lg" className="gap-2">
          <Link href="/onboarding">
            Start Onboarding
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/roadmap">View Roadmap</Link>
        </Button>
      </div>
    </section>
  )
}
