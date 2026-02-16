"""SQLite-backed CRUD for EHP comments."""

import uuid
from datetime import UTC, datetime
from typing import Literal

import aiosqlite

from src.models.ehp import EHPComment
from src.services.db import get_db


async def save_comment(comment: EHPComment) -> None:
    db = await get_db()
    try:
        await db.execute(
            """INSERT OR REPLACE INTO ehp_comments
               (id, client_id, document_id, author, role, content,
                timestamp, resolved, ai_generated)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                comment.id,
                comment.client_id,
                comment.document_id,
                comment.author,
                comment.role,
                comment.content,
                comment.timestamp.isoformat(),
                1 if comment.resolved else 0,
                1 if comment.ai_generated else 0,
            ),
        )
        await db.commit()
    finally:
        await db.close()


async def list_comments(
    client_id: str, document_id: str
) -> list[EHPComment]:
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM ehp_comments"
            " WHERE client_id = ? AND document_id = ?"
            " ORDER BY timestamp ASC",
            (client_id, document_id),
        )
        rows = await cursor.fetchall()
        return [_row_to_comment(r) for r in rows]
    finally:
        await db.close()


async def get_comment(comment_id: str) -> EHPComment | None:
    db = await get_db()
    try:
        cursor = await db.execute(
            "SELECT * FROM ehp_comments WHERE id = ?",
            (comment_id,),
        )
        row = await cursor.fetchone()
        if row is None:
            return None
        return _row_to_comment(row)
    finally:
        await db.close()


async def toggle_resolved(comment_id: str) -> EHPComment | None:
    comment = await get_comment(comment_id)
    if comment is None:
        return None
    new_resolved = not comment.resolved
    db = await get_db()
    try:
        await db.execute(
            "UPDATE ehp_comments SET resolved = ? WHERE id = ?",
            (1 if new_resolved else 0, comment_id),
        )
        await db.commit()
    finally:
        await db.close()
    return await get_comment(comment_id)


RoleType = Literal[
    "finma-reviewer", "applicant", "consultant", "auditor"
]


async def add_comment(
    client_id: str,
    document_id: str,
    author: str,
    role: RoleType,
    content: str,
    ai_generated: bool = False,
    resolved: bool = False,
    timestamp: datetime | None = None,
    comment_id: str | None = None,
) -> EHPComment:
    comment = EHPComment(
        id=comment_id or uuid.uuid4().hex[:16],
        client_id=client_id,
        document_id=document_id,
        author=author,
        role=role,
        content=content,
        timestamp=timestamp or datetime.now(UTC),
        resolved=resolved,
        ai_generated=ai_generated,
    )
    await save_comment(comment)
    return comment


async def seed_demo_ehp_comments() -> None:
    """Seed the demo EHP comments for thomas-muller."""
    existing = await list_comments("thomas-muller", "banking-1-1")
    if existing:
        return

    for data in _SEED_COMMENTS:
        ts = data.get("timestamp")
        if isinstance(ts, str):
            from datetime import datetime as dt

            parsed_ts = dt.fromisoformat(ts.replace("Z", "+00:00"))
        else:
            parsed_ts = datetime.now(UTC)

        role = str(data["role"])
        await add_comment(
            client_id="thomas-muller",
            document_id=str(data["document_id"]),
            author=str(data["author"]),
            role=role,  # type: ignore[arg-type]
            content=str(data["content"]),
            resolved=bool(data.get("resolved", False)),
            ai_generated=False,
            timestamp=parsed_ts,
            comment_id=str(data["id"]),
        )


def _row_to_comment(row: aiosqlite.Row) -> EHPComment:
    return EHPComment(
        id=row["id"],
        client_id=row["client_id"],
        document_id=row["document_id"],
        author=row["author"],
        role=row["role"],
        content=row["content"],
        timestamp=datetime.fromisoformat(row["timestamp"]),
        resolved=bool(row["resolved"]),
        ai_generated=bool(row["ai_generated"]),
    )


# fmt: off
_SEED_COMMENTS: list[dict[str, object]] = [
    # ── Stage 1: Pre-Consultation ──
    {"id": "ehp-001", "document_id": "banking-1-1", "author": "M. Brunner", "role": "finma-reviewer", "content": "Business concept received. Please clarify the expected deposit volume for Year 1 and Year 2, and specify whether retail or institutional deposits are targeted.", "timestamp": "2025-07-12T09:15:00Z", "resolved": True},
    {"id": "ehp-002", "document_id": "banking-1-1", "author": "Thomas Müller", "role": "applicant", "content": "Year 1: CHF 50M primarily institutional deposits. Year 2: CHF 120M expanding to retail. Updated concept document uploaded.", "timestamp": "2025-07-15T14:30:00Z", "resolved": True},
    {"id": "ehp-003", "document_id": "banking-1-1", "author": "M. Brunner", "role": "finma-reviewer", "content": "Noted. Retail expansion will require enhanced depositor protection measures. Proceed with application preparation.", "timestamp": "2025-07-16T10:00:00Z", "resolved": True},
    {"id": "ehp-004", "document_id": "banking-1-2", "author": "Dr. S. Keller", "role": "consultant", "content": "Regulatory classification confirmed: Full banking license under Art. 3 BankA required due to planned deposit-taking and lending activities. FinTech license (Art. 1b) not applicable given lending component.", "timestamp": "2025-07-20T11:00:00Z", "resolved": True},
    {"id": "ehp-005", "document_id": "banking-1-3", "author": "M. Brunner", "role": "finma-reviewer", "content": "Shareholder structure appears straightforward. Please confirm whether Müller Holding AG holds any indirect participations through nominee structures.", "timestamp": "2025-07-25T08:45:00Z", "resolved": True},
    {"id": "ehp-006", "document_id": "banking-1-3", "author": "Thomas Müller", "role": "applicant", "content": "Confirmed: No nominee or trust structures. Müller Holding AG holds 85% directly. Remaining 15% held by three natural persons as detailed in the updated document.", "timestamp": "2025-07-26T16:20:00Z", "resolved": True},
    {"id": "ehp-007", "document_id": "banking-1-5", "author": "M. Brunner", "role": "finma-reviewer", "content": "Capital concept noted. CHF 12M initial capitalization provides adequate buffer above the CHF 10M minimum. Please ensure capital commitment letters are included in the formal application.", "timestamp": "2025-08-02T10:30:00Z", "resolved": True},
    # ── Stage 2: Application Preparation ──
    {"id": "ehp-010", "document_id": "banking-2-1", "author": "M. Brunner", "role": "finma-reviewer", "content": "Business plan reviewed. Section 3.2 projects revenue of CHF 12M in Year 2 — this appears optimistic given current market conditions and the 18% CAGR assumption in Section 2. Please provide a sensitivity analysis with pessimistic scenarios in Section 7.", "timestamp": "2025-09-10T09:00:00Z", "resolved": True},
    {"id": "ehp-011", "document_id": "banking-2-1", "author": "Thomas Müller", "role": "applicant", "content": "Sensitivity analysis added in Section 7.3. Three scenarios modelled: base case (CHF 5M/12M/28M), stressed (-30%: CHF 3.5M/8.4M/19.6M), and severe stress (-50%: CHF 2.5M/6M/14M). CET1 ratio remains above 10.5% in all scenarios. Break-even at Month 18 base case, Month 26 stressed.", "timestamp": "2025-09-15T13:00:00Z", "resolved": True},
    {"id": "ehp-012", "document_id": "banking-2-3", "author": "A. Weber", "role": "finma-reviewer", "content": "Section 3.2 'Delegation of Authority' is marked as a placeholder. The organizational regulations must include an explicit delegation matrix delineating Board vs. executive management decision rights per FINMA Circular 2017/1. Appendix A is currently empty — this is a blocking deficiency.", "timestamp": "2025-09-20T14:15:00Z", "resolved": False},
    {"id": "ehp-013", "document_id": "banking-2-3", "author": "Dr. S. Keller", "role": "consultant", "content": "Acknowledged. We are completing Appendix A with specific thresholds for credit decisions, investment decisions, expenditures, and contractual commitments as noted in the placeholder. Updated version will be uploaded by 30 September.", "timestamp": "2025-09-22T09:30:00Z", "resolved": False},
    {"id": "ehp-014", "document_id": "banking-2-5", "author": "M. Brunner", "role": "finma-reviewer", "content": "Capital plan is comprehensive. Section 3 confirms CHF 12M in escrow at Credit Suisse (ref: CH93-0070-0110-0075-4321-8). Section 4.2 projections show CET1 above 12.6% through Year 3. Please provide the original bank confirmation letter from Credit Suisse dated 20 September 2025 referenced in Annex 1.", "timestamp": "2025-09-25T11:00:00Z", "resolved": True},
    {"id": "ehp-015", "document_id": "banking-2-6", "author": "A. Weber", "role": "finma-reviewer", "content": "Dossier 2 (Dr. Anna Meier) notes her primary expertise is corporate law and M&A. Her only banking supervisory experience is a non-executive role at Privatbank Bellevue (2015-2020). FINMA requires demonstrated financial services supervision expertise — please supplement with evidence of relevant regulatory board experience or consider adding a member with direct banking supervisory background.", "timestamp": "2025-10-01T09:45:00Z", "resolved": False},
    {"id": "ehp-016", "document_id": "banking-2-8", "author": "M. Brunner", "role": "finma-reviewer", "content": "Risk management framework is well-structured. Two observations: (1) Section 6.2 notes 'This section should be updated to reference FINMA Circular 2023/1 on operational resilience' — this must be addressed before submission. (2) The framework entirely omits climate risk. Per FINMA Guidance 01/2024, a dedicated climate risk section is required. The note at the end of the document acknowledges this gap.", "timestamp": "2025-10-05T14:00:00Z", "resolved": False},
    {"id": "ehp-017", "document_id": "banking-2-8", "author": "Thomas Müller", "role": "applicant", "content": "Thank you. We will (1) update Section 6 to reference FINMA Circular 2023/1 operational resilience requirements, and (2) add a new Section 9: Climate Risk per FINMA Guidance 01/2024. Expected revision date: 15 October 2025.", "timestamp": "2025-10-06T10:30:00Z", "resolved": False},
    {"id": "ehp-018", "document_id": "banking-2-10", "author": "A. Weber", "role": "finma-reviewer", "content": "AML/KYC framework is comprehensive. However, Section 4.1 and Section 4.2 both reference a CHF 25,000 transaction monitoring threshold. Per the 2024 AMLA amendment, this threshold has been reduced to CHF 15,000. The document itself contains a note acknowledging this is outdated — please update all thresholds and remove the caveat note.", "timestamp": "2025-10-08T09:00:00Z", "resolved": False},
    {"id": "ehp-019", "document_id": "banking-2-10", "author": "Dr. S. Keller", "role": "consultant", "content": "Corrected in v3. Section 4.1 and 4.2 thresholds updated from CHF 25,000 to CHF 15,000 per the 2024 AMLA amendment. Aggregate 30-day monitoring threshold in Section 4.2 adjusted accordingly. Caveat note removed.", "timestamp": "2025-10-10T15:00:00Z", "resolved": False},
    {"id": "ehp-020", "document_id": "banking-2-9", "author": "M. Brunner", "role": "finma-reviewer", "content": "ICS follows the three lines of defense model appropriately. However, Section 3.2 states the Head of Compliance 'reports operationally to the CEO' with escalation rights. Per FINMA requirements, the compliance function must report directly to the Board, not through the CEO. The note in Section 3.2 already flags this — please resolve before formal submission.", "timestamp": "2025-10-12T11:30:00Z", "resolved": False},
    {"id": "ehp-021", "document_id": "banking-2-4", "author": "A. Weber", "role": "finma-reviewer", "content": "Organizational chart approved. Reporting lines are clear — CRO and Head of Compliance have appropriate direct escalation to Board/Risk Committee. Headcount plan (35→55→80 FTE) is reasonable for the projected growth. No further action required.", "timestamp": "2025-09-30T16:00:00Z", "resolved": True},
    {"id": "ehp-022", "document_id": "banking-2-11", "author": "M. Brunner", "role": "finma-reviewer", "content": "Remuneration policy reviewed. Variable compensation deferral period should be extended from 1 year to 3 years for senior management per FINMA Circular 2010/1 margin no. 45.", "timestamp": "2025-10-15T10:00:00Z", "resolved": False},
    {"id": "ehp-023", "document_id": "banking-2-12", "author": "A. Weber", "role": "finma-reviewer", "content": "Source of funds documentation for M\u00fcller Holding AG is complete. Still pending: Declaration of beneficial ownership for the 5% stake held through Alpenrose Beteiligungen GmbH.", "timestamp": "2025-10-18T14:30:00Z", "resolved": False},
    {"id": "ehp-024", "document_id": "banking-2-2", "author": "M. Brunner", "role": "finma-reviewer", "content": "Draft articles reviewed. Purpose clause is appropriately restricted to banking activities. Minor: Article 12 should reference the BankA capital maintenance requirement explicitly.", "timestamp": "2025-09-18T09:30:00Z", "resolved": True},
    {"id": "ehp-025", "document_id": "banking-2-7", "author": "A. Weber", "role": "finma-reviewer", "content": "Executive management dossiers are satisfactory. CEO and CFO demonstrate adequate banking experience. Please provide reference letters for the Head of Operations.", "timestamp": "2025-10-03T11:15:00Z", "resolved": False},
    # ── Stage 3: Formal Submission ──
    {"id": "ehp-030", "document_id": "banking-3-1", "author": "M. Brunner", "role": "finma-reviewer", "content": "Application form received. Completeness check initiated. Expected processing time: 2-4 weeks for initial review.", "timestamp": "2025-11-01T08:00:00Z", "resolved": False},
    {"id": "ehp-031", "document_id": "banking-3-3", "author": "R. Zimmermann", "role": "auditor", "content": "Audit engagement confirmed. PwC Switzerland will serve as regulatory auditor. Independence declaration and audit plan submitted.", "timestamp": "2025-10-28T10:00:00Z", "resolved": True},
]
# fmt: on
