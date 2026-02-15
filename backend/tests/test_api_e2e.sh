#!/usr/bin/env bash
# =============================================================================
# Darcy Hackathon Backend — End-to-End API Test Suite
# =============================================================================
# Usage:  ./test_api_e2e.sh [BASE_URL]
# Default BASE_URL: http://18.195.13.46
# =============================================================================
set -euo pipefail

BASE_URL="${1:-http://18.195.13.46}"

# ---------------------------------------------------------------------------
# Colour helpers
# ---------------------------------------------------------------------------
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Colour

PASS_COUNT=0
FAIL_COUNT=0

pass() {
  PASS_COUNT=$((PASS_COUNT + 1))
  echo -e "  ${GREEN}PASS${NC} $1"
}

fail() {
  FAIL_COUNT=$((FAIL_COUNT + 1))
  echo -e "  ${RED}FAIL${NC} $1"
  if [[ -n "${2:-}" ]]; then
    echo -e "       ${RED}Detail: $2${NC}"
  fi
}

section() {
  echo ""
  echo -e "${CYAN}${BOLD}=== $1 ===${NC}"
}

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
# json_field <json_string> <field>  — extract a top-level string/number field
json_field() {
  echo "$1" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d$2)" 2>/dev/null
}

# json_has_field <json_string> <field_path> — check existence (returns 0/1)
json_has_field() {
  echo "$1" | python3 -c "
import sys, json
d = json.load(sys.stdin)
try:
    val = d$2
    sys.exit(0)
except (KeyError, IndexError, TypeError):
    sys.exit(1)
" 2>/dev/null
}

# json_len <json_string> — length of top-level array
json_len() {
  echo "$1" | python3 -c "import sys,json; print(len(json.load(sys.stdin)))" 2>/dev/null
}

# collect_sse <url> <json_body> <timeout_seconds> — collect SSE data: lines
collect_sse() {
  local url="$1" body="$2" timeout_s="${3:-30}"
  curl -sS --max-time "$timeout_s" \
    -X POST "$url" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -d "$body" 2>/dev/null || true
}

# Cleanup tracking
CREATED_CLIENT_IDS=()
UPLOADED_DOC_IDS=()
TEST_DOC_FILE=""

cleanup() {
  section "Cleanup"
  echo "  Cleaning up test data..."

  # Delete uploaded test documents
  for doc_id in "${UPLOADED_DOC_IDS[@]+"${UPLOADED_DOC_IDS[@]}"}"; do
    local resp
    resp=$(curl -sS -X DELETE "${BASE_URL}/api/kb/documents/${doc_id}" 2>/dev/null || true)
    echo "  Deleted doc ${doc_id}: ${resp}"
  done

  # Remove temp file
  if [[ -n "$TEST_DOC_FILE" && -f "$TEST_DOC_FILE" ]]; then
    rm -f "$TEST_DOC_FILE"
    echo "  Removed temp file ${TEST_DOC_FILE}"
  fi

  echo "  Done."
}

trap cleanup EXIT

# =============================================================================
section "1. Health Check"
# =============================================================================
HEALTH_RESP=$(curl -sS -w "\n%{http_code}" "${BASE_URL}/health" 2>/dev/null)
HEALTH_CODE=$(echo "$HEALTH_RESP" | tail -1)
HEALTH_BODY=$(echo "$HEALTH_RESP" | sed '$d')

if [[ "$HEALTH_CODE" == "200" ]]; then
  pass "GET /health returned 200"
else
  fail "GET /health returned $HEALTH_CODE" "$HEALTH_BODY"
fi

HEALTH_STATUS=$(json_field "$HEALTH_BODY" "['status']")
if [[ "$HEALTH_STATUS" == "ok" ]]; then
  pass "Health status is 'ok'"
else
  fail "Health status is '$HEALTH_STATUS', expected 'ok'"
fi

# =============================================================================
section "2. KB: Upload Test Document"
# =============================================================================
# Create a temp file with unique, searchable content
TEST_DOC_FILE="/tmp/darcy_test_doc_$$.txt"
cat > "$TEST_DOC_FILE" <<'DOCEOF'
Blockchain Custody Regulations in Liechtenstein

The Liechtenstein Token and TT Service Provider Act (TVTG), also known as the
Blockchain Act, entered into force on 1 January 2020. It establishes a comprehensive
regulatory framework for token economy service providers.

Key Requirements for Custody Providers:
1. Registration with the Financial Market Authority (FMA) Liechtenstein
2. Minimum capital requirement of CHF 100,000 for TT Key Depositaries
3. Mandatory appointment of a qualified compliance officer
4. Segregated custody of client assets on-chain and off-chain
5. Annual external audit by an FMA-approved auditor

The concept of "TT Key Depositary" covers any entity that holds private keys on
behalf of clients, including hot wallets, cold storage, and multi-signature setups.

