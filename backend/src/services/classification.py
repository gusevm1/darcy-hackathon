"""Deterministic decision tree classification service."""

from src.data.decision_tree import (
    SERVICE_CAPITAL_REQUIREMENTS,
    SIMPLIFIED_PATHWAYS,
    TIMELINE_ESTIMATES,
    TOKEN_CLASSIFICATIONS,
)
from src.models.classification import (
    ClassificationResult,
    LicenseRequirement,
    WizardAnswers,
)


def _classify_token(token_type: str) -> tuple[str, str]:
    """Classify the token type and return label + details."""
    info = TOKEN_CLASSIFICATIONS.get(token_type)
    if info is None:
        return "Other Crypto-Asset", "Classified under MiCAR Title II."
    label = str(info["label"])
    title = str(info["micar_title"])
    desc = str(info["description"])
    return label, f"{title}: {desc}"


def _get_capital_requirements(
    services: list[str],
) -> list[dict[str, str | int]]:
    """Determine capital requirements based on selected services."""
    requirements: list[dict[str, str | int]] = []
    seen_classes: set[int] = set()

    for service in services:
        svc = SERVICE_CAPITAL_REQUIREMENTS.get(service)
        if svc is None:
            continue
        cap_class = svc["capital_class"]
        if cap_class not in seen_classes:
            seen_classes.add(cap_class)
            requirements.append(
                {
                    "class": cap_class,
                    "minimum_eur": svc["minimum_capital_eur"],
                    "article": svc["article"],
                    "description": svc["description"],
                }
            )

    return sorted(requirements, key=lambda r: int(r["class"]))


def _determine_licenses(
    token_type: str,
    services: list[str],
    fiat_handling: bool,
    target_jurisdictions: list[str],
    existing_licenses: list[str],
) -> list[LicenseRequirement]:
    """Determine required licences based on wizard answers."""
    licenses: list[LicenseRequirement] = []

    # Token-specific requirements
    if token_type == "asset_referenced":
        licenses.append(
            LicenseRequirement(
                license_type="ART Issuer Authorisation",
                description=(
                    "Authorisation required to issue asset-referenced "
                    "tokens under MiCAR Title III."
                ),
                article="Art. 21",
                timeline=TIMELINE_ESTIMATES["art_issuer"]["total_estimate"],
            )
        )
    elif token_type == "e_money":
        licenses.append(
            LicenseRequirement(
                license_type="EMT Issuer (Credit Institution or EMI)",
                description=(
                    "E-money tokens may only be issued by authorised "
                    "credit institutions or electronic money institutions."
                ),
                article="Art. 48",
                timeline=TIMELINE_ESTIMATES["emt_issuer"]["total_estimate"],
            )
        )

    # CASP authorisation if providing services
    if services:
        has_simplified = any(
            lic in ("credit_institution", "investment_firm", "emi")
            for lic in existing_licenses
        )
        if has_simplified:
            licenses.append(
                LicenseRequirement(
                    license_type="CASP Simplified Notification (Art. 60)",
                    description=(
                        "Existing financial entity may provide crypto-asset "
                        "services by notifying competent authority."
                    ),
                    article="Art. 60",
                    timeline=TIMELINE_ESTIMATES["casp_simplified"]["total_estimate"],
                )
            )
        else:
            licenses.append(
                LicenseRequirement(
                    license_type="CASP Authorisation",
                    description=(
                        "Full authorisation required as Crypto-Asset Service "
                        "Provider under MiCAR Title V."
                    ),
                    article="Art. 59, 62-63",
                    timeline=TIMELINE_ESTIMATES["casp_new"]["total_estimate"],
                )
            )

    # Fiat handling — additional PI/EMI requirement
    if fiat_handling and not any(
        lic in ("credit_institution", "emi") for lic in existing_licenses
    ):
        licenses.append(
            LicenseRequirement(
                license_type="Payment / E-Money Institution Licence",
                description=(
                    "Handling fiat currency may require additional "
                    "authorisation as a payment or e-money institution "
                    "depending on the nature of fiat operations."
                ),
                article="PSD2 / EMD2",
                timeline="6-12 months",
            )
        )

    # UK-specific
    if "uk" in target_jurisdictions:
        licenses.append(
            LicenseRequirement(
                license_type="FCA Cryptoasset Registration",
                description=(
                    "UK requires separate FCA registration for "
                    "crypto-asset businesses under MLR 2017."
                ),
                article="MLR 2017, Part 8A",
                timeline="6-12+ months",
            )
        )

    # Switzerland-specific
    if "ch" in target_jurisdictions:
        licenses.append(
            LicenseRequirement(
                license_type="FINMA Licence / VQF Membership",
                description=(
                    "Switzerland requires FINMA FinTech licence, "
                    "DLT Trading Facility licence, or VQF SRO "
                    "membership depending on activities."
                ),
                article="Banking Act / FMIA / AMLA",
                timeline="2-12 months",
            )
        )

    return licenses


