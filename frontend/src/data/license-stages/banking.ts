import type { LicenseDefinition } from '@/types'

export const bankingDefinition: LicenseDefinition = {
  type: 'banking',
  label: 'Banking License',
  legalBasis: 'Art. 3 BankA',
  stages: [
    {
      id: 'banking-1',
      name: 'Pre-Consultation',
      shortName: 'Pre-Consult',
      description:
        'Initial engagement with FINMA to discuss the proposed banking activity and regulatory classification.',
      documents: [
        {
          id: 'banking-1-1',
          name: 'Preliminary business concept',
          description:
            'High-level overview of the proposed banking business model and target market.',
          category: 'Corporate',
        },
        {
          id: 'banking-1-2',
          name: 'Regulatory classification memo',
          description:
            'Legal analysis determining applicable regulatory framework and license category.',
          category: 'Compliance',
        },
        {
          id: 'banking-1-3',
          name: 'Pre-consultation meeting minutes',
          description: 'Documented record of discussions and guidance received from FINMA.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'banking-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Assembly of all required documentation for the formal banking license application.',
      documents: [
        {
          id: 'banking-2-1',
          name: 'Business plan (3-year)',
          description:
            'Comprehensive business plan including financial projections for three years.',
          category: 'Corporate',
        },
        {
          id: 'banking-2-2',
          name: 'Articles of association (draft)',
          description:
            'Draft corporate articles reflecting regulatory requirements for banking entities.',
          category: 'Corporate',
        },
        {
          id: 'banking-2-3',
          name: 'Organizational chart',
          description:
            'Detailed organizational structure including reporting lines and key functions.',
          category: 'Corporate',
        },
        {
          id: 'banking-2-4',
          name: 'Capital plan (min CHF 10M proof)',
          description: 'Evidence of minimum required capital of CHF 10 million.',
          category: 'Financial',
        },
        {
          id: 'banking-2-5',
          name: 'Fit & proper dossiers (directors/executives)',
          description: 'Background documentation for all proposed directors and senior executives.',
          category: 'Compliance',
        },
        {
          id: 'banking-2-6',
          name: 'Internal regulations (draft)',
          description: 'Draft internal governance regulations and operational procedures.',
          category: 'Compliance',
        },
        {
          id: 'banking-2-7',
          name: 'Risk management framework',
          description: 'Comprehensive risk identification, assessment, and mitigation framework.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'banking-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description: 'Official submission of the complete application package to FINMA.',
      documents: [
        {
          id: 'banking-3-1',
          name: 'Completed FINMA application form',
          description: 'Official FINMA application form with all sections completed.',
          category: 'Corporate',
        },
        {
          id: 'banking-3-2',
          name: 'Notarized articles of association',
          description: 'Final articles of association certified by a Swiss notary.',
          category: 'Corporate',
        },
        {
          id: 'banking-3-3',
          name: 'Auditor confirmation letter',
          description:
            'Letter from approved audit firm confirming engagement for regulatory audit.',
          category: 'Financial',
        },
        {
          id: 'banking-3-4',
          name: 'AML/KYC policy',
          description: 'Anti-money laundering and know-your-customer policies and procedures.',
          category: 'Compliance',
        },
        {
          id: 'banking-3-5',
          name: 'IT security & BCM concept',
          description:
            'Information technology security framework and business continuity management plan.',
          category: 'Compliance',
        },
        {
          id: 'banking-3-6',
          name: 'Outsourcing policy',
          description: 'Policy governing outsourcing of material business activities.',
          category: 'Compliance',
        },
        {
          id: 'banking-3-7',
          name: 'Complaints handling procedure',
          description: 'Formal procedure for receiving and resolving client complaints.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'banking-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA reviews the submission for completeness and requests any missing documentation.',
      documents: [
        {
          id: 'banking-4-1',
          name: 'FINMA acknowledgment of receipt',
          description: 'Official confirmation from FINMA that the application has been received.',
          category: 'Corporate',
        },
        {
          id: 'banking-4-2',
          name: 'Supplementary information requests (response docs)',
          description: 'Responses to any follow-up questions or document requests from FINMA.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'banking-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts detailed assessment of the application including potential on-site inspections.',
      documents: [
        {
          id: 'banking-5-1',
          name: 'FINMA due diligence questionnaire responses',
          description: 'Completed responses to FINMA detailed due diligence questionnaire.',
          category: 'Compliance',
        },
        {
          id: 'banking-5-2',
          name: 'Additional capital adequacy documentation',
          description: 'Supplementary capital adequacy and solvency documentation.',
          category: 'Financial',
        },
        {
          id: 'banking-5-3',
          name: 'On-site inspection preparation docs',
          description: 'Documentation prepared for FINMA on-site inspection visit.',
          category: 'Compliance',
        },
        {
          id: 'banking-5-4',
          name: 'Regulatory audit report',
          description: 'Independent regulatory audit report from approved auditor.',
          category: 'Financial',
        },
      ],
    },
    {
      id: 'banking-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description: 'FINMA issues its decision and, if approved, grants the banking license.',
      documents: [
        {
          id: 'banking-6-1',
          name: 'FINMA decision letter',
          description: 'Official FINMA decision on the banking license application.',
          category: 'Corporate',
        },
        {
          id: 'banking-6-2',
          name: 'Conditions of license (acknowledgment)',
          description: 'Signed acknowledgment of any conditions attached to the license.',
          category: 'Compliance',
        },
        {
          id: 'banking-6-3',
          name: 'Commercial register entry',
          description: 'Confirmation of entry in the Swiss commercial register as a licensed bank.',
          category: 'Corporate',
        },
        {
          id: 'banking-6-4',
          name: 'Post-licensing reporting schedule',
          description: 'Schedule of ongoing regulatory reporting obligations.',
          category: 'Compliance',
        },
      ],
    },
  ],
}
