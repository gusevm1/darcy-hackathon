import type { LicenseType } from '@/types'

export const licenseColors: Record<LicenseType, string> = {
  banking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  fintech:
    'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300',
  'securities-firm':
    'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  'fund-management':
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  insurance:
    'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
}

export const licenseLabels: Record<LicenseType, string> = {
  banking: 'Banking',
  fintech: 'Fintech',
  'securities-firm': 'Securities',
  'fund-management': 'Fund Mgmt',
  insurance: 'Insurance',
}
