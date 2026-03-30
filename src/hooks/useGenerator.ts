"use client";

import { useState, useCallback } from "react";
import type { GeneratePayload, GenerateResponse, ContentType } from "@/types";

export type { ContentType };
export type GenerationPhase = 'idle' | 'prompting' | 'generating' | 'polishing' | 'uploading';
export type WizardStep = 1 | 2 | 3 | 4 | 5;
export type ProductType = "tshirt" | "sweatshirt";
export type ProductColor = "black" | "white";

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
  isLoading: boolean;
  phase: GenerationPhase;
  error: string | null;
}

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
  isLoading: false,
  phase: 'idle',
  error: null,
};

export function useGenerator() {
  const [state, setState] = useState<GeneratorState>(INITIAL_STATE);

  const setOccasion = useCallback((value: string) => {
    setState((prev) => ({ ...prev, occasion: value, error: null }));
  }, []);

  const setRecipient = useCallback((value: string) => {
    setState((prev) => ({ ...prev, recipient: value, error: null }));
  }, []);

  const setMotif = useCallback((value: string) => {
    setState((prev) => ({ ...prev, motif: value, error: null }));
  }, []);

  const setStyle = useCallback((value: string) => {
    setState((prev) => ({ ...prev, style: value, error: null }));
  }, []);

  const setContentType = useCallback((value: ContentType) => {
    setState((prev) => ({ ...prev, contentType: value, error: null }));
  }, []);

  const setProductType = useCallback((value: ProductType) => {
    setState((prev) => ({ ...prev, productType: value, error: null }));
  }, []);

  const setProductColor = useCallback((value: ProductColor) => {
    setState((prev) => ({ ...prev, productColor: value, error: null }));
  }, []);

  const setProductSize = useCallback((value: string) => {
    setState((prev) => ({ ...prev, productSize: value, error: null }));
  }, []);

  const goToStep = useCallback((step: WizardStep) => {
    setState((prev) => ({ ...prev, wizardStep: step, error: null }));
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => {
      const next = Math.min(prev.wizardStep + 1, 5) as WizardStep;
      return { ...prev, wizardStep: next, error: null };
    });
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => {
      const prev2 = Math.max(prev.wizardStep - 1, 1) as WizardStep;
      return { ...prev, wizardStep: prev2, error: null };
    });
  }, []);

  const handleGenerate = useCallback(async () => {
    if (state.isLoading) return;

    if (!state.occasion || !state.recipient || !state.motif || !state.style) {
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
      const payload: GeneratePayload = {
        occasion: state.occasion,
        recipient: state.recipient,
        motif: state.motif,
        style: state.style,
        contentType: state.contentType,
      };

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
        wizardStep: 5,
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
  }, [state.occasion, state.style, state.recipient, state.motif, state.contentType, state.isLoading]);

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