def _check_simplified_pathway(
    existing_licenses: list[str],
) -> tuple[bool, str]:
    """Check if a simplified pathway is available."""
    for lic in existing_licenses:
        pathway = SIMPLIFIED_PATHWAYS.get(lic)
        if pathway and lic in (
            "credit_institution",
            "investment_firm",
            "emi",
        ):
            return True, str(pathway["pathway"])

    none_pathway = SIMPLIFIED_PATHWAYS.get("none")
    if none_pathway:
        return False, str(none_pathway["pathway"])
    return False, "Full CASP authorisation required under Art. 63."


def _estimate_timeline(
    token_type: str,
    existing_licenses: list[str],
    services: list[str],
    target_jurisdictions: list[str],
) -> str:
    """Estimate overall timeline."""
    parts: list[str] = []

    # Token issuance timeline
    if token_type == "asset_referenced":
        parts.append(
            f"ART issuance: {TIMELINE_ESTIMATES['art_issuer']['total_estimate']}"
        )
    elif token_type == "e_money":
        parts.append(
            f"EMT issuance: {TIMELINE_ESTIMATES['emt_issuer']['total_estimate']}"
        )
    elif token_type in ("utility", "other"):
        parts.append(
            f"Token offering: {TIMELINE_ESTIMATES['utility_token']['total_estimate']}"
        )

    # CASP timeline
    if services:
        has_simplified = any(
            lic in ("credit_institution", "investment_firm", "emi")
            for lic in existing_licenses
        )
        if has_simplified:
            parts.append(
                "CASP (simplified): "
                f"{TIMELINE_ESTIMATES['casp_simplified']['total_estimate']}"
            )
        else:
            parts.append(
                "CASP authorisation: "
                f"{TIMELINE_ESTIMATES['casp_new']['total_estimate']}"
            )

    # Passporting
    if len(target_jurisdictions) > 1 and "eu" in target_jurisdictions:
        parts.append(
            f"EU passporting: {TIMELINE_ESTIMATES['passporting']['total_estimate']}"
        )

    return ". ".join(parts) if parts else "Timeline depends on scope."


def _determine_obligations(services: list[str], fiat_handling: bool) -> list[str]:
    """Determine key ongoing obligations."""
    obligations: list[str] = [
        "Act honestly, fairly and professionally (Art. 66)",
        "Maintain prudential safeguards at all times (Art. 67)",
        "Safeguard client crypto-assets and funds (Art. 68)",
        "Complaints-handling procedures (Art. 69)",
        "Conflicts of interest management (Art. 70)",
        "AML/CFT compliance (AMLD, TFR Travel Rule)",
    ]

    if "trading_platform" in services:
        obligations.append("Operating rules for trading platform (Art. 72)")
    if "custody" in services:
        obligations.append("Register of positions and asset movement records (Art. 75)")
    if "advice" in services:
        obligations.append("Suitability assessment for client advice (Art. 78)")
    if "portfolio_management" in services:
        obligations.append("Best interest and diversification requirements (Art. 79)")
    if fiat_handling:
        obligations.append(
            "Client funds placement with credit institution (Art. 68(3))"
        )

    return obligations


def classify(answers: WizardAnswers) -> ClassificationResult:
    """Run the deterministic classification algorithm."""
    token_label, token_details = _classify_token(answers.token_type)

    required_licenses = _determine_licenses(
        token_type=answers.token_type,
        services=answers.services,
        fiat_handling=answers.fiat_handling,
        target_jurisdictions=answers.target_jurisdictions,
        existing_licenses=answers.existing_licenses,
    )

    capital_requirements = _get_capital_requirements(answers.services)

    simplified, simplified_details = _check_simplified_pathway(
        answers.existing_licenses
    )

    timeline = _estimate_timeline(
        token_type=answers.token_type,
        existing_licenses=answers.existing_licenses,
        services=answers.services,
        target_jurisdictions=answers.target_jurisdictions,
    )

    obligations = _determine_obligations(answers.services, answers.fiat_handling)

    return ClassificationResult(
        required_licenses=required_licenses,
        capital_requirements=capital_requirements,
        timeline_estimate=timeline,
        key_obligations=obligations,
        simplified_pathway=simplified,
        simplified_pathway_details=simplified_details,
        token_classification=token_label,
        token_classification_details=token_details,
    )
