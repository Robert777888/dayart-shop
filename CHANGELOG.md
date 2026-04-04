# 📑 AI TEE Webshop Changelog - 2026-03-30

## 2026-04-04
### Changed
- Tightened `codex-workflow-v1/runtime/session_logger.py` so it now refuses to write a session note without at least one `--critic` entry when policy requires critic coverage.
- Added a `--dry-run` mode to the session logger so workflow-memory writes can be previewed safely before touching the Obsidian vault.
- Updated the Codex workflow docs to state that critic review is a hard runtime contract for the self-improvement cycle, not just a prose guideline.

### Validation
- `python /Users/robertkispal/Documents/projects/AI_TEE_webshop/codex-workflow-v1/runtime/session_logger.py --request "Review the workflow runtime" --summary "Captured a runtime-policy mismatch and patched it" --workflow codex_skill_self_improvement_cycle --workspace /Users/robertkispal/Documents/projects/AI_TEE_webshop --status success --skill codex-skill-self-improvement-cycle --dry-run` fails with the expected missing-critic error.
- `python /Users/robertkispal/Documents/projects/AI_TEE_webshop/codex-workflow-v1/runtime/session_logger.py --request "Review the workflow runtime" --summary "Captured a runtime-policy mismatch and patched it" --workflow codex_skill_self_improvement_cycle --workspace /Users/robertkispal/Documents/projects/AI_TEE_webshop --status success --skill codex-skill-self-improvement-cycle --critic "The runtime allowed empty critic review despite policy requiring it." --dry-run` renders a valid note.

## 2026-04-03
### Changed
- Added shared UI tokens for soft borders, card shadows, and interactive transitions in `globals.css`, then applied them across hero, wizard, and key buttons/cards to reduce duplication.
- Extracted wizard step titles/subtitles and phase labels into `src/components/designer/wizardCopy.ts` to keep the main component slim.
- Simplified `useGenerator` with helper functions for payload building, step clamping, and state updates.

### Validation
- `npx tsc --noEmit`
- `python agent/skills/lint-and-validate/scripts/lint_runner.py .`

## 2026-04-03
### Changed
- Redesigned the landing hero to use a darker studio-style showcase and swapped the default visual to the black premium tee so the opening frame is no longer dominated by a white mockup.
- Added a first-step product selector to the designer wizard so users choose shirt vs. sweatshirt and black vs. white before generating.
- Reworked the designer wizard into a six-step flow with product choice, design setup, generation, and a separate post-generation size/cart step.
- Normalized style option values to lowercase keys and aligned Gemini style mappings to those values.
 - Refactored the designer wizard by extracting each step into `src/components/designer/steps.tsx` to simplify the main component.

### Validation
- `npx tsc --noEmit`

## 2026-04-03
### Changed
- Verified the refreshed Gemini key by running the full Gemini -> Cloudinary -> Supabase flow successfully.

### Validation
- Direct Gemini generation succeeded.
- Cloudinary upload succeeded.
- Supabase insert succeeded and returned a new `designs` row id.

## 2026-04-03
### Changed
- Replaced the designer preview t-shirt base with premium PNG mockups and tightened the print-area placement for a more realistic fit.
- Switched the home hero mockup to the premium t-shirt photo and added a warm photo frame treatment so the asset blends with the light editorial background.
- Added a stricter Gemini client guard that throws a clear error when `GEMINI_API_KEY` is missing.
 - Added a local integration smoke test script for Cloudinary + Supabase connectivity.
 - Improved `/api/generate` error handling to distinguish missing Gemini keys and to surface detailed errors in development.
 - Classified leaked Gemini API keys explicitly so the UI can ask for rotation instead of showing a generic overload message.

### Why
- The previous SVG bases made the preview and hero feel flat compared to the Stitch-inspired reference and the premium product cards.

### Validation
- Visual pass only (no automated tests run).
- Environment presence check (Cloudinary + Gemini keys).
 - Cloudinary upload smoke test passed.
 - Supabase REST reachable with service role; anon key returned 401.

