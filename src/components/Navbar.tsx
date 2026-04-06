"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Navbar() {
  const { totalItems, toggleCart } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/designer", label: "Tervező" },
    { href: "/templates", label: "Sablonok" },
    { href: "/account", label: "Fiokom" },
    { href: "/admin/fulfillment", label: "Admin" },
    { href: "/shop", label: "Kollekció" },
    { href: "/shipping", label: "Szállítás" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo" id="nav-logo">
          <span className="navbar-logo-icon" aria-hidden="true">✧</span>
          <span className="navbar-logo-text">Threads <span className="navbar-logo-accent">& Ink</span></span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links" aria-label="Főnavigáció">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`navbar-link ${pathname === link.href ? "active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Cart Button */}
          <button
            id="cart-toggle-btn"
            className="cart-btn"
            onClick={toggleCart}
            aria-label={`Kosár megnyitása, ${totalItems} termék`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {totalItems > 0 && (
              <span className="cart-badge" aria-hidden="true">{totalItems > 99 ? "99+" : totalItems}</span>
            )}
          </button>

          {/* CTA */}
          <Link href="/designer" className="navbar-cta" id="nav-design-btn">
            Tervezz most
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menü megnyitása"
            aria-expanded={mobileOpen}
            id="mobile-menu-toggle"
          >
            <span className={`hamburger ${mobileOpen ? "open" : ""}`}>
              <span /><span /><span />
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`} aria-hidden={!mobileOpen}>
        <nav className="mobile-nav">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-link ${pathname === link.href ? "active" : ""}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/designer" className="mobile-nav-cta" onClick={() => setMobileOpen(false)}>
            ✨ Tervezz most
          </Link>
        </nav>
      </div>
    </header>
  );
}
