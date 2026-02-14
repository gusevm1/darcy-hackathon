import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">darcy-hackathon</CardTitle>
          <CardDescription>
            Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-muted-foreground text-center">
            Edit{' '}
            <code className="bg-muted rounded px-1.5 py-0.5 font-mono text-sm">
              src/app/page.tsx
            </code>{' '}
            to get started.
          </p>
          <div className="flex gap-3">
            <Button asChild>
              <a href="https://nextjs.org/docs" target="_blank" rel="noopener noreferrer">
                Next.js Docs
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer">
                shadcn/ui
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
