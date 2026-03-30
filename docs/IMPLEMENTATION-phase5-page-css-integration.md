# Phase 5 — Page Assembly, CSS & Integration

> **Cél:** Összerakni a főoldalt a komponensekből, megírni a teljes CSS-t, és elhisztelni az egészet.
> **Fázisok:** 3 fájl | **Függőség:** Phase 4 kész (összes komponens létezik)

---

## Task 1 · [MODIFY] `src/app/page.tsx`

**TÖRÖLD** az eredeti `create-next-app` tartalmát. A teljes fájlt cseréld le:

```typescript
"use client";

import { useGenerator } from "@/hooks/useGenerator";
import { MockupPreview } from "@/components/MockupPreview";
import { OccasionSelect } from "@/components/OccasionSelect";
import { StyleSelect } from "@/components/StyleSelect";
import { CustomTextInput } from "@/components/CustomTextInput";
import { GenerateButton } from "@/components/GenerateButton";

export default function HomePage() {
  const { state, setOccasion, setStyle, setCustomText, handleGenerate } =
    useGenerator();

  const isFormComplete =
    state.occasion !== "" && state.style !== "" && state.customText.trim() !== "";

  return (
    <main className="generator-page">
      {/* ─── Bal oszlop: Mockup Preview ─── */}
      <section className="preview-column">
        <MockupPreview
          designUrl={state.designUrl}
          isLoading={state.isLoading}
        />
      </section>

      {/* ─── Jobb oszlop: Control Panel ─── */}
      <section className="controls-column">
        <div className="controls-header">
          <h1>AI T-Shirt Designer</h1>
          <p className="subtitle">
            Create unique DTF-ready designs with AI in seconds.
          </p>
        </div>

        <div className="controls-form">
          <OccasionSelect value={state.occasion} onChange={setOccasion} />
          <StyleSelect value={state.style} onChange={setStyle} />
          <CustomTextInput value={state.customText} onChange={setCustomText} />
        </div>

        {state.error && (
          <div className="error-message" role="alert">
            {state.error}
          </div>
        )}

        <GenerateButton
          isLoading={state.isLoading}
          onClick={handleGenerate}
          disabled={!isFormComplete}
        />
      </section>
    </main>
  );
}
```

**FONTOS:**
- Az `isFormComplete` változó határozza meg, hogy a Generate gomb `disabled` legyen-e.
- Az `error-message` div CSAK akkor renderelődik, ha `state.error` nem null.
- A `role="alert"` attribútum biztosítja az akadálymentességet (screen reader felolvassa).

---

## Task 2 · [MODIFY] `src/app/layout.tsx`

**MÓDOSÍTSD** a meglévő layout.tsx-et. Cseréld le a `metadata` objektumot és a `<body>` tartalmát:

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI T-Shirt Designer | DTF Print-on-Demand",
  description:
    "Create unique DTF-ready t-shirt designs with AI. Choose occasion, style, and add your custom text.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

## Task 3 · [MODIFY] `src/app/globals.css`

**TÖRÖLD** a teljes meglévő globals.css tartalmát és cseréld le az alábbira:

```css
/* ===== RESET & TOKENS ===== */
:root {
  --color-bg: #0a0a0f;
  --color-surface: #141420;
  --color-surface-hover: #1c1c30;
  --color-border: #2a2a40;
  --color-text-primary: #f0f0f5;
  --color-text-secondary: #8888aa;
  --color-accent: #7c5cfc;
  --color-accent-hover: #9b7eff;
  --color-accent-glow: rgba(124, 92, 252, 0.25);
  --color-error: #ff4d6a;
  --color-error-bg: rgba(255, 77, 106, 0.1);
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --font-body: "Inter", system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  background: var(--color-bg);
  color: var(--color-text-primary);
  min-height: 100vh;
}

/* ===== GENERATOR PAGE LAYOUT ===== */

.generator-page {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
  gap: 48px;
  align-items: center;
}

/* ===== LEFT COLUMN: PREVIEW ===== */

.preview-column {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-container {
  width: 100%;
  max-width: 500px;
}

.mockup-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup-base {
  width: 90%;
  height: auto;
  object-fit: contain;
  z-index: 1;
}

.mockup-overlay {
  position: absolute;
  top: 28%;
  left: 28%;
  width: 44%;
  height: auto;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
  animation: fadeIn 0.6s ease-out;
}

.mockup-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 3;
  text-align: center;
  color: var(--color-text-secondary);
}

.mockup-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.pulse-animation {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-accent-glow);
  margin: 0 auto 12px;
  animation: pulse 1.5s ease-in-out infinite;
}

/* ===== RIGHT COLUMN: CONTROLS ===== */

.controls-column {
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 480px;
}

.controls-header h1 {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, var(--color-accent), #e040fb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.controls-header .subtitle {
  margin-top: 8px;
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.controls-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ===== FORM ELEMENTS ===== */

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-secondary);
}

.form-group select,
.form-group input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  font-family: var(--font-body);
  color: var(--color-text-primary);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  appearance: none;
  -webkit-appearance: none;
}

.form-group select:focus,
.form-group input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-accent-glow);
}

.form-group select:hover,
.form-group input:hover {
  border-color: var(--color-surface-hover);
}

.char-count {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  text-align: right;
}

/* ===== GENERATE BUTTON ===== */

.generate-btn {
  width: 100%;
  padding: 16px 24px;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: var(--font-body);
  color: white;
  background: linear-gradient(135deg, var(--color-accent), #e040fb);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  box-shadow: 0 4px 24px var(--color-accent-glow);
}

.generate-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px var(--color-accent-glow);
}

.generate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.generate-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.loading-state {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

/* ===== ERROR MESSAGE ===== */

.error-message {
  padding: 12px 16px;
  background: var(--color-error-bg);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-sm);
  color: var(--color-error);
  font-size: 0.9rem;
}

/* ===== ANIMATIONS ===== */

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* ===== RESPONSIVE (mobil < 768px) ===== */

@media (max-width: 768px) {
  .generator-page {
    grid-template-columns: 1fr;
    padding: 24px 16px;
    gap: 24px;
  }

  .preview-column {
    order: -1; /* Mobilon a preview legyen felül */
  }

  .controls-column {
    max-width: 100%;
  }

  .controls-header h1 {
    font-size: 1.6rem;
  }
}
```

**A CSS-ben a következők KRITIKUSAK:**
1. `.mockup-overlay` pozícionálása: `top: 28%, left: 28%, width: 44%` — ez határozza meg, hogy a generált kép hol jelenik meg a pólón. Ezeket az értékeket később finomhangolhatod a tényleges mockup képed alapján.
2. A sötét color scheme (`--color-bg: #0a0a0f`) — modern, premium megjelenés.
3. A gradient gomb (`linear-gradient(135deg, var(--color-accent), #e040fb)`) — figyelemfelkeltő CTA.
4. A responsive breakpoint (`768px`) — mobilon egyoszlopos layout-ra vált, preview felül.

---

## Done When (Phase 5 ellenőrzőlista)

- [ ] `npm run dev` elindul hiba nélkül
- [ ] `http://localhost:3000` betölt és VIZUÁLISAN megjeleníti:
  - [ ] Sötét háttér
  - [ ] Bal oldalon: póló mockup kép (vagy placeholder szöveg ha a kép hiányzik)
  - [ ] Jobb oldalon: "AI T-Shirt Designer" cím gradient színnel
  - [ ] 2 dropdown (Occasion, Style) működő opciókkal
  - [ ] 1 szöveges input mező karakterszámlálóval
  - [ ] 1 gradient gomb "✨ Generate Design" felirattal
- [ ] A gomb `disabled` (halványabb), amíg nincs minden mező kitöltve
- [ ] Az Occasion dropdown tartalmazza: Birthday, Christmas, Wedding, Graduation, Halloween, Valentine's Day, Custom
- [ ] A Style dropdown tartalmazza: Minimalist, Retro, Streetwear, Cartoon, Abstract, Typography
- [ ] A böngésző konzolban NINCS piros hiba (`F12 → Console`)
- [ ] Mobil nézetben (`F12 → responsive → 375px`) egyoszlopos layout, mockup felül
