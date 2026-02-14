"""Gap analysis service: compare client state against pathway requirements."""

from src.models.client import Client, Gap, GapAnalysis, NextStep


def analyze_gaps(client: Client) -> GapAnalysis:
    """Analyze a client's readiness for their chosen licensing pathway."""
    pathway = client.pathway or "undetermined"
    gaps: list[Gap] = []
    next_steps: list[NextStep] = []
    critical_blockers: list[str] = []

    # Check core fields
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
        critical_blockers.append(
            "Legal structure must be determined before application"
        )

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
        critical_blockers.append("Swiss office is mandatory")

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
        critical_blockers.append("Swiss-resident director is mandatory")

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

    # Pathway-specific checks
    if pathway == "undetermined":
        gaps.append(
            Gap(
                category="governance",
                field_or_item="pathway",
                description="Regulatory pathway not yet determined",
                severity="needs_review",
            )
        )
        critical_blockers.append("Regulatory pathway must be determined to proceed")

    # Capital checks
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
            critical_blockers.append(
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

    # Compliance checks
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

    if pathway == "sro" and client.aml_officer_swiss_resident is False:
        gaps.append(
            Gap(
                category="compliance",
                field_or_item="aml_officer_swiss_resident",
                description="AML officer should ideally be Swiss-resident for SRO",
                severity="needs_review",
            )
        )

    # FINMA-specific triggers
    if client.handles_client_assets is True and pathway == "sro":
        gaps.append(
            Gap(
                category="governance",
                field_or_item="handles_client_assets",
                description=(
                    "Long-term custody of client assets"
                    " may require FINMA license, not just SRO"
                ),
                severity="needs_review",
            )
        )
    if client.operates_order_book is True and pathway == "sro":
        gaps.append(
            Gap(
                category="governance",
                field_or_item="operates_order_book",
                description=(
                    "Operating an order book typically"
                    " requires FINMA banking or DLT license"
                ),
                severity="needs_review",
            )
        )
        critical_blockers.append(
            "Order book operation may require FINMA license upgrade"
        )

    # Checklist gap analysis
    total_items = len(client.checklist)
    completed_items = sum(1 for item in client.checklist if item.status == "complete")
    blocked_items = [item for item in client.checklist if item.status == "blocked"]
    not_started = [item for item in client.checklist if item.status == "not_started"]

    for item in blocked_items:
        gaps.append(
            Gap(
                category=item.category,
                field_or_item=item.id,
                description=f"Checklist item blocked: {item.item}",
                severity="needs_review",
            )
        )

    # Unresolved flags
    for flag in client.flags:
        if not flag.resolved and flag.severity == "critical":
            critical_blockers.append(f"Unresolved critical flag: {flag.reason}")

    # Generate next steps
    priority = 1

    if pathway == "undetermined":
        next_steps.append(
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
        next_steps.append(
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
        next_steps.append(
            NextStep(
                priority=priority,
                action="Establish Swiss office address",
                category="legal_structure",
                estimated_days=7,
            )
        )
        priority += 1

    if client.has_swiss_director is not True:
        next_steps.append(
            NextStep(
                priority=priority,
                action="Appoint at least one Swiss-resident director",
                category="personnel",
                estimated_days=14,
            )
        )
        priority += 1

    if not client.has_aml_officer:
        next_steps.append(
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
        next_steps.append(
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
        next_steps.append(
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
        next_steps.append(
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
        next_steps.append(
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
    for item in not_started[:5]:  # Top 5 not-started items
        # Skip if depends_on items aren't complete
        deps_met = all(
            any(ci.id == dep and ci.status == "complete" for ci in client.checklist)
            for dep in item.depends_on
        )
        if deps_met or not item.depends_on:
            next_steps.append(
                NextStep(
                    priority=priority,
                    action=item.item,
                    category=item.category,
                    estimated_days=item.estimated_days,
                    depends_on=item.depends_on,
                )
            )
            priority += 1

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
