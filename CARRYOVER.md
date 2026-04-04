# 📝 Session Handoff - 2026-04-03 (Stitch Visual Refactor + MCP Setup)

## 2026-04-04 CODEX SKILL IMPROVEMENT CYCLE
- Reviewed the last 24 hours of notes under `/Users/robertkispal/Obsidian/AI_memory/Codex`.
- Only one real session note existed, so there was not enough evidence for broad skill refactors or shared-library proposals.
- The concrete defect found was a policy/runtime mismatch: the session log showed `## Critic Review` as `None recorded` even though `codex-workflow-v1/registry/policies.json` already requires critic coverage.
- `codex-workflow-v1/runtime/session_logger.py` now blocks writes that omit `--critic` when `require_critic_before_execution` is true.
- The session logger also has a new `--dry-run` mode for safe previewing of the rendered note before writing to the vault.
- `codex-workflow-v1/docs/lifecycle.md`, `codex-workflow-v1/docs/automation-codex-skill-self-improvement-cycle.md`, and `codex-workflow-v1/README.md` were updated so the runtime contract and evidence threshold are explicit.
- Writing back into `/Users/robertkispal/Obsidian/AI_memory/Codex` is currently blocked in this automation context, so the session note and distilled knowledge refresh need either a writable vault path or a rerun with broader write access.
- Immediate next follow-up: rerun the logger and distiller against the canonical Codex vault once write access is available, then check whether the next 24-hour review surfaces real failure notes instead of just policy gaps.

## ✅ Latest Changes (2026-04-03, follow-up)
- Added shared UI tokens for soft borders, card shadows, and interactive transitions, then reused them across hero/wizard buttons and cards to reduce CSS duplication.
- Extracted the wizard step titles/subtitles and phase labels into `src/components/designer/wizardCopy.ts`.
- Simplified `useGenerator` with step clamping and a single update helper for cleaner state management.
- Added Stitch-aligned intro panels to the designer, shop, and checkout pages so the main commerce flows share one editorial layout language.
- Reworked the footer to remove dead links and keep only live routes plus support contact details.
- Added shared page intro chips and checkout summary cards to make the site feel more cohesive and less fragmented.
- Switched the designer preview t-shirt base to the premium PNG mockups and re-centered the print overlay for a more realistic placement.
- Updated the home hero to use the premium t-shirt photo and added a warm frame treatment to reduce the flat SVG look.
- Added a stricter Gemini client guard so missing `GEMINI_API_KEY` fails fast with a clear error.
- Added a local `.tmp/integration_smoke.js` script and copied `.env.local.bak` to `.env.local` for live service checks.
- Cloudinary upload smoke test succeeded with current credentials.
- Supabase REST endpoint is reachable; anon key returns 401, service role returns 200 (connectivity ok, anon key likely invalid or revoked).
- `/api/generate` now returns a clear "missing Gemini key" error and shows the actual Gemini error message in dev mode.
- Live Gemini test failed with `403 PERMISSION_DENIED` and the provider message `Your API key was reported as leaked. Please use another API key.`
- The generate route now classifies leaked Gemini keys explicitly and tells the user to rotate the key.
- The refreshed Gemini key now passes the full Gemini -> Cloudinary -> Supabase flow end-to-end.
- The landing hero now uses a darker studio-style frame with the black tee as the default visual to avoid the oversized white mockup look.
- The designer now starts with an explicit product selector for tee/sweatshirt and black/white before the generation steps.
- Style option values were normalized to lowercase keys and the Gemini prompt map was aligned to those keys.
- The designer wizard steps were extracted into `src/components/designer/steps.tsx` for cleaner organization.

## ✅ Latest Changes (2026-04-03)
- Added an upload pipeline (`/api/upload`) with Cloudinary background removal + safe fallback upload.
- Added an AI vs. upload toggle to the designer wizard and wired it to the new upload API.
- Replaced mockups with higher-fidelity SVG t-shirt/sweatshirt assets (black/white) and updated hero + featured visuals.
- Switched hero and preview SVG rendering to plain `<img>` tags to avoid Next Image quirks that can show a white block.
- Added automatic day/night theming using the local hour, plus mobile layout refinements so the hero stays visible on phones.
- Tuned the palette toward a warmer, more Stitch-like editorial feel by replacing neon magenta gradients with a softer terracotta accent.
- Pulled in the Stitch reference zip and mapped the design language: paper-light day mode, deep charcoal night mode, cyan pulse accents, glassmorphism, big editorial spacing, bottom action bar behavior, and mobile-first shell treatment.
- Added a local Stitch MCP server entry to `~/.codex/config.toml` so the Codex app can use Stitch after a session restart.

## ✅ Current State
- The active GitHub repo is now `arturwssystem-glitch/dayart-shop`.
- The previous `arturwssystem-glitch/ai-tee-webshop` repo was deleted and replaced with the new name.
- Local `origin` points to `https://github.com/arturwssystem-glitch/dayart-shop.git`.
- `main` is pushed and clean at commit `87a9c39`.
- The working tree currently includes in-progress local edits for the Stitch-inspired visual refactor, new mockup assets, and the upload flow.
- `~/.codex/config.toml` now includes `[mcp_servers.stitch]` pointing to `https://stitch.googleapis.com/mcp`.
- The Stitch config was added locally, but the Codex app may need a restart/new session before the new MCP server appears in the toolset.

