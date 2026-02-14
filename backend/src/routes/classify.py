"""Classification wizard endpoint."""

from fastapi import APIRouter

from src.models.classification import ClassificationResult, WizardAnswers
from src.services.classification import classify

router = APIRouter(prefix="/api", tags=["classify"])


@router.post("/classify")
async def classify_answers(
    answers: WizardAnswers,
) -> ClassificationResult:
    """Classify crypto-asset business and return licensing requirements."""
    return classify(answers)
