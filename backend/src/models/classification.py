"""Models for the classification wizard and results."""

from pydantic import BaseModel


class LicenseRequirement(BaseModel):
    license_type: str
    description: str
    article: str
    timeline: str


class WizardAnswers(BaseModel):
    business_role: str
    token_type: str
    services: list[str]
    fiat_handling: bool
    target_jurisdictions: list[str]
    establishment: str
    existing_licenses: list[str]


class ClassificationResult(BaseModel):
    required_licenses: list[LicenseRequirement]
    capital_requirements: list[dict[str, str | int]]
    timeline_estimate: str
    key_obligations: list[str]
    simplified_pathway: bool
    simplified_pathway_details: str
    token_classification: str
    token_classification_details: str