## ✅ What Was Validated
- `npm run lint` passed.
- `npx tsc --noEmit` passed.
- `python agent/skills/lint-and-validate/scripts/lint_runner.py .` passed (no ESLint warnings).
- `npm run build` previously failed only because `next/font` tried to fetch Google Fonts in a network-restricted environment.
- Browser screenshot verification could not complete in this environment because Playwright Chromium hit a macOS permission error (`bootstrap_check_in ... Permission denied`).

## ✅ What Was Mapped
- Next.js 14 App Router webshop with routes for home, designer, shop, shipping, checkout, and `/api/generate`.
- Shared cart flow across `ShopGrid`, product pages, drawer, and checkout.
- AI pipeline through `useGenerator` -> API route -> Gemini -> Cloudinary -> Supabase.
- Current design language is split by time of day.
- Day mode is light, paper-like, editorial, and airy.
- Night mode is deep charcoal with cyan glow accents.
- The designer page is the main area still being aligned to the Stitch reference rhythm.
- The footer originally contained dead routes; those were replaced with live navigation and support links.

## ⚠️ Notes For Next Session
- Keep comments minimal in runtime code so the Vercel build stays clean and maintainable.
- `CARRYOVER.md` should remain the authoritative session state summary.
- If needed, the next cleanup pass should focus on removing noisy comments and keeping only essential explanations.
- Do not commit `.tmp/`; it contains extracted reference material and should stay disposable.
- If the Stitch MCP does not show up immediately, restart Codex or open a new session.
- The API key used for the Stitch MCP was configured locally in `~/.codex/config.toml`; rotate it if you want a fresh credential boundary.

## 🚨 CRITICAL RULES
- **Visual Aesthetic**: The app MUST use the "Threads & Ink" premium cream/beige theme (`#FDFCF7` backgrounds).
- **Mockup Fidelity**: Use ONLY the high-resolution premium mockups from `public/mockups/` (white/black).
- **Blend Modes**: Designs on white apparel MUST use `mix-blend-mode: multiply` for realism.
- **Port Management**: The development server MUST run on port `4321`.

## 🏗️ SYSTEM ARCHITECTURE
- **Mockup Engine**: Dynamic `MockupPreview` supporting color-specific assets and realistic compositing.
- **Branding**: "Threads & Ink" logo and typography (✧).
- **CI/CD**: Linked to GitHub repository `arturwssystem-glitch/dayart-shop`.

## 🗺️ CURRENT STATE MAP
### ✅ Complete
- **Premium Mockups**: Studio-lit white/black t-shirt bases generated and integrated.
- **Threads & Ink Overhaul**: Complete CSS/UI transformation to a high-end beige aesthetic.
- **GitHub Sync**: Pushed the entire production codebase with a valid PAT.
- **Global Skill**: Promoted `premium-mockup-generator` to the global Antigravity library.
- **Day/Night Theme**: Automatic theme switching by local hour is in place.
- **Mobile Pass**: Hero, nav, cards, wizard, and checkout responsive work is underway and partially landed.
- **Stitch MCP**: Local MCP config has been added and is ready after restart.

### 🛠️ In Progress / Next Steps
- **Designer Refactor**: Continue tightening the spacing and hierarchy on the designer page after the new intro panel landed.
- **Home Refactor**: Continue the editorial light-mode pass so the hero and product sections feel closer to the reference.
- **Checkout Polish**: Continue refining the shipping/payment forms after the new intro and summary card landed.
- **Credit System**: Implementation of the lead-magnet strategy.
- **MCP Restart**: Restart Codex or reopen the session to expose the new Stitch MCP server in tools.

## 🧠 KEY REVISIONS & WHY-LOG
- **Aesthetic Shift**: Switched from "Glassmorphism Dark" to "Threads & Ink Light" based on user inspiration to elevate perceived value.
- **Mockup Realism**: Refined the overlay logic to include blend modes, solving the "pasted-on sticker" look.
- **Premium Consistency**: Aligned the designer preview and hero with the premium photo mockups so the first impression matches the product cards.
- **Fail-Fast Config**: Missing Gemini key now surfaces immediately instead of returning a misleading “overloaded” message.
- **Compromised Key**: The active Gemini key is rejected by Google as leaked, so the root fix is key rotation, not code changes.
- **End-to-End Green**: After key rotation, the full generation pipeline completed successfully and wrote a new Supabase row.
- **Landing Clarity**: The opening hero no longer leads with a distracting white mockup, and the designer asks for the base product up front.
- **Style Consistency**: UI style selections now map cleanly to Gemini prompt styles without casing mismatch.
- **Wizard Split**: The main wizard component is slimmer and each step is now isolated for easier iteration.
- **Stitch Reference**: The imported reference shows a split personality.
- **Light mode**: white/paper surfaces, soft shadows, rounded cards, lots of negative space.
- **Dark mode**: deep charcoal canvas, cyan accent glow, glass panels, and a fixed bottom action bar.
- The current implementation should continue following that structure rather than drifting back to purple/magenta accents.

