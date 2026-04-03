"use client";

import { OCCASION_OPTIONS, STYLE_OPTIONS, CONTENT_TYPE_OPTIONS } from "@/types";
import type { ContentType, ProductType, ProductColor } from "@/hooks/useGenerator";
import { useCart } from "@/context/CartContext";
import { BASE_PRODUCTS } from "@/data/products";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

export function StepProductChoice({
  productType,
  productColor,
  onProductTypeChange,
  onProductColorChange,
  onNext,
}: {
  productType: ProductType;
  productColor: ProductColor;
  onProductTypeChange: (v: ProductType) => void;
  onProductColorChange: (v: ProductColor) => void;
  onNext: () => void;
}) {
  const options = BASE_PRODUCTS.filter((product) => product.type === "tshirt" || product.type === "sweatshirt");
  const canProceed = !!productType && !!productColor;

  return (
    <div className="wizard-step-content">
      <div className="product-choice-grid">
        {options.map((option) => (
          <button
            key={option.id}
            className={`product-choice-card ${productType === option.type && productColor === option.color ? "selected" : ""}`}
            onClick={() => {
              onProductTypeChange(option.type);
              onProductColorChange(option.color);
            }}
            type="button"
            id={`product-choice-${option.id}`}
          >
            <span className="product-choice-swatch" style={{ background: option.colorHex }} />
            <span className="product-choice-label">{option.name}</span>
            <span className="product-choice-price">{option.price.toLocaleString("hu-HU")} Ft</span>
          </button>
        ))}
      </div>
      <div className="product-choice-note">
        A kiválasztott alap az előnézeten is azonnal látszik.
      </div>
      <button className="wizard-next-btn" onClick={onNext} disabled={!canProceed} type="button">
        Tovább →
      </button>
    </div>
  );
}

