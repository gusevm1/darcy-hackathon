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
        'Initial engagement with FINMA to discuss the proposed insurance business model, product classification, and applicable supervisory regime under the Insurance Supervision Act.',
      documents: [
        {
          id: 'insurance-1-1',
          name: 'Insurance business model description',
          description:
            'Detailed description of the proposed insurance business including target markets, distribution channels, and strategic objectives.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 4',
        },
        {
          id: 'insurance-1-2',
          name: 'Product line classification memo',
          description:
            'Legal analysis classifying proposed insurance product lines (life, non-life, reinsurance) under ISA categories and identifying applicable supervisory requirements.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 5',
        },
        {
          id: 'insurance-1-3',
          name: 'Regulatory scope assessment',
          description:
            'Assessment of the regulatory perimeter including cross-border considerations, group supervision implications, and any exemptions under Art. 2 ISA.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 2',
        },
        {
          id: 'insurance-1-4',
          name: 'Pre-consultation meeting minutes',
          description:
            'Documented record of all pre-consultation discussions with FINMA, including guidance received on application requirements and supervisory expectations.',
          category: 'Corporate',
        },
        {
          id: 'insurance-1-5',
          name: 'Preliminary capital and solvency overview',
          description:
            'High-level overview of expected capitalization, preliminary Swiss Solvency Test considerations, and planned capital structure.',
          category: 'Financial',
          finmaReference: 'ISA Art. 9',
        },
      ],
    },
    {
      id: 'insurance-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Comprehensive preparation of all documentation required for the formal insurance license application under the Insurance Supervision Act and Insurance Supervision Ordinance.',
      documents: [
        {
          id: 'insurance-2-1',
          name: 'Business plan (5-year)',
          description:
            'Five-year business plan including premium volume projections, claims ratio estimates, market analysis, distribution strategy, and detailed financial forecasts.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 4',
        },
        {
          id: 'insurance-2-2',
          name: 'Articles of association (draft)',
          description:
            'Draft corporate articles of association reflecting ISA requirements for insurance companies, including purpose clause restricted to insurance activities.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 7',
        },
        {
          id: 'insurance-2-3',
          name: 'Organizational chart and functional description',
          description:
            'Detailed organizational structure with reporting lines, key functions (risk management, compliance, internal audit, actuarial function), and staffing plan.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/2',
        },
        {
          id: 'insurance-2-4',
          name: 'Actuarial report on premium calculations',
          description:
            'Actuarial analyses supporting premium calculations, tariff structures, and pricing methodology for all proposed product lines.',
          category: 'Financial',
          finmaReference: 'ISA Art. 22',
        },
        {
          id: 'insurance-2-5',
          name: 'Swiss Solvency Test (SST) initial calculation',
          description:
            'Initial SST calculation demonstrating projected solvency ratio, including market risk, insurance risk, and credit risk components under the standard model or approved internal model.',
          category: 'Financial',
          finmaReference: 'FINMA Circular 2017/3',
        },
        {
          id: 'insurance-2-6',
          name: 'Technical provisions methodology',
          description:
            'Comprehensive methodology for calculating technical provisions including best estimate liabilities, risk margins, and reserving assumptions for each product line.',
          category: 'Financial',
          finmaReference: 'ISA Art. 16',
        },
        {
          id: 'insurance-2-7',
          name: 'Reinsurance concept',
          description:
            'Reinsurance strategy detailing planned treaty and facultative arrangements, retention levels, counterparty selection criteria, and risk transfer effectiveness.',
          category: 'Financial',
          finmaReference: 'ISA Art. 11',
        },
        {
          id: 'insurance-2-8',
          name: 'Investment policy',
          description:
            'Investment policy governing the management of insurance assets, including asset allocation strategy, risk limits, ALM framework, and compliance with ISA investment regulations.',
          category: 'Financial',
          finmaReference: 'ISA Art. 12',
        },
        {
          id: 'insurance-2-9',
          name: 'Fit & proper dossiers (directors, executives, appointed actuary)',
          description:
            'Background documentation for all proposed board members, senior executives, and the appointed actuary, including CVs, criminal record extracts, and guarantee of proper conduct declarations.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 14',
        },
        {
          id: 'insurance-2-10',
          name: 'Risk management framework',
          description:
            'Enterprise risk management framework covering risk identification, assessment, monitoring, and reporting processes across all material risk categories.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2017/2',
        },
        {
          id: 'insurance-2-11',
          name: 'Internal control system (ICS) concept',
          description:
            'Design of the internal control system including control objectives, key controls, control testing methodology, and escalation procedures.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/2',
        },
        {
          id: 'insurance-2-12',
          name: 'Capital plan and proof of minimum capital',
          description:
            'Evidence of meeting minimum capital requirements under ISA, including source of funds documentation and projected capital development over the planning horizon.',
          category: 'Financial',
          finmaReference: 'ISA Art. 9',
        },
      ],
    },
    {
      id: 'insurance-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official filing of the complete insurance license application with FINMA under the Insurance Supervision Act, including all statutory exhibits and supporting documentation.',
      documents: [
        {
          id: 'insurance-3-1',
          name: 'ISA license application form',
          description:
            'Official FINMA application form for an insurance license with all sections completed and signed by authorized representatives.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 3',
        },
        {
          id: 'insurance-3-2',
          name: 'Notarized articles of association',
          description:
            'Final articles of association certified by a Swiss notary, reflecting all ISA requirements and FINMA pre-consultation feedback.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 7',
        },
        {
          id: 'insurance-3-3',
          name: 'General insurance conditions (GIC)',
          description:
            'General terms and conditions for all proposed insurance products, ensuring compliance with mandatory provisions and consumer protection requirements.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 22',
        },
        {
          id: 'insurance-3-4',
          name: 'Appointed actuary confirmation and mandate',
          description:
            'Formal confirmation of the appointment of a responsible actuary including the mandate agreement, qualification certificates, and independence declaration.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 23',
        },
        {
          id: 'insurance-3-5',
          name: 'AML/CTF policy (life insurance)',
          description:
            'Anti-money laundering and counter-terrorism financing policies and procedures for life insurance products, including customer due diligence and suspicious activity reporting.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 3-8',
        },
        {
          id: 'insurance-3-6',
          name: 'Corporate governance regulations',
          description:
            'Internal governance regulations covering board responsibilities, committee structures, delegation of authority, and conflicts of interest management.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/2',
        },
        {
          id: 'insurance-3-7',
          name: 'Outsourcing policy and material outsourcing agreements',
          description:
            'Policy governing outsourcing of material functions, including drafted service agreements, oversight mechanisms, and contingency arrangements.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2017/2',
        },
        {
          id: 'insurance-3-8',
          name: 'IT security and business continuity plan',
          description:
            'Information technology security framework and business continuity management plan ensuring operational resilience of critical insurance operations.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2023/1',
        },
        {
          id: 'insurance-3-9',
          name: 'Auditor engagement confirmation',
          description:
            'Letter from a FINMA-recognized audit firm confirming engagement for regulatory audit under the Insurance Supervision Act.',
          category: 'Financial',
          finmaReference: 'ISA Art. 28',
        },
        {
          id: 'insurance-3-10',
          name: 'Complaints handling procedure',
          description:
            'Formal procedure for receiving, processing, and resolving policyholder complaints, including escalation paths and record-keeping requirements.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 30',
        },
      ],
    },
    {
      id: 'insurance-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA reviews the submitted application for formal completeness, raises initial queries, and confirms the application is ready for substantive assessment.',
      documents: [
        {
          id: 'insurance-4-1',
          name: 'FINMA acknowledgment of receipt',
          description:
            'Official acknowledgment letter from FINMA confirming receipt of the insurance license application and assignment of a case reference number.',
          category: 'Corporate',
        },
        {
          id: 'insurance-4-2',
          name: 'Completeness deficiency notice responses',
          description:
            'Formal responses to FINMA deficiency notices addressing missing or incomplete documentation identified during the completeness review.',
          category: 'Corporate',
        },
        {
          id: 'insurance-4-3',
          name: 'Actuarial review clarification responses',
          description:
            'Responses to preliminary actuarial queries raised by FINMA regarding technical provisions, premium calculations, or SST methodology.',
          category: 'Financial',
          finmaReference: 'ISA Art. 22-23',
        },
        {
          id: 'insurance-4-4',
          name: 'Updated SST calculation (if requested)',
          description:
            'Revised Swiss Solvency Test calculation incorporating updated market data, refined assumptions, or methodology adjustments requested by FINMA.',
          category: 'Financial',
          finmaReference: 'FINMA Circular 2017/3',
        },
      ],
    },
    {
      id: 'insurance-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts a detailed substantive review of the application, including assessment of the Swiss Solvency Test, governance framework, product design, and operational readiness.',
      documents: [
        {
          id: 'insurance-5-1',
          name: 'SST detailed review and stress testing documentation',
          description:
            'Comprehensive SST documentation including detailed risk model specifications, parameter calibrations, stress test scenarios, and sensitivity analyses.',
          category: 'Financial',
          finmaReference: 'FINMA Circular 2017/3',
        },
        {
          id: 'insurance-5-2',
          name: 'Governance and ICS assessment report',
          description:
            'Detailed assessment of the corporate governance framework, internal control system effectiveness, and compliance with FINMA corporate governance requirements for insurers.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/2',
        },
        {
          id: 'insurance-5-3',
          name: 'Product approval dossiers',
          description:
            'Individual product approval files for each proposed insurance product including policy wording, pricing basis, target market assessment, and consumer fairness analysis.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 4-5',
        },
        {
          id: 'insurance-5-4',
          name: 'Own Risk and Solvency Assessment (ORSA) report',
          description:
            'Forward-looking assessment of own risk profile in relation to solvency needs, including prospective solvency analysis under various economic scenarios.',
          category: 'Financial',
          finmaReference: 'ISA Art. 9a',
        },
        {
          id: 'insurance-5-5',
          name: 'Fit & proper assessment results',
          description:
            'FINMA fit and proper assessment outcomes for all key personnel including any conditions, follow-up requirements, or additional due diligence findings.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 14',
        },
        {
          id: 'insurance-5-6',
          name: 'On-site inspection preparation and findings',
          description:
            'Documentation prepared for and arising from the FINMA on-site inspection, including operational readiness evidence, interview protocols, and remediation actions.',
          category: 'Compliance',
        },
        {
          id: 'insurance-5-7',
          name: 'Reinsurance program final review',
          description:
            'Final review documentation for the reinsurance program including executed treaty slips, counterparty credit assessments, and adequacy of risk transfer.',
          category: 'Financial',
          finmaReference: 'ISA Art. 11',
        },
        {
          id: 'insurance-5-8',
          name: 'Appointed actuary report on technical provisions',
          description:
            'Formal report from the appointed actuary confirming the adequacy of technical provisions, appropriateness of actuarial assumptions, and compliance with reserving standards.',
          category: 'Financial',
          finmaReference: 'ISA Art. 23',
        },
      ],
    },
    {
      id: 'insurance-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description:
        'FINMA issues its formal decision on the insurance license application, grants authorization for specified product lines, and establishes ongoing supervisory requirements.',
      documents: [
        {
          id: 'insurance-6-1',
          name: 'FINMA insurance license decision',
          description:
            'Official FINMA ruling granting the insurance license, specifying authorized insurance classes, any conditions or restrictions, and the effective date of authorization.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 6',
        },
        {
          id: 'insurance-6-2',
          name: 'Authorized insurance classes and product lines',
          description:
            'Formal list of authorized insurance classes (life, non-life branches) and approved product lines that the insurer is permitted to underwrite.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 5',
        },
        {
          id: 'insurance-6-3',
          name: 'License conditions acknowledgment',
          description:
            'Signed acknowledgment of all conditions and obligations attached to the insurance license, including any transitional arrangements or deadlines for compliance.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 6',
        },
        {
          id: 'insurance-6-4',
          name: 'SST and supervisory reporting schedule',
          description:
            'Schedule of ongoing Swiss Solvency Test submissions, financial reporting requirements, and ad-hoc notification obligations to FINMA.',
          category: 'Financial',
          finmaReference: 'FINMA Circular 2017/3',
        },
        {
          id: 'insurance-6-5',
          name: 'Commercial register entry confirmation',
          description:
            'Confirmation of entry in the Swiss commercial register as a FINMA-authorized insurance company.',
          category: 'Corporate',
          finmaReference: 'ISA Art. 7',
        },
        {
          id: 'insurance-6-6',
          name: 'Ongoing supervisory obligations summary',
          description:
            'Comprehensive summary of ongoing supervisory requirements including annual reporting, appointed actuary duties, audit obligations, and material change notification requirements.',
          category: 'Compliance',
          finmaReference: 'ISA Art. 25-30',
        },
      ],
    },
  ],
}
