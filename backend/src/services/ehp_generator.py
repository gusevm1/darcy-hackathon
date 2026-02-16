"""AI-generated EHP comment exchanges using Claude."""

import logging

import anthropic

from src.config import settings
from src.models.ehp import EHPComment
from src.services import ehp_store

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are simulating a FINMA Electronic Hub Platform (EHP) review exchange for a \
Swiss financial license application. Generate realistic comments that would appear \
during the regulatory review process.

Generate 2-4 comments forming a realistic exchange between:
- A FINMA reviewer (use Swiss-German names like M. Brunner, A. Weber, Dr. S. Keller, \
R. Zimmermann, L. Fischer)
- The applicant or their consultant

Each comment MUST:
- Reference SPECIFIC section numbers, paragraphs, or content from the document \
(e.g., "Section 3.2 states..." or "The threshold in Section 4.1...")
- Cite specific figures, names, or data points from the document when available
- Reference applicable FINMA circulars or Swiss regulations by number
- Use professional Swiss regulatory language
- Be specific and actionable (not generic)
- Follow a logical conversation flow (question → response → follow-up)

If document content is provided, ground ALL comments in the actual text. Do NOT \
generate generic comments — every observation must tie to a specific part of the document.

Respond with a JSON array of comment objects. Each object must have:
- "author": string (name of the commenter)
- "role": one of "finma-reviewer", "applicant", "consultant", "auditor"
- "content": string (the comment text)
- "resolved": boolean (true if the issue is resolved in the exchange)

Return ONLY the JSON array, no other text."""


async def generate_ehp_comments(
    client_id: str,
    document_id: str,
    document_name: str,
    document_description: str,
    document_text: str | None = None,
) -> list[EHPComment]:
    """Generate realistic EHP comments for a document using Claude."""
    user_prompt = (
        f"Generate an EHP review exchange for this document:\n\n"
        f"Document: {document_name}\n"
        f"Description: {document_description}\n"
        f"Document ID: {document_id}\n"
    )
    if document_text:
        truncated = document_text[:3000]
        user_prompt += f"\nDocument content (excerpt):\n{truncated}\n"

    user_prompt += (
        "\nGenerate 2-4 realistic review comments for this document. "
        "The exchange should include at least one FINMA reviewer comment "
        "raising a specific regulatory concern, and a response."
    )

    try:
        client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)
        response = await client.messages.create(
            model=settings.agent_model,
            max_tokens=1500,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_prompt}],
        )

        import json

        text = response.content[0].text  # type: ignore[union-attr]
        comments_data = json.loads(text)

        results: list[EHPComment] = []
        for item in comments_data:
            comment = await ehp_store.add_comment(
                client_id=client_id,
                document_id=document_id,
                author=item["author"],
                role=item["role"],
                content=item["content"],
                resolved=item.get("resolved", False),
                ai_generated=True,
            )
            results.append(comment)

        return results
    except Exception:
        logger.exception("Failed to generate EHP comments")
        return []
