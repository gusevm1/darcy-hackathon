import type { LicenseDefinition } from '@/types'

export const fintechDefinition: LicenseDefinition = {
  type: 'fintech',
  label: 'Fintech License',
  legalBasis: 'Art. 1b BankA',
  stages: [
    {
      id: 'fintech-1',
      name: 'Pre-Consultation',
      shortName: 'Pre-Consult',
      description:
        'Initial discussions with FINMA regarding the fintech business model and regulatory sandbox applicability.',
      documents: [
        {
          id: 'fintech-1-1',
          name: 'Fintech business model description',
          description: 'Detailed description of the fintech product, service, and business model.',
          category: 'Corporate',
        },
        {
          id: 'fintech-1-2',
          name: 'Regulatory sandbox assessment',
          description: 'Assessment of eligibility for FINMA regulatory sandbox provisions.',
          category: 'Compliance',
        },
        {
          id: 'fintech-1-3',
          name: 'Pre-consultation correspondence',
          description: 'Record of all pre-consultation communications with FINMA.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fintech-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description: 'Preparation of the simplified application package for a fintech license.',
      documents: [
        {
          id: 'fintech-2-1',
          name: 'Simplified business plan',
          description: 'Business plan tailored to fintech license requirements.',
          category: 'Corporate',
        },
        {
          id: 'fintech-2-2',
          name: 'Proof of capital (CHF 300K)',
          description: 'Evidence of minimum required capital of CHF 300,000.',
          category: 'Financial',
        },
        {
          id: 'fintech-2-3',
          name: 'Articles of association (draft)',
          description: 'Draft corporate articles for the fintech entity.',
          category: 'Corporate',
        },
        {
          id: 'fintech-2-4',
          name: 'Organizational structure',
          description: 'Overview of organizational setup and key personnel.',
          category: 'Corporate',
        },
        {
          id: 'fintech-2-5',
          name: 'AML concept',
          description: 'Anti-money laundering concept and procedures.',
          category: 'Compliance',
        },
        {
          id: 'fintech-2-6',
          name: 'IT security concept',
          description: 'Information security architecture and controls documentation.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'fintech-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description: 'Official filing of the fintech license application with FINMA.',
      documents: [
        {
          id: 'fintech-3-1',
          name: 'FINMA fintech application form',
          description: 'Official FINMA application form for fintech license.',
          category: 'Corporate',
        },
        {
          id: 'fintech-3-2',
          name: 'Notarized articles of association',
          description: 'Final articles of association certified by a Swiss notary.',
          category: 'Corporate',
        },
        {
          id: 'fintech-3-3',
          name: 'Client deposit protection concept',
          description: 'Framework for protecting client deposits up to CHF 100 million.',
          category: 'Compliance',
        },
        {
          id: 'fintech-3-4',
          name: 'Investor information document',
          description: 'Document informing investors about risks and deposit protection.',
          category: 'Compliance',
        },
        {
          id: 'fintech-3-5',
          name: 'Outsourcing agreements',
          description: 'Agreements governing any outsourced business functions.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fintech-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description: 'FINMA reviews the submission for completeness and may request clarifications.',
      documents: [
        {
          id: 'fintech-4-1',
          name: 'FINMA acknowledgment',
          description: 'Official confirmation of application receipt from FINMA.',
          category: 'Corporate',
        },
        {
          id: 'fintech-4-2',
          name: 'Clarification responses',
          description: 'Responses to FINMA requests for additional information.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fintech-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description: 'FINMA assesses technology risks, AML compliance, and operational readiness.',
      documents: [
        {
          id: 'fintech-5-1',
          name: 'Technology risk assessment',
          description: 'Comprehensive assessment of technology-related risks.',
          category: 'Compliance',
        },
        {
          id: 'fintech-5-2',
          name: 'AML compliance review docs',
          description: 'Documentation for FINMA AML compliance review.',
          category: 'Compliance',
        },
        {
          id: 'fintech-5-3',
          name: 'Operational readiness confirmation',
          description: 'Confirmation that all operational systems are ready for launch.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fintech-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description: 'FINMA issues the fintech license decision and any operating conditions.',
      documents: [
        {
          id: 'fintech-6-1',
          name: 'FINMA fintech license',
          description: 'Official fintech license document from FINMA.',
          category: 'Corporate',
        },
        {
          id: 'fintech-6-2',
          name: 'Operating conditions',
          description: 'Conditions and restrictions attached to the fintech license.',
          category: 'Compliance',
        },
        {
          id: 'fintech-6-3',
          name: 'Commercial register entry',
          description: 'Confirmation of entry in the Swiss commercial register.',
          category: 'Corporate',
        },
      ],
    },
  ],
}
