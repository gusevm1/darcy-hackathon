"""Decision tree rules for crypto-asset classification under MiCAR."""

from typing import TypedDict

# ---------------------------------------------------------------------------
# Token-type classification
# ---------------------------------------------------------------------------

TOKEN_CLASSIFICATIONS: dict[str, dict[str, str | list[str]]] = {
    "asset_referenced": {
        "label": "Asset-Referenced Token (ART)",
        "micar_title": "Title III",
        "description": (
            "Tokens that maintain a stable value by referencing "
            "another value, right, or combination thereof"
        ),
        "key_articles": ["Art. 16-47"],
        "authorisation": "Art. 21 — Authorisation required from NCA",
        "reserve_requirement": "Art. 25 — Must maintain reserve of assets",
    },
    "e_money": {
        "label": "E-Money Token (EMT)",
        "micar_title": "Title IV",
        "description": (
            "Tokens that maintain a stable value by referencing one official currency"
        ),
        "key_articles": ["Art. 48-58"],
        "authorisation": (
            "Art. 48 — Must be authorised as credit institution or "
            "EMI under Directive 2009/110/EC"
        ),
        "redemption": (
            "Art. 49 — Holders must have right to redeem at par value at any time"
        ),
    },
    "utility": {
        "label": "Utility Token",
        "micar_title": "Title II",
        "description": (
            "Tokens intended to provide access to a good or service "
            "supplied by the issuer"
        ),
        "key_articles": ["Art. 4-15"],
        "authorisation": (
            "Art. 4 — White paper notification required; no NCA authorisation needed"
        ),
        "exemptions": (
            "Art. 5 — Exempt if offered free, mining reward, or limited-network use"
        ),
    },
    "other": {
        "label": "Other Crypto-Asset",
        "micar_title": "Title II",
        "description": (
            "Crypto-assets not classified as ART, EMT, or utility tokens "
            "(e.g., payment tokens, governance tokens)"
        ),
        "key_articles": ["Art. 4-15"],
        "authorisation": "Art. 4 — White paper notification required",
        "liability": "Art. 7 — Issuer liability for white paper accuracy",
    },
}

# ---------------------------------------------------------------------------
# Service-type to capital-requirement mapping (Art. 67)
# ---------------------------------------------------------------------------


class ServiceCapital(TypedDict):
    capital_class: int
    minimum_capital_eur: int
    article: str
    description: str


SERVICE_CAPITAL_REQUIREMENTS: dict[str, ServiceCapital] = {
    "advice": {
        "capital_class": 1,
        "minimum_capital_eur": 50_000,
        "article": "Art. 67(1)(a) / Art. 78",
        "description": "Providing advice on crypto-assets",
    },
    "order_reception": {
        "capital_class": 1,
        "minimum_capital_eur": 50_000,
        "article": "Art. 67(1)(a) / Art. 77",
        "description": ("Reception and transmission of orders on behalf of clients"),
    },
    "placing": {
        "capital_class": 2,
        "minimum_capital_eur": 125_000,
        "article": "Art. 67(1)(a) / Art. 76",
        "description": "Placing of crypto-assets",
    },
    "order_execution": {
        "capital_class": 2,
        "minimum_capital_eur": 125_000,
        "article": "Art. 67(1)(a) / Art. 74",
        "description": "Execution of orders on behalf of clients",
    },
    "transfer": {
        "capital_class": 2,
        "minimum_capital_eur": 125_000,
        "article": "Art. 67(1)(a)",
        "description": "Providing transfer services on behalf of clients",
    },
    "custody": {
        "capital_class": 3,
        "minimum_capital_eur": 150_000,
        "article": "Art. 67(1)(a) / Art. 75",
        "description": (
            "Custody and administration of crypto-assets on behalf of clients"
        ),
    },
    "exchange_fiat": {
        "capital_class": 3,
        "minimum_capital_eur": 150_000,
        "article": "Art. 67(1)(a) / Art. 73",
        "description": "Exchange of crypto-assets for funds",
    },
    "exchange_crypto": {
        "capital_class": 3,
        "minimum_capital_eur": 150_000,
        "article": "Art. 67(1)(a) / Art. 73",
        "description": "Exchange of crypto-assets for other crypto-assets",
    },
    "trading_platform": {
        "capital_class": 3,
        "minimum_capital_eur": 150_000,
        "article": "Art. 67(1)(a) / Art. 72",
        "description": "Operation of a trading platform for crypto-assets",
    },
    "portfolio_management": {
        "capital_class": 3,
        "minimum_capital_eur": 150_000,
        "article": "Art. 67(1)(a) / Art. 79",
        "description": "Providing portfolio management on crypto-assets",
    },
}

# ---------------------------------------------------------------------------
# Existing-license simplified pathways (Art. 60)
# ---------------------------------------------------------------------------

SIMPLIFIED_PATHWAYS: dict[str, dict[str, str]] = {
    "credit_institution": {
        "label": "Credit Institution",
        "pathway": (
            "Art. 60 — May provide crypto-asset services by notifying "
            "competent authority at least 40 working days in advance. "
            "No separate CASP authorisation required."
        ),
        "notification_period": "40 working days",
    },
    "investment_firm": {
        "label": "MiFID II Investment Firm",
        "pathway": (
            "Art. 60 — May provide crypto-asset services by notifying "
            "competent authority. Programme of operations and internal "
            "controls description required."
        ),
        "notification_period": "40 working days",
    },
    "emi": {
        "label": "Electronic Money Institution",
        "pathway": (
            "Art. 60 — May provide crypto-asset services by notification. "
            "Already authorised for e-money issuance under EMD2."
        ),
        "notification_period": "40 working days",
    },
    "payment_institution": {
        "label": "Payment Institution",
        "pathway": (
            "Requires full CASP authorisation under Art. 63. "
            "Payment institution licence does not qualify for "
            "Art. 60 simplified pathway."
        ),
        "notification_period": "N/A — full authorisation required",
    },
    "none": {
        "label": "No Existing Licence",
        "pathway": (
            "Full CASP authorisation required under Art. 63. "
            "Application assessed within 40 working days of "
            "complete submission (Art. 63(3))."
        ),
        "notification_period": "N/A — full authorisation required",
    },
}

# ---------------------------------------------------------------------------
# Timeline estimates
# ---------------------------------------------------------------------------

TIMELINE_ESTIMATES: dict[str, dict[str, str]] = {
    "casp_new": {
        "label": "New CASP Authorisation",
        "preparation": "3-6 months",
        "application_review": "Up to 3 months (Art. 63(4))",
        "total_estimate": "6-12 months",
    },
    "casp_simplified": {
        "label": "Simplified Pathway (Art. 60)",
        "preparation": "1-3 months",
        "notification_period": "40 working days",
        "total_estimate": "3-6 months",
    },
    "art_issuer": {
        "label": "ART Issuer Authorisation",
        "preparation": "4-8 months",
        "application_review": "3-6 months",
        "total_estimate": "9-18 months",
    },
    "emt_issuer": {
        "label": "EMT Issuer (via EMI/Credit Institution)",
        "preparation": "6-12 months",
        "application_review": "3-6 months (EMI authorisation)",
        "total_estimate": "12-24 months",
    },
    "utility_token": {
        "label": "Utility Token Offer",
        "preparation": "1-2 months (white paper drafting)",
        "notification": "Notification to NCA only",
        "total_estimate": "1-3 months",
    },
    "passporting": {
        "label": "Cross-Border Passporting",
        "notification": "Art. 65 — 10 working days NCA processing",
        "start_date": "15 working days from submission at latest",
        "total_estimate": "1-2 months additional",
    },
}
