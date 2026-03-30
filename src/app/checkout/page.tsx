"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { SHIPPING_INFO } from "@/data/products";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirm";

interface ShippingForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  zip: string;
  city: string;
  address: string;
  shippingMethod: "standard" | "express";
  comment: string;
}

const INITIAL_FORM: ShippingForm = {
  firstName: "", lastName: "", email: "", phone: "",
  country: "Magyarország", zip: "", city: "", address: "",
  shippingMethod: "standard", comment: "",
};

export default function CheckoutPage() {
  const { state, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [form, setForm] = useState<ShippingForm>(INITIAL_FORM);
  const [placed, setPlaced] = useState(false);
  const [orderNum] = useState(() => `DTF-${Date.now().toString(36).toUpperCase()}`);

  const shipping = SHIPPING_INFO[form.shippingMethod];
  const shippingCost = totalPrice >= 20000 ? 0 : shipping.price;
  const grandTotal = totalPrice + shippingCost;

  const updateForm = (key: keyof ShippingForm, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const canProceedShipping =
    form.firstName && form.lastName && form.email && form.phone &&
    form.zip && form.city && form.address;

  const handlePlaceOrder = () => {
    clearCart();
    setPlaced(true);
  };

  if (placed) {
    return (
      <main className="checkout-page">
        <div className="order-success">
          <div className="order-success-icon">🎉</div>
          <h1>Rendelés leadva!</h1>
          <p>Köszönjük rendelését! A visszaigazolást elküldtük a megadott e-mail-re.</p>
          <div className="order-num">
            Rendelésszám: <strong>{orderNum}</strong>
          </div>
          <div className="order-success-info">
            <div>📦 Szállítás: {SHIPPING_INFO[form.shippingMethod].days}</div>
            <div>📧 Visszaigazolás: {form.email}</div>
          </div>
          <a href="/" className="order-success-btn" id="order-success-home-btn">
            Vissza a főoldalra
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <h1 className="checkout-title">Megrendelés</h1>

      {/* Step Indicator */}
      <div className="checkout-steps">
        {(["cart", "shipping", "payment", "confirm"] as CheckoutStep[]).map((s, i) => {
          const labels: Record<CheckoutStep, string> = {
            cart: "Kosár", shipping: "Szállítás", payment: "Fizetés", confirm: "Összegzés",
          };
          const stepNums: Record<CheckoutStep, number> = { cart: 0, shipping: 1, payment: 2, confirm: 3 };
          const current = stepNums[step];
          const active = i <= current;
          return (
            <div key={s} className={`checkout-step-item ${active ? "active" : ""} ${i === current ? "current" : ""}`}>
              <div className="checkout-step-dot">{i < current ? "✓" : i + 1}</div>
              <span className="checkout-step-label">{labels[s]}</span>
              {i < 3 && <div className={`checkout-step-line ${i < current ? "filled" : ""}`} />}
            </div>
          );
        })}
      </div>

      <div className="checkout-layout">
        {/* Main Content */}
        <div className="checkout-main">

          {/* STEP: CART */}
          {step === "cart" && (
            <div className="checkout-section">
              <h2>1. Kosár áttekintése</h2>
              {state.items.length === 0 ? (
                <div className="checkout-empty">
                  <p>A kosár üres.</p>
                  <a href="/shop" className="checkout-empty-btn">Vásárlás folytatása</a>
                </div>
              ) : (
                <>
                  {state.items.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color}`} className="checkout-item">
                      <div className="checkout-item-emoji">👕</div>
                      <div className="checkout-item-info">
                        <p className="checkout-item-name">{item.name}</p>
                        <p className="checkout-item-meta">{item.color} · {item.size} · {item.quantity} db</p>
                      </div>
                      <span className="checkout-item-price">{(item.price * item.quantity).toLocaleString("hu-HU")} Ft</span>
                    </div>
                  ))}
                  <button className="checkout-next-btn" onClick={() => setStep("shipping")} id="checkout-to-shipping-btn">
                    Tovább a szállításhoz →
                  </button>
                </>
              )}
            </div>
          )}

          {/* STEP: SHIPPING */}
          {step === "shipping" && (
            <div className="checkout-section">
              <h2>1. Szállítási adatok</h2>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="firstName">Keresztnév *</label>
                  <input id="firstName" type="text" value={form.firstName} onChange={(e) => updateForm("firstName", e.target.value)} placeholder="Pl. Péter" />
                </div>
                <div className="form-field">
                  <label htmlFor="lastName">Vezetéknév *</label>
                  <input id="lastName" type="text" value={form.lastName} onChange={(e) => updateForm("lastName", e.target.value)} placeholder="Pl. Kovács" />
                </div>
                <div className="form-field full">
                  <label htmlFor="email">E-mail *</label>
                  <input id="email" type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="pelda@email.hu" />
                </div>
                <div className="form-field">
                  <label htmlFor="phone">Telefonszám *</label>
                  <input id="phone" type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="+36 30 123 4567" />
                </div>
                <div className="form-field">
                  <label htmlFor="country">Ország</label>
                  <input id="country" type="text" value={form.country} onChange={(e) => updateForm("country", e.target.value)} />
                </div>
                <div className="form-field half">
                  <label htmlFor="zip">Irányítószám *</label>
                  <input id="zip" type="text" value={form.zip} onChange={(e) => updateForm("zip", e.target.value)} placeholder="1234" maxLength={4} />
                </div>
                <div className="form-field">
                  <label htmlFor="city">Város *</label>
                  <input id="city" type="text" value={form.city} onChange={(e) => updateForm("city", e.target.value)} placeholder="Budapest" />
                </div>
                <div className="form-field full">
                  <label htmlFor="address">Cím (utca, házszám) *</label>
                  <input id="address" type="text" value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="Fő utca 1." />
                </div>
                <div className="form-field full">
                  <label htmlFor="comment">Megjegyzés (opcionális)</label>
                  <textarea id="comment" value={form.comment} onChange={(e) => updateForm("comment", e.target.value)} rows={2} placeholder="Kapucsengő neve, stb." />
                </div>
              </div>

              {/* Shipping Method */}
              <h3 className="shipping-method-title">Szállítási mód</h3>
              <div className="shipping-methods">
                {(["standard", "express"] as const).map((method) => {
                  const info = SHIPPING_INFO[method];
                  const cost = totalPrice >= 20000 && method === "standard" ? 0 : info.price;
                  return (
                    <button
                      key={method}
                      className={`shipping-method-card ${form.shippingMethod === method ? "active" : ""}`}
                      onClick={() => updateForm("shippingMethod", method)}
                      id={`shipping-${method}`}
                    >
                      <div className="shipping-method-top">
                        <div className={`shipping-radio ${form.shippingMethod === method ? "checked" : ""}`} />
                        <div>
                          <strong>{info.name}</strong>
                          <p>{info.description}</p>
                          <p className="shipping-days">⏱ {info.days}</p>
                        </div>
                      </div>
                      <span className="shipping-price">
                        {cost === 0 ? "Ingyenes 🎉" : `${cost.toLocaleString("hu-HU")} Ft`}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="checkout-nav">
                <button className="checkout-back-btn" onClick={() => setStep("cart")}>← Vissza</button>
                <button
                  className="checkout-next-btn"
                  onClick={() => setStep("payment")}
                  disabled={!canProceedShipping}
                  id="checkout-to-payment-btn"
                >
                  Tovább a fizetéshez →
                </button>
              </div>
            </div>
          )}

          {/* STEP: PAYMENT */}
          {step === "payment" && (
            <div className="checkout-section">
              <h2>2. Fizetési mód</h2>
              <div className="payment-methods">
                <div className="payment-card active" id="payment-card">
                  <div className="payment-card-header">
                    <span>💳 Bankkártyás fizetés</span>
                    <span className="payment-secure">🔒 SSL titkosítás</span>
                  </div>
                  <p className="payment-info-text">Simplepay / Barion biztonságos fizetési átirányítás. A kártyaadatait mi nem tároljuk.</p>
                  <div className="payment-card-form">
                    <div className="form-field full">
                      <label>Kártyaszám</label>
                      <input type="text" placeholder="•••• •••• •••• ••••" maxLength={19} id="card-number" />
                    </div>
                    <div className="form-field half">
                      <label>Lejárat</label>
                      <input type="text" placeholder="HH/ÉÉ" maxLength={5} id="card-expiry" />
                    </div>
                    <div className="form-field half">
                      <label>CVV</label>
                      <input type="text" placeholder="•••" maxLength={4} id="card-cvv" />
                    </div>
                    <div className="form-field full">
                      <label>Kártyán szereplő név</label>
                      <input type="text" placeholder="KOVÁCS PÉTER" id="card-name" />
                    </div>
                  </div>
                </div>
                <div className="payment-card" id="payment-transfer">
                  <div className="payment-card-header">
                    <span>🏦 Banki átutalás</span>
                  </div>
                  <p className="payment-info-text">Átutalás esetén a rendelés csak a beérkezés után kerül feldolgozásra (1-2 banki nap).</p>
                </div>
              </div>
              <div className="checkout-nav">
                <button className="checkout-back-btn" onClick={() => setStep("shipping")}>← Vissza</button>
                <button className="checkout-next-btn" onClick={() => setStep("confirm")} id="checkout-to-confirm-btn">
                  Összegzés →
                </button>
              </div>
            </div>
          )}

          {/* STEP: CONFIRM */}
          {step === "confirm" && (
            <div className="checkout-section">
              <h2>3. Rendelés összegzése</h2>
              <div className="confirm-block">
                <h3>Szállítási cím</h3>
                <p>{form.lastName} {form.firstName}</p>
                <p>{form.zip} {form.city}, {form.address}</p>
                <p>{form.email} · {form.phone}</p>
              </div>
              <div className="confirm-block">
                <h3>Tételek</h3>
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="confirm-item">
                    <span>{item.name} ({item.size}, {item.color}) × {item.quantity}</span>
                    <span>{(item.price * item.quantity).toLocaleString("hu-HU")} Ft</span>
                  </div>
                ))}
              </div>
              <div className="checkout-nav">
                <button className="checkout-back-btn" onClick={() => setStep("payment")}>← Vissza</button>
                <button className="checkout-place-btn" onClick={handlePlaceOrder} id="place-order-btn">
                  ✅ Rendelés leadása ({grandTotal.toLocaleString("hu-HU")} Ft)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="checkout-sidebar">
          <div className="order-summary">
            <h3>Rendelés összege</h3>
            {state.items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="summary-item">
                <span>{item.name} ×{item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString("hu-HU")} Ft</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row">
              <span>Részösszeg</span>
              <span>{totalPrice.toLocaleString("hu-HU")} Ft</span>
            </div>
            <div className="summary-row">
              <span>Szállítás</span>
              <span>{shippingCost === 0 ? "Ingyenes" : `${shippingCost.toLocaleString("hu-HU")} Ft`}</span>
            </div>
            <div className="summary-row total">
              <span>Összesen</span>
              <span>{grandTotal.toLocaleString("hu-HU")} Ft</span>
            </div>
            <div className="summary-badges">
              <span>🔒 Biztonságos fizetés</span>
              <span>🔄 30 nap visszaküldés</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
