export type BusinessRole = 'issuer' | 'service_provider' | 'both'

export type TokenType = 'ART' | 'EMT' | 'other_crypto' | 'NFT'

export type ServiceType =
  | 'custody'
  | 'exchange'
  | 'trading_platform'
  | 'execution'
  | 'advice'
  | 'portfolio_management'
  | 'transfer'
  | 'order_reception'

export type Jurisdiction = 'EU' | 'UK' | 'CH'

export type ExistingLicense =
  | 'credit_institution'
  | 'mifid_firm'
  | 'emi'
  | 'pi'
  | 'national_crypto'
  | 'none'

export type EstablishmentLocation =
  | 'EU'
  | 'DE'
  | 'FR'
  | 'IE'
  | 'NL'
  | 'LU'
  | 'MT'
  | 'UK'
  | 'CH'

export interface WizardAnswers {
  businessRole: BusinessRole
  tokenType?: TokenType
  serviceTypes?: ServiceType[]
  handlesFiat: boolean
  targetJurisdictions: Jurisdiction[]
  establishmentLocation: EstablishmentLocation
  existingLicenses: ExistingLicense[]
}

export interface LicenseRequirement {
  licenseType: string
  description: string
  article: string
  timeline: string
}

export interface CapitalRequirement {
  class: number
  minimumEur: number
  article: string
  description: string
}

export interface ClassificationResult {
  requiredLicenses: LicenseRequirement[]
  capitalRequirements: CapitalRequirement[]
  timelineEstimate: string
  keyObligations: string[]
  simplifiedPathway: boolean
  simplifiedPathwayDetails: string
  tokenClassification: string
  tokenClassificationDetails: string
}
