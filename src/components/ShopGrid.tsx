"use client";

import Link from "next/link";
import { useState } from "react";
import { PRODUCTS, CATEGORIES } from "@/data/products";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [hovering, setHovering] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: "M",
      color: product.colors[0].name,
      quantity: 1,
      isCustom: product.category === "custom",
    });
  };

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/shop/${product.id}`}
      className="product-card"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      id={`product-${product.id}`}
    >
      {/* Badges */}
      <div className="product-badges">
        {product.isNew && <span className="badge badge-new">Új</span>}
        {product.isBestseller && <span className="badge badge-bestseller">Bestseller</span>}
        {discount && <span className="badge badge-sale">-{discount}%</span>}
        {product.category === "limited" && <span className="badge badge-limited">🔥 Limitált</span>}
      </div>

      {/* Image Mockup */}
      <div className="product-img-wrap" style={{ padding: '0px' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/mockups/${product.id === 'custom-tshirt' ? 'tshirt-black-premium.png' : (product.id.includes('tshirt') ? product.id + '-premium.png' : product.id + '.svg')}`}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
        {product.category === "custom" && (
          <span className="product-img-ai-badge" style={{ position: 'absolute', bottom: '80px', pointerEvents: 'none' }}>✨ AI</span>
        )}

        {/* Color swatches */}
        <div className="product-colors">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              className="color-swatch"
              style={{ background: c.hex, border: c.hex === "#FFFFFF" ? "1px solid #e5e7eb" : "none" }}
              title={c.name}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="color-swatch-more">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Quick Add (hover) */}
        <button
          className={`product-quick-add ${hovering ? "visible" : ""}`}
          onClick={handleQuickAdd}
          id={`quick-add-${product.id}`}
          aria-label={`${product.name} gyors kosárba helyezés`}
        >
          + Kosárba
        </button>
      </div>

      {/* Info */}
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <span className="stars">{"★".repeat(Math.round(product.rating))}{"☆".repeat(5 - Math.round(product.rating))}</span>
          <span className="rating-count">({product.reviewCount})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">{product.price.toLocaleString("hu-HU")} Ft</span>
          {product.originalPrice && (
            <span className="product-orig-price">{product.originalPrice.toLocaleString("hu-HU")} Ft</span>
          )}
        </div>
        {product.stock <= 20 && product.stock > 0 && (
          <p className="product-stock-warn">⚡ Csak {product.stock} db maradt!</p>
        )}
      </div>
    </Link>
  );
}

export function ShopGrid() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = PRODUCTS
    .filter((p) => {
      const matchCat = activeCategory === "all" || p.category === activeCategory;
      const matchSearch = searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "new") return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0;
    });

  return (
    <div className="shop-layout">
      {/* Filters Bar */}
      <div className="shop-filters">
        {/* Search */}
        <div className="shop-search-wrap">
          <svg className="shop-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Keresés..."
            className="shop-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            id="shop-search-input"
          />
        </div>

        {/* Categories */}
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`category-pill ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
              id={`category-${cat.id}`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          className="shop-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          id="shop-sort-select"
        >
          <option value="default">Rendezés: Ajánlott</option>
          <option value="price-asc">Ár: alacsony → magas</option>
          <option value="price-desc">Ár: magas → alacsony</option>
          <option value="rating">Értékelés szerint</option>
          <option value="new">Legújabbak</option>
        </select>
      </div>

      {/* Results count */}
      <p className="shop-result-count">
        {filtered.length} termék
      </p>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="shop-empty">
          <span>🔍</span>
          <p>Nincs találat. Próbálj más keresési feltételt!</p>
        </div>
      )}
    </div>
  );
}
