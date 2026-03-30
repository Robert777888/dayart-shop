"use client";

import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";

function CartItemRow({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className="cart-item">
      <div className="cart-item-img">
        <span className="cart-item-emoji">👕</span>
      </div>
      <div className="cart-item-info">
        <p className="cart-item-name">{item.name}</p>
        <p className="cart-item-meta">
          {item.color} · {item.size}
          {item.isCustom && <span className="cart-item-badge">✨ Egyedi</span>}
        </p>
        <div className="cart-item-controls">
          <div className="qty-control">
            <button
              className="qty-btn"
              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
              aria-label="Csökkentés"
            >
              −
            </button>
            <span className="qty-value">{item.quantity}</span>
            <button
              className="qty-btn"
              onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
              aria-label="Növelés"
            >
              +
            </button>
          </div>
          <span className="cart-item-price">{(item.price * item.quantity).toLocaleString("hu-HU")} Ft</span>
        </div>
      </div>
      <button
        className="cart-item-remove"
        onClick={() => removeItem(item.id, item.size, item.color)}
        aria-label="Eltávolítás"
      >
        ✕
      </button>
    </div>
  );
}

export function CartDrawer() {
  const { state, closeCart, totalItems, totalPrice, clearCart } = useCart();
  const FREE_SHIPPING_THRESHOLD = 20000;
  const STANDARD_SHIPPING = 990;
  const remaining = FREE_SHIPPING_THRESHOLD - totalPrice;
  const shippingCost = totalPrice >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING;
  const grandTotal = totalPrice + shippingCost;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`cart-backdrop ${state.isOpen ? "open" : ""}`}
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`cart-drawer ${state.isOpen ? "open" : ""}`}
        aria-label="Kosár"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="cart-header">
          <h2 className="cart-title">
            Kosár
            {totalItems > 0 && <span className="cart-count">{totalItems} db</span>}
          </h2>
          <button className="cart-close-btn" onClick={closeCart} id="cart-close-btn" aria-label="Kosár bezárása">
            ✕
          </button>
        </div>

        {/* Free shipping progress */}
        {totalItems > 0 && remaining > 0 && (
          <div className="cart-shipping-progress">
            <p className="cart-shipping-text">
              Még <strong>{remaining.toLocaleString("hu-HU")} Ft</strong> és ingyenes a szállítás! 🚚
            </p>
            <div className="cart-progress-bar">
              <div
                className="cart-progress-fill"
                style={{ width: `${Math.min((totalPrice / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {totalItems > 0 && remaining <= 0 && (
          <div className="cart-shipping-free">
            🎉 Ingyenes szállítás jár rendeléséhez!
          </div>
        )}

        {/* Items */}
        <div className="cart-items">
          {state.items.length === 0 ? (
            <div className="cart-empty">
              <span className="cart-empty-icon">🛍️</span>
              <p>Kosara üres</p>
              <p className="cart-empty-sub">Tervezz egyedi pólót, vagy böngéssz kollekciónkban!</p>
            </div>
          ) : (
            <>
              {state.items.map((item) => (
                <CartItemRow key={`${item.id}-${item.size}-${item.color}`} item={item} />
              ))}
              <button className="cart-clear-btn" onClick={clearCart}>
                Kosár ürítése
              </button>
            </>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="cart-footer">
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Részösszeg</span>
                <span>{totalPrice.toLocaleString("hu-HU")} Ft</span>
              </div>
              <div className="cart-summary-row">
                <span>Szállítás</span>
                <span>{shippingCost === 0 ? "Ingyenes 🎉" : `${shippingCost.toLocaleString("hu-HU")} Ft`}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Összesen</span>
                <span>{grandTotal.toLocaleString("hu-HU")} Ft</span>
              </div>
            </div>
            <a href="/checkout" className="cart-checkout-btn" id="cart-checkout-btn">
              Megrendelés →
            </a>
            <button className="cart-continue-btn" onClick={closeCart}>
              Vásárlás folytatása
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
