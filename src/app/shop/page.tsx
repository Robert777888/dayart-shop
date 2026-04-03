import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Kollekció – Threads & Ink | Prémium Egyedi Pólók",
  description: "Böngéssz a Threads & Ink prémium póló kollekciói között. AI-alapú egyedi designok, organikus pamut és stílusos kiegészítők.",
};

export default function ShopPage() {
  return (
    <main className="shop-page">
      <section className="page-intro shop-intro">
        <div className="page-intro-copy">
          <span className="page-intro-badge">Kész kollekciók</span>
          <h1>Kollekció</h1>
          <p>
            Gondosan válogatott prémium darabok, tiszta termékblokkokkal és könnyű
            gyorsvásárlási lehetőséggel.
          </p>
        </div>
        <div className="page-intro-chips" aria-label="Bolt előnyök">
          <span className="page-intro-chip">Bestseller darabok</span>
          <span className="page-intro-chip">Gyors kosárba helyezés</span>
          <span className="page-intro-chip">Ingyenes szállítás 20k felett</span>
        </div>
      </section>
      <div className="shop-container">
        <ShopGrid />
      </div>
    </main>
  );
}
