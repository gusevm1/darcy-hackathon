# darcy-hackathon — Project Instructions

## Repository Layout
This is a monorepo with two independent projects:
- `frontend/` — Next.js 15+ (App Router), deploys to Vercel
- `backend/` — Python / FastAPI, deploys to AWS EC2

They share no packages or workspace linking. Each has its own dependency management.

---

## Frontend (`frontend/`)

### Tech Stack
- **Framework:** Next.js 15+ (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **Package Manager:** pnpm
- **Node Version:** 22
- **Deployment:** Vercel (Root Directory: `frontend`)
- **Linting:** ESLint + Prettier

### Project Structure
- `frontend/src/app/` — App Router pages, layouts, and route handlers
- `frontend/src/components/ui/` — shadcn/ui components (managed by CLI, do not edit directly)
- `frontend/src/components/shared/` — Custom reusable components
- `frontend/src/lib/` — Utility functions and helpers
- `frontend/src/hooks/` — Custom React hooks
- `frontend/src/types/` — TypeScript type definitions
- `frontend/src/config/` — App configuration constants

### Conventions
- Use Server Components by default; add `'use client'` only when needed (event handlers, hooks, browser APIs)
- Use functional components with TypeScript
- Prefer named exports over default exports
- Use `async`/`await` over `.then()` chains
- Keep components small and focused (< 150 lines)
- Co-locate tests next to source files (`*.test.ts`)
- Use the `cn()` helper from `@/lib/utils` for conditional class names
- Import from path aliases: `@/components/...`, `@/lib/...`, `@/hooks/...`
- Follow the existing Prettier configuration (no semicolons, single quotes)
- Use `pnpm` for all package management commands

### Adding shadcn/ui Components
This project has the shadcn MCP server configured (`.mcp.json` at repo root). You can:
- Browse available components by asking about the shadcn registry
- Install components with: `cd frontend && pnpm dlx shadcn@latest add <component-name>`
- Components are installed to `frontend/src/components/ui/`
- Do NOT manually edit files in `src/components/ui/` — use the CLI to update them

### Key Commands (run from `frontend/`)
- `pnpm dev` — Start development server (Turbopack)
- `pnpm build` — Production build
- `pnpm lint` — Run ESLint
- `pnpm format` — Format code with Prettier
- `pnpm tsc --noEmit` — Type check

---

## Backend (`backend/`)

### Tech Stack
- **Framework:** FastAPI
- **Language:** Python 3.12
- **Settings:** pydantic-settings
- **Linting:** ruff
- **Type Checking:** mypy (strict)
- **Testing:** pytest
- **Deployment:** AWS EC2

### Project Structure
- `backend/src/main.py` — FastAPI app entrypoint
- `backend/src/config.py` — Settings via pydantic-settings
- `backend/src/routes/` — API route modules
- `backend/src/models/` — Pydantic / DB models
- `backend/src/services/` — Business logic
- `backend/src/middleware/` — Middleware (CORS, etc.)
- `backend/tests/` — Pytest tests

### Key Commands (run from `backend/`)
- `uvicorn src.main:app --reload` — Start dev server
- `pytest` — Run tests
- `ruff check .` — Lint
- `ruff format .` — Format
- `mypy src/` — Type check

---

## Branching Strategy
- `main` — Production. Protected. Deploy on push.
- `develop` — Integration branch. CI runs on push.
- `feature/*` — New features. Branch from `develop`.
- `fix/*` — Bug fixes. Branch from `develop`.
- `chore/*` — Maintenance tasks. Branch from `develop`.

## Git Conventions
- Write concise commit messages in imperative mood
- Reference issue numbers in commits when applicable
- Keep PRs focused — one feature/fix per PR
- Squash merge feature branches into develop
- Rebase develop onto main before release

## Before Committing
### Frontend
- `cd frontend && pnpm lint` — no warnings or errors
- `cd frontend && pnpm tsc --noEmit` — no type errors
- `cd frontend && pnpm build` — build succeeds

### Backend
- `cd backend && ruff check .` — no lint errors
- `cd backend && mypy src/` — no type errors
- `cd backend && pytest` — all tests pass

---

## Deploying Frontend to Vercel

### Project Details
- **Vercel Project:** `darcy-hackathon` (team: `maxims-projects-e4175e3c`)
- **Production URL:** https://darcy-hackathon.vercel.app
- **Root Directory:** `frontend/` (configured in Vercel project settings)
- **Git Integration:** Connected to `gusevm1/darcy-hackathon` — pushes to `main` auto-deploy to production

### How It Deploys
Pushing to `main` triggers an automatic Vercel production build. No manual CLI deploy needed.

### CLI Deploy Caveats
- **Do NOT run `vercel` from inside `frontend/`** — Vercel's root directory setting is already `frontend/`, so running from there doubles the path to `frontend/frontend/`. Always run from the repo root.
- **Use `--archive=tgz`** if deploying via CLI to avoid hitting the file upload rate limit (`api-upload-free` cap of 5000 requests). Example: `vercel --prod --yes --archive=tgz`
- **Prefer Git-triggered deploys** over CLI deploys — just push to `main` and let the integration handle it.
- The `.vercel/` directory is gitignored. If a fresh clone needs linking, run `vercel link` from the repo root.

### Environment Variables
Set these in Vercel project settings (Settings → Environment Variables), not in `.env` files:
- `NEXT_PUBLIC_API_URL` — Backend API base URL (currently `http://18.195.13.46`)
- `NEXT_PUBLIC_APP_URL` — Frontend URL (defaults to `http://localhost:3000` if unset)

---

## Deploying Backend to EC2

### Connection Details
- **Instance:** t4g.small (ARM64, Ubuntu 24.04) — `i-0bdcad744a86d60c8`
- **Elastic IP:** `18.195.13.46`
- **Region:** eu-central-1 (Frankfurt)
- **SSH:** `ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46`
- **Repo on EC2:** `/home/ubuntu/darcy-hackathon` (branch: `main`)
- **Stack:** Docker Compose (API on port 8000 + Qdrant on 6333) behind Nginx reverse proxy (port 80)
- **Systemd:** `darcy-api.service` auto-restarts Docker Compose on reboot
- **API Base URL:** `http://18.195.13.46`

### Deploy Steps (after pushing to `main`)
```bash
ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46
cd /home/ubuntu/darcy-hackathon && git pull origin main
sudo docker compose down && sudo docker compose up -d --build
```
Use `--build` whenever `requirements.txt`, `Dockerfile`, or source files change.

### Verify Deployment
```bash
# Health check
curl -s http://18.195.13.46/health

# Check indexed documents (expect 10)
curl -s http://18.195.13.46/api/kb/documents | python3 -m json.tool

# Test search
curl -s -X POST http://18.195.13.46/api/kb/search \
  -H "Content-Type: application/json" \
  -d '{"query": "test query", "top_k": 3}' | python3 -m json.tool
```

### Rollback
```bash
ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46
cd /home/ubuntu/darcy-hackathon
git log --oneline -5          # find the good commit
git checkout <commit-hash>
sudo docker compose down && sudo docker compose up -d --build
```

### Full Push + Deploy Workflow
1. Run pre-commit checks (see "Before Committing" above)
2. `git push origin main`
3. **Frontend:** Vercel auto-deploys from the push — no action needed
4. **Backend:** SSH into EC2, pull, and rebuild (see Deploy Steps above)
5. Verify both: Vercel production URL + EC2 health check and document listing
