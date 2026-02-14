import Link from 'next/link'

import {
  CheckSquare,
  ClipboardList,
  MessageCircle,
  Scale,
  Shield,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const features = [
  {
    title: 'Classify Your Business',
    description:
      'Answer a few questions to determine which licenses you need across EU, UK, and Swiss jurisdictions.',
    href: '/wizard',
    icon: ClipboardList,
  },
  {
    title: 'Compare Jurisdictions',
    description:
      'Side-by-side comparison of MiCAR (EU), FCA (UK), and FINMA (Switzerland) frameworks.',
    href: '/compare',
    icon: Scale,
  },
  {
    title: 'Ask a Question',
    description:
      'Chat with our AI assistant about specific regulatory requirements, citing actual legislation.',
    href: '/chat',
    icon: MessageCircle,
  },
  {
    title: 'Requirements Checklist',
    description:
      'Get a step-by-step checklist for your licensing application from pre-application to post-authorization.',
    href: '/checklist',
    icon: CheckSquare,
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <section className="container mx-auto flex flex-col items-center gap-6 px-4 py-16 text-center md:py-24">
        <div className="bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
          <Shield className="h-4 w-4" />
          Regulatory Intelligence
        </div>
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          Navigate European Crypto Licensing
        </h1>
        <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
          Understand MiCAR, FCA, and FINMA requirements for your crypto
          business. Classify your services, compare jurisdictions, and get a
          clear path to compliance.
        </p>
        <div className="flex gap-3">
          <Button asChild size="lg">
            <Link href="/wizard">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/compare">Compare Frameworks</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href} className="group">
              <Card className="h-full transition-shadow group-hover:shadow-md">
                <CardHeader>
                  <feature.icon className="text-primary mb-2 h-8 w-8" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t bg-muted/50">
        <div className="container mx-auto grid gap-8 px-4 py-16 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold">MiCAR (EU)</h3>
            <p className="text-muted-foreground text-sm">
              The Markets in Crypto-Assets Regulation provides a comprehensive
              EU-wide framework for crypto-asset service providers with
              passporting rights across all member states.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">FCA (UK)</h3>
            <p className="text-muted-foreground text-sm">
              The Financial Conduct Authority regulates crypto businesses in the
              UK through existing financial services frameworks and dedicated
              crypto registration requirements.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold">FINMA (Switzerland)</h3>
            <p className="text-muted-foreground text-sm">
              The Swiss Financial Market Supervisory Authority oversees crypto
              activities through a principles-based approach, leveraging existing
              banking and securities laws.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
