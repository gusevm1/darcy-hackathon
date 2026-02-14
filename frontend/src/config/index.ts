export const siteConfig = {
  name: 'European Crypto Licensing Navigator',
  shortName: 'CryptoNav',
  description:
    'Navigate European crypto licensing requirements across MiCAR, FCA, and FINMA regulatory frameworks.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
} as const

export const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Wizard', href: '/wizard' },
  { label: 'Compare', href: '/compare' },
  { label: 'Chat', href: '/chat' },
  { label: 'Checklist', href: '/checklist' },
] as const
