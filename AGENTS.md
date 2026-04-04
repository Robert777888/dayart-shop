# Agent Operating Notes (Project)

## Memory First
- Always update [PROJECT_MEMORY.md](/Users/robertkispal/Documents/projects/AI_TEE_webshop/PROJECT_MEMORY.md) before ending a session.
- Always log an Obsidian session note via `codex-workflow-v1/runtime/session_logger.py`.

## Codex Workflow V1
- Reference docs: `codex-workflow-v1/docs/`.
- The workflow folder stays **untracked** and must not be pushed to GitHub.

## Minimal Runtime Contract
- Use planning for any multi-step work.
- Capture a short critic review before execution.
- Verify before completion (lint/typecheck where relevant).
- Write memory hooks (PROJECT_MEMORY + Obsidian note).

## Dev Defaults
- Dev server: `HOST=127.0.0.1 PORT=4321 npm run dev`
- Never commit secrets. Use `.env.example` as the template.
