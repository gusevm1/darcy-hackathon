import type { LicenseDefinition } from '@/types'

export const licenseDefinitions: LicenseDefinition[] = [
  {
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
            description:
              'Documented record of discussions and guidance received from FINMA.',
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
            description:
              'Evidence of minimum required capital of CHF 10 million.',
            category: 'Financial',
          },
          {
            id: 'banking-2-5',
            name: 'Fit & proper dossiers (directors/executives)',
            description:
              'Background documentation for all proposed directors and senior executives.',
            category: 'Compliance',
          },
          {
            id: 'banking-2-6',
            name: 'Internal regulations (draft)',
            description:
              'Draft internal governance regulations and operational procedures.',
            category: 'Compliance',
          },
          {
            id: 'banking-2-7',
            name: 'Risk management framework',
            description:
              'Comprehensive risk identification, assessment, and mitigation framework.',
            category: 'Compliance',
          },
        ],
      },
      {
        id: 'banking-3',
        name: 'Formal Submission',
        shortName: 'Submission',
        description:
          'Official submission of the complete application package to FINMA.',
        documents: [
          {
            id: 'banking-3-1',
            name: 'Completed FINMA application form',
            description:
              'Official FINMA application form with all sections completed.',
            category: 'Corporate',
          },
          {
            id: 'banking-3-2',
            name: 'Notarized articles of association',
            description:
              'Final articles of association certified by a Swiss notary.',
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
            description:
              'Anti-money laundering and know-your-customer policies and procedures.',
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
            description:
              'Policy governing outsourcing of material business activities.',
            category: 'Compliance',
          },
          {
            id: 'banking-3-7',
            name: 'Complaints handling procedure',
            description:
              'Formal procedure for receiving and resolving client complaints.',
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
            description:
              'Official confirmation from FINMA that the application has been received.',
            category: 'Corporate',
          },
          {
            id: 'banking-4-2',
            name: 'Supplementary information requests (response docs)',
            description:
              'Responses to any follow-up questions or document requests from FINMA.',
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
            description:
              'Completed responses to FINMA detailed due diligence questionnaire.',
            category: 'Compliance',
          },
          {
            id: 'banking-5-2',
            name: 'Additional capital adequacy documentation',
            description:
              'Supplementary capital adequacy and solvency documentation.',
            category: 'Financial',
          },
          {
            id: 'banking-5-3',
            name: 'On-site inspection preparation docs',
            description:
              'Documentation prepared for FINMA on-site inspection visit.',
            category: 'Compliance',
          },
          {
            id: 'banking-5-4',
            name: 'Regulatory audit report',
            description:
              'Independent regulatory audit report from approved auditor.',
            category: 'Financial',
          },
        ],
      },
      {
        id: 'banking-6',
        name: 'Decision & License Grant',
        shortName: 'Decision',
        description:
          'FINMA issues its decision and, if approved, grants the banking license.',
        documents: [
          {
            id: 'banking-6-1',
            name: 'FINMA decision letter',
            description:
              'Official FINMA decision on the banking license application.',
            category: 'Corporate',
          },
          {
            id: 'banking-6-2',
            name: 'Conditions of license (acknowledgment)',
            description:
              'Signed acknowledgment of any conditions attached to the license.',
            category: 'Compliance',
          },
          {
            id: 'banking-6-3',
            name: 'Commercial register entry',
            description:
              'Confirmation of entry in the Swiss commercial register as a licensed bank.',
            category: 'Corporate',
          },
          {
            id: 'banking-6-4',
            name: 'Post-licensing reporting schedule',
            description:
              'Schedule of ongoing regulatory reporting obligations.',
            category: 'Compliance',
          },
        ],
      },
    ],
  },
  {
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
            description:
              'Detailed description of the fintech product, service, and business model.',
            category: 'Corporate',
          },
          {
            id: 'fintech-1-2',
            name: 'Regulatory sandbox assessment',
            description:
              'Assessment of eligibility for FINMA regulatory sandbox provisions.',
            category: 'Compliance',
          },
          {
            id: 'fintech-1-3',
            name: 'Pre-consultation correspondence',
            description:
              'Record of all pre-consultation communications with FINMA.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'fintech-2',
        name: 'Application Preparation',
        shortName: 'Preparation',
        description:
          'Preparation of the simplified application package for a fintech license.',
        documents: [
          {
            id: 'fintech-2-1',
            name: 'Simplified business plan',
            description:
              'Business plan tailored to fintech license requirements.',
            category: 'Corporate',
          },
          {
            id: 'fintech-2-2',
            name: 'Proof of capital (CHF 300K)',
            description:
              'Evidence of minimum required capital of CHF 300,000.',
            category: 'Financial',
          },
          {
            id: 'fintech-2-3',
            name: 'Articles of association (draft)',
            description:
              'Draft corporate articles for the fintech entity.',
            category: 'Corporate',
          },
          {
            id: 'fintech-2-4',
            name: 'Organizational structure',
            description:
              'Overview of organizational setup and key personnel.',
            category: 'Corporate',
          },
          {
            id: 'fintech-2-5',
            name: 'AML concept',
            description:
              'Anti-money laundering concept and procedures.',
            category: 'Compliance',
          },
          {
            id: 'fintech-2-6',
            name: 'IT security concept',
            description:
              'Information security architecture and controls documentation.',
            category: 'Compliance',
          },
        ],
      },
      {
        id: 'fintech-3',
        name: 'Formal Submission',
        shortName: 'Submission',
        description:
          'Official filing of the fintech license application with FINMA.',
        documents: [
          {
            id: 'fintech-3-1',
            name: 'FINMA fintech application form',
            description:
              'Official FINMA application form for fintech license.',
            category: 'Corporate',
          },
          {
            id: 'fintech-3-2',
            name: 'Notarized articles of association',
            description:
              'Final articles of association certified by a Swiss notary.',
            category: 'Corporate',
          },
          {
            id: 'fintech-3-3',
            name: 'Client deposit protection concept',
            description:
              'Framework for protecting client deposits up to CHF 100 million.',
            category: 'Compliance',
          },
          {
            id: 'fintech-3-4',
            name: 'Investor information document',
            description:
              'Document informing investors about risks and deposit protection.',
            category: 'Compliance',
          },
          {
            id: 'fintech-3-5',
            name: 'Outsourcing agreements',
            description:
              'Agreements governing any outsourced business functions.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'fintech-4',
        name: 'Completeness Check',
        shortName: 'Completeness',
        description:
          'FINMA reviews the submission for completeness and may request clarifications.',
        documents: [
          {
            id: 'fintech-4-1',
            name: 'FINMA acknowledgment',
            description:
              'Official confirmation of application receipt from FINMA.',
            category: 'Corporate',
          },
          {
            id: 'fintech-4-2',
            name: 'Clarification responses',
            description:
              'Responses to FINMA requests for additional information.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'fintech-5',
        name: 'In-Depth Review',
        shortName: 'Review',
        description:
          'FINMA assesses technology risks, AML compliance, and operational readiness.',
        documents: [
          {
            id: 'fintech-5-1',
            name: 'Technology risk assessment',
            description:
              'Comprehensive assessment of technology-related risks.',
            category: 'Compliance',
          },
          {
            id: 'fintech-5-2',
            name: 'AML compliance review docs',
            description:
              'Documentation for FINMA AML compliance review.',
            category: 'Compliance',
          },
          {
            id: 'fintech-5-3',
            name: 'Operational readiness confirmation',
            description:
              'Confirmation that all operational systems are ready for launch.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'fintech-6',
        name: 'Decision & License Grant',
        shortName: 'Decision',
        description:
          'FINMA issues the fintech license decision and any operating conditions.',
        documents: [
          {
            id: 'fintech-6-1',
            name: 'FINMA fintech license',
            description:
              'Official fintech license document from FINMA.',
            category: 'Corporate',
          },
          {
            id: 'fintech-6-2',
            name: 'Operating conditions',
            description:
              'Conditions and restrictions attached to the fintech license.',
            category: 'Compliance',
          },
          {
            id: 'fintech-6-3',
            name: 'Commercial register entry',
            description:
              'Confirmation of entry in the Swiss commercial register.',
            category: 'Corporate',
          },
        ],
      },
    ],
  },
  {
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
  },
  {
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
            description:
              'Overview of proposed fund strategy, structure, and target investors.',
            category: 'Corporate',
          },
          {
            id: 'fund-1-2',
            name: 'Regulatory classification (CISA)',
            description:
              'Legal analysis of applicable CISA provisions and license category.',
            category: 'Compliance',
          },
          {
            id: 'fund-1-3',
            name: 'Pre-consultation meeting minutes',
            description:
              'Minutes from pre-consultation meetings with FINMA.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'fund-2',
        name: 'Application Preparation',
        shortName: 'Preparation',
        description:
          'Assembly of fund management license application documentation.',
        documents: [
          {
            id: 'fund-2-1',
            name: 'Business plan',
            description:
              'Detailed business plan for the fund management company.',
            category: 'Corporate',
          },
          {
            id: 'fund-2-2',
            name: 'Capital requirements proof (CHF 1M min)',
            description:
              'Evidence of minimum required capital of CHF 1 million.',
            category: 'Financial',
          },
          {
            id: 'fund-2-3',
            name: 'Fund regulations (draft)',
            description:
              'Draft fund regulations governing the collective investment scheme.',
            category: 'Compliance',
          },
          {
            id: 'fund-2-4',
            name: 'Custodian bank agreement (draft)',
            description:
              'Draft agreement with a custodian bank for asset safekeeping.',
            category: 'Financial',
          },
          {
            id: 'fund-2-5',
            name: 'Fit & proper dossiers',
            description:
              'Background documentation for directors and key personnel.',
            category: 'Compliance',
          },
          {
            id: 'fund-2-6',
            name: 'Organizational regulations',
            description:
              'Formal organizational structure and governance regulations.',
            category: 'Corporate',
          },
          {
            id: 'fund-2-7',
            name: 'Valuation & pricing policy',
            description:
              'Policy for valuation of fund assets and pricing of fund units.',
            category: 'Financial',
          },
        ],
      },
      {
        id: 'fund-3',
        name: 'Formal Submission',
        shortName: 'Submission',
        description:
          'Official submission of the CISA fund management license application.',
        documents: [
          {
            id: 'fund-3-1',
            name: 'CISA application form',
            description:
              'Official application form under the Collective Investment Schemes Act.',
            category: 'Corporate',
          },
          {
            id: 'fund-3-2',
            name: 'Notarized articles of association',
            description:
              'Final articles of association certified by a Swiss notary.',
            category: 'Corporate',
          },
          {
            id: 'fund-3-3',
            name: 'Fund prospectus (draft)',
            description:
              'Draft fund prospectus including investment objectives and risks.',
            category: 'Corporate',
          },
          {
            id: 'fund-3-4',
            name: 'Key investor information document (KIID)',
            description:
              'Standardized document providing key information for investors.',
            category: 'Compliance',
          },
          {
            id: 'fund-3-5',
            name: 'Distribution plan',
            description:
              'Plan for fund distribution channels and target markets.',
            category: 'Corporate',
          },
          {
            id: 'fund-3-6',
            name: 'AML/KYC policy',
            description:
              'Anti-money laundering and know-your-customer policies.',
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
            description:
              'Official acknowledgment of receipt from FINMA.',
            category: 'Corporate',
          },
          {
            id: 'fund-4-2',
            name: 'Supplementary requests',
            description:
              'Responses to FINMA requests for supplementary information.',
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
            description:
              'FINMA review and approval of fund regulations.',
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
            description:
              'Review of risk management and liquidity management procedures.',
            category: 'Compliance',
          },
          {
            id: 'fund-5-4',
            name: 'Delegation & outsourcing assessment',
            description:
              'Assessment of delegated and outsourced functions.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'fund-6',
        name: 'Decision & License Grant',
        shortName: 'Decision',
        description:
          'FINMA grants the fund management license and approves fund regulations.',
        documents: [
          {
            id: 'fund-6-1',
            name: 'FINMA fund management license',
            description:
              'Official license to operate as a fund management company.',
            category: 'Corporate',
          },
          {
            id: 'fund-6-2',
            name: 'Approved fund regulations',
            description:
              'FINMA-approved fund regulations for the collective investment scheme.',
            category: 'Compliance',
          },
          {
            id: 'fund-6-3',
            name: 'Distribution authorization',
            description:
              'Authorization to distribute fund units in approved jurisdictions.',
            category: 'Corporate',
          },
          {
            id: 'fund-6-4',
            name: 'Ongoing reporting schedule',
            description:
              'Schedule of ongoing regulatory reporting requirements.',
            category: 'Compliance',
          },
        ],
      },
    ],
  },
  {
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
            description:
              'Detailed description of the proposed insurance business and product lines.',
            category: 'Corporate',
          },
          {
            id: 'insurance-1-2',
            name: 'Product line classification',
            description:
              'Classification of insurance product lines under ISA categories.',
            category: 'Compliance',
          },
          {
            id: 'insurance-1-3',
            name: 'Pre-consultation correspondence',
            description:
              'Record of all pre-consultation communications with FINMA.',
            category: 'Corporate',
          },
        ],
      },
      {
        id: 'insurance-2',
        name: 'Application Preparation',
        shortName: 'Preparation',
        description:
          'Preparation of the comprehensive insurance license application package.',
        documents: [
          {
            id: 'insurance-2-1',
            name: 'Business plan (5-year)',
            description:
              'Five-year business plan including premium projections and market analysis.',
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
            description:
              'Evidence of meeting capital requirements under the Swiss Solvency Test.',
            category: 'Financial',
          },
          {
            id: 'insurance-2-4',
            name: 'Fit & proper dossiers',
            description:
              'Background documentation for directors, executives, and appointed actuary.',
            category: 'Compliance',
          },
          {
            id: 'insurance-2-5',
            name: 'Organizational chart',
            description:
              'Organizational structure including key functions and reporting lines.',
            category: 'Corporate',
          },
          {
            id: 'insurance-2-6',
            name: 'Reinsurance concept',
            description:
              'Reinsurance strategy and arrangements for risk transfer.',
            category: 'Financial',
          },
          {
            id: 'insurance-2-7',
            name: 'Investment policy',
            description:
              'Investment policy governing the management of insurance assets.',
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
            description:
              'Official application form under the Insurance Supervision Act.',
            category: 'Corporate',
          },
          {
            id: 'insurance-3-2',
            name: 'Notarized articles of association',
            description:
              'Final articles of association certified by a Swiss notary.',
            category: 'Corporate',
          },
          {
            id: 'insurance-3-3',
            name: 'General insurance conditions (GIC)',
            description:
              'General terms and conditions for all insurance products.',
            category: 'Compliance',
          },
          {
            id: 'insurance-3-4',
            name: 'Technical provisions methodology',
            description:
              'Methodology for calculating technical provisions and reserves.',
            category: 'Financial',
          },
          {
            id: 'insurance-3-5',
            name: 'Appointed actuary confirmation',
            description:
              'Confirmation of appointment of a qualified responsible actuary.',
            category: 'Compliance',
          },
          {
            id: 'insurance-3-6',
            name: 'AML policy (if applicable)',
            description:
              'Anti-money laundering policy for life insurance products.',
            category: 'Compliance',
          },
        ],
      },
      {
        id: 'insurance-4',
        name: 'Completeness Check',
        shortName: 'Completeness',
        description:
          'FINMA reviews submission completeness and may raise actuarial review queries.',
        documents: [
          {
            id: 'insurance-4-1',
            name: 'FINMA acknowledgment',
            description:
              'Official acknowledgment of application receipt from FINMA.',
            category: 'Corporate',
          },
          {
            id: 'insurance-4-2',
            name: 'Supplementary requests',
            description:
              'Responses to FINMA supplementary information requests.',
            category: 'Corporate',
          },
          {
            id: 'insurance-4-3',
            name: 'Actuarial review queries',
            description:
              'Responses to FINMA actuarial department review questions.',
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
            description:
              'Detailed SST calculation and supporting documentation.',
            category: 'Financial',
          },
          {
            id: 'insurance-5-2',
            name: 'Governance & ICS assessment',
            description:
              'Assessment of governance framework and internal control system.',
            category: 'Compliance',
          },
          {
            id: 'insurance-5-3',
            name: 'Product approval review',
            description:
              'Review and approval of individual insurance products.',
            category: 'Compliance',
          },
          {
            id: 'insurance-5-4',
            name: 'On-site inspection docs',
            description:
              'Documentation prepared for FINMA on-site inspection.',
            category: 'Compliance',
          },
        ],
      },
      {
        id: 'insurance-6',
        name: 'Decision & License Grant',
        shortName: 'Decision',
        description:
          'FINMA grants the insurance license and authorizes product lines.',
        documents: [
          {
            id: 'insurance-6-1',
            name: 'FINMA insurance license',
            description:
              'Official insurance license from FINMA.',
            category: 'Corporate',
          },
          {
            id: 'insurance-6-2',
            name: 'Authorized product lines',
            description:
              'List of authorized insurance product lines.',
            category: 'Corporate',
          },
          {
            id: 'insurance-6-3',
            name: 'Solvency reporting schedule',
            description:
              'Schedule for ongoing Swiss Solvency Test reporting.',
            category: 'Financial',
          },
          {
            id: 'insurance-6-4',
            name: 'Ongoing supervisory requirements',
            description:
              'Summary of ongoing supervisory obligations and reporting requirements.',
            category: 'Compliance',
          },
        ],
      },
    ],
  },
]

export function getLicenseDefinition(
  type: string,
): LicenseDefinition | undefined {
  return licenseDefinitions.find((d) => d.type === type)
}