## 2026-04-03
### Changed
- Added Stitch-aligned page intro panels to the designer, shop, and checkout screens so the main flows share a more editorial rhythm.
- Cleaned up the footer to remove dead links and replace them with live routes and support contact details.
- Added shared glass-style intro cards, trust chips, and checkout summary styling to better match the current visual direction.

### Fixed
- Removed duplicated footer destinations that pointed to non-existent pages.

### Validation
- `npm run lint`
- `npx tsc --noEmit`

## 2026-04-03
### Added
- Added an upload flow for customer artwork with Cloudinary background removal and a safe fallback upload.
- Built high-fidelity SVG mockups (t-shirt + sweatshirt, black/white) with fabric texture, depth shading, and studio-style lighting.

### Changed
- Updated the designer wizard to include AI vs. upload mode selection and wired it to the new upload API.
- Swapped hero and featured visuals to the new mockups and aligned the preview with sweatshirt placement.
- Clarified Gemini logging to “Nano Banana 1” while keeping the Gemini 3.1 Flash Image Preview model.
- Replaced SVG mockup rendering in the hero and preview with plain `<img>` elements to avoid Next Image/SVG rendering glitches.
- Added automatic day/night theming so the site renders light during the day and dark at night.
- Improved mobile layout behavior for the hero, navigation, product cards, and wizard actions.
- Shifted the palette away from neon magenta toward a warmer Stitch-like editorial accent and added a softer paper-style background wash.
- Added a detailed session handoff and local Stitch MCP configuration so the next session can resume the refactor cleanly.

### Notes
- Background removal uses Cloudinary add-on if enabled; otherwise it falls back automatically to standard upload.

## 2026-04-03

### Added
- Reset the GitHub target from `ai-tee-webshop` to a new repository named `dayart-shop`.
- Updated the session handoff state so the next window can continue from the new repo and remote configuration.

### Changed
- Moved the active local `origin` to `https://github.com/arturwssystem-glitch/dayart-shop.git`.

### Notes
- The current main branch is pushed to the new repository and the working tree is clean.

## 2026-04-03

### Added
- Completed a full repository mapping of the live webshop architecture, including routes, state flow, data layer, and documentation drift.
- Verified `npm run lint` and `npx tsc --noEmit` on the current codebase.

### Fixed
- Documented that `npm run build` currently fails in offline environments because `src/app/layout.tsx` fetches `Plus Jakarta Sans` from Google Fonts at build time.

### Notes
- The live implementation has diverged from the phase docs and now uses a richer wizard flow in the designer, plus a broader product/cart/checkout experience.

## ✅ Accomplishments
- **🛠️ Krea API v1 Fix**: Corrected Krea.ai endpoint from `https://api.krea.ai` to `https://api.krea.ai/v1` to resolve 404 errors.
- **🛡️ Gemini Image Recovery**: Corrected the `generateContent` call structure; the system now successfully generates images using `gemini-3.1-flash-image-preview` (Nano Banana 2).
- **🕵️‍♂️ Ghost Mode Branding**: Completely removed all AI-related mentions, model names (Nano Banana, Gemini), and provider badges from the UI.
- **🔍 Smart Zoom Feature**: Implemented an interactive 6x magnification lens on the mockup preview for quality inspection.
- **🇭🇺 localization**: Hungarian branding for the entire design process, including headers and error messages.
- **🧠 Obsidian Sync**: Integrated project status, pricing details, and architectural decisions into the central `Antygravity_memory` vault.
- **✨ Design Wizard**: Replaced the static generator form with a premium, 4-step guided wizard (Glassmorphism UI).
- **📝 Content Differentiation**: Added "Text only", "Graphic + Text", and "Graphic only" modes to fine-tune the generative design.
- **🛡️ DTF Printing constraints**: Updated Prompt Builder with strict constraints (min 2pt line thickness, min 14pt text) to ensure printability on physical garments.
- **⬇️ Download Flow**: Added a direct "Design letöltése" (Download) button to the Mockup Preview for immediate user access to generated PNGs.
- **💎 Loyalty Roadmap**: Defined the credit-based monetization model (2 free/Guest → 5 bonus/Member → Credits for purchases).
- **🧠 Obsidian Sync (V2)**: Successfully mapped the entire project structure and the new business logic into the centralized vault.

