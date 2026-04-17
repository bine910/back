#!/usr/bin/env bash
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOG="$REPO_ROOT/scripts/verify-backend-last.log"
mkdir -p "$(dirname "$LOG")"
log() { echo "$(date -Iseconds) $*" | tee -a "$LOG"; }
log "=== verify-backend start ==="
if [[ -f "$REPO_ROOT/docker-compose.yml" ]]; then
  (cd "$REPO_ROOT" && docker compose up -d) 2>&1 | while read -r line; do log "$line"; done || log "docker compose skipped or failed"
else
  log "No docker-compose.yml; skip DB."
fi
if [[ -f "$REPO_ROOT/back/package.json" ]]; then
  (cd "$REPO_ROOT/back" && npm run test) 2>&1 | while read -r line; do log "$line"; done
else
  log "No back/package.json; exit."
fi
log "=== verify-backend end ==="