Cross-border considerations: Liechtenstein's EEA membership allows passporting of
licensed services into EU/EEA member states under certain conditions.

DARCY_UNIQUE_TEST_STRING_XYZ_2025
DOCEOF

UPLOAD_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/kb/documents" \
  -F "file=@${TEST_DOC_FILE}" \
  -F "title=Blockchain Custody Regs Liechtenstein (TEST)" \
  -F "source=test_e2e_script" \
  2>/dev/null)
UPLOAD_CODE=$(echo "$UPLOAD_RESP" | tail -1)
UPLOAD_BODY=$(echo "$UPLOAD_RESP" | sed '$d')

if [[ "$UPLOAD_CODE" == "200" ]]; then
  pass "POST /api/kb/documents returned 200"
else
  fail "POST /api/kb/documents returned $UPLOAD_CODE" "$UPLOAD_BODY"
fi

UPLOADED_DOC_ID=$(json_field "$UPLOAD_BODY" "['doc_id']" 2>/dev/null || echo "")
UPLOAD_TITLE=$(json_field "$UPLOAD_BODY" "['title']" 2>/dev/null || echo "")
UPLOAD_CHUNKS=$(json_field "$UPLOAD_BODY" "['chunks']" 2>/dev/null || echo "")

if [[ -n "$UPLOADED_DOC_ID" ]]; then
  pass "Upload returned doc_id: ${UPLOADED_DOC_ID}"
  UPLOADED_DOC_IDS+=("$UPLOADED_DOC_ID")
else
  fail "Upload did not return a doc_id" "$UPLOAD_BODY"
fi

if [[ -n "$UPLOAD_TITLE" ]]; then
  pass "Upload title set: '$UPLOAD_TITLE'"
else
  fail "Upload did not return a title" "$UPLOAD_BODY"
fi

if [[ -n "$UPLOAD_CHUNKS" && "$UPLOAD_CHUNKS" -gt 0 ]] 2>/dev/null; then
  pass "Upload created $UPLOAD_CHUNKS chunks"
else
  fail "Upload chunks count unexpected: '$UPLOAD_CHUNKS'"
fi

# =============================================================================
section "3. KB: Verify Document in List"
# =============================================================================
sleep 1  # Brief pause to allow indexing

DOC_LIST_RESP=$(curl -sS -w "\n%{http_code}" "${BASE_URL}/api/kb/documents" 2>/dev/null)
DOC_LIST_CODE=$(echo "$DOC_LIST_RESP" | tail -1)
DOC_LIST_BODY=$(echo "$DOC_LIST_RESP" | sed '$d')

if [[ "$DOC_LIST_CODE" == "200" ]]; then
  pass "GET /api/kb/documents returned 200"
else
  fail "GET /api/kb/documents returned $DOC_LIST_CODE" "$DOC_LIST_BODY"
fi

DOC_LIST_LEN=$(json_len "$DOC_LIST_BODY" 2>/dev/null || echo "0")
if [[ "$DOC_LIST_LEN" -gt 0 ]] 2>/dev/null; then
  pass "Document list has $DOC_LIST_LEN document(s)"
else
  fail "Document list is empty"
fi

# Check that our uploaded doc_id appears in the list
DOC_FOUND=$(echo "$DOC_LIST_BODY" | python3 -c "
import sys, json
docs = json.load(sys.stdin)
found = any(d.get('doc_id') == '$UPLOADED_DOC_ID' for d in docs)
print('yes' if found else 'no')
" 2>/dev/null || echo "no")

if [[ "$DOC_FOUND" == "yes" ]]; then
  pass "Uploaded document '$UPLOADED_DOC_ID' found in list"
else
  fail "Uploaded document '$UPLOADED_DOC_ID' NOT found in document list"
fi

# =============================================================================
section "4. KB: Search for Uploaded Document Content"
# =============================================================================
SEARCH1_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/kb/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "TT Key Depositary Liechtenstein custody private keys", "top_k": 5}' \
  2>/dev/null)
SEARCH1_CODE=$(echo "$SEARCH1_RESP" | tail -1)
SEARCH1_BODY=$(echo "$SEARCH1_RESP" | sed '$d')

if [[ "$SEARCH1_CODE" == "200" ]]; then
  pass "POST /api/kb/search returned 200"
else
  fail "POST /api/kb/search returned $SEARCH1_CODE" "$SEARCH1_BODY"
fi

SEARCH1_LEN=$(json_len "$SEARCH1_BODY" 2>/dev/null || echo "0")
if [[ "$SEARCH1_LEN" -gt 0 ]] 2>/dev/null; then
  pass "Search returned $SEARCH1_LEN result(s)"
else
  fail "Search returned no results"
fi

