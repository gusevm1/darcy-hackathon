"""Static jurisdiction comparison data for EU, UK, and Switzerland."""

from typing import TypedDict


class JurisdictionData(TypedDict):
    name: str
    regulatory_body: str
    framework: str
    license_types: list[dict[str, str]]
    capital_requirements: list[dict[str, str]]
    timeline: str
    passporting: str
    aml_requirements: list[str]
    key_obligations: list[str]
    transitional_provisions: str
    recent_developments: str


JURISDICTIONS: dict[str, JurisdictionData] = {
    "eu_micar": {
        "name": "European Union (MiCAR)",
        "regulatory_body": "National Competent Authorities (NCAs), EBA, ESMA",
        "framework": (
            "Regulation (EU) 2023/1114 — Markets in Crypto-Assets Regulation (MiCAR)"
        ),
        "license_types": [
            {
                "type": "CASP Authorisation",
                "description": (
                    "Crypto-Asset Service Provider authorisation under "
                    "Art. 59-63. Required for all 10 categories of "
                    "crypto-asset services."
                ),
                "article": "Art. 59-63",
            },
            {
                "type": "ART Issuer Authorisation",
                "description": (
                    "Authorisation to issue asset-referenced tokens. "
                    "Requires reserve of assets and compliance with "
                    "Title III."
                ),
                "article": "Art. 21",
            },
            {
                "type": "EMT Issuer",
                "description": (
                    "E-money tokens may only be issued by authorised "
                    "credit institutions or electronic money institutions."
                ),
                "article": "Art. 48",
            },
            {
                "type": "Simplified Notification",
                "description": (
                    "Existing financial entities (credit institutions, "
                    "investment firms, EMIs) may provide crypto services "
                    "via notification under Art. 60."
                ),
                "article": "Art. 60",
            },
        ],
        "capital_requirements": [
            {
                "class": "Class 1",
                "amount": "EUR 50,000",
                "services": "Advice, order reception/transmission",
            },
            {
                "class": "Class 2",
                "amount": "EUR 125,000",
                "services": ("Placing, order execution, transfer services"),
            },
            {
                "class": "Class 3",
                "amount": "EUR 150,000",
                "services": (
                    "Custody, exchange (fiat/crypto), trading platform, "
                    "portfolio management"
                ),
            },
        ],
        "timeline": (
            "New CASP: 6-12 months. Simplified (Art. 60): 3-6 months. "
            "ART Issuer: 9-18 months."
        ),
        "passporting": (
            "Full EU passporting via Art. 65. CASP authorisation valid "
            "across all 27 EU/EEA Member States. Notification to host "
            "NCA required (10 working days processing). Can start "
            "services within 15 working days."
        ),
        "aml_requirements": [
            "CASPs are obliged entities under AMLD (Directive 2015/849)",
            ("Travel Rule compliance required under TFR (Regulation 2023/1113)"),
            "Customer Due Diligence (CDD) and Know Your Customer (KYC)",
            "Suspicious transaction reporting to national FIU",
            "Record-keeping for minimum 5 years",
            "Risk-based approach to AML/CFT compliance",
        ],
        "key_obligations": [
            "Prudential safeguards (Art. 67) — own funds or insurance",
            "Client asset safeguarding (Art. 68)",
            "Complaints handling procedures (Art. 69)",
            "Conflict of interest management (Art. 70)",
            "Outsourcing controls (Art. 71)",
            "ICT security and governance requirements",
            "White paper publication for token offerings (Art. 4-6)",
            "Marketing communications fair and not misleading (Art. 66)",
        ],
        "transitional_provisions": (
            "Art. 143-146: Services provided before 30 Dec 2024 may "
            "continue until 1 July 2026 or until authorisation decision. "
            "Member States may shorten this period. Existing financial "
            "entities may use simplified notification from 30 Dec 2024."
        ),
        "recent_developments": (
            "MiCAR fully applicable from 30 December 2024. Title III "
            "(ART) and Title IV (EMT) provisions applied from "
            "30 June 2024. ESMA and EBA issuing RTS/ITS for detailed "
            "implementation requirements throughout 2024-2025."
        ),
    },
    "uk_fca": {
        "name": "United Kingdom (FCA)",
        "regulatory_body": "Financial Conduct Authority (FCA)",
        "framework": (
            "Financial Services and Markets Act 2000 (FSMA), "
            "Money Laundering Regulations 2017 (MLRs), "
            "Financial Promotions Regime"
        ),
        "license_types": [
            {
                "type": "FCA Cryptoasset Registration",
                "description": (
                    "MLR registration required for crypto-asset "
                    "businesses operating in the UK. Covers AML/CFT "
                    "supervision."
                ),
                "article": "MLR 2017, Part 8A",
            },
            {
                "type": "EMI Authorisation",
                "description": (
                    "Electronic money institution authorisation for "
                    "stablecoin issuance (fiat-backed)."
                ),
                "article": "EMRs 2011",
            },
            {
                "type": "Payment Institution Authorisation",
                "description": (
                    "Required if handling fiat payments alongside "
                    "crypto-asset services."
                ),
                "article": "PSRs 2017",
            },
            {
                "type": "Financial Promotions Approval",
                "description": (
                    "Since Oct 2023, all crypto promotions must be "
                    "approved by an FCA-authorised firm or qualify "
                    "for an exemption."
                ),
                "article": "FSMA s.21, FCA PS23/6",
            },
        ],
        "capital_requirements": [
            {
                "class": "MLR Registration",
                "amount": "No fixed minimum",
                "services": ("Assessed on case-by-case basis during registration"),
            },
            {
                "class": "EMI",
                "amount": "EUR 350,000 (initial capital)",
                "services": "E-money issuance",
            },
            {
                "class": "Payment Institution",
                "amount": "EUR 20,000 - EUR 125,000",
                "services": "Payment services (varies by service type)",
            },
        ],
        "timeline": (
            "FCA registration: 6-12+ months (significant backlog). "
            "EMI authorisation: 12-18 months. "
            "Payment institution: 6-12 months."
        ),
        "passporting": (
            "No EU passporting post-Brexit. UK firms must seek "
            "separate authorisation in each EU Member State (or "
            "obtain MiCAR CASP authorisation). Temporary permissions "
            "regime expired."
        ),
        "aml_requirements": [
            "MLR 2017 registration mandatory for crypto-asset businesses",
            "CDD/KYC required for all customers",
            "Travel Rule compliance (from Sept 2023)",
            "Suspicious Activity Reports (SARs) to NCA",
            "Risk assessment and record-keeping obligations",
            "Senior management responsible for AML compliance",
        ],
        "key_obligations": [
            "FCA registration before commencing business",
            "Financial promotions regime compliance (since Oct 2023)",
            "Consumer Duty compliance (since July 2023)",
            "Operational resilience requirements",
            "Systems and controls appropriate to business",
            "Annual financial crime returns to FCA",
            "Ongoing compliance monitoring and reporting",
        ],
        "transitional_provisions": (
            "Temporary Registration Regime has ended. All crypto "
            "businesses must now hold full FCA registration. "
            "HM Treasury consulting on future regulatory framework "
            "for crypto-assets beyond AML registration."
        ),
        "recent_developments": (
            "UK developing bespoke crypto-asset regulatory framework. "
            "Financial promotions regime for crypto effective Oct 2023. "
            "FCA proposing rules for stablecoins, trading platforms, "
            "and broader crypto activities. Full regime expected "
            "2025-2026."
        ),
    },
    "ch_finma": {
        "name": "Switzerland (FINMA)",
        "regulatory_body": (
            "Swiss Financial Market Supervisory Authority (FINMA), "
            "VQF (self-regulatory organisation)"
        ),
        "framework": (
            "Financial Market Infrastructure Act (FMIA), "
            "Banking Act (BA), Anti-Money Laundering Act (AMLA), "
            "DLT Act (Federal Act on the Adaptation of Federal Law "
            "to Developments in Distributed Ledger Technology)"
        ),
        "license_types": [
            {
                "type": "FINMA FinTech Licence",
                "description": (
                    "For accepting public deposits up to CHF 100 million "
                    "(not invested or interest-bearing). Suitable for "
                    "crypto custodians and exchanges."
                ),
                "article": "Banking Act Art. 1b",
            },
            {
                "type": "DLT Trading Facility Licence",
                "description": (
                    "New licence type under DLT Act for multilateral "
                    "trading of DLT securities. Allows combined trading "
                    "and post-trade services."
                ),
                "article": "FMIA Art. 73a-73f",
            },
            {
                "type": "Banking Licence",
                "description": (
                    "Full banking licence required if accepting public "
                    "deposits exceeding FinTech licence limits or "
                    "offering interest."
                ),
                "article": "Banking Act Art. 1",
            },
            {
                "type": "VQF SRO Membership",
                "description": (
                    "AML self-regulatory membership for financial "
                    "intermediaries. Required for crypto brokers and "
                    "exchanges not holding a FINMA licence."
                ),
                "article": "AMLA Art. 14",
            },
        ],
        "capital_requirements": [
            {
                "class": "FinTech Licence",
                "amount": "CHF 300,000",
                "services": "Custody, deposits up to CHF 100M",
            },
            {
                "class": "DLT Trading Facility",
                "amount": "CHF 1,000,000+",
                "services": "DLT securities trading",
            },
            {
                "class": "Banking Licence",
                "amount": "CHF 10,000,000+",
                "services": "Full banking activities",
            },
            {
                "class": "VQF Membership",
                "amount": "No fixed minimum",
                "services": "AML compliance for financial intermediaries",
            },
        ],
        "timeline": (
            "VQF membership: 2-4 months. FinTech licence: 3-6 months. "
            "DLT Trading Facility: 6-12 months. "
            "Banking licence: 12-24 months."
        ),
        "passporting": (
            "No EU passporting (Switzerland is not an EU/EEA member). "
            "Swiss firms need separate authorisation for each EU market "
            "under MiCAR. Bilateral agreements may facilitate some "
            "cross-border activities."
        ),
        "aml_requirements": [
            "AMLA compliance mandatory for all financial intermediaries",
            "SRO membership (e.g., VQF) or direct FINMA supervision",
            "CDD/KYC for all client relationships",
            "Travel Rule compliance (FINMA guidance)",
            "Suspicious Activity Reports to MROS (FIU)",
            "Risk-based approach with periodic reviews",
        ],
        "key_obligations": [
            "FINMA licence or VQF SRO membership before operations",
            "Segregation of client assets (since Jan 2023 DLT Act)",
            "Adequate organisation and risk management",
            "Minimum capital and liquidity requirements",
            "Audit requirements (regulatory audit)",
            "Reporting obligations to FINMA",
            "Business continuity and IT security measures",
        ],
        "transitional_provisions": (
            "DLT Act fully in force since Aug 2021. Existing firms "
            "operating under prior licences may continue. FINMA "
            "provides no-action guidance for innovative business models "
            "during sandbox phase (deposits up to CHF 1M exempt)."
        ),
        "recent_developments": (
            "Switzerland is a leading crypto-friendly jurisdiction. "
            "DLT Act provides comprehensive legal framework since 2021. "
            "Crypto Valley (Zug) hosts major blockchain companies. "
            "FINMA actively reviewing stablecoin regulation and DeFi "
            "guidance. Swiss approach favours technology-neutral, "
            "principle-based regulation."
        ),
    },
}
