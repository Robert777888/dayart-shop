# Phase 1 — Project Scaffold & Dependencies

> **Cél:** Üres Next.js 14 App Router projekt inicializálása, összes dependency telepítése, env fájl létrehozása, Supabase tábla elkészítése.
> **Fázisok:** 5 lépés | **Becsült idő:** 10 perc

---

## Task 1 · [CREATE] Next.js scaffold

**Parancs:**
```bash
npx -y create-next-app@latest ./ --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

**FIGYELEM:** A parancsot az `AI_TEE_webshop` könyvtárban kell futtatni. A `./` azt jelenti, hogy ide telepíti, nem hoz létre alkönyvtárat. Ha a könyvtárban már vannak fájlok (pl. `AGENTS.md`), a `create-next-app` esetleg rákérdez — válaszolj **Yes** az overwrite-ra (a meglévő `.gitignore`-t felülírja, de más fájlokat nem töröl).

**Elvárt eredmény:**
- Létezik: `src/app/page.tsx`, `src/app/layout.tsx`, `next.config.ts`, `tsconfig.json`, `package.json`
- `npm run dev` hiba nélkül elindul a `http://localhost:3000` címen

---

## Task 2 · [MODIFY] Függőségek telepítése

**Parancs:**
```bash
npm install @google/genai cloudinary @supabase/supabase-js
```

| Csomag | Verzió (min) | Miért |
|--------|-------------|-------|
| `@google/genai` | latest | Gemini API hívás (kép generálás) |
| `cloudinary` | ^2.x | Kép feltöltés + BG removal |
| `@supabase/supabase-js` | ^2.x | Supabase adatbázis kliens |

**Elvárt eredmény:**
- `package.json` `dependencies` szekciójában megjelenik mindhárom csomag.
- `node_modules/` könyvtárban létezik: `@google/genai`, `cloudinary`, `@supabase/supabase-js`

---

## Task 3 · [CREATE] `.env.local`

**Fájl:** `.env.local` (projekt gyökér)

```bash
# === Google AI (Gemini) ===
GEMINI_API_KEY=

# === Cloudinary ===
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# === Supabase ===
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

**FONTOS szabályok:**
- A `NEXT_PUBLIC_` prefix-szel ellátott változók a **kliens oldalon is** elérhetők.
- A `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET` és `GEMINI_API_KEY` NEM kap `NEXT_PUBLIC_` prefixet — ezek csak a szerver oldalon (API route-ban) érhetők el.

**Elvárt eredmény:**
- `.env.local` fájl létezik a gyökérben.
- `.gitignore` fájl tartalmazza a `.env*.local` sort (a `create-next-app` alapból berakja).

---

## Task 4 · [MODIFY] `.gitignore` kiegészítés

**Fájl:** `.gitignore`

A meglévő `.gitignore` végére add hozzá (ha még nincs benne):

```
# Project-specific
.env.local
.env*.local
```

**Ellenőrzés:** `grep -c "env.local" .gitignore` → legalább 1 találat.

---

## Task 5 · [CREATE] Supabase `designs` tábla

**Hol:** Supabase Dashboard → SQL Editor → New Query

```sql
CREATE TABLE IF NOT EXISTS designs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cloudinary_url TEXT NOT NULL,
  occasion      TEXT NOT NULL,
  style         TEXT NOT NULL,
  custom_text   TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Opcionális: RLS kikapcsolása lokális MVP-hez
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all for service role" ON designs
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

**FONTOS:** Ez a lépés a **Supabase webes felületen** történik, nem a kódban. A user-nek kell lefuttatnia.

**Elvárt eredmény:**
- A Supabase Dashboard → Table Editor-ban megjelenik a `designs` tábla 6 oszloppal: `id`, `cloudinary_url`, `occasion`, `style`, `custom_text`, `created_at`.

---

## Done When (Phase 1 ellenőrzőlista)

- [ ] `npm run dev` elindul és `http://localhost:3000` betölt hiba nélkül
- [ ] `package.json` tartalmazza: `@google/genai`, `cloudinary`, `@supabase/supabase-js`
- [ ] `.env.local` létezik a gyökérben, 7 változóval (kulcsok kitöltötte a user)
- [ ] `.gitignore` tartalmazza `.env*.local`-t
- [ ] Supabase-ben létezik a `designs` tábla (manuális ellenőrzés)
