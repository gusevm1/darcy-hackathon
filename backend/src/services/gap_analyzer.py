"""Gap analysis service: compare client state against pathway requirements."""

from src.models.client import Client, Gap, GapAnalysis, NextStep


def _check_core_fields(client: Client) -> tuple[list[Gap], list[str]]:
    """Check company name, legal structure, Swiss presence, description, services."""
    gaps: list[Gap] = []
    blockers: list[str] = []

    if not client.company_name:
        gaps.append(
            Gap(
                category="legal_structure",
                field_or_item="company_name",
                description="Company name not provided",
                severity="missing",
            )
        )

    if client.legal_structure is None:
        gaps.append(
            Gap(
                category="legal_structure",
                field_or_item="legal_structure",
                description="Legal structure (AG/GmbH) not specified",
                severity="missing",
            )
        )
        blockers.append("Legal structure must be determined before application")

    if client.has_swiss_office is None:
        gaps.append(
            Gap(
                category="legal_structure",
                field_or_item="has_swiss_office",
                description="Swiss office status unknown",
                severity="missing",
            )
        )
    elif not client.has_swiss_office:
        gaps.append(
            Gap(
                category="legal_structure",
                field_or_item="has_swiss_office",
                description="Swiss office required for both SRO and FINMA",
                severity="missing",
            )
        )
        blockers.append("Swiss office is mandatory")

    if client.has_swiss_director is None:
        gaps.append(
            Gap(
                category="personnel",
                field_or_item="has_swiss_director",
                description="Swiss-resident director status unknown",
                severity="missing",
            )
        )
    elif not client.has_swiss_director:
        gaps.append(
            Gap(
                category="personnel",
                field_or_item="has_swiss_director",
                description="At least one Swiss-resident director is required",
                severity="missing",
            )
        )
        blockers.append("Swiss-resident director is mandatory")

    if client.business_description is None:
        gaps.append(
            Gap(
                category="legal_structure",
                field_or_item="business_description",
                description="Business description not provided",
                severity="missing",
            )
        )

    if not client.services:
        gaps.append(
            Gap(
                category="legal_structure",
                field_or_item="services",
                description="Services/activities not specified",
                severity="missing",
            )
        )

    return gaps, blockers


def _check_capital(
    client: Client, pathway: str
) -> tuple[list[Gap], list[str]]:
    """Check general and pathway-specific capital requirements."""
    gaps: list[Gap] = []
    blockers: list[str] = []

    if (
        client.minimum_capital_chf is not None
        and client.existing_capital_chf is not None
    ):
        if client.existing_capital_chf < client.minimum_capital_chf:
            shortfall = client.minimum_capital_chf - client.existing_capital_chf
            gaps.append(
                Gap(
                    category="capital",
                    field_or_item="existing_capital_chf",
                    description=f"Capital shortfall of CHF {shortfall:,}",
                    severity="missing",
                )
            )
            blockers.append(
                f"Capital shortfall of CHF {shortfall:,} must be addressed"
            )
    elif client.minimum_capital_chf is not None and client.existing_capital_chf is None:
        gaps.append(
            Gap(
                category="capital",
                field_or_item="existing_capital_chf",
                description="Existing capital amount not provided",
                severity="missing",
            )
        )

    pathway_capital: dict[str, tuple[int, str]] = {
        "finma_banking": (10_000_000, "Banking license requires CHF 10M minimum"),
        "finma_securities": (1_500_000, "Securities Firm requires CHF 1.5M minimum"),
        "finma_fund_management": (
            1_000_000,
            "Fund Management requires CHF 1M minimum",
        ),
    }
    if pathway in pathway_capital:
        min_capital, label = pathway_capital[pathway]
        if (
            client.existing_capital_chf is not None
            and client.existing_capital_chf < min_capital
        ):
            shortfall = min_capital - client.existing_capital_chf
            gaps.append(
                Gap(
                    category="capital",
                    field_or_item="existing_capital_chf",
                    description=(f"{label}. Shortfall: CHF {shortfall:,}"),
                    severity="missing",
                )
            )
            blockers.append(
                f"Capital shortfall of CHF {shortfall:,} for {pathway}"
            )

    return gaps, blockers


