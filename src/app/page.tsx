"use client";

import Link from "next/link";
export default function HomePage() {

  return (
    <main style={{ background: "var(--color-bg)" }}>
      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✧ Prémium DTF Nyomtatás</div>
          <h1 className="hero-title">
            Tervezd meg<br />
            <span className="hero-title-accent">álmaid egyedi darabját</span><br />
            percek alatt
          </h1>
          <p className="hero-subtitle">
            AI-alapú egyedi design pólóra vagy pulóverre, 100% organikus pamut, gyors szállítás.<br />
            Személyes ajándék vagy ikonikus streetwear – tied a választás.
          </p>
          <div className="hero-cta-group">
            <Link href="/designer" className="hero-btn-primary" id="hero-design-btn">
              ✨ Tervezz most
            </Link>
            <Link href="/shop" className="hero-btn-secondary" id="hero-shop-btn">
              Kollekció megtekintése →
            </Link>
          </div>
          <div className="hero-trust">
            <span>⭐ 4.9/5 értékelés</span>
            <span>·</span>
            <span>🚚 Ingyenes szállítás 20.000 Ft felett</span>
            <span>·</span>
            <span>🔄 30 napos visszaküldés</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-stage">
            <div className="hero-stage-label">Először kiválasztod az alapot.</div>
            <div className="hero-stage-pills" aria-label="Választható alapok">
              <span className="hero-stage-pill">Póló · Fekete</span>
              <span className="hero-stage-pill">Póló · Fehér</span>
              <span className="hero-stage-pill">Pulóver · Fekete</span>
            </div>
            <div className="hero-tee-mockup">
              <div className="hero-tee-glow" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/mockups/tshirt-black-premium.png"
                alt="Prémium fekete póló"
                className="hero-tee-img hero-tee-photo"
              />
              <div className="hero-tee-badge">AI Generated ✦</div>
            </div>
            <div className="hero-stage-note">
              Póló, pulóver, fekete vagy fehér. Utána jön a design.
            </div>
          </div>
          <div className="hero-floating-card card-1">
            <span>🎂</span> Születésnapi ajándék
          </div>
          <div className="hero-floating-card card-2">
            <span>⚡</span> 2 nap alatt kész
          </div>
          <div className="hero-floating-card card-3">
            <span>🌿</span> Organikus pamut
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="how-section">
        <div className="section-header" style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2 className="section-title">Hogyan működik?</h2>
          <p className="section-sub">Három egyszerű lépés az egyedi pólódig</p>
        </div>
        <div className="how-steps">
          <div className="how-step">
            <div className="how-step-num">01</div>
            <div className="how-step-icon">🎨</div>
            <h3>Tervezz</h3>
            <p>Add meg az alkalom típusát, a motívumot és a stílust – AI varázsolja életre a designt.</p>
          </div>
          <div className="how-step-arrow">→</div>
          <div className="how-step">
            <div className="how-step-num">02</div>
            <div className="how-step-icon">🛒</div>
            <h3>Rendelj</h3>
            <p>Válaszd ki a méretet és a szín alapot, tedd kosárba, és add meg a szállítási adatokat.</p>
          </div>
          <div className="how-step-arrow">→</div>
          <div className="how-step">
            <div className="how-step-num">03</div>
            <div className="how-step-icon">📦</div>
            <h3>Kapd meg</h3>
            <p>1–5 munkanapon belül házhoz szállítjuk prémium csomagolásban.</p>
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Bestseller termékek</h2>
          <Link href="/shop" className="section-link">Összes megtekintése →</Link>
        </div>
        <div className="featured-grid">
          {[
            { id: "tshirt-black", name: "Prémium Póló – Fekete", price: 8990, badge: "Bestseller", desc: "100% organikus pamut, 180g/m²", img: "/mockups/tshirt-black-premium.png" },
            { id: "tshirt-white", name: "Prémium Póló – Fehér", price: 8990, badge: "Új", desc: "Klasszikus, időtálló választás", img: "/mockups/tshirt-white-premium.png" },
            { id: "sweatshirt-black", name: "Prémium Pulóver – Fekete", price: 14990, badge: "Akció", desc: "80% pamut, 20% poliészter, 320g/m²", img: "/mockups/sweatshirt-black.svg" },
          ].map((item) => (
            <Link key={item.id} href={`/shop/${item.id}`} className="featured-card" id={`featured-card-${item.id}`}>
              <div className="featured-card-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.img}
                  alt={item.name}
                  width={400}
                  height={400}
                  style={{ objectFit: "contain", height: "100%", width: "100%" }}
                />
                <span className="featured-card-badge">{item.badge}</span>
              </div>
              <div className="featured-card-info">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className="featured-card-footer">
                  <span className="featured-price">{item.price.toLocaleString("hu-HU")} Ft</span>
                  <span className="featured-detail-btn">Részletek →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── USP STRIP ── */}
      <section className="usp-strip">
        <div className="usp-item">
          <span className="usp-icon" aria-hidden="true">🌿</span>
          <div>
            <strong>Organikus pamut</strong>
            <p>GOTS tanúsított alapanyag</p>
          </div>
        </div>
        <div className="usp-item">
          <span className="usp-icon" aria-hidden="true">🎨</span>
          <div>
            <strong>DTF nyomtatás</strong>
            <p>Prémium, mosásálló print</p>
          </div>
        </div>
        <div className="usp-item">
          <span className="usp-icon">🚚</span>
          <div>
            <strong>Gyors szállítás</strong>
            <p>1–5 munkanap, GLS/Posta</p>
          </div>
        </div>
        <div className="usp-item">
          <span className="usp-icon">🔄</span>
          <div>
            <strong>30 nap visszaküldés</strong>
            <p>Gondtalan vásárlás</p>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="cta-banner">
        <div className="cta-banner-content">
          <h2>Kész vagy az egyedi designra?</h2>
          <p>Az első 2 design generálás teljesen ingyenes. Próbáld ki most!</p>
          <Link href="/designer" className="cta-banner-btn" id="cta-design-btn">
            ✨ Ingyenes tervező megnyitása
          </Link>
        </div>
      </section>
    </main>
  );
}
