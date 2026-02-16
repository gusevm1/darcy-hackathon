"""Client models for Swiss financial licensing applications."""

from datetime import UTC, datetime
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
    contact_name: str = ""
    contact_email: str = ""
    current_stage_index: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
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
        Literal[
            "sro",
            "finma_banking",
            "finma_fintech",
            "finma_securities",
            "finma_fund_management",
            "finma_insurance",
            "undetermined",
        ]
        | None
    ) = None
    finma_license_type: (
        Literal[
            "banking",
            "fintech",
            "securities_firm",
            "fund_management",
            "insurance",
        ]
        | None
    ) = None

    # Services & Activities
    services: list[str] = Field(default_factory=list)
    handles_fiat: bool | None = None
    handles_client_assets: bool | None = None
    client_types: list[str] = Field(default_factory=list)
    cross_border_activities: bool | None = None

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


class ClientDocument(BaseModel):
    id: str
    client_id: str
    document_id: str  # matches frontend RequiredDocument.id
    file_name: str
    file_path: str
    content_type: str = ""
    file_size: int = 0
    status: Literal["pending", "verified", "rejected", "error"] = "pending"
    verification_result: str | None = None
    uploaded_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    verified_at: datetime | None = None
