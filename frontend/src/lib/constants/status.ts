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
}

export const statusVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  'not-started': 'outline',
  uploaded: 'secondary',
  'under-review': 'default',
  approved: 'default',
  rejected: 'destructive',
}

export const statusLabel: Record<string, string> = {
  'not-started': 'Not Started',
  uploaded: 'Uploaded',
  'under-review': 'Under Review',
  approved: 'Approved',
  rejected: 'Rejected',
}
