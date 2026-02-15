import type { CannedResponse } from '@/types/assistant'

export const cannedResponses: CannedResponse[] = [
  {
    keywords: ['aml', 'kyc', 'money laundering'],
    content:
      'Based on the submitted documents, the AML/KYC policies for Alpine Digital Bank AG and ZuriPay Fintech GmbH are progressing well. The banking AML/KYC policy [1] has been submitted and is currently under review by FINMA. The fintech AML concept [2] is also in the preparation phase. Both documents need to demonstrate compliance with AMLA (Anti-Money Laundering Act) requirements, including customer identification procedures, transaction monitoring, and suspicious activity reporting obligations.',
    citationDocIds: ['banking-3-4', 'fintech-2-5'],
  },
  {
    keywords: ['capital', 'capital adequacy'],
    content:
      'Capital requirements vary significantly across license types. Alpine Digital Bank AG has submitted their capital plan demonstrating the minimum CHF 10M requirement [1]. Helvetia Securities AG has their capital adequacy proof in review [2], while ZuriPay Fintech GmbH needs to meet the lower CHF 300K threshold for fintech licenses [3]. All capital documentation must comply with the relevant FINMA circulars on capital adequacy and liquidity.',
    citationDocIds: ['banking-2-4', 'securities-2-2', 'fintech-2-2'],
  },
  {
    keywords: ['status', 'overview', 'progress'],
    content:
      'Here is a summary of the current application status across clients. Alpine Digital Bank AG is in the Formal Submission stage — the FINMA application form [1] has been approved, while the auditor confirmation letter [2] has been uploaded and awaits review. ZuriPay Fintech GmbH is preparing their Application — the simplified business plan [3] is approved. Overall, 3 of 5 clients have active submissions in progress, with the remaining clients in earlier preparation phases.',
    citationDocIds: ['banking-3-1', 'banking-3-3', 'fintech-2-1'],
  },
  {
    keywords: ['risk', 'risk management'],
    content:
      'Risk management frameworks are a critical component of the licensing process. Alpine Digital Bank AG has submitted their comprehensive risk management framework [1] as part of the Application Preparation stage. Helvetia Securities AG also has their risk management policy [2] documented. Both frameworks need to address market risk, credit risk, operational risk, and liquidity risk in accordance with FINMA Circular 2017/1 on corporate governance.',
    citationDocIds: ['banking-2-7', 'securities-2-6'],
  },
  {
    keywords: ['upload', 'missing', 'incomplete'],
    content:
      'Several documents are still pending upload across the active applications. For Alpine Digital Bank AG in the Formal Submission stage, the outsourcing policy [1] and complaints handling procedure [2] still need to be uploaded. I recommend prioritizing these documents as they are required for the completeness check phase. You can upload documents by using the upload button in the sidebar or dragging files directly into the document tree.',
    citationDocIds: ['banking-3-6', 'banking-3-7'],
  },
  {
    keywords: ['insurance', 'edelweiss', 'isa'],
    content:
      'Edelweiss Insurance AG is in the early Pre-Consultation stage of their ISA (Insurance Supervision Act) license application. The insurance business model description [1] is the first document in the pipeline, and the product line classification [2] needs to be prepared next. Key requirements for insurance licenses include actuarial reports, Swiss Solvency Test compliance, and reinsurance arrangements. The full application will require approximately 30 documents across 6 stages.',
    citationDocIds: ['insurance-1-1', 'insurance-1-2'],
  },
  {
    keywords: ['fintech', 'zuripay', 'sandbox'],
    content:
      'ZuriPay Fintech GmbH is pursuing a fintech license under Art. 1b BankA, which allows acceptance of public deposits up to CHF 100 million. Their simplified business plan [1] has been approved, and the proof of capital (CHF 300K) [2] is currently under review. The IT security concept [3] still needs to be uploaded. The fintech license offers a streamlined path compared to a full banking license, with reduced capital requirements and simplified regulatory obligations.',
    citationDocIds: ['fintech-2-1', 'fintech-2-2', 'fintech-2-6'],
  },
]

export const fallbackResponse: CannedResponse = {
  keywords: [],
  content:
    'I can help you with information about the FINMA licensing process. Try asking about:\n\n- **AML/KYC policies** — status of anti-money laundering documentation\n- **Capital requirements** — capital adequacy across different license types\n- **Status overview** — current progress of all client applications\n- **Risk management** — risk framework documentation status\n- **Missing documents** — which documents still need to be uploaded\n- **Insurance licensing** — Edelweiss Insurance AG application details\n- **Fintech licensing** — ZuriPay Fintech GmbH sandbox application',
  citationDocIds: [],
}

export function matchCannedResponse(input: string): CannedResponse {
  const lower = input.toLowerCase()
  return (
    cannedResponses.find((r) => r.keywords.some((keyword) => lower.includes(keyword))) ??
    fallbackResponse
  )
}
