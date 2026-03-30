"use client";

import { OCCASION_OPTIONS, STYLE_OPTIONS, CONTENT_TYPE_OPTIONS } from "@/types";
import type { ContentType, WizardStep, ProductType, ProductColor } from "@/hooks/useGenerator";
import { GenerationPhase } from "@/hooks/useGenerator";
import { useCart } from "@/context/CartContext";
import { BASE_PRODUCTS } from "@/data/products";

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
  1: "Kinek és mire?",
  2: "Mi legyen rajta?",
  3: "Hogyan épüljön fel?",
  4: "Milyen stílusban?",
  5: "Válaszd ki a terméked!",
};

const STEP_SUBTITLES: Record<WizardStep, string> = {
  1: "Adj meg néhány alapadatot – ez segít igazán személyessé tenni a designt.",
  2: "Írd le, mi legyen a póló fő témája vagy motívuma.",
  3: "Csak szöveg, csak grafika, vagy a kettő együtt?",
  4: "Válaszd ki a vizuális stílust, ami legjobban illik a témához.",
  5: "A design kész! Most válaszd ki, mire szeretnéd nyomtatni.",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

// --- Step 1 ---
function Step1({ occasion, recipient, onOccasionChange, onRecipientChange, onNext }: {
  occasion: string; recipient: string;
  onOccasionChange: (v: string) => void; onRecipientChange: (v: string) => void;
  onNext: () => void;
}) {
  const canProceed = occasion !== "" && recipient.trim() !== "";
  return (
    <div className="wizard-step-content">
      <div className="form-group">
        <label htmlFor="occasion-select">Mi az alkalom?</label>
        <div className="select-grid">
          {OCCASION_OPTIONS.map((opt) => (
            <button key={opt.value} id={`occasion-${opt.value}`}
              className={`option-pill ${occasion === opt.value ? "selected" : ""}`}
              onClick={() => onOccasionChange(opt.value)} type="button">
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group" style={{ marginTop: "24px" }}>
        <label htmlFor="recipient-input">Kinek szánjuk?</label>
        <input id="recipient-input" type="text" value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
          placeholder="Pl. Édesapám, Barátnőm, A csapat..." maxLength={60} autoComplete="off" />
        <span className="char-count">{recipient.length}/60</span>
      </div>
      <button className="wizard-next-btn" onClick={onNext} disabled={!canProceed} type="button">
        Tovább →
      </button>
    </div>
  );
}

// --- Step 2 ---
function Step2({ motif, onMotifChange, onNext, onPrev }: {
  motif: string; onMotifChange: (v: string) => void;
  onNext: () => void; onPrev: () => void;
}) {
  const canProceed = motif.trim().length >= 3;
  const suggestions = [
    "Horgászbot és beer", "Focilabda és koronás király", "Macska fejhallgatóval",
    "Vintage motorkerékpár", "Hegyi táj holdas éjszakával", "Chef sapkás szakács",
    "Gitározó medve", "Golf ütő és csillag", "Koffein-függő koponya",
  ];
  return (
    <div className="wizard-step-content">
      <div className="form-group">
        <label htmlFor="motif-input">Mi legyen a fő motívum?</label>
        <textarea id="motif-input" value={motif} onChange={(e) => onMotifChange(e.target.value)}
          placeholder="Pl. Egy horgászbot és egy söröskorsó, vicces felirattal..."
          maxLength={200} rows={3} className="motif-textarea" />
        <span className="char-count">{motif.length}/200</span>
      </div>
      <div className="suggestions-label">Ötletek (kattintásra másolható):</div>
      <div className="suggestions-grid">
        {suggestions.map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => onMotifChange(s)} type="button">{s}</button>
        ))}
      </div>
      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button">← Vissza</button>
        <button className="wizard-next-btn" onClick={onNext} disabled={!canProceed} type="button">Tovább →</button>
      </div>
    </div>
  );
}

// --- Step 3 ---
function Step3({ contentType, onContentTypeChange, onNext, onPrev }: {
  contentType: ContentType; onContentTypeChange: (v: ContentType) => void;
  onNext: () => void; onPrev: () => void;
}) {
  return (
    <div className="wizard-step-content">
      <div className="content-type-grid">
        {CONTENT_TYPE_OPTIONS.map((opt) => (
          <button key={opt.value} id={`content-type-${opt.value}`}
            className={`content-type-card ${contentType === opt.value ? "selected" : ""}`}
            onClick={() => onContentTypeChange(opt.value)} type="button">
            <span className="card-icon">{opt.icon}</span>
            <span className="card-label">{opt.label}</span>
            <span className="card-desc">{opt.description}</span>
          </button>
        ))}
      </div>
      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button">← Vissza</button>
        <button className="wizard-next-btn" onClick={onNext} type="button">Tovább →</button>
      </div>
    </div>
  );
}

// --- Step 4 ---
function Step4({ style, onStyleChange, onGenerate, onPrev, isLoading, phase }: {
  style: string; onStyleChange: (v: string) => void;
  onGenerate: () => void; onPrev: () => void;
  isLoading: boolean; phase: GenerationPhase;
}) {
  return (
    <div className="wizard-step-content">
      <div className="style-card-grid">
        {STYLE_OPTIONS.map((opt) => (
          <button key={opt.value} id={`style-${opt.value}`}
            className={`style-card ${style === opt.value ? "selected" : ""}`}
            onClick={() => onStyleChange(opt.value)} type="button">
            <span className="style-card-icon">{opt.icon}</span>
            <span className="style-card-label">{opt.label}</span>
            <span className="style-card-desc">{opt.description}</span>
          </button>
        ))}
      </div>
      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button" disabled={isLoading}>← Vissza</button>
        <button className="generate-btn" onClick={onGenerate} disabled={!style || isLoading}
          type="button" id="generate-design-btn" style={{ flex: 1 }}>
          {isLoading ? (
            <span className="loading-state">
              <span className="spinner" />
              {PHASE_MESSAGES[phase]}
            </span>
          ) : "✨ Design elkészítése"}
        </button>
      </div>
    </div>
  );
}

// --- Step 5: Termék választó ---
function Step5({ productType, productColor, productSize, designUrl,
  onProductTypeChange, onProductColorChange, onProductSizeChange, onPrev }: {
  productType: ProductType; productColor: ProductColor; productSize: string;
  designUrl: string | null;
  onProductTypeChange: (v: ProductType) => void;
  onProductColorChange: (v: ProductColor) => void;
  onProductSizeChange: (v: string) => void;
  onPrev: () => void;
}) {
  const { addItem, openCart } = useCart();

  const selectedProduct = BASE_PRODUCTS.find(
    (p) => p.type === productType && p.color === productColor
  );

  const canAddToCart = !!productSize && !!selectedProduct;

  const handleAddToCart = () => {
    if (!selectedProduct || !productSize) return;
    addItem({
      id: `${selectedProduct.id}-${Date.now()}`,
      name: selectedProduct.name,
      price: selectedProduct.price,
      size: productSize,
      color: selectedProduct.colorLabel,
      quantity: 1,
      designUrl: designUrl ?? undefined,
      isCustom: true,
    });
    openCart();
  };

  return (
    <div className="wizard-step-content">
      {/* Termék típus */}
      <div className="form-group">
        <label>Mit szeretnél?</label>
        <div className="product-type-grid">
          <button
            className={`product-type-card ${productType === "tshirt" ? "selected" : ""}`}
            onClick={() => onProductTypeChange("tshirt")} type="button" id="product-type-tshirt">
            <span className="product-type-icon">👕</span>
            <span className="product-type-label">Póló</span>
            <span className="product-type-price">8.990 Ft</span>
          </button>
          <button
            className={`product-type-card ${productType === "sweatshirt" ? "selected" : ""}`}
            onClick={() => onProductTypeChange("sweatshirt")} type="button" id="product-type-sweatshirt">
            <span className="product-type-icon">🧥</span>
            <span className="product-type-label">Pulóver</span>
            <span className="product-type-price">14.990 Ft</span>
          </button>
        </div>
      </div>

      {/* Szín */}
      <div className="form-group">
        <label>Melyik színre?</label>
        <div className="color-choice-grid">
          <button
            className={`color-choice-card ${productColor === "black" ? "selected" : ""}`}
            onClick={() => onProductColorChange("black")} type="button" id="color-choice-black">
            <span className="color-choice-swatch" style={{ background: "#1a1a1a" }} />
            <span>Fekete</span>
          </button>
          <button
            className={`color-choice-card ${productColor === "white" ? "selected" : ""}`}
            onClick={() => onProductColorChange("white")} type="button" id="color-choice-white">
            <span className="color-choice-swatch" style={{ background: "#fff", border: "1px solid #ccc" }} />
            <span>Fehér</span>
          </button>
        </div>
      </div>

      {/* Méret */}
      <div className="form-group">
        <label>Melyik méret?</label>
        <div className="size-picker">
          {SIZES.map((s) => (
            <button key={s} className={`size-btn ${productSize === s ? "active" : ""}`}
              onClick={() => onProductSizeChange(s)} type="button" id={`size-choice-${s}`}>
              {s}
            </button>
          ))}
        </div>
        {!productSize && <p className="size-hint">⚠️ Válassz méretet a hozzáadáshoz!</p>}
      </div>

      {selectedProduct && (
        <div className="product-summary-band">
          <span>{selectedProduct.name}</span>
          <strong>{selectedProduct.price.toLocaleString("hu-HU")} Ft</strong>
        </div>
      )}

      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button">← Vissza</button>
        <button
          className={`add-to-cart-btn ${!canAddToCart ? "disabled" : ""}`}
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          type="button"
          id="wizard-add-to-cart-btn"
          style={{ flex: 1 }}
        >
          🛒 Kosárba – {selectedProduct?.price.toLocaleString("hu-HU")} Ft
        </button>
      </div>
    </div>
  );
}

const PHASE_MESSAGES: Record<GenerationPhase, string> = {
  idle: "",
  prompting: "Threads & Ink koncepció kidolgozása...",
  generating: "Prémium grafika szintézise...",
  polishing: "Művészi simítások alkalmazása...",
  uploading: "Nyomtatási sablon előkészítése...",
};

// --- Main Wizard ---
export function DesignWizard({
  occasion, recipient, motif, style, contentType,
  wizardStep, isLoading, phase, error, designUrl,
  productType, productColor, productSize,
  onOccasionChange, onRecipientChange, onMotifChange, onStyleChange, onContentTypeChange,
  onProductTypeChange, onProductColorChange, onProductSizeChange,
  onNextStep, onPrevStep, onGenerate, onReset,
}: WizardProps) {
  const designSteps = [1, 2, 3, 4] as WizardStep[];
  const isProductStep = wizardStep === 5;

  return (
    <div className="wizard-container">
      {/* Header */}
      <div className="controls-header">
        <div className="hero-badge">✧ Threads & Ink Studio</div>
        <h1>AI Design Wizard</h1>
        <p className="subtitle">Tervezz prémium darabokat mesterséges intelligenciával.</p>
      </div>

      {/* Stepper – csak a design lépéseknél */}
      {!isProductStep && (
        <div className="stepper" role="progressbar" aria-valuenow={wizardStep} aria-valuemax={4}>
          {designSteps.map((step) => (
            <div key={step}
              className={`stepper-item ${wizardStep >= step ? "active" : ""} ${wizardStep === step ? "current" : ""}`}>
              <div className="stepper-dot">{wizardStep > step ? "✓" : step}</div>
              {step < 4 && <div className="stepper-line" />}
            </div>
          ))}
        </div>
      )}

      {/* Step 5 progress badge */}
      {isProductStep && (
        <div className="step5-badge">
          <span className="step5-check">✓</span> Design kész! Most válaszd ki a terméket.
        </div>
      )}

      {/* Lépés cím */}
      <div className="step-header">
        <h2 className="step-title">{STEP_TITLES[wizardStep]}</h2>
        <p className="step-subtitle">{STEP_SUBTITLES[wizardStep]}</p>
      </div>

      {wizardStep === 1 && <Step1 occasion={occasion} recipient={recipient}
        onOccasionChange={onOccasionChange} onRecipientChange={onRecipientChange} onNext={onNextStep} />}
      {wizardStep === 2 && <Step2 motif={motif} onMotifChange={onMotifChange}
        onNext={onNextStep} onPrev={onPrevStep} />}
      {wizardStep === 3 && <Step3 contentType={contentType} onContentTypeChange={onContentTypeChange}
        onNext={onNextStep} onPrev={onPrevStep} />}
      {wizardStep === 4 && <Step4 style={style} onStyleChange={onStyleChange}
        onGenerate={onGenerate} onPrev={onPrevStep} isLoading={isLoading} phase={phase} />}
      {wizardStep === 5 && <Step5
        productType={productType} productColor={productColor} productSize={productSize}
        designUrl={designUrl}
        onProductTypeChange={onProductTypeChange}
        onProductColorChange={onProductColorChange}
        onProductSizeChange={onProductSizeChange}
        onPrev={() => onPrevStep()} />}

      {error && <div className="error-message" role="alert">{error}</div>}

      {designUrl && !isLoading && wizardStep === 5 && (
        <button className="reset-btn" onClick={onReset} type="button" id="reset-wizard-btn">
          🔄 Új design tervezése
        </button>
      )}
    </div>
  );
}
