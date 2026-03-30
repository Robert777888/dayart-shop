import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Szállítás & Infók – Threads & Ink",
  description: "Szállítási információk, gyártási idők és fontos tudnivalók a Threads & Ink prémium pólókhoz.",
};

export default function ShippingPage() {
  return (
    <main className="info-page">
      <div className="info-hero">
        <h1>Szállítás & Infók</h1>
        <p>Threads & Ink – Ahol a minőség és a gondos kiszállítás találkozik.</p>
      </div>

      <div className="info-container">

        {/* Egyedi termék tájékoztató */}
        <section className="info-section">
          <div className="info-badge">Fontos tudnivaló</div>
          <h2>Egyedi, Személyre Szabott Termék</h2>
          <div className="info-highlight-box">
            <strong>Minden Threads & Ink termék egyedileg, a te megrendelésedre készül.</strong>
            <p>
              Mivel minden darab egyedi AI designnal vagy speciális kéréssel készül, az EU fogyasztóvédelmi
              irányelvek alapján ezekre a termékekre <strong>nem vonatkozik az elállási jog.</strong>{" "}
              Minden darabot a legnagyobb gondossággal ellenőrzünk feladás előtt.
            </p>
          </div>
        </section>

        {/* Szállítási opciók */}
        <section className="info-section">
          <h2>🚚 Szállítási Lehetőségek</h2>
          <div className="shipping-info-grid">
            <div className="shipping-info-card">
              <span className="sic-icon">📦</span>
              <strong>Standard</strong>
              <span className="sic-time">3–5 munkanap</span>
              <span className="sic-price">990 Ft</span>
              <p>Magyar Posta / GLS futárszolgálat</p>
            </div>
            <div className="shipping-info-card highlight">
              <span className="sic-icon">⚡</span>
              <strong>Express</strong>
              <span className="sic-time">1–2 munkanap</span>
              <span className="sic-price">1.990 Ft</span>
              <p>GLS Express – 14:00-ig leadott megrendelésre</p>
            </div>
            <div className="shipping-info-card">
              <span className="sic-icon">🎁</span>
              <strong>Ingyenes</strong>
              <span className="sic-time">3–5 munkanap</span>
              <span className="sic-price free">0 Ft</span>
              <p>20.000 Ft feletti rendelésnél automatikusan</p>
            </div>
          </div>
        </section>

        {/* Gyártási idők */}
        <section className="info-section">
          <h2>🏭 Gyártási Idők</h2>
          <div className="info-table">
            <div className="info-table-row header">
              <span>Termék típus</span>
              <span>Elkészülési idő</span>
            </div>
            <div className="info-table-row">
              <span>Egyedi póló (DTF)</span>
              <span>1–2 munkanap</span>
            </div>
            <div className="info-table-row">
              <span>Egyedi pulóver (DTF)</span>
              <span>1–2 munkanap</span>
            </div>
          </div>
          <p className="info-note">
            ⓘ A gyártási idő a fizetés megerősítése után kezdődik. Hétvégén és ünnepnapokon nem dolgozunk.
          </p>
        </section>

        {/* Gyártási hiba */}
        <section className="info-section">
          <h2>🛡️ Gyártási Hiba Esetén</h2>
          <div className="info-list">
            <div className="info-list-item">
              <span className="info-list-icon">📸</span>
              <div>
                <strong>Dokumentáld a hibát</strong>
                <p>Kérjük, fotózd le a sérült vagy hibás terméket a kézhezvételtől számított 48 órán belül.</p>
              </div>
            </div>
            <div className="info-list-item">
              <span className="info-list-icon">✉️</span>
              <div>
                <strong>Küldj nekünk emailt</strong>
                <p>
                  Írd meg a rendelési számodat és csatold a fotókat:{" "}
                  <a href="mailto:hello@threads-ink.hu">hello@threads-ink.hu</a>
                </p>
              </div>
            </div>
            <div className="info-list-item">
              <span className="info-list-icon">🔄</span>
              <div>
                <strong>Csere vagy jóváírás</strong>
                <p>Gyártási hiba esetén ingyenesen újragyártjuk a terméket, vagy jóváírást adunk.</p>
              </div>
            </div>
          </div>
        </section>

        {/* GYIK */}
        <section className="info-section">
          <h2>❓ Gyakori Kérdések</h2>
          <div className="faq-list">
            {[
              {
                q: "Miért nem fogadtok el visszárut?",
                a: "Minden termék kizárólag a te személyes megrendelésedre és designodra készül. Mivel egyetlen más vásárlónak sem küldhetnénk el pontosan ugyanazt, nem tudunk visszárut elfogadni – ez az egyedi gyártás természetéből adódik.",
              },
              {
                q: "Mi történik, ha rossz méretet rendeltem?",
                a: "Sajnos a méretcsere nem lehetséges, mivel a terméket személyre szabva gyártottuk. Kérjük, a rendelés előtt alaposan nézd át a mérettáblázatunkat!",
              },
              {
                q: "Mikor indul el a gyártás?",
                a: "A fizetés megerősítése után azonnal megkezdjük a gyártást, általában 1–2 munkanapon belül elkészül és feladjuk a csomagot.",
              },
              {
                q: "Követhetem a csomagom?",
                a: "Igen! A feladás után emailben küldünk nyomkövetési számot, amellyel a GLS vagy Magyar Posta oldalán nyomon követheted a csomagodat.",
              },
              {
                q: "Szállítanak külföldre?",
                a: "Egyelőre csak Magyarországra szállítunk. Nemzetközi szállítás hamarosan elérhető lesz!",
              },
            ].map(({ q, a }) => (
              <details key={q} className="faq-item">
                <summary className="faq-question">{q}</summary>
                <p className="faq-answer">{a}</p>
              </details>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
