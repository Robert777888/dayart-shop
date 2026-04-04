# PROJECT MEMORY (AI_TEE_webshop)

## Goal
This file is the single place to resume work in a new window or session.

## Quick Start
- Read this file end-to-end.
- Check git status and decide whether to keep the pending deletions.
- Run dev server: `HOST=127.0.0.1 PORT=4321 npm run dev`.
- Open: `http://localhost:3000/` and `http://localhost:3000/designer`.

## Memory Priority (2026-04-04)
- This project treats memory as a first-class requirement.
- Always update this file and write an Obsidian session note before ending work.
- The Obsidian note is the authoritative long-term thread; this file is the local quick resume.

## Memory Protocol (Always Do)
1. Update `PROJECT_MEMORY.md` with the latest state and next steps.
2. Write an Obsidian session note via `codex-workflow-v1/runtime/session_logger.py`.
3. Keep `codex-workflow-v1/` untracked unless explicitly requested.

## Current State (2026-04-04)
- The repo is a Next.js App Router webshop with AI design generation.
- The latest pushed commit is `e203094` (refactor wizard copy and UI tokens).
- Core memory hook files were restored (`AGENTS.md`, `CARRYOVER.md`, `CHANGELOG.md`, `ENVIRONMENT_VARS.txt`, `SKILL_INDEX.md`).
- A canonical `.agent/` scaffold and root-level `directives/` and `execution/` placeholders now exist.
- The `codex-workflow-v1/` folder is present locally but should remain untracked.
- The `agent/` folder exists; `.agent/` scaffold is present but not yet populated with real directives or execution scripts.
- Architecture direction clarified: separate raw generation, processed design, mockup assets, selection, and order workflows; Cloudinary for media processing, Supabase for business data, Vercel for app deploy.
- Agent-ready spec drafted with concrete data model, pipeline, endpoints, screens, and state machine (awaiting decisions on raw storage, print provider, and background removal method).
- Implemented pipeline foundations: Cloudinary raw + processed uploads, Supabase asset/generation saves, and schema updates in `supabase_schema.sql`.
- Verified UI flow in dev server via Playwright: wizard steps 1–5 work; `/api/generate` completes but can take ~59s (generation phase visible in UI).
- The central alignment note now captures `session logger` and the raw-to-generated memory loop.
- Project `AGENTS.md` edits remain centralized until the pattern is clearly stable and low-risk.

## Current Git Status (Summary)
- Modified: `.gitignore`, `AGENTS.md`, `CARRYOVER.md`, `CHANGELOG.md`, `ENVIRONMENT_VARS.txt`, `SKILL_INDEX.md`, `PROJECT_MEMORY.md`.
- Added: `.agent/` scaffold, `directives/`, `execution/`.
- Not yet committed/pushed.

## Core Flows
- Landing: `/` (hero + featured products + CTA).
- Designer: `/designer` (wizard + live mockup preview).
- Shop: `/shop` (product list, cart drawer).
- Checkout: `/checkout` (shipping and payment steps).
- API: `/api/generate` (Gemini -> Cloudinary -> Supabase).
- API: `/api/upload` (Cloudinary upload for user assets).

## AI Generation Pipeline
- `useGenerator` in [useGenerator.ts](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/hooks/useGenerator.ts) drives the wizard state.
- `/api/generate` receives the payload and calls Gemini for image output.
- The resulting image is uploaded to Cloudinary.
- The final URL and metadata are written to Supabase.
- Error handling differentiates missing or leaked Gemini keys.

## Designer Wizard
- Main container: [DesignWizard.tsx](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/components/DesignWizard.tsx)
- Step components: [steps.tsx](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/components/designer/steps.tsx)
- Wizard copy: [wizardCopy.ts](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/components/designer/wizardCopy.ts)
- The flow is 6 steps: product choice -> occasion/recipient -> motif -> content type -> style -> size/cart.

## Mockup System
- Premium mockups live in `public/mockups/`.
- The preview uses `mix-blend-mode: multiply` for white apparel.
- The designer preview is in [MockupPreview.tsx](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/components/MockupPreview.tsx).

## Design System Notes
- Theme tokens are defined in [globals.css](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/app/globals.css).
- Single beige-only theme (no dark mode), warm bronze accent, premium cream surfaces.
- Theme toggle removed from the navbar; ThemeProvider forced to light mode.

## Environment Variables
- See `.env.example` for required keys and names.
- Required groups: Gemini, Cloudinary, Supabase, Krea.
- Never commit `.env.local`.

## Validation
- Lint: `npm run lint` (2026-04-04)
- Typecheck: `npx tsc --noEmit`

## Deployment
- GitHub remote: `https://github.com/Robert777888/dayart-shop`
- Vercel is wired to GitHub; deployments are triggered on push to `main`.
 - Use Git-based deploys only (no direct Vercel CLI deploy).

## Codex Workflow (Local)
- Reference docs: `codex-workflow-v1/docs/`.
- Canonical structure recommended: `.agent/`, `directives/`, `execution/`, `memory/`.
- Current repo does not include `.agent/` or `directives/` or `execution/`.
- Use Obsidian session logging for long-term memory.

## Obsidian Session Notes
- Base path: `/Users/robertkispal/Obsidian/AI_memory`
- Codex folder: `/Users/robertkispal/Obsidian/AI_memory/Codex`
- Environment: set `OBSIDIAN_VAULT_PATH=/Users/robertkispal/Obsidian/AI_memory`
- Recommended logger: `bash execution/session_logger.sh ...`
- Latest session note: `/Users/robertkispal/Obsidian/AI_memory/Codex/Sessions/2026/04/2026-04-04_131025-session-vilagos-bezs-premium-tema-az-egesz-webshopon-sot.md`
- Canonical vault write was sandbox-blocked this run; fallback session note and distilled notes were written to `.tmp/obsidian-vault/Codex/...`.

## Immediate Next Steps
- Review beige theme on `/`, `/shop`, `/shop/[id]`, `/designer`, `/checkout`, `/shipping` and flag any layout tweaks.
- Keep `codex-workflow-v1/` untracked unless you explicitly want it in GitHub.
- Commit and push after approval.
- Translate the latest architecture/spec into concrete Supabase schema migrations and API endpoints.
- Align `/api/generate` and upload flow with the new asset pipeline (raw -> processed -> mockup -> selection -> order).
- Confirm open decisions (raw storage location, background removal approach, print provider timing) and then implement schema migrations + API updates.
- Apply updated `supabase_schema.sql` in Supabase SQL Editor to create new tables + RLS policies.
- Add `mockup` + `selection` endpoints, then wire UI to use selection/cart/order IDs.
- Investigate generation latency and add UX timeout/feedback; confirm Gemini/Cloudinary/Supabase envs in local dev.
- Regenerate distilled Codex knowledge after the next Obsidian session note write so the generated memory stays in sync.
