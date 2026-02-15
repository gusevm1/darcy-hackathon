import type { LicenseDefinition } from '@/types'

export const insuranceDefinition: LicenseDefinition = {
  type: 'insurance',
  label: 'Insurance License',
  legalBasis: 'ISA',
  stages: [
    {
      id: 'insurance-1',
      name: 'Pre-Consultation',
      shortName: 'Pre-Consult',
      description:
        'Initial engagement with FINMA to discuss the insurance business model and product classification.',
      documents: [
        {
          id: 'insurance-1-1',
          name: 'Insurance business model description',
          description: 'Detailed description of the proposed insurance business and product lines.',
          category: 'Corporate',
        },
        {
          id: 'insurance-1-2',
          name: 'Product line classification',
          description: 'Classification of insurance product lines under ISA categories.',
          category: 'Compliance',
        },
        {
          id: 'insurance-1-3',
          name: 'Pre-consultation correspondence',
          description: 'Record of all pre-consultation communications with FINMA.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'insurance-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description: 'Preparation of the comprehensive insurance license application package.',
      documents: [
        {
          id: 'insurance-2-1',
          name: 'Business plan (5-year)',
          description: 'Five-year business plan including premium projections and market analysis.',
          category: 'Corporate',
        },
        {
          id: 'insurance-2-2',
          name: 'Actuarial reports',
          description:
            'Actuarial analyses supporting premium calculations and reserve requirements.',
          category: 'Financial',
        },
        {
          id: 'insurance-2-3',
          name: 'Capital adequacy proof (Swiss Solvency Test)',
          description: 'Evidence of meeting capital requirements under the Swiss Solvency Test.',
          category: 'Financial',
        },
        {
          id: 'insurance-2-4',
          name: 'Fit & proper dossiers',
          description: 'Background documentation for directors, executives, and appointed actuary.',
          category: 'Compliance',
        },
        {
          id: 'insurance-2-5',
          name: 'Organizational chart',
          description: 'Organizational structure including key functions and reporting lines.',
          category: 'Corporate',
        },
        {
          id: 'insurance-2-6',
          name: 'Reinsurance concept',
          description: 'Reinsurance strategy and arrangements for risk transfer.',
          category: 'Financial',
        },
        {
          id: 'insurance-2-7',
          name: 'Investment policy',
          description: 'Investment policy governing the management of insurance assets.',
          category: 'Financial',
        },
      ],
    },
    {
      id: 'insurance-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official filing of the insurance license application under the Insurance Supervision Act.',
      documents: [
        {
          id: 'insurance-3-1',
          name: 'ISA application form',
          description: 'Official application form under the Insurance Supervision Act.',
          category: 'Corporate',
        },
        {
          id: 'insurance-3-2',
          name: 'Notarized articles of association',
          description: 'Final articles of association certified by a Swiss notary.',
          category: 'Corporate',
        },
        {
          id: 'insurance-3-3',
          name: 'General insurance conditions (GIC)',
          description: 'General terms and conditions for all insurance products.',
          category: 'Compliance',
        },
        {
          id: 'insurance-3-4',
          name: 'Technical provisions methodology',
          description: 'Methodology for calculating technical provisions and reserves.',
          category: 'Financial',
        },
        {
          id: 'insurance-3-5',
          name: 'Appointed actuary confirmation',
          description: 'Confirmation of appointment of a qualified responsible actuary.',
          category: 'Compliance',
        },
        {
          id: 'insurance-3-6',
          name: 'AML policy (if applicable)',
          description: 'Anti-money laundering policy for life insurance products.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'insurance-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description: 'FINMA reviews submission completeness and may raise actuarial review queries.',
      documents: [
        {
          id: 'insurance-4-1',
          name: 'FINMA acknowledgment',
          description: 'Official acknowledgment of application receipt from FINMA.',
          category: 'Corporate',
        },
        {
          id: 'insurance-4-2',
          name: 'Supplementary requests',
          description: 'Responses to FINMA supplementary information requests.',
          category: 'Corporate',
        },
        {
          id: 'insurance-4-3',
          name: 'Actuarial review queries',
          description: 'Responses to FINMA actuarial department review questions.',
          category: 'Financial',
        },
      ],
    },
    {
      id: 'insurance-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts detailed review including Swiss Solvency Test, governance, and product approval.',
      documents: [
        {
          id: 'insurance-5-1',
          name: 'Swiss Solvency Test (SST) detailed review',
          description: 'Detailed SST calculation and supporting documentation.',
          category: 'Financial',
        },
        {
          id: 'insurance-5-2',
          name: 'Governance & ICS assessment',
          description: 'Assessment of governance framework and internal control system.',
          category: 'Compliance',
        },
        {
          id: 'insurance-5-3',
          name: 'Product approval review',
          description: 'Review and approval of individual insurance products.',
          category: 'Compliance',
        },
        {
          id: 'insurance-5-4',
          name: 'On-site inspection docs',
          description: 'Documentation prepared for FINMA on-site inspection.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'insurance-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description: 'FINMA grants the insurance license and authorizes product lines.',
      documents: [
        {
          id: 'insurance-6-1',
          name: 'FINMA insurance license',
          description: 'Official insurance license from FINMA.',
          category: 'Corporate',
        },
        {
          id: 'insurance-6-2',
          name: 'Authorized product lines',
          description: 'List of authorized insurance product lines.',
          category: 'Corporate',
        },
        {
          id: 'insurance-6-3',
          name: 'Solvency reporting schedule',
          description: 'Schedule for ongoing Swiss Solvency Test reporting.',
          category: 'Financial',
        },
        {
          id: 'insurance-6-4',
          name: 'Ongoing supervisory requirements',
          description: 'Summary of ongoing supervisory obligations and reporting requirements.',
          category: 'Compliance',
        },
      ],
    },
  ],
}
