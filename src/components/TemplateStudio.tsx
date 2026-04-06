"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/context/CartContext";
import { MockupPreview } from "@/components/MockupPreview";
import { BASE_PRODUCTS } from "@/data/products";
import { MONTH_OPTIONS, TEMPLATE_IDEAS, type TemplateId } from "@/data/templateCatalog";
import type { MockupResponse, SelectionResponse, CartResponse } from "@/types";

interface FamilyMemberInput {
  name: string;
  month: string;
}

interface ComposeTemplateResponse {
  success: boolean;
  designUrl?: string;
  generationId?: string;
  rawAssetId?: string;
  processedAssetId?: string;
  error?: string;
}

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];

const ACTIVE_TEMPLATE_IDS: TemplateId[] = ["vintage_year_badge", "pet_name_emblem", "family_birth_garden"];

function isActiveTemplateId(value: string): value is TemplateId {
  return ACTIVE_TEMPLATE_IDS.includes(value as TemplateId);
}

export function TemplateStudio() {
  const { addItem, openCart } = useCart();

  const [selectedTemplateId, setSelectedTemplateId] = useState<TemplateId>("vintage_year_badge");
  const [productType, setProductType] = useState<"tshirt" | "sweatshirt">("tshirt");
  const [productColor, setProductColor] = useState<"black" | "white">("black");
  const [productSize, setProductSize] = useState("M");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [designUrl, setDesignUrl] = useState<string | null>(null);
  const [processedAssetId, setProcessedAssetId] = useState<string | null>(null);

  const [vintageData, setVintageData] = useState({
    year: "1992",
    name: "LIMITED EDITION",
    city: "BUDAPEST",
    slogan: "CRAFTED FOR LEGENDS",
  });

  const [petData, setPetData] = useState({
    petType: "dog",
    name: "MILO",
    year: "2021",
  });

  const [gardenData, setGardenData] = useState({
    title: "A MI CSALADI KERTUNK",
    members: [
      { name: "ANNA", month: "jan" },
      { name: "MATE", month: "feb" },
    ] as FamilyMemberInput[],
  });

  const baseProducts = useMemo(
    () => BASE_PRODUCTS.filter((p) => p.type === "tshirt" || p.type === "sweatshirt"),
    []
  );

  const selectedProduct = BASE_PRODUCTS.find(
    (p) => p.type === productType && p.color === productColor
  );

  const canGenerate = useMemo(() => {
    if (selectedTemplateId === "vintage_year_badge") {
      return vintageData.year.trim().length === 4 && vintageData.name.trim().length >= 2;
    }
    if (selectedTemplateId === "pet_name_emblem") {
      return petData.name.trim().length >= 2 && petData.year.trim().length === 4;
    }
    return gardenData.title.trim().length >= 3 && gardenData.members.filter((m) => m.name.trim().length >= 2).length >= 2;
  }, [selectedTemplateId, vintageData, petData, gardenData]);

  const buildTemplatePayload = (): Record<string, unknown> => {
    if (selectedTemplateId === "vintage_year_badge") {
      return vintageData;
    }
    if (selectedTemplateId === "pet_name_emblem") {
      return petData;
    }
    return gardenData;
  };

  const handleCompose = async () => {
    if (!canGenerate || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/templates/compose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: selectedTemplateId,
          payload: buildTemplatePayload(),
        }),
      });

      const data = (await response.json()) as ComposeTemplateResponse;

      if (!data.success || !data.designUrl) {
        setError(data.error || "A sablon generalasa sikertelen volt.");
        return;
      }

      setDesignUrl(data.designUrl);
      setProcessedAssetId(data.processedAssetId ?? null);
    } catch (composeError) {
      console.error("[TemplateStudio] compose error", composeError);
      setError("Halozati hiba tortent. Kerlek probald ujra.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !productSize || !designUrl) return;

    let selectionId: string | null = null;
    let cartItemId: string | null = null;
    let mockupAssetId: string | null = null;

    if (processedAssetId) {
      try {
        const mockupRes = await fetch("/api/mockup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            processedAssetId,
            productType,
            productColor,
            product: {
              baseSku: selectedProduct.id,
              color: selectedProduct.colorLabel,
              size: productSize,
              price: selectedProduct.price,
            },
          }),
        });
        const mockupData = (await mockupRes.json()) as MockupResponse;
        mockupAssetId = mockupData.mockupAssetId ?? null;
      } catch (mockupError) {
        console.warn("[TemplateStudio] mockup failed", mockupError);
      }

      try {
        const selectionRes = await fetch("/api/selection", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            processedAssetId,
            mockupAssetId,
            product: {
              baseSku: selectedProduct.id,
              color: selectedProduct.colorLabel,
              size: productSize,
              price: selectedProduct.price,
            },
          }),
        });
        const selectionData = (await selectionRes.json()) as SelectionResponse;
        selectionId = selectionData.selectionId ?? null;
      } catch (selectionError) {
        console.warn("[TemplateStudio] selection save failed", selectionError);
      }
    }

    try {
      const cartRes = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectionId, quantity: 1, price: selectedProduct.price }),
      });
      const cartData = (await cartRes.json()) as CartResponse;
      cartItemId = cartData.cartItemId ?? null;
    } catch (cartError) {
      console.warn("[TemplateStudio] cart save failed", cartError);
    }

    addItem({
      id: `${selectedProduct.id}-${Date.now()}`,
      name: `${selectedProduct.name} · Template`,
      price: selectedProduct.price,
      size: productSize,
      color: selectedProduct.colorLabel,
      quantity: 1,
      designUrl,
      isCustom: true,
      selectionId,
      cartItemId,
    });

    openCart();
  };

  return (
    <section className="template-studio-grid">
      <div className="template-controls">
        <div className="template-panel">
          <h2>1) Valassz sablont</h2>
          <p>Gyors, vezetett szemelyre szabhatosag. Nem nullarol tervezes.</p>

          <div className="template-card-grid">
            {TEMPLATE_IDEAS.map((template) => {
              const isActive = isActiveTemplateId(template.id);
              const isSelected = selectedTemplateId === template.id;

              return (
                <button
                  key={template.id}
                  type="button"
                  className={`template-card ${isSelected ? "selected" : ""}`}
                  disabled={!isActive}
                  onClick={() => {
                    if (!isActive) return;
                    setSelectedTemplateId(template.id as TemplateId);
                    setError(null);
                  }}
                >
                  <div className="template-card-top">
                    <strong>{template.title}</strong>
                    <span className={`template-chip ${template.status === "active" ? "active" : "soon"}`}>
                      {template.status === "active" ? "Aktiv" : "Hamarosan"}
                    </span>
                  </div>
                  <p>{template.subtitle}</p>
                  <div className="template-meta-row">
                    <span>{template.complexity === "easy" ? "Konnyu" : "Kozepes"}</span>
                    <span>{template.avgFillTimeSec} mp kitoltes</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="template-panel">
          <h2>2) Toltsd ki a sablon mezoket</h2>

          {selectedTemplateId === "vintage_year_badge" && (
            <div className="template-form-grid">
              <label>
                Evszam
                <input
                  value={vintageData.year}
                  maxLength={4}
                  onChange={(event) => setVintageData((prev) => ({ ...prev, year: event.target.value.replace(/[^0-9]/g, "") }))}
                />
              </label>
              <label>
                Fo felirat
                <input
                  value={vintageData.name}
                  maxLength={36}
                  onChange={(event) => setVintageData((prev) => ({ ...prev, name: event.target.value.toUpperCase() }))}
                />
              </label>
              <label>
                Varos
                <input
                  value={vintageData.city}
                  maxLength={24}
                  onChange={(event) => setVintageData((prev) => ({ ...prev, city: event.target.value.toUpperCase() }))}
                />
              </label>
              <label>
                Szlogen
                <input
                  value={vintageData.slogan}
                  maxLength={34}
                  onChange={(event) => setVintageData((prev) => ({ ...prev, slogan: event.target.value.toUpperCase() }))}
                />
              </label>
            </div>
          )}

          {selectedTemplateId === "pet_name_emblem" && (
            <div className="template-form-grid">
              <label>
                Kedvenc neve
                <input
                  value={petData.name}
                  maxLength={20}
                  onChange={(event) => setPetData((prev) => ({ ...prev, name: event.target.value.toUpperCase() }))}
                />
              </label>
              <label>
                Evszam
                <input
                  value={petData.year}
                  maxLength={4}
                  onChange={(event) => setPetData((prev) => ({ ...prev, year: event.target.value.replace(/[^0-9]/g, "") }))}
                />
              </label>
              <label>
                Tipus
                <select
                  value={petData.petType}
                  onChange={(event) => setPetData((prev) => ({ ...prev, petType: event.target.value }))}
                >
                  <option value="dog">Kutya</option>
                  <option value="cat">Macska</option>
                </select>
              </label>
            </div>
          )}

          {selectedTemplateId === "family_birth_garden" && (
            <div className="template-form-grid">
              <label>
                Cim
                <input
                  value={gardenData.title}
                  maxLength={34}
                  onChange={(event) => setGardenData((prev) => ({ ...prev, title: event.target.value.toUpperCase() }))}
                />
              </label>

              <div className="family-members-wrap">
                <div className="family-members-header">
                  <strong>Csaladtagok (2-6)</strong>
                  <button
                    type="button"
                    className="mini-btn"
                    onClick={() => {
                      setGardenData((prev) => {
                        if (prev.members.length >= 6) return prev;
                        return {
                          ...prev,
                          members: [...prev.members, { name: "", month: "jan" }],
                        };
                      });
                    }}
                  >
                    + Uj tag
                  </button>
                </div>

                {gardenData.members.map((member, index) => (
                  <div key={`member-${index}`} className="member-row">
                    <input
                      placeholder={`Nev ${index + 1}`}
                      value={member.name}
                      maxLength={18}
                      onChange={(event) => {
                        const next = [...gardenData.members];
                        next[index] = { ...next[index], name: event.target.value.toUpperCase() };
                        setGardenData((prev) => ({ ...prev, members: next }));
                      }}
                    />
                    <select
                      value={member.month}
                      onChange={(event) => {
                        const next = [...gardenData.members];
                        next[index] = { ...next[index], month: event.target.value };
                        setGardenData((prev) => ({ ...prev, members: next }));
                      }}
                    >
                      {MONTH_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="mini-btn danger"
                      onClick={() => {
                        setGardenData((prev) => {
                          if (prev.members.length <= 2) return prev;
                          return {
                            ...prev,
                            members: prev.members.filter((_, itemIndex) => itemIndex !== index),
                          };
                        });
                      }}
                    >
                      Torles
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="generate-btn template-generate" disabled={!canGenerate || isLoading} onClick={handleCompose} type="button">
            {isLoading ? "Sablon generalas..." : "Template design generalasa"}
          </button>

          {error && <p className="template-error">{error}</p>}
        </div>

        <div className="template-panel">
          <h2>3) Termek es kosar</h2>
          <div className="template-product-grid">
            {baseProducts.map((product) => {
              const selected = product.type === productType && product.color === productColor;
              return (
                <button
                  key={product.id}
                  type="button"
                  className={`product-choice-card ${selected ? "selected" : ""}`}
                  onClick={() => {
                    setProductType(product.type);
                    setProductColor(product.color);
                  }}
                >
                  <span className="product-choice-swatch" style={{ background: product.colorHex }} />
                  <span className="product-choice-label">{product.name}</span>
                  <span className="product-choice-price">{product.price.toLocaleString("hu-HU")} Ft</span>
                </button>
              );
            })}
          </div>

          <div className="size-picker">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                className={`size-btn ${productSize === size ? "active" : ""}`}
                onClick={() => setProductSize(size)}
              >
                {size}
              </button>
            ))}
          </div>

          <button
            type="button"
            className={`add-to-cart-btn ${!designUrl ? "disabled" : ""}`}
            onClick={handleAddToCart}
            disabled={!designUrl || !selectedProduct}
          >
            Kosarba rakom ezt a sablont {selectedProduct ? `- ${selectedProduct.price.toLocaleString("hu-HU")} Ft` : ""}
          </button>
        </div>
      </div>

      <div className="template-preview-column">
        <MockupPreview
          designUrl={designUrl}
          isLoading={isLoading}
          phase={isLoading ? "generating" : "idle"}
          productColor={productColor}
          productType={productType}
        />
      </div>
    </section>
  );
}