export function StepOccasionRecipient({
  occasion,
  recipient,
  onOccasionChange,
  onRecipientChange,
  onNext,
}: {
  occasion: string;
  recipient: string;
  onOccasionChange: (v: string) => void;
  onRecipientChange: (v: string) => void;
  onNext: () => void;
}) {
  const canProceed = occasion !== "" && recipient.trim() !== "";

  return (
    <div className="wizard-step-content">
      <div className="form-group">
        <label htmlFor="occasion-select">Mi az alkalom?</label>
        <div className="select-grid">
          {OCCASION_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              id={`occasion-${opt.value}`}
              className={`option-pill ${occasion === opt.value ? "selected" : ""}`}
              onClick={() => onOccasionChange(opt.value)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
      <div className="form-group" style={{ marginTop: "24px" }}>
        <label htmlFor="recipient-input">Kinek szánjuk?</label>
        <input
          id="recipient-input"
          type="text"
          value={recipient}
          onChange={(e) => onRecipientChange(e.target.value)}
          placeholder="Pl. Édesapám, Barátnőm, A csapat..."
          maxLength={60}
          autoComplete="off"
        />
        <span className="char-count">{recipient.length}/60</span>
      </div>
      <button className="wizard-next-btn" onClick={onNext} disabled={!canProceed} type="button">
        Tovább →
      </button>
    </div>
  );
}

export function StepMotif({
  motif,
  onMotifChange,
  onNext,
  onPrev,
}: {
  motif: string;
  onMotifChange: (v: string) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const canProceed = motif.trim().length >= 3;
  const suggestions = [
    "Horgászbot és beer",
    "Focilabda és koronás király",
    "Macska fejhallgatóval",
    "Vintage motorkerékpár",
    "Hegyi táj holdas éjszakával",
    "Chef sapkás szakács",
    "Gitározó medve",
    "Golf ütő és csillag",
    "Koffein-függő koponya",
  ];

  return (
    <div className="wizard-step-content">
      <div className="form-group">
        <label htmlFor="motif-input">Mi legyen a fő motívum?</label>
        <textarea
          id="motif-input"
          value={motif}
          onChange={(e) => onMotifChange(e.target.value)}
          placeholder="Pl. Egy horgászbot és egy söröskorsó, vicces felirattal..."
          maxLength={200}
          rows={3}
          className="motif-textarea"
        />
        <span className="char-count">{motif.length}/200</span>
      </div>
      <div className="suggestions-label">Ötletek (kattintásra másolható):</div>
      <div className="suggestions-grid">
        {suggestions.map((s) => (
          <button key={s} className="suggestion-chip" onClick={() => onMotifChange(s)} type="button">
            {s}
          </button>
        ))}
      </div>
      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button">
          ← Vissza
        </button>
        <button className="wizard-next-btn" onClick={onNext} disabled={!canProceed} type="button">
          Tovább →
        </button>
      </div>
    </div>
  );
}

export function StepContentType({
  contentType,
  onContentTypeChange,
  onNext,
  onPrev,
}: {
  contentType: ContentType;
  onContentTypeChange: (v: ContentType) => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  return (
    <div className="wizard-step-content">
      <div className="content-type-grid">
        {CONTENT_TYPE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            id={`content-type-${opt.value}`}
            className={`content-type-card ${contentType === opt.value ? "selected" : ""}`}
            onClick={() => onContentTypeChange(opt.value)}
            type="button"
          >
            <span className="card-icon">{opt.icon}</span>
            <span className="card-label">{opt.label}</span>
            <span className="card-desc">{opt.description}</span>
          </button>
        ))}
      </div>
      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button">
          ← Vissza
        </button>
        <button className="wizard-next-btn" onClick={onNext} type="button">
          Tovább →
        </button>
      </div>
    </div>
  );
}

export function StepStyle({
  style,
  onStyleChange,
  onGenerate,
  onPrev,
  isLoading,
  phaseLabel,
}: {
  style: string;
  onStyleChange: (v: string) => void;
  onGenerate: () => void;
  onPrev: () => void;
  isLoading: boolean;
  phaseLabel: string;
}) {
  return (
    <div className="wizard-step-content">
      <div className="style-card-grid">
        {STYLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            id={`style-${opt.value}`}
            className={`style-card ${style === opt.value ? "selected" : ""}`}
            onClick={() => onStyleChange(opt.value)}
            type="button"
          >
            <span className="style-card-icon">{opt.icon}</span>
            <span className="style-card-label">{opt.label}</span>
            <span className="style-card-desc">{opt.description}</span>
          </button>
        ))}
      </div>
      <div className="wizard-nav">
        <button className="wizard-back-btn" onClick={onPrev} type="button" disabled={isLoading}>
          ← Vissza
        </button>
        <button
          className="generate-btn"
          onClick={onGenerate}
          disabled={!style || isLoading}
          type="button"
          id="generate-design-btn"
          style={{ flex: 1 }}
        >
          {isLoading ? (
            <span className="loading-state">
              <span className="spinner" />
              {phaseLabel || "Indul..."}
            </span>
          ) : "✨ Design elkészítése"}
        </button>
      </div>
    </div>
  );
}

export function StepSizeAndCart({
  productType,
  productColor,
  productSize,
  designUrl,
  onProductSizeChange,
  onPrev,
}: {
  productType: ProductType;
  productColor: ProductColor;
  productSize: string;
  designUrl: string | null;
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
      <div className="product-summary-band">
        <span>Választott alap</span>
        <strong>{productType === "tshirt" ? "Póló" : "Pulóver"} · {productColor === "white" ? "Fehér" : "Fekete"}</strong>
      </div>

      <div className="form-group">
        <label>Melyik méret?</label>
        <div className="size-picker">
          {SIZES.map((s) => (
            <button
              key={s}
              className={`size-btn ${productSize === s ? "active" : ""}`}
              onClick={() => onProductSizeChange(s)}
              type="button"
              id={`size-choice-${s}`}
            >
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
        <button className="wizard-back-btn" onClick={onPrev} type="button">
          ← Vissza
        </button>
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
