export const siteConfig = {
  name: 'FINMA Comply',
  shortName: 'FINMA Comply',
  description: 'Compliance project management for Swiss financial licence procurement.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

export const navItems = [
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'Knowledge', href: '/knowledge' },
  { label: 'MCP', href: '/mcp' },
] as const
