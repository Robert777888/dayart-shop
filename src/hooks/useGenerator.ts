"use client";

import { useState, useCallback } from "react";
import type { GeneratePayload, GenerateResponse, ContentType } from "@/types";

export type { ContentType };
export type GenerationPhase = 'idle' | 'prompting' | 'generating' | 'polishing' | 'uploading';
export type WizardStep = 1 | 2 | 3 | 4 | 5 | 6;
export type ProductType = "tshirt" | "sweatshirt";
export type ProductColor = "black" | "white";
const MIN_STEP: WizardStep = 1;
const MAX_STEP: WizardStep = 6;

export interface GeneratorState {
  occasion: string;
  recipient: string;
  motif: string;
  style: string;
  contentType: ContentType;
  wizardStep: WizardStep;
  // Step 5: termék választó
  productType: ProductType;
  productColor: ProductColor;
  productSize: string;
  // Generátor állapot
  designUrl: string | null;
  generationId: string | null;
  rawAssetId: string | null;
  processedAssetId: string | null;
  isLoading: boolean;
  phase: GenerationPhase;
  error: string | null;
}

const clampStep = (value: number): WizardStep => {
  if (value < MIN_STEP) return MIN_STEP;
  if (value > MAX_STEP) return MAX_STEP;
  return value as WizardStep;
};

type PayloadSource = Pick<GeneratorState, "occasion" | "recipient" | "motif" | "style" | "contentType">;

const buildPayload = (source: PayloadSource): GeneratePayload => ({
  occasion: source.occasion,
  recipient: source.recipient,
  motif: source.motif,
  style: source.style,
  contentType: source.contentType,
});

const INITIAL_STATE: GeneratorState = {
  occasion: "",
  recipient: "",
  motif: "",
  style: "",
  contentType: "graphic_text",
  wizardStep: 1,
  productType: "tshirt",
  productColor: "black",
  productSize: "",
  designUrl: null,
  generationId: null,
  rawAssetId: null,
  processedAssetId: null,
  isLoading: false,
  phase: 'idle',
  error: null,
};

export function useGenerator() {
  const [state, setState] = useState<GeneratorState>(INITIAL_STATE);

  const applyUpdates = useCallback((updates: Partial<GeneratorState>) => {
    setState((prev) => ({ ...prev, ...updates, error: null }));
  }, []);

  const setOccasion = useCallback((value: string) => {
    applyUpdates({ occasion: value });
  }, [applyUpdates]);

  const setRecipient = useCallback((value: string) => {
    applyUpdates({ recipient: value });
  }, [applyUpdates]);

  const setMotif = useCallback((value: string) => {
    applyUpdates({ motif: value });
  }, [applyUpdates]);

  const setStyle = useCallback((value: string) => {
    applyUpdates({ style: value });
  }, [applyUpdates]);

  const setContentType = useCallback((value: ContentType) => {
    applyUpdates({ contentType: value });
  }, [applyUpdates]);

  const setProductType = useCallback((value: ProductType) => {
    applyUpdates({ productType: value });
  }, [applyUpdates]);

  const setProductColor = useCallback((value: ProductColor) => {
    applyUpdates({ productColor: value });
  }, [applyUpdates]);

  const setProductSize = useCallback((value: string) => {
    applyUpdates({ productSize: value });
  }, [applyUpdates]);

  const goToStep = useCallback((step: WizardStep) => {
    applyUpdates({ wizardStep: step });
  }, [applyUpdates]);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = clampStep(prev.wizardStep + 1);
      return { ...prev, wizardStep: next, error: null };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const prevStepValue = clampStep(prev.wizardStep - 1);
      return { ...prev, wizardStep: prevStepValue, error: null };
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    const { occasion, recipient, motif, style, contentType, isLoading } = state;

    if (isLoading) return;

    if (!occasion || !recipient || !motif || !style) {
      setState((prev) => ({
        ...prev,
        error: "Kérjük, töltsd ki az összes mezőt a generálás előtt.",
      }));
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, phase: 'prompting', error: null }));
    await new Promise(r => setTimeout(r, 800));
    setState((prev) => ({ ...prev, phase: 'generating' }));

    try {
      const payload = buildPayload({ occasion, recipient, motif, style, contentType });

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: GenerateResponse = await response.json();

      setState((prev) => ({ ...prev, phase: 'polishing' }));
      await new Promise(r => setTimeout(r, 600));

      if (!data.success || !data.designUrl) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.error || "A generálás sikertelen volt. Kérjük, próbáld újra.",
        }));
        return;
      }

      // Sikeres generálás → automatikusan lép az 5. lépésre (termék választó)
      setState((prev) => ({
        ...prev,
        isLoading: false,
        phase: 'idle',
        designUrl: data.designUrl!,
        generationId: data.generationId ?? null,
        rawAssetId: data.rawAssetId ?? null,
        processedAssetId: data.processedAssetId ?? null,
        wizardStep: 6,
        error: null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        phase: 'idle',
        error: "Hálózati hiba. Kérjük, ellenőrizd az internetkapcsolatodat.",
      }));
    }
  }, [state]);

  const resetWizard = useCallback(() => {
    setState(INITIAL_STATE);
  }, []);

  return {
    state,
    setOccasion,
    setRecipient,
    setMotif,
    setStyle,
    setContentType,
    setProductType,
    setProductColor,
    setProductSize,
    goToStep,
    nextStep,
    prevStep,
    handleGenerate,
    resetWizard,
  };
}
