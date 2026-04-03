# 📑 AI TEE Webshop Changelog - 2026-03-30

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
