"use client";

import type { WizardStep, GenerationPhase } from "@/hooks/useGenerator";

export const WIZARD_STEP_TITLES: Record<WizardStep, string> = {
  1: "Mit tervezünk?",
  2: "Kinek és mire?",
  3: "Mi legyen rajta?",
  4: "Hogyan épüljön fel?",
  5: "Milyen stílusban?",
  6: "Méretezés és kosár",
};

export const WIZARD_STEP_SUBTITLES: Record<WizardStep, string> = {
  1: "Először válaszd ki a terméket és a színt, hogy a mockup már az elején jó legyen.",
  2: "Adj meg néhány alapadatot – ez segít igazán személyessé tenni a designt.",
  3: "Írd le, mi legyen a fő motívum vagy téma.",
  4: "Csak szöveg, csak grafika, vagy a kettő együtt?",
  5: "Válaszd ki a vizuális stílust, ami legjobban illik a témához.",
  6: "A design kész! Most válaszd ki a méretet, és mehet a kosárba.",
};

export const WIZARD_PHASE_LABELS: Record<GenerationPhase, string> = {
  idle: "",
  prompting: "Threads & Ink koncepció kidolgozása...",
  generating: "Prémium grafika szintézise...",
  polishing: "Művészi simítások alkalmazása...",
  uploading: "Nyomtatási sablon előkészítése...",
};
