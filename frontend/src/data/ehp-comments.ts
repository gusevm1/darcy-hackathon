import type { EHPComment } from '@/types'

/**
 * Mock EHP (Electronic Hub Platform) comments for demo purposes.
 * These simulate the comment threads that appear on FINMA's EHP portal
 * during the license application review process.
 */
export const ehpComments: EHPComment[] = [
  // ── Stage 1: Pre-Consultation ──────────────────────────────
  {
    id: 'ehp-001',
    documentId: 'banking-1-1',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Business concept received. Please clarify the expected deposit volume for Year 1 and Year 2, and specify whether retail or institutional deposits are targeted.',
    timestamp: '2025-07-12T09:15:00Z',
    resolved: true,
  },
  {
    id: 'ehp-002',
    documentId: 'banking-1-1',
    author: 'Thomas Müller',
    role: 'applicant',
    content:
      'Year 1: CHF 50M primarily institutional deposits. Year 2: CHF 120M expanding to retail. Updated concept document uploaded.',
    timestamp: '2025-07-15T14:30:00Z',
    resolved: true,
  },
  {
    id: 'ehp-003',
    documentId: 'banking-1-1',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content: 'Noted. Retail expansion will require enhanced depositor protection measures. Proceed with application preparation.',
    timestamp: '2025-07-16T10:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-004',
    documentId: 'banking-1-2',
    author: 'Dr. S. Keller',
    role: 'consultant',
    content:
      'Regulatory classification confirmed: Full banking license under Art. 3 BankA required due to planned deposit-taking and lending activities. FinTech license (Art. 1b) not applicable given lending component.',
    timestamp: '2025-07-20T11:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-005',
    documentId: 'banking-1-3',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Shareholder structure appears straightforward. Please confirm whether Müller Holding AG holds any indirect participations through nominee structures.',
    timestamp: '2025-07-25T08:45:00Z',
    resolved: true,
  },
  {
    id: 'ehp-006',
    documentId: 'banking-1-3',
    author: 'Thomas Müller',
    role: 'applicant',
    content: 'Confirmed: No nominee or trust structures. Müller Holding AG holds 85% directly. Remaining 15% held by three natural persons as detailed in the updated document.',
    timestamp: '2025-07-26T16:20:00Z',
    resolved: true,
  },
  {
    id: 'ehp-007',
    documentId: 'banking-1-5',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Capital concept noted. CHF 12M initial capitalization provides adequate buffer above the CHF 10M minimum. Please ensure capital commitment letters are included in the formal application.',
    timestamp: '2025-08-02T10:30:00Z',
    resolved: true,
  },

  // ── Stage 2: Application Preparation ──────────────────────
  {
    id: 'ehp-010',
    documentId: 'banking-2-1',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Business plan reviewed. The revenue model assumptions for Year 2 appear optimistic given current market conditions. Please provide sensitivity analysis with pessimistic scenario.',
    timestamp: '2025-09-10T09:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-011',
    documentId: 'banking-2-1',
    author: 'Thomas Müller',
    role: 'applicant',
    content:
      'Sensitivity analysis added in Section 7.3. Three scenarios modelled: base case, stressed (-30% revenue), and severe stress (-50% revenue). Capital remains above minimum in all scenarios.',
    timestamp: '2025-09-15T13:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-012',
    documentId: 'banking-2-3',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content:
      'Organizational regulations need to include explicit delegation of authority matrix. Current version lacks clear delineation between Board and executive management decision rights per FINMA Circular 2017/1.',
    timestamp: '2025-09-20T14:15:00Z',
    resolved: false,
  },
  {
    id: 'ehp-013',
    documentId: 'banking-2-3',
    author: 'Dr. S. Keller',
    role: 'consultant',
    content:
      'We are revising the organizational regulations to include the delegation matrix. Updated version will be uploaded by 30 September. See tracked changes in Appendix A.',
    timestamp: '2025-09-22T09:30:00Z',
    resolved: false,
  },
  {
    id: 'ehp-014',
    documentId: 'banking-2-5',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Capital plan is comprehensive. Please provide bank confirmation letter for the CHF 12M deposit once the escrow account is established.',
    timestamp: '2025-09-25T11:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-015',
    documentId: 'banking-2-6',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content:
      'Board member CV for Frau Dr. Meier needs to include specific banking supervisory experience. Current CV emphasizes corporate law but FINMA requires demonstrated financial services expertise on the board.',
    timestamp: '2025-10-01T09:45:00Z',
    resolved: false,
  },
  {
    id: 'ehp-016',
    documentId: 'banking-2-8',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Risk management framework is well-structured. Two observations: (1) Operational risk section should reference FINMA Circular 2023/1 on operational resilience. (2) Please add climate risk considerations per FINMA Guidance 01/2024.',
    timestamp: '2025-10-05T14:00:00Z',
    resolved: false,
  },
  {
    id: 'ehp-017',
    documentId: 'banking-2-8',
    author: 'Thomas Müller',
    role: 'applicant',
    content:
      'Thank you for the feedback. We will update both sections. Expected revision date: 15 October 2025.',
    timestamp: '2025-10-06T10:30:00Z',
    resolved: false,
  },
  {
    id: 'ehp-018',
    documentId: 'banking-2-10',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content:
      'AML/KYC policies are comprehensive. Please ensure the transaction monitoring thresholds are aligned with current FINMA Circular 2016/7 requirements. Section 4.2 refers to outdated CHF 25,000 threshold — this should be CHF 15,000 per the 2024 amendment.',
    timestamp: '2025-10-08T09:00:00Z',
    resolved: false,
  },
  {
    id: 'ehp-019',
    documentId: 'banking-2-10',
    author: 'Dr. S. Keller',
    role: 'consultant',
    content:
      'Corrected. All thresholds updated to reflect the 2024 AMLA amendment. Transaction monitoring rules recalibrated accordingly. See v3 of the document.',
    timestamp: '2025-10-10T15:00:00Z',
    resolved: false,
  },
  {
    id: 'ehp-020',
    documentId: 'banking-2-9',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Internal control system concept follows the three lines of defense model appropriately. Please clarify the reporting line of the compliance function — it should report directly to the Board, not through the CEO.',
    timestamp: '2025-10-12T11:30:00Z',
    resolved: false,
  },
  {
    id: 'ehp-021',
    documentId: 'banking-2-4',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content: 'Organizational chart approved. Functional descriptions are adequate. No further action required.',
    timestamp: '2025-09-30T16:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-022',
    documentId: 'banking-2-11',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Remuneration policy reviewed. Variable compensation deferral period should be extended from 1 year to 3 years for senior management per FINMA Circular 2010/1 margin no. 45.',
    timestamp: '2025-10-15T10:00:00Z',
    resolved: false,
  },
  {
    id: 'ehp-023',
    documentId: 'banking-2-12',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content:
      'Source of funds documentation for Müller Holding AG is complete. Still pending: Declaration of beneficial ownership for the 5% stake held through Alpenrose Beteiligungen GmbH.',
    timestamp: '2025-10-18T14:30:00Z',
    resolved: false,
  },
  {
    id: 'ehp-024',
    documentId: 'banking-2-2',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Draft articles reviewed. Purpose clause is appropriately restricted to banking activities. Minor: Article 12 should reference the BankA capital maintenance requirement explicitly.',
    timestamp: '2025-09-18T09:30:00Z',
    resolved: true,
  },
  {
    id: 'ehp-025',
    documentId: 'banking-2-7',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content:
      'Executive management dossiers are satisfactory. CEO and CFO demonstrate adequate banking experience. Please provide reference letters for the Head of Operations.',
    timestamp: '2025-10-03T11:15:00Z',
    resolved: false,
  },

  // ── Stage 3: Formal Submission ────────────────────────────
  {
    id: 'ehp-030',
    documentId: 'banking-3-1',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Application form received. Completeness check initiated. Expected processing time: 2-4 weeks for initial review.',
    timestamp: '2025-11-01T08:00:00Z',
    resolved: false,
  },
  {
    id: 'ehp-031',
    documentId: 'banking-3-3',
    author: 'R. Zimmermann',
    role: 'auditor',
    content:
      'Audit engagement confirmed. PwC Switzerland will serve as regulatory auditor. Independence declaration and audit plan submitted.',
    timestamp: '2025-10-28T10:00:00Z',
    resolved: true,
  },
  {
    id: 'ehp-032',
    documentId: 'banking-3-4',
    author: 'A. Weber',
    role: 'finma-reviewer',
    content:
      'IT security concept needs to address cloud infrastructure risks specifically. Please add a section on cloud service provider oversight per FINMA Circular 2018/3.',
    timestamp: '2025-11-05T14:00:00Z',
    resolved: false,
  },
  {
    id: 'ehp-033',
    documentId: 'banking-3-7',
    author: 'M. Brunner',
    role: 'finma-reviewer',
    content:
      'Liquidity framework is sound. LCR projections show adequate buffers. Please include NSFR calculation as well for completeness.',
    timestamp: '2025-11-10T09:30:00Z',
    resolved: false,
  },
]

/**
 * Get comments for a specific document, sorted by timestamp.
 */
export function getCommentsForDocument(documentId: string): EHPComment[] {
  return ehpComments
    .filter((c) => c.documentId === documentId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}

/**
 * Get unresolved comment count for a document.
 */
export function getUnresolvedCount(documentId: string): number {
  return ehpComments.filter((c) => c.documentId === documentId && !c.resolved).length
}
