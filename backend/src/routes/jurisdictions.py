"""Jurisdiction comparison endpoint."""

from typing import Any

from fastapi import APIRouter

from src.data.jurisdictions import JURISDICTIONS
from src.models.jurisdiction import (
    CapitalRequirement,
    JurisdictionComparison,
    JurisdictionListResponse,
    LicenseType,
    ServiceFilter,
)

router = APIRouter(prefix="/api", tags=["jurisdictions"])

# Map service filter to relevant keywords for filtering
_SERVICE_KEYWORDS: dict[str, list[str]] = {
    "custody": ["custody", "custod"],
    "exchange": ["exchange"],
    "trading_platform": ["trading platform", "trading"],
    "advice": ["advice", "advisory"],
    "portfolio_management": ["portfolio"],
    "transfer": ["transfer"],
}


def _build_comparison(key: str, data: dict[str, Any]) -> JurisdictionComparison:
    """Build a JurisdictionComparison from raw jurisdiction data."""
    raw_licenses: list[dict[str, str]] = data.get("license_types", [])
    raw_capital: list[dict[str, str]] = data.get("capital_requirements", [])

    license_types = [
        LicenseType(
            type=lt.get("type", ""),
            description=lt.get("description", ""),
            article=lt.get("article", ""),
        )
        for lt in raw_licenses
    ]

    capital_requirements = [
        CapitalRequirement(
            capital_class=cr.get("class", ""),
            amount=cr.get("amount", ""),
            services=cr.get("services", ""),
        )
        for cr in raw_capital
    ]

    aml_requirements: list[str] = data.get("aml_requirements", [])
    key_obligations: list[str] = data.get("key_obligations", [])

    return JurisdictionComparison(
        name=str(data.get("name", key)),
        regulatory_body=str(data.get("regulatory_body", "")),
        framework=str(data.get("framework", "")),
        license_types=license_types,
        capital_requirements=capital_requirements,
        timeline=str(data.get("timeline", "")),
        passporting=str(data.get("passporting", "")),
        aml_requirements=aml_requirements,
        key_obligations=key_obligations,
        transitional_provisions=str(data.get("transitional_provisions", "")),
        recent_developments=str(data.get("recent_developments", "")),
    )


@router.get("/jurisdictions")
async def get_jurisdictions(
    service: ServiceFilter = ServiceFilter.all,
) -> JurisdictionListResponse:
    """Return jurisdiction comparison data, optionally filtered by service."""
    comparisons: list[JurisdictionComparison] = []

    for key, raw_data in JURISDICTIONS.items():
        data: dict[str, Any] = dict(raw_data)
        comparison = _build_comparison(key, data)

        # Filter capital requirements by service if specified
        if service != ServiceFilter.all:
            keywords = _SERVICE_KEYWORDS.get(service.value, [])
            if keywords:
                comparison.capital_requirements = [
                    cr
                    for cr in comparison.capital_requirements
                    if any(kw in cr.services.lower() for kw in keywords)
                ]

        comparisons.append(comparison)

    return JurisdictionListResponse(jurisdictions=comparisons)
