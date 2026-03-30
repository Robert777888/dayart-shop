"use client";

import { notFound } from "next/navigation";
import { useState } from "react";
import { PRODUCTS } from "@/data/products";
import { useCart } from "@/context/CartContext";

const SIZE_GUIDE = [
  { size: "XS", chest: "82-87", length: "65" },
  { size: "S", chest: "88-93", length: "68" },
  { size: "M", chest: "94-99", length: "71" },
  { size: "L", chest: "100-105", length: "74" },
  { size: "XL", chest: "106-111", length: "77" },
  { size: "XXL", chest: "112-117", length: "80" },
];

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = PRODUCTS.find((p) => p.id === params.id);
  if (!product) notFound();

  const { addItem, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor.name,
      quantity,
      isCustom: product.category === "custom",
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    openCart();
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <main className="product-page">
      <div className="product-detail">
        {/* Left: Image */}
        <div className="product-detail-img">
          <div className="product-detail-img-wrap">
            <span className="product-detail-emoji">👕</span>
            {product.isNew && <span className="product-detail-badge new">Új</span>}
            {product.category === "limited" && (
              <span className="product-detail-badge limited">🔥 Limitált – {product.stock} db maradt</span>
            )}
          </div>
          <div className="product-detail-thumbnails">
            {[1, 2, 3].map((i) => (
              <div key={i} className="product-thumbnail">👕</div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="product-detail-info">
          <nav className="breadcrumb" aria-label="Oldalsáv navigáció">
            <a href="/shop">Kollekció</a>
            <span>›</span>
            <span>{product.name}</span>
          </nav>

          <h1 className="product-detail-name">{product.name}</h1>

          {/* Rating */}
          <div className="product-detail-rating">
            <span className="stars-lg">{"★".repeat(Math.round(product.rating))}</span>
            <span className="rating-score">{product.rating}</span>
            <span className="rating-count-lg">({product.reviewCount} vélemény)</span>
          </div>

          {/* Price */}
          <div className="product-detail-price">
            <span className="price-main">{product.price.toLocaleString("hu-HU")} Ft</span>
            {product.originalPrice && (
              <>
                <span className="price-orig">{product.originalPrice.toLocaleString("hu-HU")} Ft</span>
                <span className="price-discount">-{discount}%</span>
              </>
            )}
          </div>

          <p className="product-detail-desc">{product.description}</p>

          {/* Color Picker */}
          <div className="picker-group">
            <label className="picker-label">
              Szín: <strong>{selectedColor.name}</strong>
            </label>
            <div className="color-picker">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  className={`color-btn ${selectedColor.name === c.name ? "active" : ""}`}
                  style={{ background: c.hex, border: c.hex === "#FFFFFF" ? "1px solid #e5e7eb" : "none" }}
                  onClick={() => setSelectedColor(c)}
                  title={c.name}
                  id={`color-${c.name.toLowerCase().replace(/\s+/g, "-")}`}
                />
              ))}
            </div>
          </div>

          {/* Size Picker */}
          <div className="picker-group">
            <div className="picker-label-row">
              <label className="picker-label">Méret</label>
              <button
                className="size-guide-link"
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                id="size-guide-toggle"
              >
                📏 Mérettáblázat
              </button>
            </div>
            <div className="size-picker">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`size-btn ${selectedSize === size ? "active" : ""}`}
                  onClick={() => setSelectedSize(size)}
                  id={`size-${size}`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="size-hint">⚠️ Kérjük, válassz méretet!</p>
            )}

            {/* Size Guide */}
            {showSizeGuide && (
              <div className="size-guide-table">
                <table>
                  <thead>
                    <tr><th>Méret</th><th>Mellbőség (cm)</th><th>Hossz (cm)</th></tr>
                  </thead>
                  <tbody>
                    {SIZE_GUIDE.filter((r) => product.sizes.includes(r.size)).map((row) => (
                      <tr key={row.size}>
                        <td><strong>{row.size}</strong></td>
                        <td>{row.chest}</td>
                        <td>{row.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="picker-group">
            <label className="picker-label">Mennyiség</label>
            <div className="qty-picker">
              <button className="qty-btn-lg" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
              <span className="qty-value-lg">{quantity}</span>
              <button className="qty-btn-lg" onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className={`add-to-cart-btn ${!selectedSize ? "disabled" : ""} ${addedToCart ? "success" : ""}`}
            onClick={handleAddToCart}
            disabled={!selectedSize}
            id="add-to-cart-btn"
          >
            {addedToCart ? "✓ Kosárba helyezve!" : "🛒 Kosárba"}
          </button>

          {/* Product details */}
          <div className="product-specs">
            <div className="spec-row"><span>Anyag</span><span>{product.material}</span></div>
            <div className="spec-row"><span>Szabás</span><span>{product.fit}</span></div>
            <div className="spec-row"><span>Nyomtatási terület</span><span>{product.printArea}</span></div>
          </div>

          {/* Trust badges */}
          <div className="trust-badges">
            <span>🚚 Ingyen szállítás 20.000 Ft felett</span>
            <span>🔄 30 nap visszaküldés</span>
            <span>🌿 GOTS organikus</span>
          </div>
        </div>
      </div>
    </main>
  );
}
