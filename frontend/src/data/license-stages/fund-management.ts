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
        'Initial engagement with FINMA to discuss the proposed fund management activity, fund structure, and regulatory classification under CISA.',
      documents: [
        {
          id: 'fund-1-1',
          name: 'Fund strategy and structure overview',
          description:
            'High-level presentation of the proposed fund management business model, fund types (contractual fund, SICAV, SICAF, limited partnership for collective investment), target investor base, and investment strategy.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 13',
        },
        {
          id: 'fund-1-2',
          name: 'Regulatory classification memorandum',
          description:
            'Legal analysis determining the applicable CISA license category, distinguishing between fund management company (Art. 28 CISA) and fund direction (Fondsleitung), and assessing whether activities require authorization.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 13-14',
        },
        {
          id: 'fund-1-3',
          name: 'Pre-consultation meeting minutes',
          description:
            'Documented record of preliminary discussions with FINMA, including guidance on application requirements, expected timeline, and any specific concerns raised by the regulator.',
          category: 'Corporate',
        },
        {
          id: 'fund-1-4',
          name: 'Shareholder and group structure overview',
          description:
            'Chart and narrative describing the ownership structure of the proposed fund management company, including qualified participations, ultimate beneficial owners, and any group affiliations.',
          category: 'Governance',
          finmaReference: 'CISA Art. 14 al. 1 lit. a',
        },
        {
          id: 'fund-1-5',
          name: 'Preliminary capitalization concept',
          description:
            'Initial assessment of capitalization plans demonstrating the ability to meet the minimum share capital requirement of CHF 1 million and adequate own funds proportional to assets under management.',
          category: 'Financial',
          finmaReference: 'CISA Art. 14 al. 1 lit. e',
        },
      ],
    },
    {
      id: 'fund-2',
      name: 'Application Preparation',
      shortName: 'Preparation',
      description:
        'Assembly of all required documentation for the formal fund management company license application under CISA Art. 28 ff.',
      documents: [
        {
          id: 'fund-2-1',
          name: 'Business plan (3-year)',
          description:
            'Comprehensive business plan including financial projections for three years, planned fund launches, distribution strategy, revenue model, staffing plan, and growth targets for assets under management.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 14 al. 1',
        },
        {
          id: 'fund-2-2',
          name: 'Capital adequacy evidence (CHF 1M minimum)',
          description:
            'Documentary proof that the fund management company holds the minimum required share capital of CHF 1 million, fully paid in, plus evidence of additional own funds proportional to managed assets as required by CISO.',
          category: 'Financial',
          finmaReference: 'CISA Art. 14 al. 1 lit. e / CISO Art. 43',
        },
        {
          id: 'fund-2-3',
          name: 'Draft fund regulations',
          description:
            'Draft fund contract (Fondsvertrag) governing the collective investment scheme, including investment policy, permitted investments, risk diversification rules, unit classes, fees, and redemption terms.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 25-35',
        },
        {
          id: 'fund-2-4',
          name: 'Draft custodian bank agreement',
          description:
            'Draft agreement with a FINMA-licensed custodian bank for safekeeping of fund assets, detailing custody duties, cash account management, oversight responsibilities, and settlement of subscriptions and redemptions.',
          category: 'Financial',
          finmaReference: 'CISA Art. 72-74',
        },
        {
          id: 'fund-2-5',
          name: 'Fit and proper dossiers (directors and key personnel)',
          description:
            'Curriculum vitae, criminal record extracts, declarations of good standing, and proof of professional qualifications for all members of the board of directors, executive management, and heads of key functions.',
          category: 'Governance',
          finmaReference: 'CISA Art. 14 al. 1 lit. a-b',
        },
        {
          id: 'fund-2-6',
          name: 'Organizational regulations',
          description:
            'Internal governance framework defining the organizational structure, decision-making authorities, reporting lines, segregation of duties, internal control system, and risk committee mandates.',
          category: 'Governance',
          finmaReference: 'CISA Art. 14 al. 1 lit. c',
        },
        {
          id: 'fund-2-7',
          name: 'Valuation and pricing policy',
          description:
            'Detailed policy for the valuation of fund assets, NAV calculation methodology, pricing of fund units, treatment of illiquid assets, swing pricing mechanisms, and fair value hierarchy.',
          category: 'Financial',
          finmaReference: 'CISA Art. 88 / CISO Art. 87-89',
        },
        {
          id: 'fund-2-8',
          name: 'Risk management framework',
          description:
            'Comprehensive risk management framework covering market risk, credit risk, counterparty risk, operational risk, concentration risk, and model risk, including risk limits, escalation procedures, and stress testing methodology.',
          category: 'Compliance',
          finmaReference: 'CISO Art. 12',
        },
        {
          id: 'fund-2-9',
          name: 'Liquidity risk management policy',
          description:
            'Policy addressing liquidity risk at both the fund management company and individual fund level, including liquidity stress testing, redemption gate mechanisms, and contingency planning for extraordinary market conditions.',
          category: 'Compliance',
          finmaReference: 'FINMA-RS 2015/2',
        },
        {
          id: 'fund-2-10',
          name: 'Delegation and outsourcing policy',
          description:
            'Policy governing the delegation of investment decisions and outsourcing of operational functions, including selection criteria for delegates, ongoing monitoring, sub-delegation restrictions, and liability arrangements.',
          category: 'Governance',
          finmaReference: 'CISA Art. 31 / CISO Art. 23',
        },
        {
          id: 'fund-2-11',
          name: 'Articles of association (draft)',
          description:
            'Draft articles of association for the fund management company as a Swiss corporation (AG) with a registered office in Switzerland, reflecting the exclusive purpose restriction for fund management activities.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 28 al. 2',
        },
      ],
    },
    {
      id: 'fund-3',
      name: 'Formal Submission',
      shortName: 'Submission',
      description:
        'Official submission of the complete fund management license application to FINMA, including all annexes and supporting documentation.',
      documents: [
        {
          id: 'fund-3-1',
          name: 'FINMA license application form (CISA)',
          description:
            'Official FINMA application form for a fund management company license under the Collective Investment Schemes Act, with all mandatory sections completed and signed by authorized representatives.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 13 al. 2',
        },
        {
          id: 'fund-3-2',
          name: 'Notarized articles of association',
          description:
            'Final articles of association of the fund management company, authenticated by a Swiss notary, reflecting the exclusive corporate purpose, registered office, and governance provisions required under CISA.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 28 al. 2',
        },
        {
          id: 'fund-3-3',
          name: 'Fund prospectus (draft)',
          description:
            'Draft prospectus for each proposed fund, containing investment objectives, strategy, risk profile, fee structure, historical performance data (if applicable), tax implications, and investor rights.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 75-76',
        },
        {
          id: 'fund-3-4',
          name: 'Key investor information document (KIID)',
          description:
            'Standardized short-form document providing retail investors with essential information about objectives, risks, costs, and past performance of each proposed fund, in a format prescribed by FINMA.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 76 al. 2',
        },
        {
          id: 'fund-3-5',
          name: 'Distribution plan and distributor agreements',
          description:
            'Comprehensive distribution plan detailing target markets, distribution channels, distributor qualification requirements, and draft agreements with proposed distributors, including cross-border distribution arrangements.',
          category: 'Corporate',
          finmaReference: 'FINMA Circular 2013/9',
        },
        {
          id: 'fund-3-6',
          name: 'AML/KYC compliance framework',
          description:
            'Anti-money laundering and know-your-customer policies aligned with AMLA requirements, including client identification procedures, beneficial ownership determination, transaction monitoring, and suspicious activity reporting.',
          category: 'Compliance',
          finmaReference: 'AMLA Art. 3-8',
        },
        {
          id: 'fund-3-7',
          name: 'Investment compliance framework',
          description:
            'Pre-trade and post-trade compliance monitoring framework ensuring fund investments adhere to regulatory limits, fund regulation constraints, and prospectus-disclosed investment guidelines.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 20 / CISO Art. 12',
        },
        {
          id: 'fund-3-8',
          name: 'FINMA-licensed auditor confirmation',
          description:
            'Letter from a FINMA-recognized audit firm confirming their engagement as regulatory auditor for both the fund management company and the collective investment schemes to be managed.',
          category: 'Financial',
          finmaReference: 'CISA Art. 126-128',
        },
        {
          id: 'fund-3-9',
          name: 'IT infrastructure and data protection concept',
          description:
            'Description of the IT systems supporting portfolio management, order execution, NAV calculation, and reporting, including cybersecurity measures, data protection policies, and business continuity arrangements.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 14 al. 1 lit. c',
        },
      ],
    },
    {
      id: 'fund-4',
      name: 'Completeness Check',
      shortName: 'Completeness',
      description:
        'FINMA reviews the application for formal completeness, verifies all required annexes, and issues requests for supplementary information if needed.',
      documents: [
        {
          id: 'fund-4-1',
          name: 'FINMA acknowledgment of receipt',
          description:
            'Official written confirmation from FINMA that the fund management license application has been received and assigned a case reference number, including the designated case handler.',
          category: 'Corporate',
        },
        {
          id: 'fund-4-2',
          name: 'Supplementary information responses',
          description:
            'Comprehensive responses to all follow-up questions and requests for additional documentation from FINMA, organized by topic area and cross-referenced to original application materials.',
          category: 'Corporate',
        },
        {
          id: 'fund-4-3',
          name: 'Amended application documents',
          description:
            'Revised versions of any application documents updated based on FINMA feedback, with tracked changes and an accompanying summary of all modifications made since the original submission.',
          category: 'Compliance',
        },
      ],
    },
    {
      id: 'fund-5',
      name: 'In-Depth Review',
      shortName: 'Review',
      description:
        'FINMA conducts a substantive review of the fund regulations, organizational adequacy, risk management, compliance framework, and fitness of proposed personnel.',
      documents: [
        {
          id: 'fund-5-1',
          name: 'Fund regulation review and amendments',
          description:
            'Iterative review process between FINMA and the applicant to finalize fund regulations, incorporating FINMA comments on investment restrictions, investor protections, fee disclosures, and redemption terms.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 25-35',
        },
        {
          id: 'fund-5-2',
          name: 'Organizational adequacy assessment',
          description:
            'FINMA evaluation of the organizational structure, staffing levels, segregation of duties between portfolio management and risk control, and adequacy of internal control functions.',
          category: 'Governance',
          finmaReference: 'CISA Art. 14 al. 1 lit. c',
        },
        {
          id: 'fund-5-3',
          name: 'Risk and liquidity management review',
          description:
            'Detailed FINMA review of risk management processes, liquidity stress test results, redemption management procedures, and contingency plans for dealing with liquidity crises at the fund level.',
          category: 'Compliance',
          finmaReference: 'FINMA-RS 2015/2',
        },
        {
          id: 'fund-5-4',
          name: 'Delegation and outsourcing assessment',
          description:
            'FINMA assessment of proposed delegation arrangements for investment management and outsourced operational functions, verifying adequate oversight, control mechanisms, and contractual safeguards.',
          category: 'Governance',
          finmaReference: 'CISA Art. 31 / CISO Art. 23',
        },
        {
          id: 'fund-5-5',
          name: 'Fit and proper interview records',
          description:
            'Records of FINMA interviews with proposed directors and senior management to verify professional competence, personal integrity, adequate time commitment, and independence where required.',
          category: 'Governance',
          finmaReference: 'CISA Art. 14 al. 1 lit. a-b',
        },
        {
          id: 'fund-5-6',
          name: 'Custodian bank due diligence review',
          description:
            'FINMA review of the custodian bank arrangement, ensuring the custodian bank is properly licensed, that the custodian agreement meets regulatory requirements, and that asset segregation procedures are adequate.',
          category: 'Financial',
          finmaReference: 'CISA Art. 72-74',
        },
        {
          id: 'fund-5-7',
          name: 'Conflicts of interest management policy',
          description:
            'Review of procedures for identifying, preventing, and managing conflicts of interest, including personal account dealing rules, best execution policy, and inducements and soft commission disclosure.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 20 / CISO Art. 12',
        },
      ],
    },
    {
      id: 'fund-6',
      name: 'Decision & License Grant',
      shortName: 'Decision',
      description:
        'FINMA issues its formal decision on the license application, grants the fund management company license, and approves the fund regulations for each proposed collective investment scheme.',
      documents: [
        {
          id: 'fund-6-1',
          name: 'FINMA fund management company license',
          description:
            'Official FINMA decision granting authorization to operate as a fund management company (Fondsleitung) under CISA, specifying the scope of permitted activities and any conditions attached to the license.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 13 / Art. 28',
        },
        {
          id: 'fund-6-2',
          name: 'Approved fund regulations',
          description:
            'FINMA-approved fund regulations (Fondsvertrag) for each collective investment scheme, representing the binding contractual framework between the fund management company, custodian bank, and investors.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 25-35',
        },
        {
          id: 'fund-6-3',
          name: 'Distribution authorization',
          description:
            'FINMA authorization to distribute fund units to the specified investor categories and through approved distribution channels, including any cross-border distribution permissions.',
          category: 'Corporate',
          finmaReference: 'FINMA Circular 2013/9',
        },
        {
          id: 'fund-6-4',
          name: 'License conditions acknowledgment',
          description:
            'Signed acknowledgment by the fund management company of all conditions and requirements attached to the license, including deadlines for meeting any transitional provisions.',
          category: 'Governance',
        },
        {
          id: 'fund-6-5',
          name: 'Commercial register entry confirmation',
          description:
            'Confirmation of the fund management company entry in the Swiss commercial register reflecting the licensed status, and listing on the FINMA register of authorized fund management companies.',
          category: 'Corporate',
          finmaReference: 'CISA Art. 13 al. 4',
        },
        {
          id: 'fund-6-6',
          name: 'Post-licensing reporting schedule',
          description:
            'Schedule of ongoing regulatory reporting obligations including annual audited financial statements, semi-annual fund reports, ad hoc notifications for material changes, and periodic regulatory returns to FINMA.',
          category: 'Compliance',
          finmaReference: 'CISA Art. 89-90 / Art. 126-128',
        },
      ],
    },
  ],
}
