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
- Template Studio vertical slice shipped on 2026-04-06 as a parallel flow to the existing AI generator.
- New route `/templates` provides guided, slot-based personalization with 3 active templates:
  - `vintage_year_badge`
  - `pet_name_emblem`
  - `family_birth_garden`
- Added deterministic SVG composer in [composer.ts](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/lib/templates/composer.ts) to generate print-ready vector artwork from form payloads (no prompt-to-image delay).
- Added template metadata catalog in [templateCatalog.ts](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/data/templateCatalog.ts), including 10 template ideas with active/coming-soon states.
- Added backend endpoint [route.ts](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/app/api/templates/compose/route.ts) to compose SVG, optionally upload raw/processed SVG assets to Cloudinary, and persist generation metadata in Supabase.
- Cloudinary helper now includes SVG upload utilities in [cloudinary.ts](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/lib/cloudinary.ts) (`uploadRawSvgAsset`, `uploadProcessedSvgAsset`).
- Added Template Studio UI component [TemplateStudio.tsx](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/components/TemplateStudio.tsx) with:
  - template picker
  - dynamic per-template forms
  - live apparel preview
  - cart integration compatible with existing mockup/selection/cart APIs when `processedAssetId` exists
- Added `/templates` navigation entry in [Navbar.tsx](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/components/Navbar.tsx).
- Added dedicated Template Studio styling in [globals.css](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/app/globals.css).
- Verification completed on 2026-04-06:
  - `npm run lint` ✅
  - `npx tsc --noEmit` ✅
- Template hardening pass completed on 2026-04-06:
  - auto-fit text sizing and letter-spacing guardrails added in template composer for long user inputs
  - year bounds clamped (`1900..2100`)
  - strict API-side payload validation added per template before compose
  - normalized payload is persisted to generation prompt metadata for traceability
- Verification after hardening:
  - `npm run lint` ✅
  - `npx tsc --noEmit` ✅
- Feasibility review completed on 2026-04-06 for `/Users/robertkispal/Downloads/implementation_plan.md` against the live repo state.
- Conclusion: the proposed modular SVG slot-based direction is feasible on the current stack, but the current implementation is still prompt-to-image (Gemini raster output) rather than template-slot SVG composition.
- Existing strengths confirmed: multi-step wizard UI, generate/mockup/selection/cart/checkout API flow, Cloudinary integration, Supabase persistence, and lint-clean baseline.
- Key gap confirmed: missing template catalog, slot schema, SVG composition engine (with text-to-path), and deterministic print-ready export pipeline.
- Recommended rollout path captured: hybrid mode first (template-first + optional AI fallback), then staged migration to deterministic SVG-only best-seller templates.
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
- Added selection/cart/checkout APIs and Supabase helpers; wizard now saves selections + cart items (best-effort) and checkout writes orders + order items.
- Added mockup endpoint and Cloudinary overlay URL generation (uses optional mockup base public IDs).
- Wrote an Obsidian project summary note: /Users/robertkispal/Obsidian/AI_memory/Codex/Projects/Generated/project-ai-tee-webshop.md
- The central alignment note now captures `session logger` and the raw-to-generated memory loop.
- Project `AGENTS.md` edits remain centralized until the pattern is clearly stable and low-risk.
- The 2026-04-05 alignment sync rechecked recent notes, reinforced the concise/direct/action-first preference, and kept AGENTS edits centralized instead of promoting a repo-local change.
- The latest alignment pass again found no new recurring clarification loop; the writable `.tmp` vault mirror remains the fallback when the canonical Obsidian vault cannot be written from this sandbox.
- The 2026-04-06 alignment pass again found no new recurring clarification loop, and the mirror now captures the one-timestamp session-log invariant as stable shorthand.
- The canonical Obsidian vault sync completed from the mirror after an elevated copy step.
- The latest session note is `/Users/robertkispal/Obsidian/AI_memory/Codex/Sessions/2026/04/2026-04-06_091355-session-developer-alignment-and-agents-memory-sync.md`.
- The self-improvement workflow now treats one-off latency or stall reports as memory-worthy when the session names the slow step and impact.
- The distiller now surfaces `Observed Friction` in workflow pattern notes when sessions mention slow, stalled, or timeout-prone steps.
- The session logger now samples one timezone-aware timestamp per note so the frontmatter `created` field, note id, and filename stay aligned.
- The latest self-improvement run wrote its session note and regenerated distillation in the writable `.tmp/obsidian-vault` mirror because the canonical Obsidian vault is still sandbox-blocked.
- The canonical Obsidian vault at `/Users/robertkispal/Obsidian/AI_memory/Codex` remains the long-term target, but this sandbox still needs the writable `.tmp/obsidian-vault` mirror for session-note and distillation writes.
- UX tuning (2026-04-05): the designer mockup print area was enlarged so generated art appears visibly bigger on apparel previews (`tshirt`: 54%, `sweatshirt`: 56% print-area width in `MockupPreview`).
- UX tuning (2026-04-05): generation now shows live customer feedback in the preview (phase timeline, elapsed seconds, progress bar, rotating status hint) instead of a passive spinner-only state.
- Generation phase flow in `useGenerator` now advances through `prompting -> generating -> polishing -> uploading` with timed state shifts while async generation is running, then clears timers safely on completion/error.
- Cloudinary background removal is now explicitly disabled in the processed upload path due severe output quality regressions; `uploadProcessedAsset` performs plain upload only.
- API persistence in `/api/generate` and `/api/upload` now stores processed assets with `status: "processed"` (no longer tagging normal flow as `fallback` when background removal is intentionally off).
- Commit `fb5f951` was pushed to `origin/main` on 2026-04-05, so Vercel auto-deploy can build the latest UX + Cloudinary fixes from GitHub.

## Current Git Status (Summary)
- Modified: `.gitignore`, `AGENTS.md`, `CARRYOVER.md`, `CHANGELOG.md`, `ENVIRONMENT_VARS.txt`, `SKILL_INDEX.md`, `PROJECT_MEMORY.md`.
- Added: `.agent/` scaffold, `directives/`, `execution/`.
- Not yet committed/pushed.
- The repo-local workflow docs are the safe source of truth for the latest Codex memory changes until the canonical Obsidian vault is writable again.
- The writable mirror has been refreshed for this run; the canonical Obsidian vault remains the long-term target when writes are available.

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
- Lint: `npm run lint` (2026-04-05) ✅
- Build + TS validation: `npm run build` (2026-04-05) ✅

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
- Latest session note: `/Users/robertkispal/Obsidian/AI_memory/Codex/Sessions/2026/04/2026-04-05_162738-session-pushold-a-friss-jav-t-sokat-githubra-hogy-a-verc.md`
- If canonical vault writes are blocked in a future run, use the writable `.tmp/obsidian-vault/Codex/...` fallback to preserve memory continuity.

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
- Consider mockup endpoint for Cloudinary overlays if/when base mockups are uploaded.
- Upload base mockup images to Cloudinary and set `CLOUDINARY_MOCKUP_*_PUBLIC_ID` in `.env.local` to enable overlay previews.
- Regenerate distilled Codex knowledge after the next Obsidian session note write so the generated memory stays in sync.
- If canonical Obsidian writes are blocked again, use the writable `.tmp/obsidian-vault` mirror so the session-note/distillation contract still completes, then resync when permission is available.
- Keep future AGENTS guidance proposals centralized unless the same rule repeats in another project.
- Keep the single-timestamp logger invariant in future session logger changes.
- If the canonical Codex vault stays blocked, use the `.tmp/obsidian-vault` fallback for the session note and distillation run.
