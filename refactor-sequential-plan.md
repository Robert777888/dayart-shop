# Refaktor Sorozat

## Cél
A webshop UI és generátor kódja legyen tisztább, következetesebb és könnyebben karbantartható.

## Feladatok
- [x] Közös stílus-tokenek és gomb/kártya alapstílusok kialakítása a [globals.css](/Users/robertkispal/Documents/projects/AI_TEE_webshop/src/app/globals.css)-ben → Verify: hero + wizard elemek ugyanúgy néznek ki.
- [x] Wizard szövegek és lépés-metaadatok kiszervezése külön modulba, majd importok frissítése → Verify: design wizard változatlanul működik.
- [x] `useGenerator` állapot-kezelés egyszerűsítése (konstansok, helper frissítések, payload builder) → Verify: lépések és generálás ugyanúgy fut.
- [x] Kapcsolódó komponensek rendbe igazítása az új helper API-hoz → Verify: nincs TypeScript hiba.
- [x] Ellenőrzés: `npx tsc --noEmit` vagy lint runner futtatása → Verify: nincs hiba.

## Kész, ha
- [x] A wizard és landing UI vizuálisan változatlan, de a kód tisztább.
- [x] A generálás, lépésváltás és kosár funkciók hibátlanul működnek.

## Megjegyzés
- Az ESLint figyelmeztetés javítva, a `lint_runner` újra lefutott.
