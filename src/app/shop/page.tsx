import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";

export const metadata: Metadata = {
  title: "Kollekció – DTFStudio | Egyedi Pólók",
  description: "Böngéssz egyedi tervezett pólóink között. Alap, prémium és limitált kollekciók, AI-egyedi designok. Szállítás 1-5 munkanap.",
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
