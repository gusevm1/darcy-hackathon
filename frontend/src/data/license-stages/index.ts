import type { LicenseDefinition } from '@/types'

import { bankingDefinition } from './banking'
import { fintechDefinition } from './fintech'
import { fundManagementDefinition } from './fund-management'
import { insuranceDefinition } from './insurance'
import { securitiesFirmDefinition } from './securities-firm'

export const licenseDefinitions: LicenseDefinition[] = [
  bankingDefinition,
  fintechDefinition,
  securitiesFirmDefinition,
  fundManagementDefinition,
  insuranceDefinition,
]

export function getLicenseDefinition(
  type: string,
): LicenseDefinition | undefined {
  return licenseDefinitions.find((d) => d.type === type)
}
