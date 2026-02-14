"""Models for regulatory checklists."""

from pydantic import BaseModel


class ChecklistItem(BaseModel):
    description: str
    regulatory_reference: str
    timeline: str
    priority: str


class ChecklistPhase(BaseModel):
    phase: str
    label: str
    items: list[ChecklistItem]


class Checklist(BaseModel):
    token_classification: str
    required_licenses: list[str]
    phases: list[ChecklistPhase]
