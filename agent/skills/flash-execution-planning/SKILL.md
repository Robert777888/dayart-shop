---
name: flash-execution-planning
description: Standards and logic for creating technical implementation plans that Gemini Flash models (or simple agents) can execute with 100% fidelity.
---

# Flash Execution Planning (Implementációs Terv Sztenderd)

Ahhoz, hogy a **Gemini 3.0 Flash** (vagy bármely gyors, alap végrehajtó modell/agent) a lehető legpontosabban hajtsa végre a feladatot, a tervezőnek (Architect) ezen sztenderdek alapján kell lebontania a munkát. Ezt a skillt kifejezetten atomi szintű, "szájbarágós" tervkészítéshez használjuk.

---

## 1. Technikai Specifikusság (Ne bízz semmit a fantáziájára)

Ne csak leíró jellegű legyen a terv, hanem tartalmazzon pontos logikai feltételeket, változóneveket, és algoritmusokat.

- ❌ **Rossz**: „Alakítsd át az adatokat."
- ✅ **Jó**: „Ha a `row['ertek']` értéke kisebb, mint 10, alakítsd `f'{num:02d}'` formátumra, kivéve ha a `tipus` mező értéke `'kizart'`."

---

## 2. Fájl-szintű lebontás

Minden módosítandó fájlhoz legyen egy külön szekció, lexikális pontossággal:
- `[MODIFY] filepath` – Pontos leírás a módosítandó függvényekről vagy sorokról. Nevezd meg a konkrét függvényt.
- `[CREATE] filepath` – Új fájl esetén a teljes várt tartalom logikai leírása (vagy akár kódváza).
- `[DELETE] filepath` – Törlendő fájlok egyértelmű megjelölése.
- Új változók, konstansok neveinek és értékeinek előre történő definiálása.

---

## 3. Verifikáció (Done When)

A "flash" szintű agent számára nagyon világos kritérium kell ahhoz, hogy ellenőrizni tudja magát:
- ❌ **Rossz**: „Ellenőrizd, hogy működik-e."
- ✅ **Jó**: „Futtasd le a `pytest tests/test_parser.py` parancsot, és ellenőrizd, hogy minden teszt zöld-e."
- ✅ **Jó**: „Futtasd le a scriptet, és ellenőrizd, hogy létrejött-e az `output/report.docx` fájl, és tartalmazza-e a 'Sikeres' szót."

---

## 4. Gyakori Hibák Elkerülése (Túl-optimalizálás)

A Flash modellek hajlamosak túl-optimalizálni vagy kihagyni részleteket, ha a terv túl hosszú:

- **Kontextus**: Mindig írd le, hogy a célfájlban _melyik sorok közé_, vagy _melyik osztályba_ jön a módosítás.
- **Sorrend**: A függőségeket (pl. importok bedrótozása, constansok beállítása) vedd előre, mielőtt a használatukat leírod.
- **Rövid fázisok**: Egy IMPLEMENTATION.md terv maximum 5-7 lépést (taskot) tartalmazhat. Ha hosszabb a feladat, bontsd "Fázis 1", "Fázis 2" dokumentumokra.
