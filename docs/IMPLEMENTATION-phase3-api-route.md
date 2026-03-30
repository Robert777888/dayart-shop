# Phase 3 — API Route (The Relay Race)

> **Cél:** Az `/api/generate` Next.js API route megírása, ami összeköti a 3 lib modult egyetlen pipeline-ba.
> **Fázisok:** 2 fájl | **Függőség:** Phase 2 kész (lib/ modulok léteznek)

---

## Task 1 · [CREATE] `src/types/index.ts`

**Fájl:** `src/types/index.ts`

```typescript
// ===== API Payload és Response típusok =====

/** A frontend ezt küldi a POST /api/generate-nek */
export interface GeneratePayload {
  occasion: string;
  style: string;
  customText: string;
}

/** Az API route ezt adja vissza a frontendnek */
export interface GenerateResponse {
  success: boolean;
  designUrl?: string;
  designId?: string;
  error?: string;
}

// ===== UI Opciók (az Occasion és Style dropdownokhoz) =====

export const OCCASION_OPTIONS = [
  "Birthday",
  "Christmas",
  "Wedding",
  "Graduation",
  "Halloween",
  "Valentine's Day",
  "Custom",
] as const;

export const STYLE_OPTIONS = [
  "Minimalist",
  "Retro",
  "Streetwear",
  "Cartoon",
  "Abstract",
  "Typography",
] as const;

export type OccasionOption = (typeof OCCASION_OPTIONS)[number];
export type StyleOption = (typeof STYLE_OPTIONS)[number];
```

**Ellenőrzés:**
- A `OCCASION_OPTIONS` és `STYLE_OPTIONS` `as const` tömb legyen, NEM sima `string[]`.
- A `GeneratePayload` és `GenerateResponse` interfacek pontosan ezekkel a mezőkkel rendelkezzenek.

---

## Task 2 · [CREATE] `src/app/api/generate/route.ts`

**Fájl:** `src/app/api/generate/route.ts`

**Importálandó modulok (pontos elérési utak):**
```typescript
import { NextRequest, NextResponse } from "next/server";
import { generateDesignImage } from "@/lib/gemini";
import { uploadWithBackgroundRemoval } from "@/lib/cloudinary";
import { saveDesign } from "@/lib/supabase";
import type { GeneratePayload, GenerateResponse } from "@/types";
```

**A `POST` handler teljes logikája:**

```typescript
export async function POST(request: NextRequest): Promise<NextResponse<GenerateResponse>> {
  try {
    // ── Step 1: Parse & Validate ──────────────────────────────
    const body = (await request.json()) as Partial<GeneratePayload>;

    const { occasion, style, customText } = body;

    // Validáció: mindhárom mező kötelező és nem-üres string
    if (
      typeof occasion !== "string" || occasion.trim() === "" ||
      typeof style !== "string"    || style.trim() === "" ||
      typeof customText !== "string" || customText.trim() === ""
    ) {
      return NextResponse.json(
        { success: false, error: "All fields (occasion, style, customText) are required." },
        { status: 400 }
      );
    }

    // ── Step 2: Gemini — kép generálás ────────────────────────
    console.log("[API] Step 2: Calling Gemini...");
    let base64Image: string;
    try {
      base64Image = await generateDesignImage(occasion, style, customText);
    } catch (err) {
      console.error("[API] Gemini error:", err);
      return NextResponse.json(
        { success: false, error: "AI image generation failed. Please try again." },
        { status: 502 }
      );
    }

    // ── Step 3: Cloudinary — feltöltés + BG removal ───────────
    console.log("[API] Step 3: Uploading to Cloudinary...");
    let designUrl: string;
    try {
      designUrl = await uploadWithBackgroundRemoval(base64Image);
    } catch (err) {
      console.error("[API] Cloudinary error:", err);
      return NextResponse.json(
        { success: false, error: "Image processing failed. Please try again." },
        { status: 502 }
      );
    }

    // ── Step 4: Supabase — mentés (silent fail) ───────────────
    console.log("[API] Step 4: Saving to Supabase...");
    const designId = await saveDesign({
      cloudinaryUrl: designUrl,
      occasion,
      style,
      customText,
    });
    // Ha designId === null, a saveDesign belül már loggolta a hibát.
    // NEM dobunk hibát — a user megkapja a képet attól függetlenül.

    // ── Step 5: Válasz a frontendnek ──────────────────────────
    console.log("[API] Step 5: Responding with URL:", designUrl);
    return NextResponse.json({
      success: true,
      designUrl,
      designId: designId ?? undefined,
    });

  } catch (err) {
    // Catch-all a váratlan hibákra
    console.error("[API] Unexpected error:", err);
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
```

**KRITIKUS SZABÁLYOK az implementáló agent számára:**
1. A fájl CSAK `POST` metódust exportál, nincs `GET`.
2. A Supabase hiba (`designId === null`) SOHA nem eredményez HTTP error response-t.
3. Minden Step-nek van saját `console.log` a debugoláshoz.
4. Minden Step-nek (Gemini, Cloudinary) van saját `try/catch` → saját HTTP status és error message.
5. Az `import` utak a `@/` alias-t használják (a `tsconfig.json` automatikusan beállítja).

---

## Done When (Phase 3 ellenőrzőlista)

- [ ] `src/types/index.ts` létezik, tartalmazza: `GeneratePayload`, `GenerateResponse`, `OCCASION_OPTIONS`, `STYLE_OPTIONS`
- [ ] `src/app/api/generate/route.ts` létezik, CSAK `POST` metódust exportál
- [ ] `npm run build` (vagy `npx tsc --noEmit`) hiba nélkül lefut
- [ ] `curl -X POST http://localhost:3000/api/generate -H "Content-Type: application/json" -d '{}'` → `400` HTTP kódot ad vissza `"All fields ... are required."` szöveggel
- [ ] `curl -X POST http://localhost:3000/api/generate -H "Content-Type: application/json" -d '{"occasion":"Birthday","style":"Retro","customText":"Test"}'` → vagy `200` (ha API kulcsok be vannak állítva) vagy `502` Gemini hibával (ha nincs kulcs)