# Verify our test doc appears in results
SEARCH1_HAS_DOC=$(echo "$SEARCH1_BODY" | python3 -c "
import sys, json
results = json.load(sys.stdin)
found = any(r.get('doc_id') == '$UPLOADED_DOC_ID' for r in results)
print('yes' if found else 'no')
" 2>/dev/null || echo "no")

if [[ "$SEARCH1_HAS_DOC" == "yes" ]]; then
  pass "Search results include our uploaded test document"
else
  fail "Search results do NOT include our uploaded test document"
fi

# Verify result structure
SEARCH1_HAS_FIELDS=$(echo "$SEARCH1_BODY" | python3 -c "
import sys, json
results = json.load(sys.stdin)
if results:
    r = results[0]
    has_all = all(k in r for k in ['text', 'title', 'source', 'doc_id', 'score'])
    print('yes' if has_all else 'no')
else:
    print('no')
" 2>/dev/null || echo "no")

if [[ "$SEARCH1_HAS_FIELDS" == "yes" ]]; then
  pass "Search result has expected fields (text, title, source, doc_id, score)"
else
  fail "Search result missing expected fields"
fi

# =============================================================================
section "5. KB: Search for Pre-Seeded Content"
# =============================================================================
SEARCH2_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/kb/search" \
  -H "Content-Type: application/json" \
  -d '{"query": "SRO membership requirements Switzerland AML", "top_k": 3}' \
  2>/dev/null)
SEARCH2_CODE=$(echo "$SEARCH2_RESP" | tail -1)
SEARCH2_BODY=$(echo "$SEARCH2_RESP" | sed '$d')

if [[ "$SEARCH2_CODE" == "200" ]]; then
  pass "Search for pre-seeded content returned 200"
else
  fail "Search for pre-seeded content returned $SEARCH2_CODE" "$SEARCH2_BODY"
fi

SEARCH2_LEN=$(json_len "$SEARCH2_BODY" 2>/dev/null || echo "0")
if [[ "$SEARCH2_LEN" -gt 0 ]] 2>/dev/null; then
  pass "Pre-seeded search returned $SEARCH2_LEN result(s)"
else
  fail "Pre-seeded search returned no results (expected SRO/AML documents)"
fi

# =============================================================================
section "6. KB: Delete Test Document"
# =============================================================================
if [[ -n "$UPLOADED_DOC_ID" ]]; then
  DEL_RESP=$(curl -sS -w "\n%{http_code}" \
    -X DELETE "${BASE_URL}/api/kb/documents/${UPLOADED_DOC_ID}" \
    2>/dev/null)
  DEL_CODE=$(echo "$DEL_RESP" | tail -1)
  DEL_BODY=$(echo "$DEL_RESP" | sed '$d')

  if [[ "$DEL_CODE" == "200" ]]; then
    pass "DELETE /api/kb/documents/${UPLOADED_DOC_ID} returned 200"
  else
    fail "DELETE returned $DEL_CODE" "$DEL_BODY"
  fi

  DEL_STATUS=$(json_field "$DEL_BODY" "['status']" 2>/dev/null || echo "")
  if [[ "$DEL_STATUS" == "deleted" ]]; then
    pass "Delete response status is 'deleted'"
  else
    fail "Delete response status is '$DEL_STATUS', expected 'deleted'"
  fi

  # Remove from cleanup array since we already deleted it
  UPLOADED_DOC_IDS=()

  # Verify it's gone from the list
  sleep 1
  DOC_LIST2_BODY=$(curl -sS "${BASE_URL}/api/kb/documents" 2>/dev/null)
  DOC_GONE=$(echo "$DOC_LIST2_BODY" | python3 -c "
import sys, json
docs = json.load(sys.stdin)
found = any(d.get('doc_id') == '$UPLOADED_DOC_ID' for d in docs)
print('no' if found else 'yes')
" 2>/dev/null || echo "no")

  if [[ "$DOC_GONE" == "yes" ]]; then
    pass "Deleted document no longer appears in document list"
  else
    fail "Deleted document still appears in document list"
  fi
else
  fail "Skipping delete — no doc_id from upload"
fi

# =============================================================================
section "7. Client: Create via Onboard/Start"
# =============================================================================
ONBOARD_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/onboard/start" \
  -H "Content-Type: application/json" \
  2>/dev/null)
ONBOARD_CODE=$(echo "$ONBOARD_RESP" | tail -1)
ONBOARD_BODY=$(echo "$ONBOARD_RESP" | sed '$d')

if [[ "$ONBOARD_CODE" == "200" ]]; then
  pass "POST /api/onboard/start returned 200"
else
  fail "POST /api/onboard/start returned $ONBOARD_CODE" "$ONBOARD_BODY"
fi

CLIENT_ID=$(json_field "$ONBOARD_BODY" "['client_id']" 2>/dev/null || echo "")
if [[ -n "$CLIENT_ID" && "$CLIENT_ID" != "None" ]]; then
  pass "Onboard returned client_id: ${CLIENT_ID}"
  CREATED_CLIENT_IDS+=("$CLIENT_ID")
else
  fail "Onboard did not return a client_id" "$ONBOARD_BODY"
  # Create a fallback client so remaining tests can proceed
  CLIENT_ID=""
fi

# =============================================================================
section "8. Client: Chat with Onboarding Agent (SSE)"
# =============================================================================
if [[ -n "$CLIENT_ID" ]]; then
  echo "  Sending onboarding message (SSE stream, 60s timeout)..."

  SSE_RAW=$(collect_sse \
    "${BASE_URL}/api/onboard/chat" \
    "{\"client_id\": \"${CLIENT_ID}\", \"message\": \"We are CryptoVault AG, a Swiss GmbH based in Zug. We want to offer crypto custody and brokerage services for institutional clients. We handle client assets and fiat currency. We already have an AML officer who is Swiss-resident.\"}" \
    60)

  # SSE responses have "data: ..." lines
  SSE_DATA_LINES=$(echo "$SSE_RAW" | grep -c "^data:" 2>/dev/null || echo "0")
  SSE_TEXT=$(echo "$SSE_RAW" | grep "^data:" | sed 's/^data: *//' | tr -d '\n')

  if [[ "$SSE_DATA_LINES" -gt 0 ]]; then
    pass "Onboard chat SSE stream received $SSE_DATA_LINES data event(s)"
  else
    fail "Onboard chat SSE stream received no data events" "Raw: $(echo "$SSE_RAW" | head -5)"
  fi

  if [[ ${#SSE_TEXT} -gt 10 ]]; then
    pass "Onboard chat response has substantive text (${#SSE_TEXT} chars)"
  else
    fail "Onboard chat response text too short (${#SSE_TEXT} chars)"
  fi
else
  fail "Skipping onboard chat — no client_id"
fi

# =============================================================================
section "9. Client: Verify Client Data Updated by Agent"
# =============================================================================
if [[ -n "$CLIENT_ID" ]]; then
  sleep 2  # Allow agent to finish writing client data

  CLIENT_RESP=$(curl -sS -w "\n%{http_code}" \
    "${BASE_URL}/api/clients/${CLIENT_ID}" \
    2>/dev/null)
  CLIENT_CODE=$(echo "$CLIENT_RESP" | tail -1)
  CLIENT_BODY=$(echo "$CLIENT_RESP" | sed '$d')

  if [[ "$CLIENT_CODE" == "200" ]]; then
    pass "GET /api/clients/${CLIENT_ID} returned 200"
  else
    fail "GET /api/clients/${CLIENT_ID} returned $CLIENT_CODE" "$CLIENT_BODY"
  fi

  # Verify the response has the expected Client model structure
  CLIENT_HAS_FIELDS=$(echo "$CLIENT_BODY" | python3 -c "
import sys, json
c = json.load(sys.stdin)
required = ['id', 'company_name', 'status', 'created_at', 'updated_at', 'checklist', 'flags']
has_all = all(k in c for k in required)
print('yes' if has_all else 'no')
" 2>/dev/null || echo "no")

  if [[ "$CLIENT_HAS_FIELDS" == "yes" ]]; then
    pass "Client record has expected fields (id, company_name, status, checklist, flags, etc.)"
  else
    fail "Client record missing expected fields" "$CLIENT_BODY"
  fi

  # Check if the agent updated some fields from our onboarding message
  AGENT_UPDATED=$(echo "$CLIENT_BODY" | python3 -c "
import sys, json
c = json.load(sys.stdin)
# The agent should have picked up at least some info from our message
updates = []
if c.get('company_name'):
    updates.append('company_name=' + c['company_name'])
if c.get('business_description'):
    updates.append('business_description set')
if c.get('legal_structure'):
    updates.append('legal_structure=' + str(c['legal_structure']))
if c.get('establishment_canton'):
    updates.append('canton=' + str(c['establishment_canton']))
if c.get('services') and len(c['services']) > 0:
    updates.append('services=' + ','.join(c['services']))
if c.get('has_aml_officer') is True:
    updates.append('has_aml_officer=True')
print('; '.join(updates) if updates else 'none')
" 2>/dev/null || echo "error")

  if [[ "$AGENT_UPDATED" != "none" && "$AGENT_UPDATED" != "error" ]]; then
    pass "Agent updated client fields: $AGENT_UPDATED"
  else
    fail "Agent did not appear to update any client fields from onboarding message"
  fi

  # Check conversation history was saved
  CONV_LEN=$(echo "$CLIENT_BODY" | python3 -c "
import sys, json
c = json.load(sys.stdin)
print(len(c.get('conversation_history', [])))
" 2>/dev/null || echo "0")

  if [[ "$CONV_LEN" -gt 0 ]] 2>/dev/null; then
    pass "Conversation history has $CONV_LEN entries"
  else
    fail "Conversation history is empty after onboarding chat"
  fi
else
  fail "Skipping client verification — no client_id"
fi

# =============================================================================
section "10. Client: Manually Update Client Fields via PATCH"
# =============================================================================
if [[ -n "$CLIENT_ID" ]]; then
  PATCH_RESP=$(curl -sS -w "\n%{http_code}" \
    -X PATCH "${BASE_URL}/api/clients/${CLIENT_ID}" \
    -H "Content-Type: application/json" \
    -d '{
      "company_name": "CryptoVault AG (E2E Test)",
      "legal_structure": "GmbH",
      "establishment_canton": "ZG",
      "has_swiss_office": true,
      "has_swiss_director": true,
      "handles_fiat": true,
      "handles_client_assets": true,
      "minimum_capital_chf": 300000,
      "existing_capital_chf": 500000,
      "has_aml_officer": true,
      "aml_officer_swiss_resident": true,
      "has_external_auditor": false,
      "has_aml_kyc_policies": true
    }' \
    2>/dev/null)
  PATCH_CODE=$(echo "$PATCH_RESP" | tail -1)
  PATCH_BODY=$(echo "$PATCH_RESP" | sed '$d')

  if [[ "$PATCH_CODE" == "200" ]]; then
    pass "PATCH /api/clients/${CLIENT_ID} returned 200"
  else
    fail "PATCH /api/clients/${CLIENT_ID} returned $PATCH_CODE" "$PATCH_BODY"
  fi

  # Verify the patched fields
  PATCH_CHECK=$(echo "$PATCH_BODY" | python3 -c "
import sys, json
c = json.load(sys.stdin)
checks = []
if c.get('company_name') == 'CryptoVault AG (E2E Test)':
    checks.append('company_name')
if c.get('legal_structure') == 'GmbH':
    checks.append('legal_structure')
if c.get('establishment_canton') == 'ZG':
    checks.append('canton')
if c.get('has_swiss_office') is True:
    checks.append('has_swiss_office')
if c.get('handles_fiat') is True:
    checks.append('handles_fiat')
if c.get('minimum_capital_chf') == 300000:
    checks.append('minimum_capital_chf')
if c.get('has_aml_kyc_policies') is True:
    checks.append('has_aml_kyc_policies')
print(','.join(checks))
" 2>/dev/null || echo "")

  PATCH_FIELD_COUNT=$(echo "$PATCH_CHECK" | tr ',' '\n' | grep -c . 2>/dev/null || echo "0")
  if [[ "$PATCH_FIELD_COUNT" -ge 5 ]] 2>/dev/null; then
    pass "PATCH updated fields correctly ($PATCH_FIELD_COUNT/7 verified: $PATCH_CHECK)"
  else
    fail "PATCH field verification: only $PATCH_FIELD_COUNT/7 matched ($PATCH_CHECK)"
  fi
else
  fail "Skipping PATCH — no client_id"
fi

# =============================================================================
section "11. Client: List All Clients"
# =============================================================================
LIST_RESP=$(curl -sS -w "\n%{http_code}" \
  "${BASE_URL}/api/clients" \
  2>/dev/null)
LIST_CODE=$(echo "$LIST_RESP" | tail -1)
LIST_BODY=$(echo "$LIST_RESP" | sed '$d')

if [[ "$LIST_CODE" == "200" ]]; then
  pass "GET /api/clients returned 200"
else
  fail "GET /api/clients returned $LIST_CODE" "$LIST_BODY"
fi

LIST_LEN=$(json_len "$LIST_BODY" 2>/dev/null || echo "0")
if [[ "$LIST_LEN" -gt 0 ]] 2>/dev/null; then
  pass "Client list has $LIST_LEN client(s)"
else
  fail "Client list is empty"
fi

# Check our client appears
if [[ -n "$CLIENT_ID" ]]; then
  CLIENT_IN_LIST=$(echo "$LIST_BODY" | python3 -c "
import sys, json
clients = json.load(sys.stdin)
found = any(c.get('id') == '$CLIENT_ID' for c in clients)
print('yes' if found else 'no')
" 2>/dev/null || echo "no")

  if [[ "$CLIENT_IN_LIST" == "yes" ]]; then
    pass "Our client '${CLIENT_ID}' found in client list"
  else
    fail "Our client '${CLIENT_ID}' NOT found in client list"
  fi

  # Check list item structure
  LIST_ITEM_FIELDS=$(echo "$LIST_BODY" | python3 -c "
import sys, json
clients = json.load(sys.stdin)
if clients:
    c = clients[0]
    required = ['id', 'company_name', 'status', 'created_at', 'updated_at']
    has_all = all(k in c for k in required)
    print('yes' if has_all else 'no')
else:
    print('no')
" 2>/dev/null || echo "no")

  if [[ "$LIST_ITEM_FIELDS" == "yes" ]]; then
    pass "Client list items have expected fields (id, company_name, status, etc.)"
  else
    fail "Client list items missing expected fields"
  fi
fi

# =============================================================================
section "12. Consultant: Chat Without Client Context (SSE)"
# =============================================================================
echo "  Sending consultant query without client context (60s timeout)..."

CONSULT_RAW=$(collect_sse \
  "${BASE_URL}/api/consult/chat" \
  '{"message": "What are the key differences between SRO membership and a FINMA fintech license in Switzerland? Which has lower capital requirements?"}' \
  60)

CONSULT_DATA_LINES=$(echo "$CONSULT_RAW" | grep -c "^data:" 2>/dev/null || echo "0")
CONSULT_TEXT=$(echo "$CONSULT_RAW" | grep "^data:" | sed 's/^data: *//' | tr -d '\n')

if [[ "$CONSULT_DATA_LINES" -gt 0 ]]; then
  pass "Consultant chat (no client) SSE received $CONSULT_DATA_LINES data event(s)"
else
  fail "Consultant chat (no client) SSE received no data events" "Raw: $(echo "$CONSULT_RAW" | head -5)"
fi

if [[ ${#CONSULT_TEXT} -gt 20 ]]; then
  pass "Consultant chat (no client) returned substantive text (${#CONSULT_TEXT} chars)"
else
  fail "Consultant chat (no client) text too short (${#CONSULT_TEXT} chars)"
fi

# =============================================================================
section "13. Consultant: Chat With Client Context (SSE)"
# =============================================================================
if [[ -n "$CLIENT_ID" ]]; then
  echo "  Sending consultant query with client context (60s timeout)..."

  CONSULT2_RAW=$(collect_sse \
    "${BASE_URL}/api/consult/chat" \
    "{\"client_id\": \"${CLIENT_ID}\", \"message\": \"Based on this client profile, which regulatory pathway do you recommend and why? What are the main gaps?\"}" \
    60)

  CONSULT2_DATA_LINES=$(echo "$CONSULT2_RAW" | grep -c "^data:" 2>/dev/null || echo "0")
  CONSULT2_TEXT=$(echo "$CONSULT2_RAW" | grep "^data:" | sed 's/^data: *//' | tr -d '\n')

  if [[ "$CONSULT2_DATA_LINES" -gt 0 ]]; then
    pass "Consultant chat (with client) SSE received $CONSULT2_DATA_LINES data event(s)"
  else
    fail "Consultant chat (with client) SSE received no data events" "Raw: $(echo "$CONSULT2_RAW" | head -5)"
  fi

  if [[ ${#CONSULT2_TEXT} -gt 20 ]]; then
    pass "Consultant chat (with client) returned substantive text (${#CONSULT2_TEXT} chars)"
  else
    fail "Consultant chat (with client) text too short (${#CONSULT2_TEXT} chars)"
  fi
else
  fail "Skipping consultant+client chat — no client_id"
fi

# =============================================================================
section "14. Consultant: Gap Analysis"
# =============================================================================
if [[ -n "$CLIENT_ID" ]]; then
  GAP_RESP=$(curl -sS -w "\n%{http_code}" \
    -X POST "${BASE_URL}/api/consult/analyze-gaps/${CLIENT_ID}" \
    -H "Content-Type: application/json" \
    2>/dev/null)
  GAP_CODE=$(echo "$GAP_RESP" | tail -1)
  GAP_BODY=$(echo "$GAP_RESP" | sed '$d')

  if [[ "$GAP_CODE" == "200" ]]; then
    pass "POST /api/consult/analyze-gaps/${CLIENT_ID} returned 200"
  else
    fail "POST /api/consult/analyze-gaps returned $GAP_CODE" "$GAP_BODY"
  fi

  # Verify GapAnalysis structure
  GAP_FIELDS=$(echo "$GAP_BODY" | python3 -c "
import sys, json
g = json.load(sys.stdin)
required = ['client_id', 'pathway', 'readiness_score', 'total_items', 'completed_items', 'gaps', 'next_steps', 'critical_blockers']
has_all = all(k in g for k in required)
print('yes' if has_all else 'no')
" 2>/dev/null || echo "no")

  if [[ "$GAP_FIELDS" == "yes" ]]; then
    pass "Gap analysis has all expected fields (client_id, pathway, readiness_score, gaps, next_steps, etc.)"
  else
    fail "Gap analysis missing expected fields" "$GAP_BODY"
  fi

  # Check readiness_score is a float between 0 and 1
  GAP_SCORE=$(echo "$GAP_BODY" | python3 -c "
import sys, json
g = json.load(sys.stdin)
score = g.get('readiness_score', -1)
print('valid' if 0 <= score <= 1 else 'invalid:' + str(score))
" 2>/dev/null || echo "error")

  if [[ "$GAP_SCORE" == "valid" ]]; then
    pass "Readiness score is valid (between 0 and 1)"
  else
    fail "Readiness score issue: $GAP_SCORE"
  fi

  # Check that gaps is a list with Gap objects
  GAP_ITEMS=$(echo "$GAP_BODY" | python3 -c "
import sys, json
g = json.load(sys.stdin)
gaps = g.get('gaps', [])
count = len(gaps)
if count > 0:
    g0 = gaps[0]
    fields = all(k in g0 for k in ['category', 'field_or_item', 'description', 'severity'])
    print(f'{count} gaps, fields_ok={fields}')
else:
    print('0 gaps')
" 2>/dev/null || echo "error")

  if echo "$GAP_ITEMS" | grep -q "fields_ok=True"; then
    pass "Gap analysis contains gaps with correct structure: $GAP_ITEMS"
  elif echo "$GAP_ITEMS" | grep -q "0 gaps"; then
    pass "Gap analysis returned 0 gaps (client may be fully populated)"
  else
    fail "Gap analysis gaps structure issue: $GAP_ITEMS"
  fi
else
  fail "Skipping gap analysis — no client_id"
fi

# =============================================================================
section "15. Consultant: Next Steps"
# =============================================================================
if [[ -n "$CLIENT_ID" ]]; then
  NEXT_RESP=$(curl -sS -w "\n%{http_code}" \
    -X POST "${BASE_URL}/api/consult/next-steps/${CLIENT_ID}" \
    -H "Content-Type: application/json" \
    2>/dev/null)
  NEXT_CODE=$(echo "$NEXT_RESP" | tail -1)
  NEXT_BODY=$(echo "$NEXT_RESP" | sed '$d')

  if [[ "$NEXT_CODE" == "200" ]]; then
    pass "POST /api/consult/next-steps/${CLIENT_ID} returned 200"
  else
    fail "POST /api/consult/next-steps returned $NEXT_CODE" "$NEXT_BODY"
  fi

  # Verify NextStepsResponse structure
  NEXT_FIELDS=$(echo "$NEXT_BODY" | python3 -c "
import sys, json
n = json.load(sys.stdin)
required = ['client_id', 'pathway', 'next_steps', 'critical_blockers']
has_all = all(k in n for k in required)
print('yes' if has_all else 'no')
" 2>/dev/null || echo "no")

  if [[ "$NEXT_FIELDS" == "yes" ]]; then
    pass "Next steps response has expected fields (client_id, pathway, next_steps, critical_blockers)"
  else
    fail "Next steps response missing expected fields" "$NEXT_BODY"
  fi

  # Check the client_id matches
  NEXT_CLIENT_ID=$(json_field "$NEXT_BODY" "['client_id']" 2>/dev/null || echo "")
  if [[ "$NEXT_CLIENT_ID" == "$CLIENT_ID" ]]; then
    pass "Next steps client_id matches our client"
  else
    fail "Next steps client_id mismatch: expected '$CLIENT_ID', got '$NEXT_CLIENT_ID'"
  fi

  # Check next_steps structure
  NEXT_ITEMS=$(echo "$NEXT_BODY" | python3 -c "
import sys, json
n = json.load(sys.stdin)
steps = n.get('next_steps', [])
count = len(steps)
if count > 0:
    s0 = steps[0]
    fields = all(k in s0 for k in ['priority', 'action', 'category'])
    print(f'{count} steps, fields_ok={fields}')
else:
    print('0 steps')
" 2>/dev/null || echo "error")

  if echo "$NEXT_ITEMS" | grep -q "fields_ok=True"; then
    pass "Next steps contains items with correct structure: $NEXT_ITEMS"
  elif echo "$NEXT_ITEMS" | grep -q "0 steps"; then
    pass "Next steps returned 0 items (client may be fully prepared)"
  else
    fail "Next steps structure issue: $NEXT_ITEMS"
  fi

  # Check pathway is set
  NEXT_PATHWAY=$(json_field "$NEXT_BODY" "['pathway']" 2>/dev/null || echo "")
  if [[ -n "$NEXT_PATHWAY" && "$NEXT_PATHWAY" != "None" ]]; then
    pass "Next steps pathway: '$NEXT_PATHWAY'"
  else
    fail "Next steps pathway is empty"
  fi
else
  fail "Skipping next steps — no client_id"
fi

# =============================================================================
# Additional: Client creation via POST /api/clients (direct CRUD)
# =============================================================================
section "Bonus: Direct Client Creation via POST /api/clients"

DIRECT_CLIENT_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/clients" \
  -H "Content-Type: application/json" \
  -d '{
    "company_name": "DirectTest GmbH",
    "legal_structure": "GmbH",
    "establishment_canton": "ZH",
    "services": ["exchange", "wallet"],
    "pathway": "sro"
  }' \
  2>/dev/null)
DIRECT_CODE=$(echo "$DIRECT_CLIENT_RESP" | tail -1)
DIRECT_BODY=$(echo "$DIRECT_CLIENT_RESP" | sed '$d')

if [[ "$DIRECT_CODE" == "200" ]]; then
  pass "POST /api/clients returned 200"
else
  fail "POST /api/clients returned $DIRECT_CODE" "$DIRECT_BODY"
fi

DIRECT_ID=$(json_field "$DIRECT_BODY" "['id']" 2>/dev/null || echo "")
DIRECT_NAME=$(json_field "$DIRECT_BODY" "['company_name']" 2>/dev/null || echo "")

if [[ -n "$DIRECT_ID" && "$DIRECT_ID" != "None" ]]; then
  pass "Direct client created with id: $DIRECT_ID"
  CREATED_CLIENT_IDS+=("$DIRECT_ID")
else
  fail "Direct client creation did not return an id"
fi

if [[ "$DIRECT_NAME" == "DirectTest GmbH" ]]; then
  pass "Direct client company_name matches: '$DIRECT_NAME'"
else
  fail "Direct client company_name mismatch: expected 'DirectTest GmbH', got '$DIRECT_NAME'"
fi

# Verify the direct client has the fields we set
DIRECT_CHECK=$(echo "$DIRECT_BODY" | python3 -c "
import sys, json
c = json.load(sys.stdin)
checks = []
if c.get('legal_structure') == 'GmbH': checks.append('legal_structure')
if c.get('establishment_canton') == 'ZH': checks.append('canton')
if 'exchange' in c.get('services', []): checks.append('services')
if c.get('pathway') == 'sro': checks.append('pathway')
print(','.join(checks))
" 2>/dev/null || echo "")

DIRECT_FIELD_COUNT=$(echo "$DIRECT_CHECK" | tr ',' '\n' | grep -c . 2>/dev/null || echo "0")
if [[ "$DIRECT_FIELD_COUNT" -ge 3 ]] 2>/dev/null; then
  pass "Direct client fields set correctly ($DIRECT_FIELD_COUNT/4 verified: $DIRECT_CHECK)"
else
  fail "Direct client fields: only $DIRECT_FIELD_COUNT/4 matched ($DIRECT_CHECK)"
fi

# =============================================================================
section "Bonus: Error Handling Tests"
# =============================================================================

# 404 for nonexistent client
ERR_RESP=$(curl -sS -w "\n%{http_code}" \
  "${BASE_URL}/api/clients/nonexistent-uuid-00000" 2>/dev/null)
ERR_CODE=$(echo "$ERR_RESP" | tail -1)

if [[ "$ERR_CODE" == "404" ]]; then
  pass "GET nonexistent client returns 404"
else
  fail "GET nonexistent client returned $ERR_CODE, expected 404"
fi

# 404 for gap analysis on nonexistent client
ERR2_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/consult/analyze-gaps/nonexistent-uuid-00000" \
  -H "Content-Type: application/json" 2>/dev/null)
ERR2_CODE=$(echo "$ERR2_RESP" | tail -1)

if [[ "$ERR2_CODE" == "404" ]]; then
  pass "Gap analysis on nonexistent client returns 404"
else
  fail "Gap analysis on nonexistent client returned $ERR2_CODE, expected 404"
fi

# 422 for malformed search request (missing required field)
ERR3_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/kb/search" \
  -H "Content-Type: application/json" \
  -d '{}' 2>/dev/null)
ERR3_CODE=$(echo "$ERR3_RESP" | tail -1)

if [[ "$ERR3_CODE" == "422" ]]; then
  pass "KB search with missing 'query' returns 422"
else
  fail "KB search with missing 'query' returned $ERR3_CODE, expected 422"
fi

# 404 for onboard chat with nonexistent client
ERR4_RESP=$(curl -sS -w "\n%{http_code}" \
  -X POST "${BASE_URL}/api/onboard/chat" \
  -H "Content-Type: application/json" \
  -d '{"client_id": "nonexistent-uuid-00000", "message": "hello"}' 2>/dev/null)
ERR4_CODE=$(echo "$ERR4_RESP" | tail -1)

if [[ "$ERR4_CODE" == "404" ]]; then
  pass "Onboard chat with nonexistent client returns 404"
else
  fail "Onboard chat with nonexistent client returned $ERR4_CODE, expected 404"
fi

# =============================================================================
# Summary
# =============================================================================
echo ""
echo -e "${BOLD}=====================================================${NC}"
TOTAL=$((PASS_COUNT + FAIL_COUNT))
echo -e "${BOLD} Test Summary: ${GREEN}${PASS_COUNT} passed${NC}, ${RED}${FAIL_COUNT} failed${NC} out of ${TOTAL} total${NC}"
echo -e "${BOLD}=====================================================${NC}"

if [[ "$FAIL_COUNT" -gt 0 ]]; then
  exit 1
else
  echo -e "${GREEN}All tests passed!${NC}"
  exit 0
fi
