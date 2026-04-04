#!/usr/bin/env bash
set -euo pipefail

VAULT_PATH="${OBSIDIAN_VAULT_PATH:-/Users/robertkispal/Obsidian/AI_memory}"

python codex-workflow-v1/runtime/session_logger.py \
  --vault "${VAULT_PATH}" \
  --root-folder "Codex" \
  "$@"
