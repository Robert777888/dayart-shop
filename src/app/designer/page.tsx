"use client";

import { useGenerator } from "@/hooks/useGenerator";
import { MockupPreview } from "@/components/MockupPreview";
import { DesignWizard } from "@/components/DesignWizard";

export default function DesignerPage() {
  const {
    state,
    setOccasion, setRecipient, setMotif, setStyle, setContentType,
    setProductType, setProductColor, setProductSize,
    nextStep, prevStep, handleGenerate, resetWizard,
  } = useGenerator();

  return (
    <main className="designer-page">
      <section className="page-intro designer-intro">
        <div className="page-intro-copy">
          <span className="page-intro-badge">Stitch-inspired tervezőasztal</span>
          <h1>Prémium pólótervező, letisztult lépésekben</h1>
          <p>
            Először kiválasztod, hogy póló vagy pulóver, fekete vagy fehér legyen,
            utána a fókuszált wizard végigvezet a teljes alkotási folyamaton.
          </p>
        </div>
        <div className="page-intro-chips" aria-label="Előnyök">
          <span className="page-intro-chip">Élő előnézet</span>
          <span className="page-intro-chip">Póló / pulóver választó</span>
          <span className="page-intro-chip">Mobilra optimalizált</span>
        </div>
      </section>

      <section className="generator-page">
        <section className="preview-column">
          <MockupPreview
            designUrl={state.designUrl}
            isLoading={state.isLoading}
            phase={state.phase}
            productColor={state.productColor}
            productType={state.productType}
          />
        </section>
        <section className="controls-column">
          <DesignWizard
            occasion={state.occasion}
            recipient={state.recipient}
            motif={state.motif}
            style={state.style}
            contentType={state.contentType}
            wizardStep={state.wizardStep}
            isLoading={state.isLoading}
            phase={state.phase}
            error={state.error}
            designUrl={state.designUrl}
            productType={state.productType}
            productColor={state.productColor}
            productSize={state.productSize}
            onOccasionChange={setOccasion}
            onRecipientChange={setRecipient}
            onMotifChange={setMotif}
            onStyleChange={setStyle}
            onContentTypeChange={setContentType}
            onProductTypeChange={setProductType}
            onProductColorChange={setProductColor}
            onProductSizeChange={setProductSize}
            onNextStep={nextStep}
            onPrevStep={prevStep}
            onGenerate={handleGenerate}
            onReset={resetWizard}
          />
        </section>
      </section>
    </main>
  );
}
