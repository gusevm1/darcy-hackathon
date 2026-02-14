"""Checklist/requirements templates grouped by phase."""

from typing import TypedDict


class ChecklistItemData(TypedDict):
    description: str
    regulatory_reference: str
    timeline: str
    priority: str


REQUIREMENTS_BY_PHASE: dict[str, list[ChecklistItemData]] = {
    "pre_application": [
        {
            "description": (
                "Determine token classification (ART, EMT, utility, or "
                "other crypto-asset) and applicable MiCAR Title"
            ),
            "regulatory_reference": "MiCAR Art. 3 (Definitions)",
            "timeline": "Week 1-2",
            "priority": "critical",
        },
        {
            "description": (
                "Identify required crypto-asset services and corresponding "
                "capital class (Class 1/2/3 under Art. 67)"
            ),
            "regulatory_reference": "MiCAR Art. 67",
            "timeline": "Week 1-2",
            "priority": "critical",
        },
        {
            "description": (
                "Assess eligibility for simplified pathway (Art. 60) if "
                "holding existing financial licence"
            ),
            "regulatory_reference": "MiCAR Art. 60",
            "timeline": "Week 2-3",
            "priority": "high",
        },
        {
            "description": (
                "Engage external legal counsel specialising in "
                "EU crypto-asset regulation"
            ),
            "regulatory_reference": "General",
            "timeline": "Week 1-4",
            "priority": "high",
        },
        {
            "description": (
                "Select home Member State and identify National Competent "
                "Authority (NCA) for CASP authorisation"
            ),
            "regulatory_reference": "MiCAR Art. 93",
            "timeline": "Week 2-4",
            "priority": "high",
        },
        {
            "description": (
                "Draft programme of operations describing planned "
                "crypto-asset services and marketing strategy"
            ),
            "regulatory_reference": "MiCAR Art. 62(2)(d)",
            "timeline": "Week 3-8",
            "priority": "high",
        },
        {
            "description": (
                "Conduct gap analysis of existing governance, risk "
                "management, and compliance frameworks"
            ),
            "regulatory_reference": "MiCAR Art. 62(2)(f)",
            "timeline": "Week 4-8",
            "priority": "medium",
        },
        {
            "description": (
                "Prepare ICT systems and security arrangements description "
                "per DORA requirements"
            ),
            "regulatory_reference": ("MiCAR Art. 62(2)(g), DORA Regulation"),
            "timeline": "Week 4-12",
            "priority": "medium",
        },
        {
            "description": (
                "Draft or update crypto-asset white paper if offering "
                "tokens to the public (Art. 6)"
            ),
            "regulatory_reference": "MiCAR Art. 4, 6, Annex I",
            "timeline": "Week 4-12",
            "priority": "high",
        },
        {
            "description": (
                "Establish or identify entity with suitable legal form "
                "in chosen EU Member State"
            ),
            "regulatory_reference": "MiCAR Art. 59(1)(a)",
            "timeline": "Week 2-8",
            "priority": "critical",
        },
    ],
    "application": [
        {
            "description": (
                "Demonstrate minimum capital requirements (EUR 50K/125K/"
                "150K) via own funds, insurance, or comparable guarantee"
            ),
            "regulatory_reference": "MiCAR Art. 67",
            "timeline": "Prior to submission",
            "priority": "critical",
        },
        {
            "description": (
                "Submit fit-and-proper documentation for management body "
                "members (good repute, knowledge, skills, experience)"
            ),
            "regulatory_reference": "MiCAR Art. 62(2)(h)",
            "timeline": "With application",
            "priority": "critical",
        },
        {
            "description": ("Provide evidence of qualifying shareholder suitability"),
            "regulatory_reference": "MiCAR Art. 62(2)(i)",
            "timeline": "With application",
            "priority": "high",
        },
        {
            "description": (
                "Submit client asset safeguarding arrangements including "
                "custody, segregation, and fund placement procedures"
            ),
            "regulatory_reference": "MiCAR Art. 62(2)(j), Art. 68",
            "timeline": "With application",
            "priority": "critical",
        },
        {
            "description": ("Provide complaints-handling procedure documentation"),
            "regulatory_reference": "MiCAR Art. 69",
            "timeline": "With application",
            "priority": "medium",
        },
        {
            "description": (
                "Submit conflicts-of-interest policy and management arrangements"
            ),
            "regulatory_reference": "MiCAR Art. 70",
            "timeline": "With application",
            "priority": "high",
        },
        {
            "description": (
                "Provide outsourcing arrangements documentation (if any "
                "operational functions outsourced)"
            ),
            "regulatory_reference": "MiCAR Art. 71",
            "timeline": "With application",
            "priority": "medium",
        },
        {
            "description": (
                "Submit AML/CFT compliance framework including KYC, CDD, "
                "and transaction monitoring procedures"
            ),
            "regulatory_reference": ("AMLD (2015/849), TFR (2023/1113)"),
            "timeline": "With application",
            "priority": "critical",
        },
        {
            "description": (
                "Provide evidence of professional indemnity insurance "
                "or comparable guarantee"
            ),
            "regulatory_reference": "MiCAR Art. 62(2)(k), Art. 67(2)",
            "timeline": "With application",
            "priority": "high",
        },
        {
            "description": (
                "Submit formal application to NCA and await "
                "acknowledgement (5 working days per Art. 63(1))"
            ),
            "regulatory_reference": "MiCAR Art. 62, 63",
            "timeline": "After all materials prepared",
            "priority": "critical",
        },
    ],
    "post_authorisation": [
        {
            "description": (
                "Maintain prudential safeguards at all times — monitor "
                "own funds / insurance coverage against minimum thresholds"
            ),
            "regulatory_reference": "MiCAR Art. 67",
            "timeline": "Ongoing",
            "priority": "critical",
        },
        {
            "description": (
                "Implement cross-border passporting notifications for "
                "each target host Member State (Art. 65)"
            ),
            "regulatory_reference": "MiCAR Art. 65",
            "timeline": ("Before operating in new Member State (15 working days)"),
            "priority": "high",
        },
        {
            "description": (
                "Ensure ongoing compliance with client asset safeguarding "
                "— no use of client crypto on own account (Art. 68(2))"
            ),
            "regulatory_reference": "MiCAR Art. 68",
            "timeline": "Ongoing",
            "priority": "critical",
        },
        {
            "description": (
                "Maintain operational resilience and ICT systems per DORA requirements"
            ),
            "regulatory_reference": "DORA Regulation",
            "timeline": "Ongoing",
            "priority": "high",
        },
        {
            "description": (
                "Comply with market abuse prevention obligations — "
                "insider dealing and market manipulation policies"
            ),
            "regulatory_reference": "MiCAR Art. 86-91",
            "timeline": "Ongoing",
            "priority": "high",
        },
        {
            "description": ("Submit periodic regulatory reports to NCA as required"),
            "regulatory_reference": "MiCAR Art. 94",
            "timeline": "Per NCA schedule",
            "priority": "medium",
        },
        {
            "description": (
                "Review and update programme of operations when adding "
                "new services or entering new jurisdictions"
            ),
            "regulatory_reference": "MiCAR Art. 62(2)(d), Art. 65",
            "timeline": "As needed",
            "priority": "medium",
        },
        {
            "description": (
                "Monitor for changes in significant-token thresholds "
                "(Art. 31/54) if issuing ARTs or EMTs"
            ),
            "regulatory_reference": "MiCAR Art. 31, 54",
            "timeline": "Quarterly review",
            "priority": "medium",
        },
        {
            "description": (
                "Maintain AML/CFT compliance — ongoing CDD, Travel Rule "
                "compliance, suspicious transaction monitoring"
            ),
            "regulatory_reference": ("AMLD (2015/849), TFR (2023/1113)"),
            "timeline": "Ongoing",
            "priority": "critical",
        },
        {
            "description": (
                "Ensure marketing communications remain fair, clear, "
                "and not misleading (Art. 66)"
            ),
            "regulatory_reference": "MiCAR Art. 66",
            "timeline": "Ongoing",
            "priority": "medium",
        },
    ],
}
