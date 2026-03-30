"use client";

import { useState } from "react";
import Image from "next/image";
import type { GenerationPhase, ProductColor, ProductType } from "@/hooks/useGenerator";

interface Props {
  designUrl: string | null;
  isLoading: boolean;
  phase: GenerationPhase;
  productColor: ProductColor;
  productType: ProductType;
}

const PHASE_MESSAGES: Record<GenerationPhase, string> = {
  idle: "",
  prompting: "Design koncepció kidolgozása...",
  generating: "Grafika elkészítése folyamatban...",
  polishing: "Végső simítások...",
  uploading: "Nyomtatásra előkészítés...",
};

export function MockupPreview({ designUrl, isLoading, phase, productColor, productType }: Props) {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!designUrl || isLoading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomStyle({
      display: 'block',
      left: `${e.clientX - rect.left}px`,
      top: `${e.clientY - rect.top}px`,
      backgroundImage: `url(${designUrl})`,
      backgroundPosition: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none' });
  };

  // Válasszuk ki a megfelelő alap képet
  const baseImage = productColor === "white" 
    ? "/mockups/tshirt-white-premium.png" 
    : "/mockups/tshirt-black-premium.png";

  return (
    <div className="mockup-container">
      <div className="mockup-frame premium-look">
        {/* Alap póló kép */}
        <Image
          src={baseImage}
          alt={`${productColor === "white" ? "Fehér" : "Fekete"} ${productType === "tshirt" ? "póló" : "pulóver"}`}
          className="mockup-base"
          width={800}
          height={800}
          priority
        />

        {/* Generált design overlay (csak ha van URL) */}
        {designUrl && (
          <div 
            className="design-zoom-trigger" 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ 
              top: '25%', // Picit feljebb a t-shirt melle felett
              left: '25%',
              width: '50%',
              aspectRatio: '1',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={designUrl}
              alt="Elkészített design"
              className="mockup-overlay"
              style={{
                mixBlendMode: productColor === "white" ? "multiply" : "normal",
                opacity: productColor === "white" ? 0.9 : 1,
              }}
            />
            {/* Nagyító Lencse */}
            <div className="magnifier-lens" style={zoomStyle} />
          </div>
        )}

        {/* Loading állapot */}
        {isLoading && (
          <div className="mockup-loading">
            <div className="pulse-animation" />
            <p className="phase-text">{PHASE_MESSAGES[phase]}</p>
          </div>
        )}

        {/* Üres állapot */}
        {!designUrl && !isLoading && (
          <div className="mockup-placeholder">
            <div className="placeholder-icon">👕</div>
            <p>A designod itt fog megjelenni</p>
          </div>
        )}
      </div>

      {/* Download gomb (ha van design) */}
      {designUrl && !isLoading && (
        <a
          href={designUrl}
          download="egyedi-polo-design.png"
          className="download-btn"
          target="_blank"
          rel="noopener noreferrer"
          id="download-design-btn"
        >
          ⬇️ Design letöltése
        </a>
      )}
    </div>
  );
}
