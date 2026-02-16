"""Generate and seed realistic mock PDF documents for the Alpine Digital Bank demo."""

import logging
from datetime import UTC, datetime

from fpdf import FPDF

from src.services import document_store
from src.services.document_ingestion import ingest_client_document

logger = logging.getLogger(__name__)

CLIENT_ID = "thomas-muller"


def _make_pdf(title: str, body: str) -> bytes:
    """Generate a simple PDF with a title and body text."""
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Helvetica", "B", 16)
    pdf.cell(0, 10, title, new_x="LMARGIN", new_y="NEXT")
    pdf.ln(4)
    pdf.set_font("Helvetica", "", 10)
    pdf.multi_cell(0, 5, body)
    return bytes(pdf.output())


# ---------------------------------------------------------------------------
# Document content
# ---------------------------------------------------------------------------

_DOCUMENTS: list[dict[str, str]] = [
    {
        "document_id": "banking-2-1",
        "file_name": "Business_Plan_3Year_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Business Plan (3-Year Projection)",
        "body": (
            "Confidential - For FINMA Review Only\n"
            "Date: August 2025 | Version 2.1\n\n"
            "Section 1: Executive Summary\n"
            "Alpine Digital Bank AG (ADB) seeks a full banking license under Art. 3 "
            "of the Swiss Banking Act (BankA) to provide digital banking services "
            "targeting both institutional and retail clients in Switzerland. The bank "
            "will focus on CHF and EUR deposit products, secured lending, and digital "
            "payment solutions.\n\n"
            "Section 2: Market Analysis\n"
            "The Swiss digital banking market is projected to grow at 18% CAGR through "
            "2028. Current penetration of fully digital banks stands at 12% of the "
            "adult population. Key competitors include neon, Yapeal, and Alpian. ADB "
            "differentiates through institutional-grade infrastructure with retail "
            "accessibility and a strong focus on Swiss regulatory compliance.\n\n"
            "Section 3: Revenue Model\n"
            "Section 3.1: Deposit Products\n"
            "Year 1: CHF 50M institutional deposits at 15bps net margin.\n"
            "Year 2: CHF 120M expanding to retail, blended margin 22bps.\n"
            "Year 3: CHF 280M with full product suite, blended margin 28bps.\n\n"
            "Section 3.2: Revenue Projections\n"
            "Year 1 revenue: CHF 5M (primarily institutional deposit margins and "
            "transaction fees). Year 2 revenue: CHF 12M (retail expansion, lending "
            "income). Year 3 revenue: CHF 28M (full product suite, cross-selling).\n\n"
            "Section 4: Deposit Growth Strategy\n"
            "Phase 1 (Months 1-12): Institutional clients through direct relationship "
            "management. Target: 25 institutional accounts averaging CHF 2M each.\n"
            "Phase 2 (Months 13-24): Retail launch with digital onboarding. Target: "
            "5,000 retail accounts averaging CHF 14,000 each.\n"
            "Phase 3 (Months 25-36): Full market expansion with partnership channels.\n\n"
            "Section 5: Cost Structure\n"
            "Year 1 operating costs: CHF 4.2M (personnel CHF 2.8M, technology CHF 0.9M, "
            "regulatory/compliance CHF 0.5M). Year 2: CHF 7.5M. Year 3: CHF 14M.\n\n"
            "Section 6: Capital Requirements\n"
            "Initial capitalization of CHF 12M exceeds the CHF 10M minimum required "
            "under Art. 4 BankA. Capital adequacy ratio maintained above 12% in all "
            "projection years. Buffer above regulatory minimum: CHF 2M at inception.\n\n"
            "Section 7: Risk Analysis\n"
            "Section 7.1: Key Risk Factors\n"
            "Market risk from interest rate movements, credit risk from lending "
            "portfolio, operational risk from technology platform dependencies.\n\n"
            "Section 7.2: Mitigation Strategies\n"
            "Interest rate risk hedged through matched-maturity funding. Credit risk "
            "managed through conservative LTV ratios (max 70%) and diversification "
            "limits. Operational risk mitigated through multi-cloud infrastructure.\n\n"
            "Section 7.3: Sensitivity Analysis\n"
            "Three scenarios have been modelled to stress-test financial projections:\n"
            "Base Case: Revenue as projected above. Capital ratio Year 3: 14.2%.\n"
            "Stressed Scenario (-30% revenue): Year 1 CHF 3.5M, Year 2 CHF 8.4M, "
            "Year 3 CHF 19.6M. Capital ratio remains above 11.5% throughout.\n"
            "Severe Stress (-50% revenue): Year 1 CHF 2.5M, Year 2 CHF 6M, "
            "Year 3 CHF 14M. Capital ratio dips to 10.8% in Year 2 but recovers to "
            "11.1% by Year 3. Capital remains above the regulatory minimum of 10.5% "
            "in all scenarios. Break-even achieved by Month 18 in base case, Month 26 "
            "in stressed scenario.\n\n"
            "Section 8: Implementation Timeline\n"
            "Q3 2025: License application submission. Q1 2026: Expected license "
            "approval. Q2 2026: Soft launch with institutional clients. Q4 2026: "
            "Retail launch. H2 2027: Full product suite deployment."
        ),
    },
    {
        "document_id": "banking-2-3",
        "file_name": "Organizational_Regulations_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Organizational Regulations",
        "body": (
            "Approved by the Board of Directors on 15 August 2025\n"
            "Version 1.2 (Draft for FINMA Review)\n\n"
            "Article 1: Purpose and Scope\n"
            "These Organizational Regulations govern the internal organization, "
            "responsibilities, and decision-making processes of Alpine Digital Bank AG "
            "in accordance with Art. 716b CO and FINMA Circular 2017/1 on Corporate "
            "Governance.\n\n"
            "Article 2: Board of Directors\n"
            "Section 2.1: Composition\n"
            "The Board shall comprise a minimum of five members with the requisite "
            "expertise in banking, risk management, technology, and legal/compliance.\n\n"
            "Section 2.2: Board Responsibilities\n"
            "The Board is responsible for: (a) overall strategic direction and risk "
            "appetite, (b) approval of annual budget and business plan, (c) appointment "
            "and oversight of executive management, (d) approval of the risk management "
            "framework, (e) oversight of regulatory compliance, (f) approval of the "
            "internal control system.\n\n"
            "Section 2.3: Board Committees\n"
            "The Board shall establish: Audit Committee, Risk Committee, Nomination "
            "and Compensation Committee. Each committee shall have a written charter "
            "defining mandate, composition, and reporting obligations.\n\n"
            "Article 3: Executive Management\n"
            "Section 3.1: Executive Committee\n"
            "The Executive Committee comprises the CEO, CFO, CRO, COO, and Head of "
            "Compliance. Day-to-day management authority is exercised within parameters "
            "set by the Board.\n\n"
            "Section 3.2: Delegation of Authority\n"
            "[NOTE: Delegation of authority matrix to be completed. Current version "
            "does not include a detailed delineation of decision rights between the "
            "Board and executive management as required by FINMA Circular 2017/1. "
            "Appendix A will contain the delegation matrix once finalized.]\n\n"
            "Article 4: Governance Framework\n"
            "Section 4.1: Internal Reporting\n"
            "Executive management reports to the Board on a monthly basis. The CRO and "
            "Head of Compliance have a direct reporting line to the Board and may "
            "escalate matters without executive management approval.\n\n"
            "Section 4.2: External Reporting\n"
            "FINMA reporting obligations fulfilled through quarterly supervisory reports "
            "and annual audit report from the regulatory auditor.\n\n"
            "Article 5: Conflicts of Interest\n"
            "Board members and executive management must disclose any conflicts of "
            "interest. Related-party transactions require Board approval with the "
            "conflicted member recused.\n\n"
            "Appendix A: Delegation of Authority Matrix\n"
            "[PLACEHOLDER - To be completed before formal submission. This section will "
            "define specific thresholds and approval requirements for credit decisions, "
            "investment decisions, expenditures, and contractual commitments.]"
        ),
    },
    {
        "document_id": "banking-2-4",
        "file_name": "Organizational_Chart_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Organizational Chart",
        "body": (
            "Version 1.1 | Date: September 2025\n"
            "Prepared for FINMA Banking License Application\n\n"
            "Board of Directors\n"
            "  Chairperson: Thomas Muller\n"
            "  Vice-Chair: Dr. Anna Meier (Independent)\n"
            "  Member: Peter Huber (Independent, Audit Committee Chair)\n"
            "  Member: Dr. Claudia Bernasconi (Risk Committee Chair)\n"
            "  Member: Lukas Steiner (Independent)\n\n"
            "Board Committees\n"
            "  Audit Committee: P. Huber (Chair), L. Steiner, C. Bernasconi\n"
            "  Risk Committee: C. Bernasconi (Chair), A. Meier, P. Huber\n"
            "  Nomination & Compensation: L. Steiner (Chair), T. Muller, A. Meier\n\n"
            "Executive Management\n"
            "  CEO: Stefan Fischer\n"
            "    Reporting: Board of Directors\n"
            "  CFO: Maria Schneider\n"
            "    Reporting: CEO, dotted line to Audit Committee\n"
            "  CRO: Dr. Hans Zimmer\n"
            "    Reporting: CEO, direct escalation to Risk Committee\n"
            "  COO: Reto Bachmann\n"
            "    Reporting: CEO\n"
            "  Head of Compliance: Kathrin Brunner\n"
            "    Reporting: CEO, direct escalation to Board\n\n"
            "Business Units\n"
            "  Institutional Banking (reporting to CEO)\n"
            "    - Relationship Management\n"
            "    - Treasury Operations\n"
            "  Retail Banking (reporting to COO)\n"
            "    - Digital Onboarding\n"
            "    - Customer Service\n"
            "    - Payment Operations\n"
            "  Lending (reporting to CRO)\n"
            "    - Credit Analysis\n"
            "    - Portfolio Management\n\n"
            "Support Functions\n"
            "  Finance & Controlling (reporting to CFO)\n"
            "  Risk Management (reporting to CRO)\n"
            "  IT & Infrastructure (reporting to COO)\n"
            "  Legal & Compliance (reporting to Head of Compliance)\n"
            "  Human Resources (reporting to COO)\n\n"
            "Headcount Plan\n"
            "  Year 1: 35 FTE\n"
            "  Year 2: 55 FTE\n"
            "  Year 3: 80 FTE\n\n"
            "Functional Description Summary\n"
            "Each business unit head has defined functional responsibilities documented "
            "in the role descriptions appendix. Reporting lines ensure adequate "
            "segregation of duties between front office, risk management, and control "
            "functions in accordance with FINMA requirements."
        ),
    },
    {
        "document_id": "banking-2-5",
        "file_name": "Capital_Plan_and_Proof_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Capital Plan & Proof of Capital",
        "body": (
            "Confidential | Date: September 2025\n"
            "Prepared for FINMA Banking License Application\n\n"
            "Section 1: Capital Structure\n"
            "Total initial capitalization: CHF 12,000,000\n"
            "Share capital: CHF 10,000,000 (10,000 registered shares at CHF 1,000 par)\n"
            "Capital reserves: CHF 2,000,000\n\n"
            "Section 2: Shareholder Contributions\n"
            "Muller Holding AG: CHF 10,200,000 (85% stake)\n"
            "Werner Kraft: CHF 900,000 (7.5%)\n"
            "Dr. Eva Richter: CHF 600,000 (5%)\n"
            "Martin Schwarz: CHF 300,000 (2.5%)\n\n"
            "Section 3: Escrow Arrangements\n"
            "All capital commitments have been deposited into an escrow account at "
            "Credit Suisse (Schweiz) AG, Zurich. Escrow account reference: "
            "CH93-0070-0110-0075-4321-8. Funds will be released upon FINMA license "
            "approval. Bank confirmation letter from Credit Suisse dated 20 September "
            "2025 confirming the availability of CHF 12,000,000 is attached as Annex 1.\n\n"
            "Section 4: Capital Adequacy Projections\n"
            "Section 4.1: Regulatory Requirements\n"
            "Minimum capital under Art. 4 BankA: CHF 10,000,000.\n"
            "Minimum capital adequacy ratio: 10.5% (CET1).\n"
            "FINMA Pillar 2 add-on (estimated): 1.5%.\n\n"
            "Section 4.2: Three-Year Capital Projections\n"
            "Year 1: Total capital CHF 11.2M (after operating losses of CHF 0.8M). "
            "RWA: CHF 62M. CET1 ratio: 18.1%.\n"
            "Year 2: Total capital CHF 12.8M (retained earnings CHF 1.6M). "
            "RWA: CHF 95M. CET1 ratio: 13.5%.\n"
            "Year 3: Total capital CHF 16.4M (retained earnings CHF 3.6M). "
            "RWA: CHF 130M. CET1 ratio: 12.6%.\n\n"
            "Section 5: Contingency Capital\n"
            "Should capital ratios approach the regulatory minimum plus buffer (12%), "
            "Muller Holding AG has provided a letter of commitment to inject additional "
            "capital of up to CHF 5M within 90 days. This contingency arrangement "
            "provides an additional safety margin against unexpected losses.\n\n"
            "Section 6: Source of Funds\n"
            "Muller Holding AG: Operating profits from existing fintech consulting "
            "business (audited financial statements attached as Annex 2). No borrowed "
            "funds used for capital contribution. Source of funds documentation "
            "verified by PwC Switzerland.\n\n"
            "Annex 1: Bank Confirmation Letter (Credit Suisse) [attached]\n"
            "Annex 2: Audited Financial Statements - Muller Holding AG [attached]"
        ),
    },
    {
        "document_id": "banking-2-6",
        "file_name": "Board_Fit_and_Proper_Dossiers_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Board of Directors Fit & Proper Dossiers",
        "body": (
            "Confidential | Date: September 2025\n"
            "Submitted under FINMA Circular 2018/3 (Outsourcing) and FINMA "
            "Guidelines on Fit & Proper Requirements\n\n"
            "Dossier 1: Thomas Muller - Chairperson\n"
            "Education: MBA, University of St. Gallen; BSc Computer Science, ETH Zurich.\n"
            "Experience: 15 years in financial technology. Founder and CEO of Muller "
            "Holding AG (fintech consulting, est. 2015). Previously: VP Product at "
            "SIX Group (2010-2015), Software Engineer at UBS (2005-2010).\n"
            "Board experience: Board member, Swiss Fintech Association (2018-present).\n"
            "Criminal record: Clean (extract attached).\n"
            "Regulatory history: No sanctions or enforcement actions.\n\n"
            "Dossier 2: Dr. Anna Meier - Vice-Chairperson (Independent)\n"
            "Education: Dr. iur., University of Zurich; LL.M., Harvard Law School.\n"
            "Experience: 20 years in corporate law and financial regulation. Partner at "
            "Walder Wyss (2010-2023), specializing in banking and capital markets law. "
            "Currently: Independent legal consultant and board member.\n"
            "Board experience: Former board member, Privatbank Bellevue AG (2015-2020). "
            "Board member, Zurich Chamber of Commerce (2019-present).\n"
            "Regulatory note: Dr. Meier's primary expertise is in corporate law, "
            "M&A transactions, and corporate governance. Her banking regulatory "
            "experience is primarily advisory through her legal practice. Direct "
            "banking supervisory experience is limited to her non-executive board "
            "role at Privatbank Bellevue.\n"
            "Criminal record: Clean (extract attached).\n"
            "Regulatory history: No sanctions or enforcement actions.\n\n"
            "Dossier 3: Peter Huber - Independent Member, Audit Committee Chair\n"
            "Education: lic. oec., University of Bern; Swiss Certified Accountant.\n"
            "Experience: 25 years in financial audit and accounting. Former Partner at "
            "KPMG Switzerland (2000-2020), Head of Banking Audit. Currently: "
            "Independent audit consultant.\n"
            "Board experience: Audit committee member at two Swiss cantonal banks.\n"
            "Criminal record: Clean.\n"
            "Regulatory history: No sanctions.\n\n"
            "Dossier 4: Dr. Claudia Bernasconi - Risk Committee Chair\n"
            "Education: PhD in Quantitative Finance, University of Zurich.\n"
            "Experience: 18 years in risk management. Former CRO at Hypothekarbank "
            "Lenzburg (2012-2022). Previously: Risk Analyst at Swiss National Bank "
            "(2005-2012). Currently: Professor of Risk Management, University of "
            "Lucerne.\n"
            "Board experience: Risk committee at Hypothekarbank Lenzburg.\n"
            "Criminal record: Clean.\n"
            "Regulatory history: No sanctions.\n\n"
            "Dossier 5: Lukas Steiner - Independent Member\n"
            "Education: MSc Information Systems, University of Lausanne.\n"
            "Experience: 12 years in banking technology. Former CTO at PostFinance "
            "(2016-2023). Previously: Head of Digital Banking at Raiffeisen (2012-2016).\n"
            "Board experience: Advisory board at several Swiss fintech startups.\n"
            "Criminal record: Clean.\n"
            "Regulatory history: No sanctions."
        ),
    },
    {
        "document_id": "banking-2-8",
        "file_name": "Risk_Management_Framework_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Risk Management Framework",
        "body": (
            "Version 1.0 | Date: September 2025\n"
            "Approved by the Risk Committee on 12 September 2025\n\n"
            "Section 1: Risk Governance\n"
            "The Risk Management Framework establishes the principles, organization, "
            "and processes for identifying, assessing, monitoring, and mitigating risks "
            "across Alpine Digital Bank AG. The framework aligns with FINMA Circular "
            "2017/1 on Corporate Governance and the Basel III framework.\n\n"
            "Section 2: Risk Appetite Statement\n"
            "The Board has approved the following risk appetite: (a) CET1 ratio to "
            "remain above 12% at all times, (b) maximum single-name credit exposure "
            "of 10% of total capital, (c) liquidity coverage ratio above 120%, "
            "(d) operational losses not to exceed 1% of gross revenue.\n\n"
            "Section 3: Credit Risk\n"
            "Section 3.1: Credit Risk Policy\n"
            "Lending activities limited to secured loans with maximum LTV of 70%. "
            "Concentration limits: no single borrower exceeds 10% of capital. Industry "
            "diversification requirements enforced.\n"
            "Section 3.2: Credit Approval Process\n"
            "Four-eyes principle for all credit decisions. Loans above CHF 500,000 "
            "require Credit Committee approval. Loans above CHF 2M require Board "
            "approval.\n\n"
            "Section 4: Market Risk\n"
            "Section 4.1: Interest Rate Risk\n"
            "Managed through matched-maturity funding. Duration gap limit of 2 years. "
            "Monthly interest rate sensitivity analysis reported to ALCO.\n"
            "Section 4.2: Foreign Exchange Risk\n"
            "Limited to CHF/EUR positions arising from client transactions. Net open "
            "position limit of CHF 1M.\n\n"
            "Section 5: Liquidity Risk\n"
            "Liquidity buffer of minimum 15% of total deposits maintained in HQLA. "
            "LCR target of 120% (above the 100% regulatory minimum). Daily liquidity "
            "monitoring with intraday reporting capability. Contingency funding plan "
            "includes committed credit lines from two correspondent banks.\n\n"
            "Section 6: Operational Risk\n"
            "Section 6.1: Framework\n"
            "Operational risk managed through the Basic Indicator Approach initially, "
            "transitioning to the Standardized Approach in Year 2. Key risk indicators "
            "monitored monthly. Loss event database maintained.\n"
            "Section 6.2: Key Controls\n"
            "IT security framework based on ISO 27001. Business continuity plan tested "
            "annually. Disaster recovery with RTO of 4 hours and RPO of 1 hour. Cyber "
            "risk assessment conducted quarterly.\n"
            "[Note: This section should be updated to reference FINMA Circular 2023/1 "
            "on operational resilience requirements.]\n\n"
            "Section 7: Compliance Risk\n"
            "Compliance function oversees adherence to all applicable laws, regulations, "
            "and internal policies. Annual compliance risk assessment conducted. "
            "Regulatory change monitoring process established.\n\n"
            "Section 8: Stress Testing\n"
            "Quarterly stress tests covering credit, market, and liquidity risks. "
            "Scenarios include historical crises (2008 GFC, 2020 COVID) and "
            "hypothetical tail events. Results reported to Risk Committee and FINMA.\n\n"
            "[Note: Climate risk considerations have not yet been incorporated into "
            "this framework. FINMA Guidance 01/2024 requires banks to assess and "
            "disclose climate-related financial risks. A dedicated climate risk section "
            "will be added in the next revision.]"
        ),
    },
    {
        "document_id": "banking-2-9",
        "file_name": "Internal_Control_System_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - Internal Control System (ICS)",
        "body": (
            "Version 1.0 | Date: October 2025\n"
            "Prepared in accordance with FINMA Circular 2017/1\n\n"
            "Section 1: ICS Overview\n"
            "The Internal Control System of Alpine Digital Bank AG is designed to "
            "ensure the effectiveness and efficiency of operations, the reliability "
            "of financial reporting, and compliance with applicable laws and regulations.\n\n"
            "Section 2: Three Lines of Defense Model\n"
            "The ICS follows the internationally recognized three lines of defense model:\n\n"
            "First Line: Business Units and Operations\n"
            "Operational management owns and manages risks. Business line managers are "
            "responsible for identifying, assessing, and controlling risks within their "
            "areas. Day-to-day controls embedded in business processes including "
            "four-eyes principle, reconciliations, and transaction limits.\n\n"
            "Second Line: Risk Management and Compliance\n"
            "Independent risk management function under the CRO provides oversight of "
            "first-line risk activities. Sets risk policies, methodologies, and tools. "
            "Monitors compliance with risk appetite and limits.\n"
            "Compliance function monitors adherence to laws, regulations, and internal "
            "policies. Provides advisory support to business lines. Conducts compliance "
            "testing and reviews.\n\n"
            "Third Line: Internal Audit\n"
            "Independent assurance function reporting directly to the Audit Committee. "
            "Provides objective assessment of the effectiveness of governance, risk "
            "management, and internal controls. Audit plan approved annually by the "
            "Audit Committee. Follows IIA International Standards.\n\n"
            "Section 3: Compliance Function\n"
            "Section 3.1: Organization\n"
            "Head of Compliance: Kathrin Brunner (appointment subject to FINMA "
            "approval). Compliance team of 3 FTE in Year 1, expanding to 5 FTE by "
            "Year 3.\n\n"
            "Section 3.2: Reporting Line\n"
            "The Head of Compliance reports operationally to the CEO and has a direct "
            "reporting and escalation line to the CEO. The compliance function presents "
            "a quarterly compliance report to the Board via the CEO.\n"
            "[Note: FINMA may require the compliance function to report directly to the "
            "Board rather than through the CEO to ensure adequate independence.]\n\n"
            "Section 3.3: Responsibilities\n"
            "Regulatory change monitoring, compliance risk assessment, AML/CFT "
            "oversight, sanctions screening oversight, regulatory reporting, staff "
            "training and awareness, whistleblower program management.\n\n"
            "Section 4: Key Control Processes\n"
            "Section 4.1: Financial Reporting Controls\n"
            "Monthly close process with documented reconciliation procedures. CFO "
            "sign-off on all financial statements. External audit by PwC Switzerland.\n\n"
            "Section 4.2: Operational Controls\n"
            "Segregation of duties enforced across all critical processes. Dual "
            "authorization for payments above CHF 50,000. System access controls "
            "reviewed quarterly.\n\n"
            "Section 4.3: IT Controls\n"
            "Change management process for all production systems. Penetration testing "
            "conducted annually. Data backup verified daily.\n\n"
            "Section 5: Monitoring and Reporting\n"
            "Key control indicators reported monthly to executive management and "
            "quarterly to the Board. Control deficiencies tracked in a central register "
            "with remediation timelines. Regulatory audit findings addressed within "
            "agreed timelines."
        ),
    },
    {
        "document_id": "banking-2-10",
        "file_name": "AML_KYC_Policy_Alpine_Digital_Bank.pdf",
        "title": "Alpine Digital Bank AG - AML/KYC Policy & Procedures",
        "body": (
            "Version 2.0 | Date: September 2025\n"
            "Based on AMLA (SR 955.0) and FINMA Circular 2016/7\n\n"
            "Section 1: Scope and Objectives\n"
            "This policy establishes the Anti-Money Laundering (AML) and Know Your "
            "Customer (KYC) framework for Alpine Digital Bank AG in compliance with "
            "the Swiss Anti-Money Laundering Act (AMLA), the FINMA Anti-Money "
            "Laundering Ordinance (AMLO-FINMA), and the Agreement on the Swiss banks' "
            "code of conduct (CDB 20).\n\n"
            "Section 2: Client Identification and Verification\n"
            "Section 2.1: Client Onboarding\n"
            "All clients must be identified and verified before establishing a business "
            "relationship. Natural persons: valid government-issued photo ID (passport "
            "or identity card). Legal entities: commercial register extract (not older "
            "than 3 months), articles of association, identification of authorized "
            "signatories and beneficial owners.\n\n"
            "Section 2.2: Beneficial Ownership\n"
            "Beneficial owners must be identified for all accounts. Threshold: natural "
            "persons holding 25% or more of a legal entity. Enhanced due diligence for "
            "complex ownership structures involving trusts or foundations.\n\n"
            "Section 2.3: Risk-Based Approach\n"
            "Clients classified into risk categories: Low, Medium, High. High-risk "
            "criteria include: PEP status, high-risk jurisdictions (FATF list), complex "
            "ownership structures, cash-intensive businesses. Enhanced due diligence "
            "required for all high-risk relationships.\n\n"
            "Section 3: Ongoing Monitoring\n"
            "Section 3.1: Transaction Monitoring\n"
            "Automated transaction monitoring system screens all transactions against "
            "predefined rules and patterns. Alerts reviewed within 24 hours by the "
            "compliance team.\n\n"
            "Section 3.2: Periodic Reviews\n"
            "High-risk clients: annual review. Medium-risk: every 2 years. Low-risk: "
            "every 3 years. Reviews include updated KYC documentation and transaction "
            "pattern analysis.\n\n"
            "Section 4: Thresholds and Reporting\n"
            "Section 4.1: Cash Transaction Reporting\n"
            "Single cash transactions exceeding CHF 25,000 are flagged for enhanced "
            "review. Multiple cash transactions that appear structured to avoid "
            "thresholds are escalated to the MLRO.\n\n"
            "Section 4.2: Suspicious Activity Monitoring Threshold\n"
            "The automated monitoring system applies a base threshold of CHF 25,000 "
            "for individual transactions requiring enhanced scrutiny. Aggregate "
            "monitoring over rolling 30-day periods with threshold of CHF 100,000.\n"
            "[NOTE: These thresholds were set based on FINMA Circular 2016/7 as "
            "originally published. The 2024 AMLA amendment reduced the individual "
            "transaction monitoring threshold to CHF 15,000. This section requires "
            "updating to reflect the current regulatory requirement.]\n\n"
            "Section 4.3: SAR Filing\n"
            "Suspicious Activity Reports filed with MROS (Money Laundering Reporting "
            "Office Switzerland) without delay when there is reasonable suspicion of "
            "money laundering, terrorist financing, or sanctions violations.\n\n"
            "Section 5: Sanctions Screening\n"
            "All clients and transactions screened against: SECO sanctions lists, "
            "UN Security Council sanctions, EU restrictive measures, OFAC SDN list. "
            "Screening conducted at onboarding and on an ongoing basis. Matches "
            "reviewed by compliance within 4 hours.\n\n"
            "Section 6: Training\n"
            "All employees receive AML/KYC training upon joining and annual refresher "
            "training. Specialized training for client-facing staff and compliance "
            "team. Training records maintained for FINMA inspection.\n\n"
            "Section 7: Record Keeping\n"
            "All client identification documents, transaction records, and compliance "
            "decisions retained for a minimum of 10 years in accordance with AMLA "
            "Art. 7."
        ),
    },
]


async def seed_demo_documents() -> None:
    """Generate and store demo PDF documents for the Alpine Digital Bank application.

    Idempotent: skips documents that already exist in the database.
    """
    for doc_spec in _DOCUMENTS:
        document_id = doc_spec["document_id"]

        existing = await document_store.get_document(CLIENT_ID, document_id)
        if existing is not None:
            logger.info("Demo document already exists: %s", document_id)
            continue

        pdf_bytes = _make_pdf(doc_spec["title"], doc_spec["body"])

        doc = await document_store.store_file(
            client_id=CLIENT_ID,
            document_id=document_id,
            file_name=doc_spec["file_name"],
            content=pdf_bytes,
            content_type="application/pdf",
        )

        await document_store.update_status(
            client_id=CLIENT_ID,
            document_id=document_id,
            status="verified",
            verification_result="Auto-verified demo document",
            verified_at=datetime.now(UTC).isoformat(),
        )

        chunks = await ingest_client_document(doc)
        logger.info("Seeded demo document: %s (%d chunks)", document_id, chunks)

    logger.info("Demo document seeding complete")