## 🧩 WORK-IN-PROGRESS FILES
- `.tmp/` contains extracted Stitch reference assets and should remain disposable.
- `public/mockups/` now contains the new SVG apparel bases used by the home page and designer preview.
- `src/app/api/upload/` is the new upload endpoint for customer artwork handling.
- `src/components/ThemeSync.tsx` applies the time-based theme in the browser.
- `~/.codex/config.toml` includes the Stitch MCP server entry and is local-only.

## 🔐 SECURITY / OPS
- The Stitch MCP API key was written to the local Codex config.
- The next session should rotate that key if a fresh credential boundary is desired.
- The Vercel and Cloudinary keys should remain out of chat and only live in env config.
- The repo is currently dirty because of the active refactor and extracted assets; that is expected.

## 🔥 DAILY SKILL REVIEW (Verified 2026-03-30)
- **Promoted**: `premium-mockup-generator` (Global).
- **Verified**: `app-builder`, `frontend-design`, `react-best-practices`.

## 🚀 IMMEDIATE NEXT STEP
1. Restart Codex or open a new session so the Stitch MCP server becomes available.
2. Run `PORT=4321 npm run dev`.
3. Open `http://localhost:3000/` and `http://localhost:3000/designer` on desktop and mobile widths.
4. Compare the home and designer layouts against the imported Stitch references.
5. Verify the Vercel build status on the GitHub repo.

## 2026-04-04 CODEX WORKFLOW V1
- Added a new workspace folder at `codex-workflow-v1/` as a concrete executable design derived from the repo `AGENTS.md` philosophy.
- The design now includes an explicit Obsidian memory layer so each completed session can be exported as structured Markdown instead of remaining only in transient chat context.
- `codex-workflow-v1/runtime/session_logger.py` writes frontmatter-based session notes into an Obsidian vault using `--vault` or `OBSIDIAN_VAULT_PATH`.
- `codex-workflow-v1/docs/obsidian-memory.md` defines the recommended vault structure, the difference between raw session logs and distilled knowledge, and the minimum fields required for later analysis.
- `codex-workflow-v1/docs/osszefoglalo-hu.md` is the single detailed Hungarian overview document that explains the system as a Codex workflow layer rather than a separate agent.
- The router prototype now exposes `session_log_profile` and `obsidian_logging_required` so memory becomes part of workflow selection rather than an optional afterthought.
- Verification confirmed both the route selection and an end-to-end sample note write into `/tmp/obsidian-vault`.
- Added a second-stage distillation design so raw session logs can later be promoted into reusable decisions, failures, patterns, and project facts.
- Verified the distiller against the temp vault and confirmed generated project, decision, pattern, and index notes are being created.
- The canonical shared knowledge directory is now `/Users/robertkispal/Obsidian/AI_memory/Codex`.
- That central Codex directory has been initialized with `Sessions`, `Projects/Generated`, `Decisions/Generated`, `Patterns/Generated`, `Failures/Generated`, `Indexes/Generated`, `Workflows`, and `Skills`.
- A starter session note, generated index, generated project note, generated decision notes, generated workflow pattern note, and the Hungarian overview note have already been written there.
- The local `codex-workflow-v1` policies now default to that central directory, so future session logging and distillation can target it directly.
- Existing upstream shared libraries were discovered at `/Users/robertkispal/Obsidian/AI_memory/Antigravity/SKILLS` and `/Users/robertkispal/Obsidian/AI_memory/Antigravity/WORKFLOWS`.
- Those Antigravity directories should be treated as reference-only shared libraries, while `/Users/robertkispal/Obsidian/AI_memory/Codex` remains the read-write active memory and generated knowledge target.
- `codex-workflow-v1/registry/knowledge_sources.json` now records this split explicitly so the workflow system has a canonical map of where to read and where to write.
- Added two clearly named automation-oriented skills to the local Codex workflow layer:
- `codex-skill-self-improvement-cycle`
- `developer-alignment-and-agents-memory-sync`
- Added local documentation for both automations plus `codex-workflow-v1/registry/automation_recipes.json`.
- Copied the new automation notes into the central Codex knowledge directory under `Skills/` and `Workflows/` so they are visible from the shared Obsidian hub.
- Added human-facing dashboard notes to `/Users/robertkispal/Obsidian/AI_memory/Codex/Indexes`:
- `01-Codex-Start-Here.md`
- `02-Codex-Command-Center.md`
- `03-Shared-References.md`
- `04-Automation-Control-Center.md`
- `05-Developer-Alignment-Preferences.md`
- Corrected the dashboard link strategy so internal links work when the `Codex` directory itself is opened as the vault root.
- Moved the misfiled `proposal-session-logger-single-timestamp.md` note into `Decisions/Generated` as `decision-session-logger-single-timestamp.md`.
- The central `Codex/Workflows/Generated` folder is now empty again, which keeps workflow notes reserved for actual workflow references rather than proposal artifacts.