## 2026-04-04

### Added
- Created `codex-workflow-v1/` as a concrete system blueprint for turning `AGENTS.md` from prose policy into a deterministic Codex workflow design.
- Added `codex-workflow-v1/runtime/session_logger.py`, a standard-library prototype that writes Obsidian-compatible session notes with YAML frontmatter.
- Added `codex-workflow-v1/docs/obsidian-memory.md` describing how to build long-term analyzable memory from session notes and later distillation passes.
- Added `codex-workflow-v1/registry/memory_profiles.json` so workflows can declare which session note format they require.
- Added `codex-workflow-v1/runtime/distiller.py` and the distillation registry/docs layer so raw session logs can be promoted into generated knowledge notes.
- Added `codex-workflow-v1/docs/osszefoglalo-hu.md`, a single detailed Hungarian overview document for the full system.
- Initialized the shared Obsidian knowledge directory at `/Users/robertkispal/Obsidian/AI_memory/Codex` with the base memory folders plus the first generated notes.
- Added `codex-workflow-v1/registry/knowledge_sources.json` to map the active Codex vault and the upstream Antigravity skill/workflow libraries.
- Added two new clearly named automation skill definitions and docs:
- `codex-skill-self-improvement-cycle`
- `developer-alignment-and-agents-memory-sync`
- Added `codex-workflow-v1/registry/automation_recipes.json` to describe the recurring maintenance and personalization automations.
- Copied the automation notes into `/Users/robertkispal/Obsidian/AI_memory/Codex/Skills` and `/Users/robertkispal/Obsidian/AI_memory/Codex/Workflows`.
- Added four human-readable dashboard notes to `/Users/robertkispal/Obsidian/AI_memory/Codex/Indexes` to make the central knowledge base easier to navigate.
- Added `05-Developer-Alignment-Preferences.md` to the `Codex/Indexes` entry points for personalization guidance.

### Changed
- Extended the runtime manifests so workflows now declare `obsidian_session_note` memory hooks and a `session_log_profile`.
- Renamed the system from `agent-runtime-v1` to `codex-workflow-v1` to make it explicit that this is a workflow layer around Codex, not a separate agent.
- Updated the router prototype to expose memory logging requirements as part of the route decision.
- Tightened the router keyword and complexity heuristics after verification surfaced a false positive frontend classification for an architecture request.
- Updated the Obsidian policy defaults so the Codex workflow system now points at `/Users/robertkispal/Obsidian/AI_memory/Codex` as its canonical knowledge directory.
- Documented the recommended role split where `Codex` is the active memory target and `Antigravity` is the shared upstream library for reusable skills and workflows.
- Switched the new automation concepts to more descriptive names so their role is obvious in both the registry and the central knowledge vault.
- Refined the dashboard notes so their internal links work with the `Codex` directory opened directly as a vault root.
- Moved the session logger timestamp proposal out of `Codex/Workflows/Generated` and into `Codex/Decisions/Generated` so the vault layout matches the note intent.

### Verified
- Ran `python codex-workflow-v1/runtime/router.py "Design an agent runtime with Obsidian session memory"`.
- Ran `python codex-workflow-v1/runtime/session_logger.py ... --vault /tmp/obsidian-vault` and confirmed the note was written successfully.
- Ran `python codex-workflow-v1/runtime/distiller.py --vault /tmp/obsidian-vault` and confirmed generated project, decision, pattern, and index notes were created.
- Wrote the first real session note and generated notes into `/Users/robertkispal/Obsidian/AI_memory/Codex` and confirmed the generated index resolved with the expected relative Obsidian links.
- Validated the updated automation registry JSON files with `python -m json.tool`.
- Verified the published dashboard notes in the central Codex `Indexes/` folder after correcting the link paths.
- Confirmed that `Codex/Workflows/Generated` no longer contains the misplaced proposal note after the move.
