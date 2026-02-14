import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { SiteHeader } from '@/components/shared/site-header'
import { TooltipProvider } from '@/components/ui/tooltip'
import { siteConfig } from '@/config'

import '@/app/globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <TooltipProvider>
          <SiteHeader />
          <main className="min-h-[calc(100vh-3.5rem)]">{children}</main>
        </TooltipProvider>
      </body>
    </html>
  )
}
