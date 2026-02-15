# Handoff: Deploy KB + Licensing Updates to EC2

## Context

We just completed a major update to the backend knowledge base and agent system. The changes integrate two new licensing reference documents (from `Licences/` PDFs) into the RAG pipeline and expand the system to support all 5 Swiss regulatory pathways documented in those PDFs.

**Nothing has been committed or pushed yet.** All changes are local on the `main` branch.

## What Changed

### New Knowledge Base Documents (2 new files in `backend/src/data/regulatory_docs/`)
- `licensing_documentation_requirements.txt` (30KB) — Per-pathway documentation checklists (48-88 items per license type) extracted from the Swiss Financial License Documentation Requirements PDF
- `swiss_licensing_guide.txt` (17KB) — Application processes, timelines, SRO vs FINMA decision guidance, best practices

These get auto-embedded into Qdrant on startup via `seed_regulatory_docs()`. The existing 8 docs are deduplication-safe (content hash check).

### Code Changes (8 modified files + 1 new dependency)

| File | What Changed |
|------|-------------|
| `backend/requirements.txt` | Added `pypdf>=5.0.0` |
| `backend/pyproject.toml` | Added `pypdf>=5.0.0` dep + mypy override |
| `backend/src/services/document_ingestion.py` | PDF parsing via pypdf; seed now globs `*.txt` + `*.pdf` |
| `backend/src/routes/kb.py` | Upload endpoint accepts PDF files |
| `backend/src/models/client.py` | Added `finma_securities` and `finma_payment_systems` pathway literals |
| `backend/src/services/checklist_templates.py` | Expanded from 2 checklists (38 items) to 4 checklists (142 items): SRO (31), FINMA generic (38), Securities Firm (43), Payment Systems (30) |
| `backend/src/services/claude_agent.py` | System prompt + pathway enum updated for 6 pathways |
| `backend/src/services/consultant_agent.py` | System prompt updated to reference expanded KB |
| `backend/src/services/gap_analyzer.py` | Added Securities Firm capital check + Payment Systems systemic importance flag |

### Pre-flight checks already passed locally
- `ruff check .` — clean
- `mypy src/` — clean
- `pytest` — passes

## Deployment Target

- **EC2 Instance:** `i-0bdcad744a86d60c8` (t4g.small, ARM64, Ubuntu 24.04)
- **Elastic IP:** `18.195.13.46`
- **Region:** eu-central-1 (Frankfurt)
- **SSH Key:** `~/.ssh/darcy-hackathon-key.pem`
- **SSH Command:** `ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46`
- **Repo on EC2:** `/home/ubuntu/darcy-hackathon` (currently on branch `backend-deploy`)
- **Docker Compose:** API (port 8000) + Qdrant (internal 6333)
- **Nginx:** Reverse proxy on port 80 → localhost:8000 (SSE-aware config)
- **Systemd:** `darcy-api.service` auto-restarts Docker Compose on reboot
- **API Base URL:** `http://18.195.13.46`

## Deployment Steps

### 1. Commit and push changes locally
```bash
cd /Users/maximgusev/workspace/darcy-hackathon
git add backend/requirements.txt \
        backend/pyproject.toml \
        backend/src/models/client.py \
        backend/src/routes/kb.py \
        backend/src/services/checklist_templates.py \
        backend/src/services/claude_agent.py \
        backend/src/services/consultant_agent.py \
        backend/src/services/document_ingestion.py \
        backend/src/services/gap_analyzer.py \
        backend/src/data/regulatory_docs/licensing_documentation_requirements.txt \
        backend/src/data/regulatory_docs/swiss_licensing_guide.txt
git commit -m "Expand KB with licensing docs, add PDF parsing, new pathways and checklists"
git push origin main
```

### 2. SSH into EC2 and pull
```bash
ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46
cd /home/ubuntu/darcy-hackathon
git checkout main
git pull origin main
```

Note: EC2 was on `backend-deploy` branch. Switch to `main` since that's where we pushed.

### 3. Rebuild and restart Docker containers
```bash
sudo docker compose down
sudo docker compose up -d --build
```

The `--build` flag is critical because:
- `requirements.txt` changed (new `pypdf` dependency)
- New text files need to be in the container's `/app/src/data/regulatory_docs/`

Note: The `docker-compose.yml` mounts `./backend/src/data:/app/src/data` as a volume, so the new text files will also be available via the host mount. But the Docker image still needs rebuilding for the `pypdf` pip install.

### 4. Verify the new docs were indexed
Wait ~30 seconds for startup + embedding, then:
```bash
curl -s http://18.195.13.46/api/kb/documents | python3 -m json.tool
```

You should see 10 documents (8 original + 2 new):
- `licensing_documentation_requirements.txt`
- `swiss_licensing_guide.txt`
- Plus the original 8: amla_switzerland, amlo_finma, finma_banking_license, finma_fintech_license, micar_articles, polyreg_rules, sro_membership_guide, vqf_rules

### 5. Test search with new content
```bash
curl -s -X POST http://18.195.13.46/api/kb/search \
  -H "Content-Type: application/json" \
  -d '{"query": "securities firm documentation requirements FinIA", "top_k": 3}' \
  | python3 -m json.tool
```

Should return chunks from the new `licensing_documentation_requirements.txt`.

### 6. Test PDF upload endpoint
```bash
curl -s -X POST http://18.195.13.46/api/kb/documents \
  -F "file=@/home/ubuntu/darcy-hackathon/Licences/Swiss Licensing Guide.pdf" \
  -F "title=Swiss Licensing Guide (PDF)" \
  | python3 -m json.tool
```

### 7. Verify health
```bash
curl -s http://18.195.13.46/api/health | python3 -m json.tool
```

## Rollback Plan

If something breaks:
```bash
ssh -i ~/.ssh/darcy-hackathon-key.pem ubuntu@18.195.13.46
cd /home/ubuntu/darcy-hackathon
git checkout backend-deploy
sudo docker compose down
sudo docker compose up -d --build
```

This reverts to the previous working deployment on the `backend-deploy` branch.

## Important Notes

- The 2 new text files will be embedded via OpenAI API on first startup (~30KB text = ~60 chunks = ~60 API calls). This costs a few cents and takes ~30 seconds.
- Qdrant deduplication is content-hash based, so re-deploying won't create duplicate embeddings.
- The BM25 corpus is rebuilt from Qdrant on every startup, so it will automatically include the new docs.
- Existing client data in SQLite and Qdrant vectors are preserved across restarts (Docker volumes).
- If Qdrant needs a full re-index (unlikely), delete the `qdrant_storage` volume: `sudo docker volume rm darcy-hackathon_qdrant_storage` and restart.
