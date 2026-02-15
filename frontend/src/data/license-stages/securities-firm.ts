import type { LicenseDefinition } from '@/types'

export const securitiesFirmDefinition: LicenseDefinition = {
  type: 'securities-firm',
  label: 'Securities Firm',
  legalBasis: 'FinIA / FinMIA',
  stages: [
    {
      id: 'securities-1',
      name: 'Pre-Consultation',
      shortName: 'Pre-Consult',
      description:
        'Initial assessment of business activities and regulatory classification under FinIA.',
      documents: [
        {
          id: 'securities-1-1',
          name: 'Business activity description',
          description:
            'Description of planned securities firm activities and services.',
          category: 'Corporate',
        },
        {
          id: 'securities-1-2',
          name: 'Regulatory classification (FinIA categorization)',
          description:
            'Legal analysis of applicable FinIA category and requirements.',
          category: 'Compliance',
        },
        {
          id: 'securities-1-3',
          name: 'Pre-consultation notes',
          description:
            'Notes from preliminary regulatory consultation meetings.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'securities-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Compilation of all required documentation for the securities firm authorization.',
      documents: [
        {
          id: 'securities-2-1',
          name: 'Business plan',
          description:
            'Comprehensive business plan for the securities firm.',
          category: 'Corporate',
        },
        {
          id: 'securities-2-2',
          name: 'Capital adequacy proof',
          description:
            'Evidence of meeting minimum capital requirements.',
          category: 'Financial',
        },
        {
          id: 'securities-2-3',
          name: 'Fit & proper dossiers',
          description:
            'Background documentation for directors and key function holders.',
          category: 'Compliance',
        },
        {
          id: 'securities-2-4',
          name: 'Code of conduct',
          description:
            'Code of conduct governing employee behavior and conflicts of interest.',
          category: 'Compliance',
        },
        {
          id: 'securities-2-5',
          name: 'Internal directives',
          description:
            'Internal operational directives and procedures.',
          category: 'Compliance',
        },
        {
          id: 'securities-2-6',
          name: 'Risk management policy',
          description:
            'Framework for identifying and managing operational and market risks.',
          category: 'Compliance',
        },
        {
          id: 'securities-2-7',
          name: 'Organizational regulations',
          description:
            'Formal organizational regulations defining governance structure.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'securities-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official submission of the FinIA authorization application.',
      documents: [
        {
          id: 'securities-3-1',
          name: 'FinIA application form',
          description:
            'Official application form under the Financial Institutions Act.',
          category: 'Corporate',
        },
        {
          id: 'securities-3-2',
          name: 'Articles of association',
          description:
            'Notarized articles of association of the securities firm.',
          category: 'Corporate',
        },
        {
          id: 'securities-3-3',
          name: 'Supervisory organization (SO) confirmation',
          description:
            'Confirmation of engagement with an approved supervisory organization.',
          category: 'Compliance',
        },
        {
          id: 'securities-3-4',
          name: 'AML affiliation proof',
          description:
            'Proof of affiliation with a recognized AML self-regulatory organization.',
          category: 'Compliance',
        },
        {
          id: 'securities-3-5',
          name: 'Professional liability insurance',
          description:
            'Evidence of professional liability insurance coverage.',
          category: 'Financial',
        },
        {
          id: 'securities-3-6',
          name: 'Client asset segregation concept',
          description:
            'Framework for segregating and protecting client assets.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'securities-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'Review of submission completeness by FINMA or supervisory organization.',
      documents: [
        {
          id: 'securities-4-1',
          name: 'FINMA/SO acknowledgment',
          description:
            'Acknowledgment of receipt from FINMA or supervisory organization.',
          category: 'Corporate',
        },
        {
          id: 'securities-4-2',
          name: 'Supplementary documentation',
          description:
            'Additional documents requested during completeness review.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'securities-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'Detailed assessment of compliance frameworks, transaction monitoring, and cross-border activities.',
      documents: [
        {
          id: 'securities-5-1',
          name: 'Compliance function assessment',
          description:
            'Assessment of the compliance function and its independence.',
          category: 'Compliance',
        },
        {
          id: 'securities-5-2',
          name: 'Transaction monitoring concept',
          description:
            'Framework for monitoring and reporting suspicious transactions.',
          category: 'Compliance',
        },
        {
          id: 'securities-5-3',
          name: 'Cross-border activity documentation',
          description:
            'Documentation of planned cross-border activities and regulatory compliance.',
          category: 'Compliance',
        },
        {
          id: 'securities-5-4',
          name: 'Regulatory audit report',
          description:
            'Independent audit report on regulatory compliance.',
          category: 'Financial',
        },
      ],
    },
    {
      id: 'securities-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description:
        'FINMA grants authorization and supervisory organization oversight begins.',
      documents: [
        {
          id: 'securities-6-1',
          name: 'FINMA authorization',
          description:
            'Official FINMA authorization to operate as a securities firm.',
          category: 'Corporate',
        },
        {
          id: 'securities-6-2',
          name: 'SO supervision agreement',
          description:
            'Agreement establishing ongoing supervision by the supervisory organization.',
          category: 'Compliance',
        },
        {
          id: 'securities-6-3',
          name: 'Ongoing reporting obligations',
          description:
            'Schedule and requirements for ongoing regulatory reporting.',
          category: 'Compliance',
        },
      ],
    },
  ],
}
