# Phase 4 — Frontend UI Components + State Management

> **Cél:** Megépíteni a két oszlopos UI-t (bal: mockup preview, jobb: form), a `useGenerator` hookot, és összes komponenst.
> **Fázisok:** 7 fájl | **Függőség:** Phase 3 kész (types/ létezik)

---

## Task 1 · [CREATE] `public/mockups/tshirt-blank.png`

**Művelet:** Egy fehér/világosszürke pólóról készült mockup képet kell elhelyezni ide.

**Specifikáció:**
- Méret: ~800×1000px (álló formátum)
- Tartalom: egyszerű, „flat" póló fotó vagy illusztráció fehér háttérrel
- Formátum: PNG, fehér háttérrel VAGY átlátszó háttérrel

**Honnan szerezze:** A user biztosítja, VAGY használjon AI generálást az `generate_image` tool-lal a következő prompttal:
```
A flat-lay mockup of a plain white crew-neck t-shirt on a pure white background, 
front view, no wrinkles, centered, studio lighting, no shadows, clean and minimal.
```

**Elvárt eredmény:** A `public/mockups/tshirt-blank.png` fájl létezik és egy kép.

---

## Task 2 · [CREATE] `src/hooks/useGenerator.ts`

**Fájl:** `src/hooks/useGenerator.ts`

```typescript
"use client";

import { useState, useCallback } from "react";
import type { GeneratePayload, GenerateResponse } from "@/types";

export interface GeneratorState {
  occasion: string;
  style: string;
  customText: string;
  designUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE: GeneratorState = {
  occasion: "",
  style: "",
  customText: "",
  designUrl: null,
  isLoading: false,
  error: null,
};

export function useGenerator() {
  const [state, setState] = useState<GeneratorState>(INITIAL_STATE);

  const setOccasion = useCallback((value: string) => {
    setState((prev) => ({ ...prev, occasion: value, error: null }));
  }, []);

  const setStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, style: value, error: null }));
  }, []);

  const setCustomText = useCallback((value: string) => {
    setState((prev) => ({ ...prev, customText: value, error: null }));
  }, []);

  const handleGenerate = useCallback(async () => {
    // Kliens-oldali validáció
    if (!state.occasion || !state.style || !state.customText.trim()) {
      setState((prev) => ({
        ...prev,
        error: "Please fill in all fields before generating.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const payload: GeneratePayload = {
        occasion: state.occasion,
        style: state.style,
        customText: state.customText,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: GenerateResponse = await response.json();

      if (!data.success || !data.designUrl) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.error || "Generation failed. Please try again.",
        }));
        return;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        designUrl: data.designUrl!,
        error: null,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Network error. Please check your connection.",
      }));
    }
  }, [state.occasion, state.style, state.customText]);

  return {
    state,
    setOccasion,
    setStyle,
    setCustomText,
    handleGenerate,
  };
}
```

**KRITIKUS szabályok:**
1. A fájl első sora KÖTELEZŐEN `"use client";` — ez Next.js App Router-ben kötelező kliens komponensekhez.
2. A `handleGenerate` a `state`-ből olvassa az aktuális értékeket, NEM kap paramétereket.
3. A `fetch` hívás relatív URL-t használ (`/api/generate`), nem abszolútat.
4. A `setState` mindig a spread operátort használja (`...prev`), hogy ne töröljük a többi mezőt.

---

## Task 3 · [CREATE] `src/components/OccasionSelect.tsx`

```typescript
"use client";

import { OCCASION_OPTIONS } from "@/types";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function OccasionSelect({ value, onChange }: Props) {
  return (
    <div className="form-group">
      <label htmlFor="occasion-select">Occasion</label>
      <select
        id="occasion-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select an occasion...</option>
        {OCCASION_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## Task 4 · [CREATE] `src/components/StyleSelect.tsx`

```typescript
"use client";

import { STYLE_OPTIONS } from "@/types";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function StyleSelect({ value, onChange }: Props) {
  return (
    <div className="form-group">
      <label htmlFor="style-select">Style</label>
      <select
        id="style-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select a style...</option>
        {STYLE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## Task 5 · [CREATE] `src/components/CustomTextInput.tsx`

```typescript
"use client";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export function CustomTextInput({ value, onChange }: Props) {
  return (
    <div className="form-group">
      <label htmlFor="custom-text-input">Your Text</label>
      <input
        id="custom-text-input"
        type="text"
        placeholder="e.g. Happy Birthday Mom!"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={80}
      />
      <span className="char-count">{value.length}/80</span>
    </div>
  );
}
```

---

## Task 6 · [CREATE] `src/components/GenerateButton.tsx`

```typescript
"use client";

interface Props {
  isLoading: boolean;
  onClick: () => void;
  disabled: boolean;
}

export function GenerateButton({ isLoading, onClick, disabled }: Props) {
  return (
    <button
      id="generate-button"
      className="generate-btn"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <span className="loading-state">
          <span className="spinner" aria-hidden="true" />
          Generating...
        </span>
      ) : (
        "✨ Generate Design"
      )}
    </button>
  );
}
```

**Megjegyzés:** A `disabled` prop `true`, ha valamelyik mező üres. Ezt a szülő komponens számítja ki.

---

## Task 7 · [CREATE] `src/components/MockupPreview.tsx`

```typescript
"use client";

interface Props {
  designUrl: string | null;
  isLoading: boolean;
}

export function MockupPreview({ designUrl, isLoading }: Props) {
  return (
    <div className="mockup-container">
      <div className="mockup-frame">
        {/* Alap póló kép */}
        <img
          src="/mockups/tshirt-blank.png"
          alt="T-shirt mockup"
          className="mockup-base"
        />

        {/* Generált design overlay (csak ha van URL) */}
        {designUrl && (
          <img
            src={designUrl}
            alt="Generated design"
            className="mockup-overlay"
          />
        )}

        {/* Loading állapot */}
        {isLoading && (
          <div className="mockup-loading">
            <div className="pulse-animation" />
            <p>Creating your design...</p>
          </div>
        )}

        {/* Üres állapot (nincs design, nincs loading) */}
        {!designUrl && !isLoading && (
          <div className="mockup-placeholder">
            <p>Your design will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

**FONTOS a CSS-hez (Phase 5-ben lesz implementálva):**
- A `.mockup-container` relatív pozíciójú.
- A `.mockup-base` tölti ki a teljes konténert.
- A `.mockup-overlay` abszolút pozícióval a póló közepére kerül (~35% top, ~25% left, ~50% width).
- A `.mockup-loading` abszolút pozícióval a póló közepére kerül.

---

## Done When (Phase 4 ellenőrzőlista)

- [ ] `public/mockups/tshirt-blank.png` létezik
- [ ] `src/hooks/useGenerator.ts` létezik, `"use client"` a fájl elején
- [ ] `src/components/` mappa tartalmazza: `OccasionSelect.tsx`, `StyleSelect.tsx`, `CustomTextInput.tsx`, `GenerateButton.tsx`, `MockupPreview.tsx`
- [ ] Minden komponens fájl első sora `"use client";`
- [ ] Minden komponens `Props` interface-szel rendelkezik, nincs `any` típus
- [ ] `npm run build` (vagy `npx tsc --noEmit`) hiba nélkül lefut
