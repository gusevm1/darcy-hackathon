export const siteConfig = {
  name: 'FINMA Comply',
  shortName: 'FINMA Comply',
  description:
    'Compliance project management for Swiss financial licence procurement.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const

export const navItems = [
  { label: 'Dashboard', href: '/clients' },
  { label: 'Assistant', href: '/assistant' },
] as const
