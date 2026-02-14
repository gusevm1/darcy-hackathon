"""Pre-built checklist templates for SRO and FINMA licensing pathways."""

from src.models.client import ChecklistItem


def _item(
    id: str,
    category: str,
    item: str,
    required_for: str,
    estimated_days: int | None = None,
    depends_on: list[str] | None = None,
) -> ChecklistItem:
    return ChecklistItem(
        id=id,
        category=category,
        item=item,
        required_for=required_for,
        estimated_days=estimated_days,
        depends_on=depends_on or [],
    )


def get_sro_checklist() -> list[ChecklistItem]:
    return [
        _item(
            "sro-01", "legal_structure", "Register legal entity (AG or GmbH)", "sro", 14
        ),
        _item(
            "sro-02",
            "legal_structure",
            "Establish Swiss office address",
            "sro",
            7,
            ["sro-01"],
        ),
        _item(
            "sro-03",
            "personnel",
            "Appoint Swiss-resident director",
            "sro",
            14,
            ["sro-01"],
        ),
        _item(
            "sro-04",
            "capital",
            "Meet minimum capital requirements",
            "sro",
            7,
            ["sro-01"],
        ),
        _item("sro-05", "capital", "Open Swiss bank account", "sro", 21, ["sro-01"]),
        _item(
            "sro-06",
            "compliance",
            "Appoint qualified AML compliance officer",
            "sro",
            14,
        ),
        _item(
            "sro-07",
            "compliance",
            "Engage FINMA-recognized external auditor",
            "sro",
            14,
        ),
        _item(
            "sro-08",
            "compliance",
            "Draft AML/KYC policies and procedures",
            "sro",
            21,
            ["sro-06"],
        ),
        _item(
            "sro-09",
            "compliance",
            "Implement transaction monitoring system",
            "sro",
            30,
            ["sro-08"],
        ),
        _item(
            "sro-10",
            "compliance",
            "Implement sanctions screening",
            "sro",
            14,
            ["sro-08"],
        ),
        _item(
            "sro-11",
            "compliance",
            "Establish beneficial owner identification procedures",
            "sro",
            7,
            ["sro-08"],
        ),
        _item(
            "sro-12",
            "compliance",
            "Complete business risk assessment",
            "sro",
            14,
            ["sro-08"],
        ),
        _item(
            "sro-13",
            "governance",
            "Assess FINMA license triggers (client assets, order book)",
            "sro",
            7,
        ),
        _item(
            "sro-14",
            "application",
            "Submit SRO membership application",
            "sro",
            7,
            ["sro-02", "sro-03", "sro-04", "sro-05", "sro-07", "sro-08", "sro-12"],
        ),
        _item("sro-15", "application", "SRO review period", "sro", 60, ["sro-14"]),
        _item(
            "sro-16",
            "application",
            "Address SRO feedback and questions",
            "sro",
            14,
            ["sro-15"],
        ),
    ]


def get_finma_checklist() -> list[ChecklistItem]:
    return [
        # Legal structure
        _item(
            "fin-01",
            "legal_structure",
            "Register legal entity (AG or GmbH)",
            "finma",
            14,
        ),
        _item(
            "fin-02",
            "legal_structure",
            "Establish Swiss office address",
            "finma",
            7,
            ["fin-01"],
        ),
        _item(
            "fin-03",
            "legal_structure",
            "Register in Commercial Register",
            "finma",
            7,
            ["fin-01"],
        ),
        # Personnel & governance
        _item(
            "fin-04",
            "personnel",
            "Appoint Swiss-resident director(s)",
            "finma",
            14,
            ["fin-01"],
        ),
        _item(
            "fin-05",
            "governance",
            "Establish board of directors",
            "finma",
            21,
            ["fin-01"],
        ),
        _item(
            "fin-06",
            "governance",
            "Appoint qualified management team",
            "finma",
            30,
            ["fin-05"],
        ),
        _item(
            "fin-07",
            "governance",
            "Complete fit-and-proper assessments for key personnel",
            "finma",
            21,
            ["fin-06"],
        ),
        # Capital
        _item(
            "fin-08",
            "capital",
            "Meet minimum capital requirements for license type",
            "finma",
            14,
            ["fin-01"],
        ),
        _item(
            "fin-09",
            "capital",
            "Open Swiss bank account and deposit capital",
            "finma",
            21,
            ["fin-08"],
        ),
        # Compliance
        _item("fin-10", "compliance", "Appoint compliance officer", "finma", 14),
        _item("fin-11", "compliance", "Appoint risk officer", "finma", 14),
        _item(
            "fin-12",
            "compliance",
            "Establish internal audit function",
            "finma",
            21,
            ["fin-10"],
        ),
        _item(
            "fin-13",
            "compliance",
            "Engage FINMA-recognized external auditor",
            "finma",
            14,
        ),
        _item(
            "fin-14",
            "compliance",
            "Draft comprehensive AML/CFT framework",
            "finma",
            30,
            ["fin-10"],
        ),
        _item(
            "fin-15",
            "compliance",
            "Implement transaction monitoring system",
            "finma",
            30,
            ["fin-14"],
        ),
        _item(
            "fin-16",
            "compliance",
            "Implement sanctions screening",
            "finma",
            14,
            ["fin-14"],
        ),
        # Documentation
        _item(
            "fin-17",
            "application",
            "Prepare comprehensive business plan",
            "finma",
            30,
            ["fin-06"],
        ),
        _item(
            "fin-18",
            "application",
            "Draft IT security and data protection documentation",
            "finma",
            21,
        ),
        _item(
            "fin-19",
            "application",
            "Prepare risk management framework",
            "finma",
            21,
            ["fin-11"],
        ),
        _item("fin-20", "application", "Register on FINMA EHP platform", "finma", 1),
        _item(
            "fin-21",
            "application",
            "Complete and submit FINMA application forms",
            "finma",
            14,
            [
                "fin-07",
                "fin-09",
                "fin-13",
                "fin-14",
                "fin-17",
                "fin-18",
                "fin-19",
                "fin-20",
            ],
        ),
        _item(
            "fin-22", "application", "FINMA assessment period", "finma", 180, ["fin-21"]
        ),
    ]


def get_checklist_for_pathway(pathway: str) -> list[ChecklistItem]:
    if pathway == "sro":
        return get_sro_checklist()
    if pathway.startswith("finma"):
        return get_finma_checklist()
    return []
