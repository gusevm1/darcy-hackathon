# Darcy Hackathon — Refactoring Progress

## Phase 1: Tech Debt Fixes (COMPLETE)

Commit: `2f11412` — "Implement Phase 1 tech debt fixes: auth, error handling, retries, datetime"

1. **API key auth middleware** — `backend/src/middleware/auth.py` — optional `API_KEY` env var gates non-health endpoints
2. **Error handling** — `backend/src/services/document_verifier.py` — structured error responses, no bare `except`
3. **Retry logic** — `backend/src/services/rag_service.py` — `tenacity` retries on OpenAI embedding calls
4. **Datetime standardization** — ISO 8601 `datetime.now(UTC)` across client_store, document_store
5. **Gap analyzer split** — `backend/src/services/gap_analyzer.py` — `analyze_gaps()` decomposed into 7 focused functions
6. **Shared `run_tool_loop()`** — `backend/src/services/agent_tool_loop.py` — deduplicated from claude_agent + consultant_agent
7. **Env-configurable CORS** — `backend/src/middleware/cors.py` + `CORS_ORIGINS` env var
8. **Shared `get_db()`** — `backend/src/services/db.py` — single SQLite connection helper
9. **SSE callbacks extraction** — `frontend/src/lib/sse-callbacks.ts` — shared by onboarding + consult chat
10. **Input validation** — `frontend/src/lib/validation.ts` — `validateChatMessage`, `validateUploadFile`, `validateOnboardingField`

## Phase 2: Stability (COMPLETE)

Verified correct as part of Phase 1 commit — all items were implemented together.

- 48 backend tests passing (ruff + mypy clean)
- Frontend: tsc + lint + build clean

## Phase 3: Architecture Refactoring (COMPLETE)

### Task 1: RAGService Dependency Injection (backend)
- **Files changed:** `rag_service.py`, `main.py`, `kb.py`, `test_rag_search.py`, `pyproject.toml`
- Converted 3 module-level globals (`_qdrant`, `_openai`, `_bm25_corpus`) into `RAGService` class
- Added `get_rag_service()` FastAPI `Depends()` function
- `kb.py` routes inject `RAGService` via `Depends`
- Module-level re-exports (`init`, `search`, `embed`, etc.) maintain backward compatibility for agents + ingestion
- `_default_instance` stored on `app.state` in lifespan
- Tests updated to `patch.object` on singleton
- Added `"src/routes/*.py" = ["B008"]` ruff ignore for FastAPI `Depends()`/`Query()` pattern

### Task 2: Split `use-knowledge-state.ts` (frontend)
- **New files:** `lib/tree-builders.ts`, `hooks/use-kb-documents.ts`
- Extracted `buildGeneralInfoTree()` and `buildInternalKBTreeFromDocs()` to pure functions in `lib/tree-builders.ts`
- Extracted `useKBDocuments()` hook (KB doc fetching + loading state) to `hooks/use-kb-documents.ts`
- `useKnowledgeState()` composes extracted pieces — public API unchanged

### Task 3: Split `use-chat-sessions.ts` (frontend)
- **New file:** `hooks/use-chat-storage.ts`
- Extracted `useChatStorage()` hook (localStorage read/write, hydration, persistence effects)
- Exported `welcomeMessage` and `createDefaultChat()` for reuse
- `useChatSessions()` delegates storage concerns to `useChatStorage()`

### Task 4: Roadmap Context (frontend)
- **New file:** `contexts/roadmap-context.tsx`
- Created `RoadmapProvider` + `useRoadmap()` hook
- `page.tsx` wraps content in provider — no more prop drilling
- `RoadmapVisualization` and `RoadmapChatPanel` consume context directly (eliminated 24 props total)
- Removed prop interfaces from child components

### Task 5: Centralized Data Transformations (frontend)
- **New file:** `lib/mappers.ts`
- Extracted `backendStatusToFrontend()` and `mergeBackendDocs()` from `use-document-state.ts`
- `apiClientToClient()` stays in `lib/api/clients.ts` (already well-placed)

### Task 6: Comprehensive Health Endpoint (backend)
- **File changed:** `routes/health.py`, `tests/test_health.py`
- Expanded from `{"status": "ok"}` to structured per-service health checks
- Checks: SQLite (SELECT 1), Qdrant (get_collections), OpenAI (client initialized)
- Returns: `{"status": "healthy|degraded|unhealthy", "services": {"database": {...}, "qdrant": {...}, "openai": {...}}}`
- Each service reports `status` ("up"/"down") and `latency_ms`
- Added `test_health_database_up` test

### Verification (Phase 3)
- **Backend:** ruff clean, mypy clean, 45 tests pass (44 + 1 new)
- **Frontend:** tsc clean, eslint clean (0 errors, fixed 2 pre-existing lint issues), build succeeds
- Fixed pre-existing `react-hooks/set-state-in-effect` ESLint errors with targeted suppression

---

## Phase 4: Testing & Documentation (NOT STARTED)

See handoff prompt for details.
