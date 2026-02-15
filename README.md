# Darcy

### *Swiss Financial Licensing Compliance, Done Properly.*

Right then. Welcome to **Darcy** — a compliance project management platform for Swiss financial licence procurement, built by yours truly, Darcy-Edward, during a hackathon that frankly didn't deserve this level of effort. But one doesn't do things by halves.

The platform pairs a rather handsome web dashboard with an AI-powered regulatory assistant, guiding organisations through the labyrinthine process of obtaining Swiss banking, fintech, securities, fund management, and insurance licences. Think of it as having a frighteningly competent solicitor in your pocket, except he never bills you and he's available at 3am.

---

## The Problem (And Why You Need Me)

Organisations seeking Swiss financial licences are, to put it charitably, absolutely lost. They face:

- Multiple regulatory pathways — SRO membership versus FINMA direct licensing — with no clear signposting whatsoever
- Between **35 and 88 required documents** per licence type, spread across 6 stages, because the Swiss do love their paperwork
- Interdependent compliance requirements (AML, capital adequacy, governance) that reference each other in a sort of bureaucratic ouroboros
- Timelines that are, at best, *aspirational*

It's an absolute shambles, frankly. Enter Darcy.

## What Darcy Does (Rather Well, If I Say So Myself)

1. **Client Dashboard** — Track multiple clients through their licensing journey at a glance. Terribly satisfying progress bars included.
2. **Document Management** — Status tracking for every last document across every stage. Not a single form goes unaccounted for.
3. **AI Compliance Assistant** — A Claude-powered co-pilot that answers regulatory questions with proper citations. Like having a conversation with someone who's actually read the legislation. Refreshing, I know.
4. **Gap Analysis** — Automated identification of missing documentation, capital shortfalls, and compliance gaps. Points out everything you've forgotten so you don't have to feel embarrassed in front of FINMA.
5. **Regulatory Knowledge Base** — Hybrid semantic and lexical search across Swiss financial law. Finds the needle in the haystack, then tells you which Article it belongs to.

---

## Architecture (The Bones of the Thing)

```
┌─────────────────┐         ┌─────────────────────────────────┐
│   Frontend       │         │   Backend (Docker Compose)      │
│   Next.js 15     │ ──────▶ │   ┌───────────┐  ┌───────────┐ │
│   Vercel         │  HTTP   │   │ FastAPI    │  │ Qdrant    │ │
│                  │         │   │ :8000      │  │ :6333     │ │
└─────────────────┘         │   └─────┬─────┘  └───────────┘ │
                            │         │                       │
                            │   ┌─────▼─────┐                │
                            │   │ Claude AI  │                │
                            │   │ OpenAI Emb │                │
                            │   └───────────┘                │
                            └─────────────────────────────────┘
```

Monorepo. Two independent projects. No shared packages because, good Lord, monorepo dependency hell is beneath us.

| Layer | Tech | Where It Lives |
|-------|------|----------------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS v4, shadcn/ui | Vercel |
| Backend | FastAPI, Python 3.12 | AWS EC2 (Docker Compose) |
| Vector DB | Qdrant | Docker Compose sidecar |
| AI Brain | Anthropic Claude Sonnet 4.5 (tool-use agent) | API |
| Embeddings | OpenAI `text-embedding-3-small` (1536 dims) | API |
| Search | Hybrid: Qdrant vectors + BM25 lexical, fused via Reciprocal Rank Fusion | In-process |

---

## The Repository (Impeccably Organised)