def _check_compliance(client: Client) -> list[Gap]:
    """Check AML officer, auditor, KYC policies, monitoring, sanctions."""
    gaps: list[Gap] = []

    compliance_fields = {
        "has_aml_officer": "AML compliance officer not appointed",
        "has_external_auditor": "External auditor not engaged",
        "has_aml_kyc_policies": "AML/KYC policies not drafted",
        "has_transaction_monitoring": "Transaction monitoring not implemented",
        "has_sanctions_screening": "Sanctions screening not implemented",
    }

    for field, desc in compliance_fields.items():
        value = getattr(client, field, None)
        if value is None:
            gaps.append(
                Gap(
                    category="compliance",
                    field_or_item=field,
                    description=f"{desc} (status unknown)",
                    severity="incomplete",
                )
            )
        elif not value:
            gaps.append(
                Gap(
                    category="compliance",
                    field_or_item=field,
                    description=desc,
                    severity="missing",
                )
            )

    if client.aml_officer_swiss_resident is False:
        gaps.append(
            Gap(
                category="compliance",
                field_or_item="aml_officer_swiss_resident",
                description="AML officer should ideally be Swiss-resident",
                severity="needs_review",
            )
        )

    return gaps


def _check_pathway_specific(
    pathway: str,
) -> tuple[list[Gap], list[str]]:
    """Check pathway-specific governance requirements (fund mgmt, insurance)."""
    gaps: list[Gap] = []
    blockers: list[str] = []

    if pathway == "undetermined":
        gaps.append(
            Gap(
                category="governance",
                field_or_item="pathway",
                description="Regulatory pathway not yet determined",
                severity="needs_review",
            )
        )
        blockers.append("Regulatory pathway must be determined to proceed")

    if pathway == "finma_fund_management":
        gaps.append(
            Gap(
                category="governance",
                field_or_item="custodian_bank",
                description=(
                    "Fund Management Company must appoint a custodian bank"
                    " (Depotbank) — confirm custodian arrangement"
                ),
                severity="needs_review",
            )
        )

    if pathway == "finma_insurance":
        gaps.append(
            Gap(
                category="compliance",
                field_or_item="actuarial_requirements",
                description=(
                    "Insurance license requires appointment of a responsible"
                    " actuary and Swiss Solvency Test (SST) compliance"
                ),
                severity="needs_review",
            )
        )

    return gaps, blockers


def _check_checklist(client: Client) -> list[Gap]:
    """Flag blocked checklist items as gaps."""
    gaps: list[Gap] = []
    blocked_items = [item for item in client.checklist if item.status == "blocked"]
    for item in blocked_items:
        gaps.append(
            Gap(
                category=item.category,
                field_or_item=item.id,
                description=f"Checklist item blocked: {item.item}",
                severity="needs_review",
            )
        )
    return gaps


def _check_unresolved_flags(client: Client) -> list[str]:
    """Return critical blockers from unresolved flags."""
    return [
        f"Unresolved critical flag: {flag.reason}"
        for flag in client.flags
        if not flag.resolved and flag.severity == "critical"
    ]


