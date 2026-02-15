import type { LicenseDefinition } from '@/types'

export const fundManagementDefinition: LicenseDefinition = {
  type: 'fund-management',
  label: 'Fund Management',
  legalBasis: 'CISA',
  stages: [
    {
      id: 'fund-1',
      name: 'Pre-Consultation',
      shortName: 'Pre-Consult',
      description:
        'Initial consultation on fund strategy, structure, and CISA regulatory classification.',
      documents: [
        {
          id: 'fund-1-1',
          name: 'Fund strategy & structure overview',
          description: 'Overview of proposed fund strategy, structure, and target investors.',
          category: 'Corporate',
        },
        {
          id: 'fund-1-2',
          name: 'Regulatory classification (CISA)',
          description: 'Legal analysis of applicable CISA provisions and license category.',
          category: 'Compliance',
        },
        {
          id: 'fund-1-3',
          name: 'Pre-consultation meeting minutes',
          description: 'Minutes from pre-consultation meetings with FINMA.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fund-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description: 'Assembly of fund management license application documentation.',
      documents: [
        {
          id: 'fund-2-1',
          name: 'Business plan',
          description: 'Detailed business plan for the fund management company.',
          category: 'Corporate',
        },
        {
          id: 'fund-2-2',
          name: 'Capital requirements proof (CHF 1M min)',
          description: 'Evidence of minimum required capital of CHF 1 million.',
          category: 'Financial',
        },
        {
          id: 'fund-2-3',
          name: 'Fund regulations (draft)',
          description: 'Draft fund regulations governing the collective investment scheme.',
          category: 'Compliance',
        },
        {
          id: 'fund-2-4',
          name: 'Custodian bank agreement (draft)',
          description: 'Draft agreement with a custodian bank for asset safekeeping.',
          category: 'Financial',
        },
        {
          id: 'fund-2-5',
          name: 'Fit & proper dossiers',
          description: 'Background documentation for directors and key personnel.',
          category: 'Compliance',
        },
        {
          id: 'fund-2-6',
          name: 'Organizational regulations',
          description: 'Formal organizational structure and governance regulations.',
          category: 'Corporate',
        },
        {
          id: 'fund-2-7',
          name: 'Valuation & pricing policy',
          description: 'Policy for valuation of fund assets and pricing of fund units.',
          category: 'Financial',
        },
      ],
    },
    {
      id: 'fund-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description: 'Official submission of the CISA fund management license application.',
      documents: [
        {
          id: 'fund-3-1',
          name: 'CISA application form',
          description: 'Official application form under the Collective Investment Schemes Act.',
          category: 'Corporate',
        },
        {
          id: 'fund-3-2',
          name: 'Notarized articles of association',
          description: 'Final articles of association certified by a Swiss notary.',
          category: 'Corporate',
        },
        {
          id: 'fund-3-3',
          name: 'Fund prospectus (draft)',
          description: 'Draft fund prospectus including investment objectives and risks.',
          category: 'Corporate',
        },
        {
          id: 'fund-3-4',
          name: 'Key investor information document (KIID)',
          description: 'Standardized document providing key information for investors.',
          category: 'Compliance',
        },
        {
          id: 'fund-3-5',
          name: 'Distribution plan',
          description: 'Plan for fund distribution channels and target markets.',
          category: 'Corporate',
        },
        {
          id: 'fund-3-6',
          name: 'AML/KYC policy',
          description: 'Anti-money laundering and know-your-customer policies.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'fund-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA reviews the submission for completeness and requests supplementary documents.',
      documents: [
        {
          id: 'fund-4-1',
          name: 'FINMA acknowledgment',
          description: 'Official acknowledgment of receipt from FINMA.',
          category: 'Corporate',
        },
        {
          id: 'fund-4-2',
          name: 'Supplementary requests',
          description: 'Responses to FINMA requests for supplementary information.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fund-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts detailed review of fund regulations, compliance, and risk management.',
      documents: [
        {
          id: 'fund-5-1',
          name: 'Fund regulation approval review',
          description: 'FINMA review and approval of fund regulations.',
          category: 'Compliance',
        },
        {
          id: 'fund-5-2',
          name: 'Investment compliance framework',
          description:
            'Framework ensuring fund investments comply with stated objectives and limits.',
          category: 'Compliance',
        },
        {
          id: 'fund-5-3',
          name: 'Risk & liquidity management review',
          description: 'Review of risk management and liquidity management procedures.',
          category: 'Compliance',
        },
        {
          id: 'fund-5-4',
          name: 'Delegation & outsourcing assessment',
          description: 'Assessment of delegated and outsourced functions.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fund-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description: 'FINMA grants the fund management license and approves fund regulations.',
      documents: [
        {
          id: 'fund-6-1',
          name: 'FINMA fund management license',
          description: 'Official license to operate as a fund management company.',
          category: 'Corporate',
        },
        {
          id: 'fund-6-2',
          name: 'Approved fund regulations',
          description: 'FINMA-approved fund regulations for the collective investment scheme.',
          category: 'Compliance',
        },
        {
          id: 'fund-6-3',
          name: 'Distribution authorization',
          description: 'Authorization to distribute fund units in approved jurisdictions.',
          category: 'Corporate',
        },
        {
          id: 'fund-6-4',
          name: 'Ongoing reporting schedule',
          description: 'Schedule of ongoing regulatory reporting requirements.',
          category: 'Compliance',
        },
      ],
    },
  ],
}
