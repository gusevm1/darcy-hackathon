"""Requirements checklist endpoint."""

from fastapi import APIRouter

from src.data.requirements import REQUIREMENTS_BY_PHASE
from src.models.checklist import Checklist, ChecklistItem, ChecklistPhase
from src.models.classification import ClassificationResult

router = APIRouter(prefix="/api", tags=["requirements"])

_PHASE_LABELS: dict[str, str] = {
    "pre_application": "Pre-Application",
    "application": "Application",
    "post_authorisation": "Post-Authorisation",
}


@router.post("/checklist")
async def get_checklist(
    classification: ClassificationResult,
) -> Checklist:
    """Generate a regulatory checklist based on classification results."""
    phases: list[ChecklistPhase] = []

    for phase_key, items_data in REQUIREMENTS_BY_PHASE.items():
        items: list[ChecklistItem] = [
            ChecklistItem(
                description=item["description"],
                regulatory_reference=item["regulatory_reference"],
                timeline=item["timeline"],
                priority=item["priority"],
            )
            for item in items_data
        ]

        phases.append(
            ChecklistPhase(
                phase=phase_key,
                label=_PHASE_LABELS.get(phase_key, phase_key),
                items=items,
            )
        )

    return Checklist(
        token_classification=classification.token_classification,
        required_licenses=[
            lic.license_type for lic in classification.required_licenses
        ],
        phases=phases,
    )
