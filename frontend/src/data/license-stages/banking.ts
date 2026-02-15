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
        'Initial engagement with FINMA to discuss the proposed banking activity, regulatory classification, and license requirements.',
      documents: [
        {
          id: 'banking-1-1',
          name: 'Preliminary business concept',
          description:
            'High-level overview of the proposed banking business model, target market, product and service offering, and strategic rationale for seeking a Swiss banking license.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 1 BankA',
        },
        {
          id: 'banking-1-2',
          name: 'Regulatory classification memo',
          description:
            'Legal analysis determining the applicable regulatory framework, confirming the activity constitutes accepting deposits from the public on a professional basis and requires a banking license.',
          category: 'Compliance',
          finmaReference: 'Art. 1a BankO',
        },
        {
          id: 'banking-1-3',
          name: 'Shareholder structure overview',
          description:
            'Preliminary disclosure of the planned ownership structure, including identification of all direct and indirect qualified participants holding 10% or more of capital or voting rights.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 lit. cbis BankA',
        },
        {
          id: 'banking-1-4',
          name: 'Pre-consultation meeting request and agenda',
          description:
            'Formal request letter to FINMA for a pre-consultation meeting, including a proposed agenda covering the business concept, organizational setup, and key regulatory questions.',
          category: 'Corporate',
        },
        {
          id: 'banking-1-5',
          name: 'Preliminary capital and funding concept',
          description:
            'Initial outline of the planned capitalization structure, sources of minimum required capital, and demonstration of financial capacity to meet the CHF 10 million minimum capital requirement.',
          category: 'Financial',
          finmaReference: 'Art. 4 BankO',
        },
        {
          id: 'banking-1-6',
          name: 'Pre-consultation meeting minutes',
          description:
            'Documented record of discussions, guidance received, and any preliminary feedback or conditions communicated by FINMA during the pre-consultation meeting.',
          category: 'Corporate',
        },
      ],
    },
    {
      id: 'banking-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Assembly of all required documentation for the formal banking license application, including corporate documents, governance frameworks, and financial plans.',
      documents: [
        {
          id: 'banking-2-1',
          name: 'Business plan (3-year)',
          description:
            'Comprehensive business plan covering the first three years of operation, including detailed financial projections, revenue model, market analysis, competitive positioning, growth strategy, and scenario analyses.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 lit. a BankA',
        },
        {
          id: 'banking-2-2',
          name: 'Draft articles of association',
          description:
            'Draft corporate articles compliant with Swiss Code of Obligations and banking regulatory requirements, specifying the corporate purpose restricted to banking activities, share capital structure, and governance provisions.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 lit. a BankA',
        },
        {
          id: 'banking-2-3',
          name: 'Organizational regulations',
          description:
            'Internal organizational regulations defining the governance framework, division of responsibilities between the board of directors and executive management, committee structures, and delegation of authority.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/1 Corporate governance – banks',
        },
        {
          id: 'banking-2-4',
          name: 'Organizational chart and functional descriptions',
          description:
            'Detailed organizational structure showing all business units, control functions, reporting lines, and functional descriptions for each key position, demonstrating adequate separation of duties.',
          category: 'Corporate',
          finmaReference: 'FINMA Circular 2017/1 margin no. 1-30',
        },
        {
          id: 'banking-2-5',
          name: 'Capital plan and proof of minimum capital',
          description:
            'Detailed capital plan demonstrating how the bank will meet and maintain the minimum capital requirement of CHF 10 million, including evidence of capital commitments, paid-in capital schedule, and capital adequacy projections.',
          category: 'Financial',
          finmaReference: 'Art. 4 BankO; Art. 1-3 CAO',
        },
        {
          id: 'banking-2-6',
          name: 'Fit and proper dossiers for board members',
          description:
            'Complete background dossiers for all proposed board members including CVs, educational credentials, professional references, criminal record extracts, bankruptcy register extracts, and declarations of good standing.',
          category: 'Governance',
          finmaReference: 'Art. 3 para. 2 lit. c BankA; Art. 12 BankO',
        },
        {
          id: 'banking-2-7',
          name: 'Fit and proper dossiers for executive management',
          description:
            'Complete background dossiers for all proposed members of executive management, demonstrating adequate professional qualifications, experience in banking, and personal integrity requirements.',
          category: 'Governance',
          finmaReference: 'Art. 3 para. 2 lit. c BankA; Art. 13 BankO',
        },
        {
          id: 'banking-2-8',
          name: 'Risk management framework',
          description:
            'Comprehensive risk management framework covering risk identification, assessment, monitoring, and mitigation for all material risk categories including credit, market, liquidity, operational, and reputational risks.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2008/21 Operational risks – banks',
        },
        {
          id: 'banking-2-9',
          name: 'Internal control system concept',
          description:
            'Description of the planned internal control system including the three lines of defense model, compliance function, risk control function, and internal audit function with independence requirements.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2017/1 margin no. 68-95',
        },
        {
          id: 'banking-2-10',
          name: 'AML/KYC policy and procedures',
          description:
            'Anti-money laundering and know-your-customer policies covering client identification and verification, beneficial ownership determination, risk-based client classification, transaction monitoring, and suspicious activity reporting.',
          category: 'Compliance',
          finmaReference: 'Art. 3-8 AMLA; FINMA Circular 2016/7',
        },
        {
          id: 'banking-2-11',
          name: 'Remuneration policy',
          description:
            'Remuneration policy for the board of directors and executive management, ensuring alignment with long-term interests and sound risk management, including variable compensation deferral and clawback provisions.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2010/1 Remuneration schemes',
        },
        {
          id: 'banking-2-12',
          name: 'Qualified participants documentation',
          description:
            'Complete disclosure of all qualified participants holding directly or indirectly 10% or more of capital or voting rights, including identification documents, source of funds declarations, group structure charts, and reputation assessments.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 lit. cbis BankA; Art. 3a BankA',
        },
      ],
    },
    {
      id: 'banking-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official submission of the complete application package to FINMA, including all finalized corporate, compliance, financial, and governance documentation.',
      documents: [
        {
          id: 'banking-3-1',
          name: 'Completed FINMA application form',
          description:
            'Official FINMA banking license application form with all required sections completed, signed by authorized representatives of the applicant entity.',
          category: 'Corporate',
          finmaReference: 'Art. 3 BankA; Art. 2 BankO',
        },
        {
          id: 'banking-3-2',
          name: 'Notarized articles of association',
          description:
            'Final articles of association certified by a Swiss notary, reflecting the corporate purpose limited to banking activities and all regulatory requirements for banking entities.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 lit. a BankA',
        },
        {
          id: 'banking-3-3',
          name: 'Audit firm engagement confirmation',
          description:
            'Letter from a FINMA-recognized regulatory audit firm confirming engagement as the external auditor for the applicant bank, including confirmation of auditor independence and licensing.',
          category: 'Financial',
          finmaReference: 'Art. 18 BankA; Art. 26-28 FINMASA',
        },
        {
          id: 'banking-3-4',
          name: 'IT security and data protection concept',
          description:
            'Comprehensive IT security framework covering information security governance, access controls, encryption standards, vulnerability management, incident response, and data protection measures in compliance with Swiss data protection law.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2008/21 margin no. 100-135',
        },
        {
          id: 'banking-3-5',
          name: 'Business continuity management plan',
          description:
            'Business continuity and disaster recovery plan covering critical business processes, recovery time objectives, fallback procedures, crisis communication protocols, and regular testing schedules.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2008/21 margin no. 136-145',
        },
        {
          id: 'banking-3-6',
          name: 'Outsourcing policy and due diligence',
          description:
            'Policy governing the outsourcing of material business activities to third parties, including risk assessment methodology, contractual requirements, monitoring obligations, and due diligence documentation for each planned outsourcing arrangement.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2018/3 Outsourcing – banks and insurers',
        },
        {
          id: 'banking-3-7',
          name: 'Liquidity management framework',
          description:
            'Liquidity management framework describing the liquidity risk governance, liquidity coverage ratio calculations, net stable funding ratio projections, stress testing methodology, and contingency funding plan.',
          category: 'Financial',
          finmaReference: 'Art. 4 BankA; Art. 2-17 LiqO',
        },
        {
          id: 'banking-3-8',
          name: 'Capital adequacy calculations',
          description:
            'Detailed capital adequacy calculations demonstrating compliance with minimum capital requirements, including risk-weighted asset calculations, capital buffers, and leverage ratio projections under the Basel III framework.',
          category: 'Financial',
          finmaReference: 'Art. 1-4 CAO',
        },
        {
          id: 'banking-3-9',
          name: 'Depositor protection scheme declaration',
          description:
            'Declaration of membership or planned membership in the esisuisse depositor protection scheme, including confirmation of the obligation to secure privileged deposits.',
          category: 'Compliance',
          finmaReference: 'Art. 37a-37j BankA',
        },
        {
          id: 'banking-3-10',
          name: 'Complaints handling and ombudsman affiliation',
          description:
            'Formal client complaints handling procedure and confirmation of affiliation with a FINMA-recognized ombudsman body for the resolution of client disputes.',
          category: 'Compliance',
          finmaReference: 'Art. 80-82 FINMASA',
        },
      ],
    },
    {
      id: 'banking-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA reviews the submission for formal completeness and requests any missing or supplementary documentation before initiating the substantive review.',
      documents: [
        {
          id: 'banking-4-1',
          name: 'FINMA acknowledgment of receipt',
          description:
            'Official written confirmation from FINMA acknowledging receipt of the complete banking license application and confirming commencement of the formal review process.',
          category: 'Corporate',
        },
        {
          id: 'banking-4-2',
          name: 'Supplementary information responses',
          description:
            'Formal responses to any follow-up questions, clarifications, or additional document requests issued by FINMA during the completeness review, including all supplementary attachments.',
          category: 'Corporate',
          finmaReference: 'Art. 6 BankO',
        },
        {
          id: 'banking-4-3',
          name: 'Updated financial projections',
          description:
            'Revised or updated financial projections if material time has elapsed since original submission, reflecting current market conditions and any changes to the business plan assumptions.',
          category: 'Financial',
          finmaReference: 'Art. 4 BankO',
        },
        {
          id: 'banking-4-4',
          name: 'Confirmation of no material changes',
          description:
            'Written declaration confirming that no material changes have occurred to the ownership structure, management composition, business plan, or capital position since the original application submission.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 BankA',
        },
      ],
    },
    {
      id: 'banking-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts a detailed substantive assessment of the application, including evaluation of governance, capital adequacy, risk management, and potential on-site inspections.',
      documents: [
        {
          id: 'banking-5-1',
          name: 'FINMA due diligence questionnaire responses',
          description:
            'Completed responses to the detailed FINMA due diligence questionnaire covering corporate governance effectiveness, operational readiness, risk management maturity, and compliance infrastructure.',
          category: 'Compliance',
          finmaReference: 'Art. 3 para. 2 BankA',
        },
        {
          id: 'banking-5-2',
          name: 'Capital adequacy stress test results',
          description:
            'Results of capital adequacy stress testing under adverse scenarios, demonstrating the bank ability to maintain required capital ratios under conditions of financial stress, including methodology documentation.',
          category: 'Financial',
          finmaReference: 'Art. 4 para. 2 BankA; CAO Annex 1',
        },
        {
          id: 'banking-5-3',
          name: 'On-site inspection preparation package',
          description:
            'Documentation prepared for the FINMA on-site inspection visit, including office readiness confirmation, staff availability schedule, system access arrangements, and index of all documentation available for review.',
          category: 'Compliance',
          finmaReference: 'Art. 29 FINMASA',
        },
        {
          id: 'banking-5-4',
          name: 'Regulatory audit report',
          description:
            'Independent regulatory audit report prepared by the appointed FINMA-recognized audit firm, confirming the applicant readiness to commence banking operations and compliance with all licensing conditions.',
          category: 'Financial',
          finmaReference: 'Art. 18 BankA; Art. 24 FINMASA',
        },
        {
          id: 'banking-5-5',
          name: 'AML/KYC operational readiness assessment',
          description:
            'Detailed assessment demonstrating operational readiness of anti-money laundering systems, including transaction monitoring system configuration, screening tools, case management workflows, and trained staff capacity.',
          category: 'Compliance',
          finmaReference: 'Art. 3-8 AMLA',
        },
        {
          id: 'banking-5-6',
          name: 'IT systems operational readiness report',
          description:
            'Report confirming operational readiness of all core banking systems, including test results for core banking platform, payment processing, client onboarding, regulatory reporting, and disaster recovery capabilities.',
          category: 'Compliance',
          finmaReference: 'FINMA Circular 2008/21 margin no. 100-135',
        },
        {
          id: 'banking-5-7',
          name: 'Internal audit charter and plan',
          description:
            'Internal audit charter defining independence, mandate, and reporting lines, together with the initial internal audit plan covering the first twelve months of operations and risk-based audit methodology.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/1 margin no. 80-95',
        },
        {
          id: 'banking-5-8',
          name: 'Compliance function readiness confirmation',
          description:
            'Confirmation of compliance function readiness, including appointment of the head of compliance, regulatory monitoring procedures, compliance risk assessment, and regulatory change management process.',
          category: 'Governance',
          finmaReference: 'FINMA Circular 2017/1 margin no. 68-79',
        },
      ],
    },
    {
      id: 'banking-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description:
        'FINMA issues its formal decision on the banking license application and, if approved, grants the license subject to any conditions and ongoing obligations.',
      documents: [
        {
          id: 'banking-6-1',
          name: 'FINMA decision letter',
          description:
            'Official FINMA decision letter granting or denying the banking license application, including the legal basis for the decision and any conditions or restrictions attached to the license.',
          category: 'Corporate',
          finmaReference: 'Art. 3 BankA',
        },
        {
          id: 'banking-6-2',
          name: 'License conditions acknowledgment',
          description:
            'Signed acknowledgment by the board of directors and executive management of all conditions and restrictions attached to the banking license, including any time-limited conditions with compliance deadlines.',
          category: 'Compliance',
          finmaReference: 'Art. 3 para. 2 BankA',
        },
        {
          id: 'banking-6-3',
          name: 'Commercial register entry confirmation',
          description:
            'Confirmation of entry in the Swiss commercial register as a FINMA-licensed bank, including the official business name, registered office, and authorized signatories.',
          category: 'Corporate',
          finmaReference: 'Art. 3 para. 2 lit. a BankA',
        },
        {
          id: 'banking-6-4',
          name: 'Post-licensing regulatory reporting schedule',
          description:
            'Complete schedule of all ongoing regulatory reporting obligations to FINMA and the Swiss National Bank, including reporting frequencies, formats, deadlines, and responsible persons.',
          category: 'Compliance',
          finmaReference: 'Art. 6 BankA; FINMA Circular 2020/1',
        },
        {
          id: 'banking-6-5',
          name: 'Depositor protection scheme membership confirmation',
          description:
            'Formal confirmation of membership in the esisuisse depositor protection scheme, including evidence of the initial contribution and acknowledgment of obligations to secure privileged deposits up to CHF 100,000 per depositor.',
          category: 'Financial',
          finmaReference: 'Art. 37a-37j BankA',
        },
        {
          id: 'banking-6-6',
          name: 'Operational launch readiness declaration',
          description:
            'Declaration by the board of directors confirming that all systems, processes, personnel, and infrastructure are in place and the bank is ready to commence operations in compliance with all regulatory requirements.',
          category: 'Governance',
          finmaReference: 'Art. 3 para. 2 BankA',
        },
        {
          id: 'banking-6-7',
          name: 'Recovery and resolution planning outline',
          description:
            'Initial outline of the recovery plan describing measures available to restore financial strength and viability in situations of financial distress, as required for ongoing licensing compliance.',
          category: 'Governance',
          finmaReference: 'Art. 25-37 BankA',
        },
      ],
    },
  ],
}