```
darcy-hackathon/
├── frontend/                   # Next.js 15 (App Router) — the face of the operation
│   ├── src/
│   │   ├── app/                # Pages & layouts
│   │   │   ├── clients/        # Dashboard + client detail
│   │   │   └── assistant/      # The AI compliance assistant
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui (CLI-managed, don't touch)
│   │   │   └── shared/         # Bespoke components, crafted by hand
│   │   ├── hooks/              # React hooks
│   │   ├── lib/                # Utilities
│   │   ├── types/              # TypeScript definitions
│   │   ├── data/               # Demo clients & licence configurations
│   │   └── config/             # App constants
│   └── package.json
│
├── backend/                    # FastAPI — the brains of the operation
│   ├── src/
│   │   ├── main.py             # App entrypoint & lifespan
│   │   ├── config.py           # pydantic-settings
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # Pydantic models
│   │   ├── services/           # Where the real magic happens
│   │   │   ├── rag_service.py          # Hybrid search (Qdrant + BM25)
│   │   │   ├── consultant_agent.py     # Claude tool-use agent
│   │   │   ├── gap_analyzer.py         # Compliance gap analysis
│   │   │   ├── document_ingestion.py   # PDF/text parsing & seeding
│   │   │   └── client_store.py         # SQLite persistence
│   │   ├── middleware/         # CORS and whatnot
│   │   └── data/
│   │       └── regulatory_docs/  # 10 Swiss regulatory documents, curated with care
│   ├── tests/                  # 53 pytest tests, because we're not savages
│   ├── Dockerfile
│   └── requirements.txt
│
├── docker-compose.yml          # API + Qdrant, one command, done
├── Licences/                   # Source PDFs for the knowledge base
├── .claude/CLAUDE.md           # Instructions for Claude Code (more on this later)
└── .mcp.json                   # MCP config for shadcn
```

---

## Features (A Guided Tour)

### Client Dashboard — `/clients`

A rather elegant grid of client cards. Each displays the company name, contact person, licence type, current stage, and a progress bar. One clicks a card and is whisked away to the full client detail. Simple. Intuitive. As things ought to be.

### Client Detail — `/clients/[id]`

This is where the substance lives:

- **Interactive timeline stepper** across all 6 licensing stages — one can see exactly where a client stands at a glance
- **Document list per stage**, grouped by category (Corporate, Compliance, Financial) — because organisation is next to godliness
- **Per-document status badges**: not started, uploaded, under review, approved, rejected — colour-coded, naturally
- **Simulated file upload** with automatic classification — upload a document and the system knows what it is
- **Progress bar** for approved documents in the current stage — deeply satisfying to watch it fill up

### AI Compliance Assistant — `/assistant`

The crown jewel. A three-panel layout that would make any Bloomberg terminal jealous:

- **Left sidebar** — A file tree of every client's documents, organised by client, then stage, then document. Clickable. Browsable. Proper.
- **Centre panel** — Multi-session chat interface with the Claude-powered regulatory co-pilot. Renders markdown beautifully and provides citation badges that link directly to source documents. No hallucinated nonsense — everything is backed by the knowledge base.
- **Right panel** — Document preview sheet with metadata, status, and a summary. Because context matters.

The assistant handles:
- Regulatory questions with cited sources (like a proper academic, not some blogger)
- Client intake analysis for gaps and risks
- Next-step recommendations with explanations
- Licensing pathway comparisons (SRO vs. FINMA, the various licence types)

### Knowledge Base & RAG (The Library)

The backend maintains a curated collection of 10 Swiss financial law documents — AMLA, FINMA licensing requirements, SRO membership guides, MICAR, documentation checklists — the essential canon.

Search employs a hybrid retrieval strategy, because using only one method is for amateurs:

1. **Vector search** — Qdrant with OpenAI embeddings for semantic similarity ("find me things that *mean* this")
2. **Lexical search** — BM25 for exact keyword matching ("find me things that *say* this")
3. **Reciprocal Rank Fusion** — Combines both signals. Best of both worlds. Rather clever, actually.

### Gap Analysis (The Honest Mirror)

Automated compliance gap detection that tells clients what they'd rather not hear, but absolutely need to:

- Missing company profile fields
- Undetermined regulatory pathway (one really must decide)
- Capital shortfalls against venue-specific minimums
- Compliance gaps — AML officer, auditor, policies, transaction monitoring, sanctions screening
- Incomplete checklist items
- Unresolved critical flags

Produces a **readiness score** (0 to 1), **prioritised next steps** with estimated days, and a list of **critical blockers**. Brutally honest. Tremendously useful.

---

## Licence Types (The Swiss Menu)

| Licence | Legal Basis | Stages | Documents |
|---------|------------|--------|-----------|
| Banking | Art. 3 BankA | 6 | ~88 |
| Fintech | Art. 1b BankA | 6 | ~65 |
| Securities Firm | FinIA | 6 | ~70 |
| Fund Management | CISA | 6 | ~60 |
| Insurance | ISA | 6 | ~35 |

Each follows 6 sequential stages, because the Swiss are nothing if not methodical:

**Pre-Consultation** → **Application Preparation** → **Formal Submission** → **Completeness Check** → **In-Depth Review** → **Decision & Licence Grant**

---

## API Endpoints (The Backend's Calling Cards)

### Health
| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Pulse check. Is the thing alive? |

### Clients
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/clients` | Create a new client |
| GET | `/api/clients` | List the lot of them |
| GET | `/api/clients/{id}` | Fetch one client in full detail |
| PATCH | `/api/clients/{id}` | Update client fields |
| PATCH | `/api/clients/{id}/checklist/{item_id}` | Tick off a checklist item |

### Knowledge Base
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/kb/search` | Hybrid RAG search |
| POST | `/api/kb/documents` | Upload a document (file + metadata) |
| GET | `/api/kb/documents` | List all indexed documents |
| DELETE | `/api/kb/documents/{doc_id}` | Remove a document |

### Consultant
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/consult/chat` | Streaming chat via SSE — the good stuff |
| POST | `/api/consult/analyze-gaps/{id}` | Run a gap analysis |
| POST | `/api/consult/next-steps/{id}` | Get prioritised next steps |

---

## Getting Started (Do Try to Keep Up)

### Prerequisites

You'll need the following. No excuses.

- **Node.js 22+** and **pnpm** — for the frontend
- **Python 3.12+** — for the backend
- **Docker** and **Docker Compose** — for running services like a civilised person
- An **Anthropic API key** — for Claude (the AI, not a person named Claude)
- An **OpenAI API key** — for embeddings

### Step 1 — Clone the Repository

```bash
git clone https://github.com/gusevm1/darcy-hackathon.git
cd darcy-hackathon
```

### Step 2 — Start the Backend

```bash
# Copy the example env and fill in your API keys
cp backend/.env.example backend/.env
# You'll need to set:
#   ANTHROPIC_API_KEY=sk-ant-...
#   OPENAI_API_KEY=sk-...

# Fire up the API and Qdrant
docker compose up -d --build

# Verify everything's tickety-boo
curl http://localhost:8000/health
curl http://localhost:8000/api/kb/documents | python3 -m json.tool
```

The backend seeds 10 regulatory documents into the knowledge base on first startup. Fully automatic. One needn't lift a finger.

### Step 3 — Start the Frontend

```bash
cd frontend
pnpm install

# Configure your environment
cp .env.example .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:8000

pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) and behold.

### Running the Backend Without Docker (If You Must)

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt

# You still need Qdrant. There's no escaping it.
docker run -d -p 6333:6333 qdrant/qdrant

uvicorn src.main:app --reload
```

---

## Environment Variables

### Frontend (`frontend/.env.local`)

| Variable | What It Does | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:8000` |
| `NEXT_PUBLIC_APP_URL` | Frontend URL | `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | Display name | `darcy-hackathon` |

### Backend (`backend/.env`)

| Variable | What It Does | Required |
|----------|-------------|----------|
| `ANTHROPIC_API_KEY` | Claude API key | Absolutely |
| `OPENAI_API_KEY` | OpenAI embeddings key | Absolutely |
| `QDRANT_URL` | Qdrant connection URL | No (`http://localhost:6333`) |
| `QDRANT_COLLECTION` | Qdrant collection name | No (`regulatory_docs`) |
| `APP_ENV` | Environment name | No (`development`) |
| `DEBUG` | Debug mode | No (`true`) |
| `HOST` | Bind address | No (`0.0.0.0`) |
| `PORT` | API port | No (`8000`) |
| `FRONTEND_URL` | Frontend URL for CORS | No (`http://localhost:3000`) |

---

## Testing (We Do Test Things Here)

### Backend

```bash
cd backend
pytest -v                    # All 53 tests
pytest -k "gap"              # Just the gap analysis tests
ruff check .                 # Lint
ruff format .                # Format
mypy src/                    # Type check, strict mode, as God intended
```

### Frontend

```bash
cd frontend
pnpm lint                    # ESLint
pnpm tsc --noEmit            # Type check
pnpm build                   # Production build
```

Run all of these before committing. Non-negotiable.

---

## Deployment

### Frontend → Vercel

Push to `main`. That's it. Vercel handles the rest. Auto-deploys to [darcy-hackathon.vercel.app](https://darcy-hackathon.vercel.app).

