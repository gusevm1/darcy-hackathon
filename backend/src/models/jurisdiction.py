"""Models for jurisdiction comparison data."""

from enum import StrEnum

from pydantic import BaseModel


class ServiceFilter(StrEnum):
    custody = "custody"
    exchange = "exchange"
    trading_platform = "trading_platform"
    advice = "advice"
    portfolio_management = "portfolio_management"
    transfer = "transfer"
    all = "all"


class LicenseType(BaseModel):
    type: str
    description: str
    article: str


class CapitalRequirement(BaseModel):
    capital_class: str
    amount: str
    services: str


class JurisdictionComparison(BaseModel):
    name: str
    regulatory_body: str
    framework: str
    license_types: list[LicenseType]
    capital_requirements: list[CapitalRequirement]
    timeline: str
    passporting: str
    aml_requirements: list[str]
    key_obligations: list[str]
    transitional_provisions: str
    recent_developments: str


class JurisdictionListResponse(BaseModel):
    jurisdictions: list[JurisdictionComparison]
