"""Client models for Swiss crypto licensing applications."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ChecklistItem(BaseModel):
    id: str
    category: str
    item: str
    status: Literal[
        "not_started", "in_progress", "complete", "blocked", "not_applicable"
    ] = "not_started"
    notes: str | None = None
    required_for: str  # sro | finma | both
    estimated_days: int | None = None
    depends_on: list[str] = Field(default_factory=list)


class FlaggedItem(BaseModel):
    id: str
    field: str
    reason: str
    severity: Literal["info", "warning", "critical"]
    resolved: bool = False
    resolution_notes: str | None = None


class Client(BaseModel):
    id: str
    company_name: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    status: Literal["intake", "in_progress", "under_review", "approved", "blocked"] = (
        "intake"
    )

    # Business Profile
    business_description: str | None = None
    legal_structure: Literal["AG", "GmbH", "other"] | None = None
    establishment_canton: str | None = None
    has_swiss_office: bool | None = None
    has_swiss_director: bool | None = None

    # Regulatory Pathway
    pathway: (
        Literal["sro", "finma_fintech", "finma_banking", "finma_dlt", "undetermined"]
        | None
    ) = None
    target_sro: Literal["VQF", "PolyReg", "SO-FIT", "other"] | None = None
    finma_license_type: (
        Literal["fintech", "banking", "securities_dealer", "dlt_facility"] | None
    ) = None

    # Services & Activities
    services: list[str] = Field(default_factory=list)
    handles_fiat: bool | None = None
    handles_client_assets: bool | None = None
    operates_order_book: bool | None = None
    token_types: list[str] = Field(default_factory=list)

    # Capital & Corporate
    minimum_capital_chf: int | None = None
    existing_capital_chf: int | None = None
    existing_licenses: list[str] = Field(default_factory=list)

    # AML/Compliance Readiness
    has_aml_officer: bool | None = None
    aml_officer_swiss_resident: bool | None = None
    has_external_auditor: bool | None = None
    has_aml_kyc_policies: bool | None = None
    has_transaction_monitoring: bool | None = None
    has_sanctions_screening: bool | None = None

    # Checklist + Flags
    checklist: list[ChecklistItem] = Field(default_factory=list)
    flags: list[FlaggedItem] = Field(default_factory=list)
    conversation_history: list[dict[str, str]] = Field(default_factory=list)


class Gap(BaseModel):
    category: str
    field_or_item: str
    description: str
    severity: Literal["missing", "incomplete", "needs_review"]


class NextStep(BaseModel):
    priority: int
    action: str
    category: str
    estimated_days: int | None = None
    depends_on: list[str] = Field(default_factory=list)
    regulatory_reference: str | None = None


class GapAnalysis(BaseModel):
    client_id: str
    pathway: str
    readiness_score: float
    total_items: int
    completed_items: int
    gaps: list[Gap]
    next_steps: list[NextStep]
    critical_blockers: list[str]
