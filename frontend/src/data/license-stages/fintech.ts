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
        'Initial engagement with FINMA to discuss the fintech business model, applicability of the fintech license under Art. 1b BankA, and distinction from sandbox and full banking license requirements.',
      documents: [
        {
          id: 'fintech-1-1',
          name: 'Fintech business model description',
          description:
            'Detailed description of the fintech product or service, including the nature of public deposits accepted, target customer segments, and how the CHF 100 million deposit ceiling will be observed.',
          category: 'Corporate',
          finmaReference: 'Art. 1b BankA',
        },
        {
          id: 'fintech-1-2',
          name: 'Regulatory classification memo',
          description:
            'Legal analysis confirming eligibility for a fintech license rather than a full banking license or sandbox exemption, including assessment of deposit-taking activities and prohibition on interest payments and investment of deposits.',
          category: 'Compliance',
          finmaReference: 'BankO Art. 13a',
        },
        {
          id: 'fintech-1-3',
          name: 'Pre-consultation meeting minutes',
          description:
            'Documented record of all pre-consultation discussions with FINMA, including guidance received on application requirements and any conditions flagged by the supervisory team.',
          category: 'Corporate',
        },
        {
          id: 'fintech-1-4',
          name: 'Competitive and market analysis',
          description:
            'Overview of the competitive landscape and target market for the proposed fintech service, demonstrating commercial viability within fintech license constraints.',
          category: 'Corporate',
        },
        {
          id: 'fintech-1-5',
          name: 'Preliminary risk assessment',
          description:
            'Initial identification of key operational, financial, and regulatory risks associated with the proposed fintech business model, including technology and cyber risks.',
          category: 'Compliance',
          finmaReference: 'FINMA Guidance 05/2019',
        },
      ],
    },
    {
      id: 'fintech-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Assembly of all required documentation for the fintech license application, reflecting simplified requirements under BankO Art. 13a-13e compared to a full banking license.',
      documents: [
        {
          id: 'fintech-2-1',
          name: 'Business plan (3-year)',
          description:
            'Comprehensive business plan covering the first three years of operations, including financial projections, revenue model, customer acquisition strategy, and demonstration that public deposits will remain below CHF 100 million.',
          category: 'Corporate',
          finmaReference: 'BankO Art. 13b',
        },
        {
          id: 'fintech-2-2',
          name: 'Proof of minimum capital (CHF 300,000)',
          description:
            'Evidence of fully paid-in minimum capital of CHF 300,000, which must be maintained at all times as required for fintech license holders.',
          category: 'Financial',
          finmaReference: 'BankO Art. 13e',
        },
        {
          id: 'fintech-2-3',
          name: 'Articles of association (draft)',
          description:
            'Draft corporate articles for the fintech entity, including purpose clause restricting activities to those permitted under the fintech license and reflecting the prohibition on interest payments and investment of accepted deposits.',
          category: 'Corporate',
          finmaReference: 'Art. 1b para. 1 BankA',
        },
        {
          id: 'fintech-2-4',
          name: 'Organizational structure and governance chart',
          description:
            'Detailed organizational chart showing reporting lines, key functions, separation of duties, and governance structure including board of directors and senior management roles.',
          category: 'Governance',
          finmaReference: 'BankO Art. 13c',
        },
        {
          id: 'fintech-2-5',
          name: 'AML/CFT concept and procedures',
          description:
            'Anti-money laundering and counter-terrorism financing concept covering customer due diligence, transaction monitoring, suspicious activity reporting, and compliance with AMLA obligations.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 3-8',
        },
        {
          id: 'fintech-2-6',
          name: 'IT security and cyber risk concept',
          description:
            'Information security architecture, cyber risk management framework, data protection measures, incident response procedures, and business continuity planning for IT systems.',
          category: 'Compliance',
          finmaReference: 'FINMA Guidance 05/2019',
        },
        {
          id: 'fintech-2-7',
          name: 'Fit and proper dossiers (directors and executives)',
          description:
            'Background documentation for all proposed directors and senior executives, including CVs, proof of qualifications, criminal record extracts, and declarations of good standing.',
          category: 'Governance',
          finmaReference: 'BankO Art. 13c',
        },
        {
          id: 'fintech-2-8',
          name: 'Deposit protection concept',
          description:
            'Detailed framework for protecting client deposits, including mechanisms to ensure deposits do not exceed CHF 100 million, segregation of client funds, and disclosure of the absence of deposit insurance coverage.',
          category: 'Financial',
          finmaReference: 'Art. 1b para. 2 BankA',
        },
        {
          id: 'fintech-2-9',
          name: 'Internal control system documentation',
          description:
            'Description of the internal control system covering risk management processes, compliance monitoring, internal audit function, and controls over deposit acceptance and management.',
          category: 'Governance',
          finmaReference: 'BankO Art. 13d',
        },
        {
          id: 'fintech-2-10',
          name: 'Investor and client information document (draft)',
          description:
            'Draft disclosure document for clients informing them that deposits are not covered by the deposit insurance scheme, that funds will not be invested or earn interest, and describing the risks of the fintech service.',
          category: 'Compliance',
          finmaReference: 'Art. 1b para. 2 BankA',
        },
      ],
    },
    {
      id: 'fintech-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official filing of the fintech license application with FINMA, including all required forms, notarized documents, and supporting evidence.',
      documents: [
        {
          id: 'fintech-3-1',
          name: 'FINMA fintech license application form',
          description:
            'Completed official FINMA application form for the fintech license under Art. 1b BankA, signed by authorized representatives of the applicant entity.',
          category: 'Corporate',
          finmaReference: 'Art. 1b BankA',
        },
        {
          id: 'fintech-3-2',
          name: 'Notarized articles of association',
          description:
            'Final articles of association authenticated by a Swiss notary public, reflecting all fintech license requirements and restrictions on business activities.',
          category: 'Corporate',
        },
        {
          id: 'fintech-3-3',
          name: 'Proof of capital deposit confirmation',
          description:
            'Bank confirmation letter evidencing the deposit of at least CHF 300,000 in fully paid-in share capital with a Swiss financial institution.',
          category: 'Financial',
          finmaReference: 'BankO Art. 13e',
        },
        {
          id: 'fintech-3-4',
          name: 'Qualified participants disclosure',
          description:
            'Identification and documentation of all qualified participants holding 10% or more of capital or voting rights, including beneficial ownership declarations.',
          category: 'Governance',
          finmaReference: 'BankO Art. 13c',
        },
        {
          id: 'fintech-3-5',
          name: 'Outsourcing agreements and policy',
          description:
            'All outsourcing agreements for material business functions, together with the outsourcing policy ensuring adequate oversight and compliance with FINMA requirements.',
          category: 'Corporate',
          finmaReference: 'FINMA Circ. 2018/3',
        },
        {
          id: 'fintech-3-6',
          name: 'AML affiliation or SRO membership confirmation',
          description:
            'Proof of affiliation with a self-regulatory organization (SRO) recognized by FINMA for anti-money laundering supervision, or application for direct FINMA AML supervision.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 14',
        },
        {
          id: 'fintech-3-7',
          name: 'Auditor appointment confirmation',
          description:
            'Confirmation of appointment of a FINMA-recognized audit firm for regulatory auditing, including engagement letter and independence declaration.',
          category: 'Governance',
          finmaReference: 'BankO Art. 13d',
        },
        {
          id: 'fintech-3-8',
          name: 'Fee payment confirmation',
          description:
            'Proof of payment of the FINMA application processing fee for the fintech license application.',
          category: 'Financial',
        },
      ],
    },
    {
      id: 'fintech-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA conducts a formal completeness review of the submitted application package and requests any missing or supplementary documentation.',
      documents: [
        {
          id: 'fintech-4-1',
          name: 'FINMA acknowledgment of receipt',
          description:
            'Official written confirmation from FINMA acknowledging receipt of the fintech license application and commencement of the completeness review.',
          category: 'Corporate',
        },
        {
          id: 'fintech-4-2',
          name: 'Supplementary information responses',
          description:
            'Written responses to all FINMA requests for clarification, additional documentation, or corrections identified during the completeness review.',
          category: 'Corporate',
        },
        {
          id: 'fintech-4-3',
          name: 'Completeness confirmation letter',
          description:
            'Formal notification from FINMA confirming that the application is complete and will proceed to the substantive in-depth review phase.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'fintech-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts a substantive assessment of the applicant covering technology risks, AML compliance, capital adequacy, governance, and operational readiness under fintech license requirements.',
      documents: [
        {
          id: 'fintech-5-1',
          name: 'Technology and operational risk assessment',
          description:
            'Comprehensive assessment of technology platform risks, including system architecture review, scalability analysis, penetration testing results, and disaster recovery capabilities.',
          category: 'Compliance',
          finmaReference: 'FINMA Guidance 05/2019',
        },
        {
          id: 'fintech-5-2',
          name: 'AML/CFT compliance review documentation',
          description:
            'Detailed documentation supporting FINMA review of AML/CFT controls, including sample customer onboarding workflows, transaction monitoring rules, and politically exposed person screening procedures.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 3-8',
        },
        {
          id: 'fintech-5-3',
          name: 'Capital adequacy and liquidity confirmation',
          description:
            'Updated financial statements and calculations demonstrating ongoing compliance with the CHF 300,000 minimum capital requirement and adequate liquidity for planned operations.',
          category: 'Financial',
          finmaReference: 'BankO Art. 13e',
        },
        {
          id: 'fintech-5-4',
          name: 'Governance and fit-and-proper assessment results',
          description:
            'Results of FINMA assessment of directors and senior management fitness and propriety, including any conditions or requirements for additional governance measures.',
          category: 'Governance',
          finmaReference: 'BankO Art. 13c',
        },
        {
          id: 'fintech-5-5',
          name: 'Deposit ceiling monitoring mechanism',
          description:
            'Technical and procedural documentation demonstrating real-time monitoring of total accepted public deposits to ensure the CHF 100 million ceiling is not exceeded.',
          category: 'Financial',
          finmaReference: 'Art. 1b para. 1 BankA',
        },
        {
          id: 'fintech-5-6',
          name: 'Operational readiness confirmation',
          description:
            'Evidence that all operational systems, internal processes, staffing, compliance infrastructure, and client-facing platforms are ready for commencement of licensed fintech operations.',
          category: 'Corporate',
          finmaReference: 'BankO Art. 13b',
        },
      ],
    },
    {
      id: 'fintech-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description:
        'FINMA issues the formal licensing decision, including any conditions or restrictions, and the fintech entity completes post-licensing registrations.',
      documents: [
        {
          id: 'fintech-6-1',
          name: 'FINMA fintech license decision',
          description:
            'Official FINMA ruling granting the fintech license under Art. 1b BankA, specifying the scope of permitted activities, deposit ceiling, and any individual conditions attached to the license.',
          category: 'Corporate',
          finmaReference: 'Art. 1b BankA',
        },
        {
          id: 'fintech-6-2',
          name: 'License conditions and restrictions schedule',
          description:
            'Detailed schedule of all conditions and restrictions attached to the fintech license, including requirements for no interest on deposits, no investment of deposits, and ongoing reporting obligations.',
          category: 'Compliance',
          finmaReference: 'BankO Art. 13a',
        },
        {
          id: 'fintech-6-3',
          name: 'Commercial register entry confirmation',
          description:
            'Confirmation of the entity registration in the Swiss commercial register reflecting the fintech license status and authorized business purpose.',
          category: 'Corporate',
        },
        {
          id: 'fintech-6-4',
          name: 'FINMA supervised entities list registration',
          description:
            'Confirmation that the licensed fintech entity has been added to the official FINMA list of supervised financial institutions.',
          category: 'Corporate',
          finmaReference: 'Art. 1b BankA',
        },
        {
          id: 'fintech-6-5',
          name: 'Post-licensing reporting framework acknowledgment',
          description:
            'Signed acknowledgment of the ongoing regulatory reporting obligations, including annual financial statements, audit reports, deposit volume reporting, and notification duties for material changes.',
          category: 'Compliance',
          finmaReference: 'BankO Art. 13d',
        },
      ],
    },
  ],
}
