export interface JurisdictionLicenseType {
  type: string
  description: string
  article: string
}

export interface JurisdictionCapitalRequirement {
  capitalClass: string
  amount: string
  services: string
}

export interface JurisdictionInfo {
  name: string
  regulatoryBody: string
  framework: string
  licenseTypes: JurisdictionLicenseType[]
  capitalRequirements: JurisdictionCapitalRequirement[]
  timeline: string
  passporting: string
  amlRequirements: string[]
  keyObligations: string[]
  transitionalProvisions: string
  recentDevelopments: string
}

export interface JurisdictionsResponse {
  jurisdictions: JurisdictionInfo[]
}
