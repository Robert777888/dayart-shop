import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Kollekció – Threads & Ink | Prémium Egyedi Pólók",
  description: "Böngéssz a Threads & Ink prémium póló kollekciói között. AI-alapú egyedi designok, organikus pamut és stílusos kiegészítők.",
};

export default function ShopPage() {
  return (
    <main className="shop-page">
      <div className="shop-hero">
        <h1 className="shop-hero-title">Kollekció</h1>
        <p className="shop-hero-sub">
          Prémium pólók minden stílushoz – vagy tervezd meg a sajátodat!
        </p>
      </div>
      <div className="shop-container">
        <ShopGrid />
      </div>
    </main>
  );
}
