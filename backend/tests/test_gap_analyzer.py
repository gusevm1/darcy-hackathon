"""Tests for the gap analysis service."""

from src.models.client import ChecklistItem, Client, FlaggedItem
from src.services.gap_analyzer import (
    _check_capital,
    _check_checklist,
    _check_compliance,
    _check_core_fields,
    _check_pathway_specific,
    _check_unresolved_flags,
    _generate_next_steps,
    analyze_gaps,
)


def _make_client(**kwargs: object) -> Client:
    """Create a minimal client with overrides."""
    defaults = {
        "id": "test-client",
        "company_name": "Test AG",
        "legal_structure": "AG",
        "has_swiss_office": True,
        "has_swiss_director": True,
        "business_description": "Payment services",
        "services": ["payments"],
        "pathway": "finma_banking",
        "has_aml_officer": True,
        "has_external_auditor": True,
        "has_aml_kyc_policies": True,
        "has_transaction_monitoring": True,
        "has_sanctions_screening": True,
    }
    defaults.update(kwargs)
    return Client.model_validate(defaults)


# --- _check_core_fields ---


def test_core_fields_all_present() -> None:
    client = _make_client()
    gaps, blockers = _check_core_fields(client)
    assert gaps == []
    assert blockers == []


def test_core_fields_missing_company_name() -> None:
    client = _make_client(company_name="")
    gaps, _ = _check_core_fields(client)
    assert any(g.field_or_item == "company_name" for g in gaps)


def test_core_fields_missing_legal_structure() -> None:
    client = _make_client(legal_structure=None)
    gaps, blockers = _check_core_fields(client)
    assert any(g.field_or_item == "legal_structure" for g in gaps)
    assert len(blockers) > 0


def test_core_fields_no_swiss_office() -> None:
    client = _make_client(has_swiss_office=False)
    gaps, blockers = _check_core_fields(client)
    assert any(g.field_or_item == "has_swiss_office" for g in gaps)
    assert "Swiss office is mandatory" in blockers


def test_core_fields_no_swiss_director() -> None:
    client = _make_client(has_swiss_director=False)
    gaps, blockers = _check_core_fields(client)
    assert any(g.field_or_item == "has_swiss_director" for g in gaps)
    assert "Swiss-resident director is mandatory" in blockers


# --- _check_capital ---


def test_capital_shortfall() -> None:
    client = _make_client(
        minimum_capital_chf=10_000_000, existing_capital_chf=5_000_000
    )
    gaps, blockers = _check_capital(client, "finma_banking")
    assert any("5,000,000" in g.description for g in gaps)
    assert len(blockers) > 0


def test_capital_sufficient() -> None:
    client = _make_client(
        minimum_capital_chf=10_000_000, existing_capital_chf=15_000_000
    )
    gaps, blockers = _check_capital(client, "finma_banking")
    # Should still check pathway-specific
    capital_gaps = [g for g in gaps if g.category == "capital"]
    assert capital_gaps == []


def test_capital_pathway_specific_shortfall() -> None:
    client = _make_client(existing_capital_chf=500_000)
    gaps, blockers = _check_capital(client, "finma_securities")
    assert any("Securities Firm" in g.description for g in gaps)


# --- _check_compliance ---


def test_compliance_all_set() -> None:
    client = _make_client()
    gaps = _check_compliance(client)
    assert gaps == []


def test_compliance_missing_aml_officer() -> None:
    client = _make_client(has_aml_officer=False)
    gaps = _check_compliance(client)
    assert any(g.field_or_item == "has_aml_officer" for g in gaps)


def test_compliance_unknown_fields() -> None:
    client = _make_client(has_transaction_monitoring=None)
    gaps = _check_compliance(client)
    monitoring_gaps = [
        g for g in gaps if g.field_or_item == "has_transaction_monitoring"
    ]
    assert len(monitoring_gaps) == 1
    assert monitoring_gaps[0].severity == "incomplete"


def test_compliance_non_swiss_aml_officer() -> None:
    client = _make_client(aml_officer_swiss_resident=False)
    gaps = _check_compliance(client)
    assert any(g.field_or_item == "aml_officer_swiss_resident" for g in gaps)


# --- _check_pathway_specific ---


def test_undetermined_pathway() -> None:
    gaps, blockers = _check_pathway_specific("undetermined")
    assert any(g.field_or_item == "pathway" for g in gaps)
    assert len(blockers) > 0


def test_fund_management_custodian() -> None:
    gaps, _ = _check_pathway_specific("finma_fund_management")
    assert any(g.field_or_item == "custodian_bank" for g in gaps)


def test_insurance_actuary() -> None:
    gaps, _ = _check_pathway_specific("finma_insurance")
    assert any(g.field_or_item == "actuarial_requirements" for g in gaps)


def test_banking_no_extra_gaps() -> None:
    gaps, blockers = _check_pathway_specific("finma_banking")
    assert gaps == []
    assert blockers == []


# --- _check_checklist ---


def test_blocked_checklist_items() -> None:
    client = _make_client()
    client.checklist = [
        ChecklistItem(
            id="item-1",
            category="compliance",
            item="Submit AML docs",
            status="blocked",
            required_for="finma",
        ),
        ChecklistItem(
            id="item-2",
            category="legal_structure",
            item="Register company",
            status="complete",
            required_for="finma",
        ),
    ]
    gaps = _check_checklist(client)
    assert len(gaps) == 1
    assert gaps[0].field_or_item == "item-1"


# --- _check_unresolved_flags ---


def test_unresolved_critical_flags() -> None:
    client = _make_client()
    client.flags = [
        FlaggedItem(
            id="f1", field="capital",
            reason="Unclear source", severity="critical",
        ),
        FlaggedItem(
            id="f2", field="capital",
            reason="Resolved", severity="critical", resolved=True,
        ),
        FlaggedItem(
            id="f3", field="info", reason="FYI", severity="info",
        ),
    ]
    blockers = _check_unresolved_flags(client)
    assert len(blockers) == 1
    assert "Unclear source" in blockers[0]


# --- _generate_next_steps ---


def test_next_steps_for_complete_client() -> None:
    client = _make_client()
    steps = _generate_next_steps(client, "finma_banking")
    # Fully compliant client should have no next steps
    assert steps == []


def test_next_steps_for_bare_client() -> None:
    client = _make_client(
        company_name="",
        legal_structure=None,
        has_swiss_office=None,
        has_swiss_director=None,
        has_aml_officer=None,
        has_external_auditor=None,
        has_aml_kyc_policies=None,
        has_transaction_monitoring=None,
        has_sanctions_screening=None,
    )
    steps = _generate_next_steps(client, "undetermined")
    assert len(steps) >= 5
    assert steps[0].priority == 1


# --- Full analyze_gaps ---


def test_analyze_gaps_ready_client() -> None:
    client = _make_client()
    client.checklist = [
        ChecklistItem(
            id="c1", category="compliance", item="Done",
            status="complete", required_for="finma",
        ),
    ]
    result = analyze_gaps(client)
    assert result.readiness_score == 1.0
    assert result.completed_items == 1
    assert result.total_items == 1
    assert result.critical_blockers == []


def test_analyze_gaps_empty_client() -> None:
    client = Client(id="empty")
    result = analyze_gaps(client)
    assert result.pathway == "undetermined"
    assert len(result.gaps) > 0
    assert len(result.critical_blockers) > 0
    assert result.readiness_score == 0.0
