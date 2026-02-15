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
        'Initial engagement with FINMA to assess the planned securities firm activities, determine the applicable FinIA category, and clarify regulatory expectations.',
      documents: [
        {
          id: 'securities-1-1',
          name: 'Business activity description',
          description:
            'Detailed description of planned securities firm activities including proprietary trading, market making, underwriting, or client-order execution services.',
          category: 'Corporate',
          finmaReference: 'FinIA Art. 41',
        },
        {
          id: 'securities-1-2',
          name: 'FinIA regulatory classification memo',
          description:
            'Legal analysis determining whether the firm qualifies as a securities firm under FinIA Art. 41 and the specific category of authorization required.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 41-43',
        },
        {
          id: 'securities-1-3',
          name: 'Pre-consultation meeting minutes',
          description:
            'Documented record of preliminary discussions with FINMA covering regulatory scope, timeline expectations, and key areas of focus for the application.',
          category: 'Corporate',
        },
        {
          id: 'securities-1-4',
          name: 'Shareholder and beneficial owner disclosure',
          description:
            'Identification of all qualified shareholders holding 10% or more of capital or voting rights, including beneficial ownership chains up to the ultimate controlling person.',
          category: 'Corporate',
          finmaReference: 'FinIA Art. 43a',
        },
        {
          id: 'securities-1-5',
          name: 'Group structure and consolidated scope overview',
          description:
            'Overview of the corporate group structure, identifying any financial group or conglomerate relationships that may trigger consolidated supervision requirements.',
          category: 'Corporate',
          finmaReference: 'FinIA Art. 45',
        },
      ],
    },
    {
      id: 'securities-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Compilation and drafting of all required documentation for the securities firm authorization under FinIA, including governance, compliance, and financial frameworks.',
      documents: [
        {
          id: 'securities-2-1',
          name: 'Business plan (3-year)',
          description:
            'Comprehensive business plan covering strategy, target markets, revenue model, staffing plan, and three-year financial projections for the securities firm.',
          category: 'Corporate',
          finmaReference: 'FinIO Art. 5',
        },
        {
          id: 'securities-2-2',
          name: 'Capital adequacy proof (min CHF 1.5M)',
          description:
            'Evidence of meeting the minimum capital requirement of CHF 1.5 million for securities firms, including bank confirmation of paid-in share capital.',
          category: 'Financial',
          finmaReference: 'FinIA Art. 46',
        },
        {
          id: 'securities-2-3',
          name: 'Fit and proper dossiers (directors and executives)',
          description:
            'Background documentation for all proposed board members, executive management, and key function holders demonstrating good reputation, professional qualifications, and adequate experience.',
          category: 'Governance',
          finmaReference: 'FinIA Art. 11',
        },
        {
          id: 'securities-2-4',
          name: 'Code of conduct',
          description:
            'Internal code of conduct governing employee personal trading, handling of confidential information, gift policies, and general standards of professional behavior.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2008/5 Margin No. 7-12',
        },
        {
          id: 'securities-2-5',
          name: 'Risk management framework',
          description:
            'Comprehensive framework for identifying, measuring, managing, and monitoring market risk, credit risk, liquidity risk, and operational risk inherent to securities firm activities.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 9',
        },
        {
          id: 'securities-2-6',
          name: 'Organizational regulations',
          description:
            'Formal organizational regulations defining governance structure, decision-making authorities, committee mandates, and internal delegation of powers.',
          category: 'Governance',
          finmaReference: 'FinIA Art. 8',
        },
        {
          id: 'securities-2-7',
          name: 'Internal directives and control framework',
          description:
            'Internal operational directives covering the internal control system (ICS), segregation of duties, four-eyes principle, and compliance monitoring procedures.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 9',
        },
        {
          id: 'securities-2-8',
          name: 'Conflicts of interest policy',
          description:
            'Policy for identifying, preventing, and managing conflicts of interest including between proprietary trading and client orders, front-running prevention, and information barriers.',
          category: 'Compliance',
          finmaReference: 'FinSA Art. 25',
        },
        {
          id: 'securities-2-9',
          name: 'Best execution policy',
          description:
            'Policy ensuring best execution of client orders covering venue selection criteria, execution factors, order handling rules, and monitoring of execution quality.',
          category: 'Compliance',
          finmaReference: 'FinSA Art. 18',
        },
        {
          id: 'securities-2-10',
          name: 'Client classification and suitability framework',
          description:
            'Framework for classifying clients as retail, professional, or institutional and performing appropriateness and suitability assessments for financial services provided.',
          category: 'Compliance',
          finmaReference: 'FinSA Art. 4-5',
        },
      ],
    },
    {
      id: 'securities-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official submission of the complete FinIA authorization application package to FINMA, including all regulatory attestations and third-party confirmations.',
      documents: [
        {
          id: 'securities-3-1',
          name: 'FinIA application form',
          description:
            'Completed official FINMA application form for securities firm authorization under the Financial Institutions Act with all required sections and annexes.',
          category: 'Corporate',
          finmaReference: 'FinIA Art. 4',
        },
        {
          id: 'securities-3-2',
          name: 'Notarized articles of association',
          description:
            'Final articles of association certified by a Swiss notary, reflecting the business purpose, governance provisions, and capital structure required for a securities firm.',
          category: 'Corporate',
          finmaReference: 'FinIA Art. 8',
        },
        {
          id: 'securities-3-3',
          name: 'Supervisory organization (SO) confirmation',
          description:
            'Written confirmation from a FINMA-recognized supervisory organization of its engagement to provide ongoing prudential supervision of the securities firm.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 43k-43n',
        },
        {
          id: 'securities-3-4',
          name: 'AML self-regulatory organization affiliation proof',
          description:
            'Proof of affiliation with a FINMA-recognized self-regulatory organization for anti-money laundering purposes, or confirmation of direct FINMA AML supervision.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 14',
        },
        {
          id: 'securities-3-5',
          name: 'AML/KYC internal directives',
          description:
            'Internal directives covering customer due diligence, beneficial owner identification, enhanced due diligence for high-risk relationships, and suspicious activity reporting obligations.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 3-8',
        },
        {
          id: 'securities-3-6',
          name: 'Professional liability insurance or capital equivalence',
          description:
            'Evidence of professional liability insurance coverage or demonstration of equivalent capital reserves to cover potential liability claims arising from securities services.',
          category: 'Financial',
          finmaReference: 'FinSA Art. 20',
        },
        {
          id: 'securities-3-7',
          name: 'Client asset segregation concept',
          description:
            'Detailed framework for the segregation and safekeeping of client assets, including custodian arrangements, reconciliation procedures, and protection in the event of firm insolvency.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 50',
        },
        {
          id: 'securities-3-8',
          name: 'Audit firm engagement letter',
          description:
            'Confirmation letter from a FINMA-approved audit firm accepting the mandate to perform regulatory audits of the securities firm.',
          category: 'Financial',
          finmaReference: 'FinIA Art. 43f',
        },
        {
          id: 'securities-3-9',
          name: 'IT security and business continuity plan',
          description:
            'Documentation of IT infrastructure security measures, cyber risk controls, data protection procedures, disaster recovery, and business continuity management plans.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2023/1',
        },
      ],
    },
    {
      id: 'securities-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA and the supervisory organization review the submitted application for formal completeness, requesting any missing or supplementary documentation.',
      documents: [
        {
          id: 'securities-4-1',
          name: 'FINMA acknowledgment of receipt',
          description:
            'Official written confirmation from FINMA that the securities firm authorization application has been received and registered.',
          category: 'Corporate',
        },
        {
          id: 'securities-4-2',
          name: 'Supplementary documentation and clarifications',
          description:
            'Responses to follow-up questions, additional documents, or clarifications requested by FINMA or the supervisory organization during the completeness review.',
          category: 'Corporate',
        },
        {
          id: 'securities-4-3',
          name: 'Completeness confirmation from supervisory organization',
          description:
            'Written statement from the supervisory organization confirming that the application dossier meets formal completeness requirements and is ready for substantive review.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 43k',
        },
      ],
    },
    {
      id: 'securities-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'Substantive assessment by FINMA and the supervisory organization of the compliance frameworks, transaction monitoring capabilities, capital adequacy, and cross-border activities.',
      documents: [
        {
          id: 'securities-5-1',
          name: 'Compliance function assessment report',
          description:
            'Detailed assessment of the compliance function covering its independence, staffing, resources, reporting lines, and ability to effectively monitor adherence to regulatory requirements.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 9',
        },
        {
          id: 'securities-5-2',
          name: 'Transaction monitoring and surveillance concept',
          description:
            'Framework for monitoring trading activities including market abuse detection, insider trading surveillance, suspicious transaction reporting, and order record-keeping.',
          category: 'Compliance',
          finmaReference: 'FinMIA Art. 142-143',
        },
        {
          id: 'securities-5-3',
          name: 'Cross-border activity documentation',
          description:
            'Documentation of planned cross-border services, applicable foreign regulatory requirements, and measures to ensure compliance with Swiss and foreign jurisdiction rules.',
          category: 'Compliance',
          finmaReference: 'FinSA Art. 34',
        },
        {
          id: 'securities-5-4',
          name: 'Capital adequacy and liquidity calculations',
          description:
            'Detailed capital adequacy calculations demonstrating compliance with minimum capital requirements, risk-weighted asset coverage, and liquidity reserves.',
          category: 'Financial',
          finmaReference: 'FinIA Art. 46-47',
        },
        {
          id: 'securities-5-5',
          name: 'Regulatory audit report',
          description:
            'Independent regulatory audit report from the FINMA-approved audit firm assessing the securities firm readiness to meet ongoing regulatory obligations.',
          category: 'Financial',
          finmaReference: 'FinIA Art. 43f',
        },
        {
          id: 'securities-5-6',
          name: 'Outsourcing arrangements and due diligence',
          description:
            'Documentation of any material outsourcing arrangements including service provider due diligence, contractual safeguards, and supervisory access provisions.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2018/3',
        },
        {
          id: 'securities-5-7',
          name: 'FinSA client documentation and disclosure samples',
          description:
            'Sample client documentation including key information documents (KID), prospectus obligations, cost transparency disclosures, and client reporting templates under FinSA.',
          category: 'Compliance',
          finmaReference: 'FinSA Art. 8-9',
        },
      ],
    },
    {
      id: 'securities-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description:
        'FINMA issues the formal authorization decision and supervisory organization oversight commences, establishing ongoing regulatory obligations.',
      documents: [
        {
          id: 'securities-6-1',
          name: 'FINMA authorization decision',
          description:
            'Official FINMA decision granting authorization to operate as a securities firm under FinIA, including any conditions or restrictions attached to the license.',
          category: 'Corporate',
          finmaReference: 'FinIA Art. 5',
        },
        {
          id: 'securities-6-2',
          name: 'Supervisory organization supervision agreement',
          description:
            'Formal agreement with the supervisory organization establishing the scope, frequency, and terms of ongoing prudential supervision.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 43k-43n',
        },
        {
          id: 'securities-6-3',
          name: 'Commercial register entry confirmation',
          description:
            'Confirmation of entry in the Swiss commercial register reflecting the authorized securities firm status and business purpose.',
          category: 'Corporate',
        },
        {
          id: 'securities-6-4',
          name: 'Ongoing reporting obligations schedule',
          description:
            'Documented schedule of all ongoing regulatory reporting obligations including annual reports, capital adequacy reports, and ad-hoc notifications to FINMA and the supervisory organization.',
          category: 'Compliance',
          finmaReference: 'FinIA Art. 43g',
        },
        {
          id: 'securities-6-5',
          name: 'Conditions of authorization acknowledgment',
          description:
            'Signed acknowledgment by the board of directors of all conditions attached to the authorization, including any remediation deadlines or operational restrictions.',
          category: 'Governance',
          finmaReference: 'FinIA Art. 5',
        },
      ],
    },
  ],
}
