import type { DocumentStatus } from '@/types'

export const statusConfig: Record<DocumentStatus, { label: string; className: string }> = {
  'not-started': {
    label: 'Not Started',
    className: 'bg-muted text-muted-foreground',
  },
  uploaded: {
    label: 'Uploaded',
    className: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  },
  pending: {
    label: 'Verifying…',
    className: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
  },
  verified: {
    label: 'Verified',
    className: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
  },
  'under-review': {
    label: 'Under Review',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
  },
  approved: {
    label: 'Approved',
    className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
  error: {
    label: 'Error',
    className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  },
}

export const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'not-started': 'outline',
  uploaded: 'secondary',
  pending: 'secondary',
  verified: 'default',
  'under-review': 'default',
  approved: 'default',
  rejected: 'destructive',
  error: 'destructive',
}

export const statusLabel: Record<string, string> = {
  'not-started': 'Not Started',
  uploaded: 'Uploaded',
  pending: 'Verifying…',
  verified: 'Verified',
  'under-review': 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
  error: 'Error',
}
