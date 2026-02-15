import { BookOpen, MessageSquare, Route } from 'lucide-react'

import { FeatureCard } from '@/components/shared/landing/feature-card'
import { HeroSection } from '@/components/shared/landing/hero-section'

const features = [
  {
    icon: MessageSquare,
    title: 'License Onboarding',
    description:
      'AI-guided interview to determine your required licenses, assess readiness, and create a tailored compliance roadmap.',
  },
  {
    icon: Route,
    title: 'AI Roadmap & Consulting',
    description:
      'Step-by-step progress tracking with an AI assistant that answers regulatory questions and helps manage documents.',
  },
  {
    icon: BookOpen,
    title: 'Knowledge Management',
    description:
      'Organized repository of legislation, client data, and compliance insights — all searchable and always up to date.',
  },
]

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <HeroSection />
      <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            Three Pillars of Compliance
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