Set environment variables in Vercel project settings (Settings → Environment Variables). Don't put secrets in `.env` files like some kind of undergraduate.

**Important caveat:** Do NOT run `vercel deploy` from inside `frontend/`. Vercel's root directory is already set to `frontend/`, so it'll double the path and everything will go sideways. Deploy from the repo root or, better yet, just push to `main` and let the Git integration do its job.

### Backend → EC2

```bash
ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46
cd /home/ubuntu/darcy-hackathon && git pull origin main
sudo docker compose down && sudo docker compose up -d --build
```

Verify your handiwork:

```bash
curl -s http://18.195.13.46/health
curl -s http://18.195.13.46/api/kb/documents | python3 -m json.tool
```

The backend runs on a `t4g.small` in Frankfurt behind Nginx, with a systemd service that restarts Docker Compose on reboot. Resilient. Sensible. Professional.

---

## Demo Data (Five Fine Clients)

The frontend ships with 5 sample clients in various states of progress:

| Client | Company | Licence | Progress |
|--------|---------|---------|----------|
| Thomas Muller | Alpine Digital Bank AG | Banking | Stage 2 of 6 |
| Sara Brunner | ZuriPay Fintech GmbH | Fintech | Stage 1 of 6 |
| Marco Rossi | Helvetia Securities AG | Securities | Stage 4 of 6 |
| Elena Fischer | Swiss Capital Funds AG | Fund Management | Stage 3 of 6 |
| Lukas Weber | Edelweiss Insurance AG | Insurance | Stage 0 of 6 |

Marco's doing rather well. Lukas, bless him, hasn't started.

---

## Claude Code Integration (A Gentleman's Development Environment)

This project is configured for [Claude Code](https://claude.com/claude-code), Anthropic's CLI tool. It's rather like pair programming with someone who never gets tired and never argues about tabs versus spaces.

### Project Instructions

`.claude/CLAUDE.md` contains comprehensive project instructions that Claude Code loads automatically upon entering the repo. Covers:

- Repository layout and conventions
- Tech stack details and coding standards
- Key commands for both frontend and backend
- Deployment procedures and all their little caveats
- Git branching strategy and pre-commit checks

### MCP Server (shadcn Integration)

`.mcp.json` configures the shadcn Model Context Protocol server, allowing Claude Code to browse, search, and install shadcn/ui components directly during development:

```json
{
  "mcpServers": {
    "shadcn": {
      "command": "npx",
      "args": ["shadcn@latest", "mcp"]
    }
  }
}
```

One simply asks Claude Code for a component and it handles the rest. Civilised.

### What Claude Code Can Do Here

- Add new shadcn/ui components via the MCP integration
- Run all pre-commit checks (lint, type check, build) before committing
- Follow the branching strategy (`feature/*`, `fix/*`, `chore/*` from `develop`)
- Deploy to both Vercel and EC2
- Understand the full project context without being told twice

---

## The Full Tech Stack

### Frontend
Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui, lucide-react, sonner, react-markdown, react-hook-form, zod

### Backend
FastAPI, uvicorn, Python 3.12, Anthropic SDK (Claude Sonnet 4.5), OpenAI SDK, Qdrant client, rank-bm25, pypdf, pydantic-settings, sse-starlette, ruff, mypy, pytest

### Infrastructure
Docker, Docker Compose, Nginx, Systemd, Vercel, AWS EC2 (t4g.small, eu-central-1)

---

## Contributing (Standards Will Be Maintained)

1. Branch from `develop` — use `feature/*`, `fix/*`, or `chore/*` prefixes
2. Follow the existing code style. Prettier for the frontend (no semicolons, single quotes). Ruff for the backend.
3. Run **all** checks before committing:
   - Frontend: `pnpm lint && pnpm tsc --noEmit && pnpm build`
   - Backend: `ruff check . && mypy src/ && pytest`
4. Write concise commit messages in imperative mood. "Fix auth bug", not "Fixed auth bug" or, heaven forbid, "fixing stuff".
5. One feature or fix per PR. Squash merge into `develop`.

---

*Built during a hackathon by people who probably should have slept more. But the code is clean, the types are strict, and the tests pass. That's what matters.*

*— Darcy-Edward*
