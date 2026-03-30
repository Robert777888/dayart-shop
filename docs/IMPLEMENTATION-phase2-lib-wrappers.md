# Phase 2 — Server-Side Library Wrappers (lib/)

> **Cél:** Létrehozni a 3 szerver-oldali helper modult: `gemini.ts`, `cloudinary.ts`, `supabase.ts`. Ezek az API route építőkockái.
> **Fázisok:** 3 fájl | **Függőség:** Phase 1 kész

---

## Task 1 · [CREATE] `src/lib/gemini.ts`

**Fájl:** `src/lib/gemini.ts`

**Dependencia:** `@google/genai` (már telepítve Phase 1-ben)

**Pontos implementáció:**

```typescript
import { GoogleGenAI, type GenerateContentResponse } from "@google/genai";

// A GEMINI_API_KEY-t a .env.local-ból olvassuk, server-side only
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

/**
 * Generál egy DTF-nyomtatásra kész design képet szöveg prompt alapján.
 *
 * @param occasion - Pl. "Birthday", "Christmas"
 * @param style    - Pl. "Retro", "Minimalist"
 * @param customText - A felhasználó által megadott szöveg
 * @returns Base64-kódolt PNG kép string (data URI nélkül, nyers base64)
 * @throws Error ha a Gemini API nem ad vissza képet
 */
export async function generateDesignImage(
  occasion: string,
  style: string,
  customText: string
): Promise<string> {
  const prompt = `A DTF print-ready vector-style graphic design for a ${occasion} t-shirt. Style: ${style}. The design must prominently feature the text: "${customText}". White background, transparent-ready, high contrast, vibrant colors, no photorealistic elements, no mockup, isolated design only.`;

  const response: GenerateContentResponse = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: prompt,
    config: {
      responseModalities: ["IMAGE", "TEXT"],
    },
  });

  // A válaszból kikeressük az első inline image part-ot
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("Gemini response contained no parts.");
  }

  const imagePart = parts.find(
    (part) => part.inlineData && part.inlineData.mimeType?.startsWith("image/")
  );

  if (!imagePart || !imagePart.inlineData?.data) {
    throw new Error("Gemini response contained no image data.");
  }

  // Visszaadjuk a nyers base64 stringet (nem data URI)
  return imagePart.inlineData.data;
}
```

**Ellenőrzés:**
- A fájl hibátlanul lefordul: `npx tsc --noEmit src/lib/gemini.ts` (vagy globális `npm run build` később)
- Az exportált függvény neve pontosan `generateDesignImage`.
- Paraméterei: `(occasion: string, style: string, customText: string)`.
- Return típus: `Promise<string>` (base64 string).

---

## Task 2 · [CREATE] `src/lib/cloudinary.ts`

**Fájl:** `src/lib/cloudinary.ts`

**Dependencia:** `cloudinary` npm csomag (v2+)

**Pontos implementáció:**

```typescript
import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// Konfiguráció — server-side only env változókból
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

/**
 * Feltölt egy base64 képet Cloudinary-ra, háttér eltávolítással.
 *
 * @param base64Image - Nyers base64 string (NEM data URI, tehát "iVBOR..." formátum)
 * @returns A feltöltött kép secure_url-je (pl. "https://res.cloudinary.com/...")
 * @throws Error ha a feltöltés sikertelen
 */
export async function uploadWithBackgroundRemoval(
  base64Image: string
): Promise<string> {
  // A Cloudinary a "data:image/png;base64,..." formátumot várja
  const dataUri = `data:image/png;base64,${base64Image}`;

  const result: UploadApiResponse = await cloudinary.uploader.upload(dataUri, {
    folder: "ai-tee-designs",
    resource_type: "image",
    transformation: [
      { effect: "background_removal" },
      { quality: "auto", fetch_format: "png" },
    ],
  });

  if (!result.secure_url) {
    throw new Error("Cloudinary upload succeeded but returned no secure_url.");
  }

  return result.secure_url;
}
```

**ALTERNATÍVA (ha nincs Cloudinary BG Removal add-on):**
Ha a user jelzi, hogy nincs BG removal add-on, akkor a `transformation` tömböt üresre kell cserélni:
```typescript
transformation: [{ quality: "auto", fetch_format: "png" }],
```

**Ellenőrzés:**
- Export név: `uploadWithBackgroundRemoval`
- 1 paraméter: `base64Image: string`
- Return: `Promise<string>` (secure_url)

---

## Task 3 · [CREATE] `src/lib/supabase.ts`

**Fájl:** `src/lib/supabase.ts`

**Dependencia:** `@supabase/supabase-js`

**Pontos implementáció:**

```typescript
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Server-side Supabase kliens (service role key-vel, nem anon key-vel)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase: SupabaseClient = createClient(
  supabaseUrl,
  supabaseServiceKey
);

/**
 * Elmenti a generált design adatait a `designs` táblába.
 *
 * @returns Az újonnan beszúrt sor `id`-ja (UUID string), vagy null ha hiba történt.
 *
 * FONTOS: Ez a függvény NEM dob hibát! Ha a DB írás sikertelen,
 * loggolja a hibát szerver oldalon és null-t ad vissza.
 * Ez azért van, mert a Supabase hiba NEM kell, hogy blokkolja a user UX-et.
 */
export async function saveDesign(params: {
  cloudinaryUrl: string;
  occasion: string;
  style: string;
  customText: string;
}): Promise<string | null> {
  const { data, error } = await supabase
    .from("designs")
    .insert({
      cloudinary_url: params.cloudinaryUrl,
      occasion: params.occasion,
      style: params.style,
      custom_text: params.customText,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[Supabase] Failed to save design:", error.message);
    return null;
  }

  return data.id;
}
```

**Ellenőrzés:**
- Export: `supabase` (kliens) + `saveDesign` (függvény)
- `saveDesign` SOHA nem dob Error-t, mindig `null`-t ad vissza hiba esetén.
- A mezőnevek pontosan egyeznek a Supabase tábla oszlopaival: `cloudinary_url`, `occasion`, `style`, `custom_text`.

---

## Done When (Phase 2 ellenőrzőlista)

- [ ] A `src/lib/` mappa tartalmazza: `gemini.ts`, `cloudinary.ts`, `supabase.ts`
- [ ] Mindhárom fájl TypeScript-ben van, típusokkal ellátva
- [ ] `generateDesignImage()` → `Promise<string>` (base64)
- [ ] `uploadWithBackgroundRemoval()` → `Promise<string>` (URL)
- [ ] `saveDesign()` → `Promise<string | null>` (UUID vagy null, SOHA nem dob hibát)
- [ ] `npm run build` hiba nélkül lefut (ha a többi fájl is kész, egyébként `npx tsc --noEmit`)