def _generate_next_steps(client: Client, pathway: str) -> list[NextStep]:
    """Generate prioritized next steps based on gaps."""
    steps: list[NextStep] = []
    priority = 1

    if pathway == "undetermined":
        steps.append(
            NextStep(
                priority=priority,
                action="Complete intake to determine regulatory pathway (SRO vs FINMA)",
                category="governance",
                estimated_days=7,
                regulatory_reference="AMLA Art. 14",
            )
        )
        priority += 1

    if not client.company_name or client.legal_structure is None:
        steps.append(
            NextStep(
                priority=priority,
                action=(
                    "Establish legal entity (AG or GmbH)"
                    " and register in Commercial Register"
                ),
                category="legal_structure",
                estimated_days=14,
                regulatory_reference="CO Art. 620 (AG) / Art. 772 (GmbH)",
            )
        )
        priority += 1

    if client.has_swiss_office is not True:
        steps.append(
            NextStep(
                priority=priority,
                action="Establish Swiss office address",
                category="legal_structure",
                estimated_days=7,
            )
        )
        priority += 1

    if client.has_swiss_director is not True:
        steps.append(
            NextStep(
                priority=priority,
                action="Appoint at least one Swiss-resident director",
                category="personnel",
                estimated_days=14,
            )
        )
        priority += 1

    if not client.has_aml_officer:
        steps.append(
            NextStep(
                priority=priority,
                action="Appoint qualified AML compliance officer",
                category="compliance",
                estimated_days=14,
                regulatory_reference="AMLA Art. 8",
            )
        )
        priority += 1

    if not client.has_aml_kyc_policies:
        steps.append(
            NextStep(
                priority=priority,
                action="Draft AML/KYC policies and procedures",
                category="compliance",
                estimated_days=21,
                depends_on=["Appoint AML compliance officer"],
                regulatory_reference="AMLO-FINMA Arts. 3-10",
            )
        )
        priority += 1

    if not client.has_external_auditor:
        steps.append(
            NextStep(
                priority=priority,
                action="Engage FINMA-recognized external auditor",
                category="compliance",
                estimated_days=14,
                regulatory_reference="AMLA Art. 24",
            )
        )
        priority += 1

    if not client.has_transaction_monitoring:
        steps.append(
            NextStep(
                priority=priority,
                action="Implement transaction monitoring system",
                category="compliance",
                estimated_days=30,
                depends_on=["Draft AML/KYC policies"],
                regulatory_reference="AMLO-FINMA Art. 20",
            )
        )
        priority += 1

    if not client.has_sanctions_screening:
        steps.append(
            NextStep(
                priority=priority,
                action="Implement sanctions screening (SECO, UN, EU lists)",
                category="compliance",
                estimated_days=14,
                depends_on=["Draft AML/KYC policies"],
            )
        )
        priority += 1

    # Add not-started checklist items as next steps
    not_started = [item for item in client.checklist if item.status == "not_started"]
    for item in not_started[:5]:
        deps_met = all(
            any(ci.id == dep and ci.status == "complete" for ci in client.checklist)
            for dep in item.depends_on
        )
        if deps_met or not item.depends_on:
            steps.append(
                NextStep(
                    priority=priority,
                    action=item.item,
                    category=item.category,
                    estimated_days=item.estimated_days,
                    depends_on=item.depends_on,
                )
            )
            priority += 1

    return steps


def analyze_gaps(client: Client) -> GapAnalysis:
    """Analyze a client's readiness for their chosen licensing pathway."""
    pathway = client.pathway or "undetermined"
    gaps: list[Gap] = []
    critical_blockers: list[str] = []

    # Per-category checks
    core_gaps, core_blockers = _check_core_fields(client)
    gaps.extend(core_gaps)
    critical_blockers.extend(core_blockers)

    pathway_gaps, pathway_blockers = _check_pathway_specific(pathway)
    gaps.extend(pathway_gaps)
    critical_blockers.extend(pathway_blockers)

    capital_gaps, capital_blockers = _check_capital(client, pathway)
    gaps.extend(capital_gaps)
    critical_blockers.extend(capital_blockers)

    gaps.extend(_check_compliance(client))
    gaps.extend(_check_checklist(client))
    critical_blockers.extend(_check_unresolved_flags(client))

    # Next steps
    next_steps = _generate_next_steps(client, pathway)

    # Readiness score
    total_items = len(client.checklist)
    completed_items = sum(1 for item in client.checklist if item.status == "complete")
    readiness = completed_items / total_items if total_items > 0 else 0.0

    return GapAnalysis(
        client_id=client.id,
        pathway=pathway,
        readiness_score=readiness,
        total_items=total_items,
        completed_items=completed_items,
        gaps=gaps,
        next_steps=next_steps,
        critical_blockers=critical_blockers,
    )
