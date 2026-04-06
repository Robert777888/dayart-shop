import { TemplateStudio } from "@/components/TemplateStudio";

export default function TemplatesPage() {
  return (
    <main className="designer-page">
      <section className="page-intro designer-intro">
        <div className="page-intro-copy">
          <span className="page-intro-badge">Template Studio</span>
          <h1>Gyors sablonos perszonalizacio, webshop tempoban</h1>
          <p>
            Itt nem ures vasznat kapsz, hanem best-seller sablonokat. 
            Keves kattintas, gyors mockup, konnyu rendelhetoseg.
          </p>
        </div>
        <div className="page-intro-chips" aria-label="Template elonyok">
          <span className="page-intro-chip">3 aktiv sablon</span>
          <span className="page-intro-chip">Determinista SVG</span>
          <span className="page-intro-chip">Kosar-kompatibilis flow</span>
        </div>
      </section>

      <TemplateStudio />
    </main>
  );
}
