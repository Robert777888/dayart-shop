"use client";

import { useEffect, useState } from "react";
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
  polishing: "Vizuális finomhangolás...",
  uploading: "Nyomtatási fájl előkészítése...",
};

const GENERATION_STEPS: Array<{ phase: Exclude<GenerationPhase, "idle">; label: string }> = [
  { phase: "prompting", label: "Koncepció előkészítése" },
  { phase: "generating", label: "Grafika generálása" },
  { phase: "polishing", label: "Minőségjavítás" },
  { phase: "uploading", label: "Fájlmentés" },
];

const LOADING_HINTS = [
  "Stílus és motívum összehangolása...",
  "Kompozíció és arányok finomítása...",
  "Nyomtatásbarát tisztítás ellenőrzése...",
  "Már majdnem kész, véglegesítés folyamatban...",
];

export function MockupPreview({ designUrl, isLoading, phase, productColor, productType }: Props) {
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({ display: 'none' });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setElapsedSeconds(0);
      return;
    }

    const startedAt = Date.now();
    const timer = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [isLoading]);

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
  const isPremiumTee = productType === "tshirt";
  const baseImage =
    productType === "sweatshirt"
      ? productColor === "white"
        ? "/mockups/sweatshirt-white.svg"
        : "/mockups/sweatshirt-black.svg"
      : productColor === "white"
        ? "/mockups/tshirt-white-premium.png"
        : "/mockups/tshirt-black-premium.png";

  const overlayStyle =
    productType === "sweatshirt"
      ? { top: "22%", left: "22%", width: "56%", aspectRatio: "1" }
      : { top: "23%", left: "23%", width: "54%", aspectRatio: "1" };

  const activeStepIndex = Math.max(
    0,
    GENERATION_STEPS.findIndex((step) => step.phase === phase)
  );
  const progressPercent = ((activeStepIndex + 1) / GENERATION_STEPS.length) * 100;
  const currentHint = LOADING_HINTS[Math.min(Math.floor(elapsedSeconds / 4), LOADING_HINTS.length - 1)];

  return (
    <div className="mockup-container">
      <div className="mockup-frame premium-look">
        {/* Alap póló kép */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={baseImage}
          alt={`${productColor === "white" ? "Fehér" : "Fekete"} ${productType === "tshirt" ? "póló" : "pulóver"}`}
          className={`mockup-base${isPremiumTee ? " mockup-photo" : ""}`}
        />

        {/* Generált design overlay (csak ha van URL) */}
        {designUrl && (
          <div 
            className="design-zoom-trigger" 
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={overlayStyle}
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
          <div className="mockup-loading" role="status" aria-live="polite">
            <div className="pulse-animation" />
            <p className="phase-text">{PHASE_MESSAGES[phase]}</p>
            <div className="generation-status-meta">
              <span>Eltelt idő: {elapsedSeconds}s</span>
              <span>Átlagos idő: 15-40 mp</span>
            </div>
            <div className="generation-progress-track" aria-hidden="true">
              <div className="generation-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
            <ul className="generation-step-list">
              {GENERATION_STEPS.map((step, index) => {
                const stateClass =
                  index < activeStepIndex ? "done" : index === activeStepIndex ? "current" : "upcoming";
                return (
                  <li key={step.phase} className={`generation-step ${stateClass}`}>
                    <span className="generation-step-dot" aria-hidden="true" />
                    <span>{step.label}</span>
                  </li>
                );
              })}
            </ul>
            <p className="generation-hint">{currentHint}</p>
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
