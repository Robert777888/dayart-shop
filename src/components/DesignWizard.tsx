"use client";

import type { ContentType, WizardStep, ProductType, ProductColor } from "@/hooks/useGenerator";
import { GenerationPhase } from "@/hooks/useGenerator";
import {
  StepProductChoice,
  StepOccasionRecipient,
  StepMotif,
  StepContentType,
  StepStyle,
  StepSizeAndCart,
} from "@/components/designer/steps";

interface WizardProps {
  occasion: string;
  recipient: string;
  motif: string;
  style: string;
  contentType: ContentType;
  wizardStep: WizardStep;
  isLoading: boolean;
  phase: GenerationPhase;
  error: string | null;
  designUrl: string | null;
  productType: ProductType;
  productColor: ProductColor;
  productSize: string;
  onOccasionChange: (v: string) => void;
  onRecipientChange: (v: string) => void;
  onMotifChange: (v: string) => void;
  onStyleChange: (v: string) => void;
  onContentTypeChange: (v: ContentType) => void;
  onProductTypeChange: (v: ProductType) => void;
  onProductColorChange: (v: ProductColor) => void;
  onProductSizeChange: (v: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onGenerate: () => void;
  onReset: () => void;
}

const STEP_TITLES: Record<WizardStep, string> = {
  1: "Mit tervezünk?",
  2: "Kinek és mire?",
  3: "Mi legyen rajta?",
  4: "Hogyan épüljön fel?",
  5: "Milyen stílusban?",
  6: "Méretezés és kosár",
};

const STEP_SUBTITLES: Record<WizardStep, string> = {
  1: "Először válaszd ki a terméket és a színt, hogy a mockup már az elején jó legyen.",
  2: "Adj meg néhány alapadatot – ez segít igazán személyessé tenni a designt.",
  3: "Írd le, mi legyen a fő motívum vagy téma.",
  4: "Csak szöveg, csak grafika, vagy a kettő együtt?",
  5: "Válaszd ki a vizuális stílust, ami legjobban illik a témához.",
  6: "A design kész! Most válaszd ki a méretet, és mehet a kosárba.",
};

const PHASE_MESSAGES: Record<GenerationPhase, string> = {
  idle: "",
  prompting: "Threads & Ink koncepció kidolgozása...",
  generating: "Prémium grafika szintézise...",
  polishing: "Művészi simítások alkalmazása...",
  uploading: "Nyomtatási sablon előkészítése...",
};

// --- Main Wizard ---
export function DesignWizard({
  occasion,
  recipient,
  motif,
  style,
  contentType,
  wizardStep,
  isLoading,
  phase,
  error,
  designUrl,
  productType,
  productColor,
  productSize,
  onOccasionChange,
  onRecipientChange,
  onMotifChange,
  onStyleChange,
  onContentTypeChange,
  onProductTypeChange,
  onProductColorChange,
  onProductSizeChange,
  onNextStep,
  onPrevStep,
  onGenerate,
  onReset,
}: WizardProps) {
  const designSteps = [1, 2, 3, 4, 5] as WizardStep[];
  const isProductStep = wizardStep === 6;

  return (
    <div className="wizard-container">
      <div className="controls-header">
        <div className="hero-badge">✧ Threads & Ink Studio</div>
        <h1>Egyedi Póló-tervező</h1>
        <p className="subtitle">Személyre szabott póló, pillanatok alatt.</p>
      </div>

      {!isProductStep && (
        <div className="stepper" role="progressbar" aria-valuenow={wizardStep} aria-valuemax={5}>
          {designSteps.map((step) => (
            <div
              key={step}
              className={`stepper-item ${wizardStep >= step ? "active" : ""} ${wizardStep === step ? "current" : ""}`}
            >
              <div className="stepper-dot">{wizardStep > step ? "✓" : step}</div>
              {step < 5 && <div className="stepper-line" />}
            </div>
          ))}
        </div>
      )}

      {isProductStep && (
        <div className="step5-badge">
          <span className="step5-check">✓</span> Design kész! Most válaszd ki a méretet, és mehet a kosárba.
        </div>
      )}

      <div className="step-header">
        <h2 className="step-title">{STEP_TITLES[wizardStep]}</h2>
        <p className="step-subtitle">{STEP_SUBTITLES[wizardStep]}</p>
      </div>

      {wizardStep === 1 && (
        <StepProductChoice
          productType={productType}
          productColor={productColor}
          onProductTypeChange={onProductTypeChange}
          onProductColorChange={onProductColorChange}
          onNext={onNextStep}
        />
      )}
      {wizardStep === 2 && (
        <StepOccasionRecipient
          occasion={occasion}
          recipient={recipient}
          onOccasionChange={onOccasionChange}
          onRecipientChange={onRecipientChange}
          onNext={onNextStep}
        />
      )}
      {wizardStep === 3 && (
        <StepMotif motif={motif} onMotifChange={onMotifChange} onNext={onNextStep} onPrev={onPrevStep} />
      )}
      {wizardStep === 4 && (
        <StepContentType
          contentType={contentType}
          onContentTypeChange={onContentTypeChange}
          onNext={onNextStep}
          onPrev={onPrevStep}
        />
      )}
      {wizardStep === 5 && (
        <StepStyle
          style={style}
          onStyleChange={onStyleChange}
          onGenerate={onGenerate}
          onPrev={onPrevStep}
          isLoading={isLoading}
          phaseLabel={PHASE_MESSAGES[phase]}
        />
      )}
      {wizardStep === 6 && (
        <StepSizeAndCart
          productType={productType}
          productColor={productColor}
          productSize={productSize}
          designUrl={designUrl}
          onProductSizeChange={onProductSizeChange}
          onPrev={onPrevStep}
        />
      )}

      {error && <div className="error-message" role="alert">{error}</div>}

      {designUrl && !isLoading && wizardStep === 6 && (
        <button className="reset-btn" onClick={onReset} type="button" id="reset-wizard-btn">
          🔄 Új design tervezése
        </button>
      )}
    </div>
  );
}
