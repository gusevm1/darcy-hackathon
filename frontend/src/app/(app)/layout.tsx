import { SiteHeader } from '@/components/shared/site-header'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
    </>
  )
}
