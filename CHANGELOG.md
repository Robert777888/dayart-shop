# 📑 AI TEE Webshop Changelog - 2026-03-30

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
