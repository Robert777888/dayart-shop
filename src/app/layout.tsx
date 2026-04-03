import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeSync } from "@/components/ThemeSync";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Threads & Ink ✧ Prémium Egyedi Póló & AI Design",
  description: "Tervezz prémium egyedi pólót mesterséges intelligenciával. Threads & Ink – Ahol a kód és a pamut találkozik. 100% organikus pamut, gyors szállítás.",
  keywords: "egyedi póló, Threads & Ink, AI design, prémium pólónyomás, ajándék póló",
  openGraph: {
    title: "Threads & Ink – Az AIvezérelt Póló-tervező",
    description: "Prémium esztétika, mesterséges intelligencia által alkotott minták. Tervezd meg saját Threads & Ink darabod!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body className={geistSans.className}>
        <ThemeProvider>
          <CartProvider>
            <Navbar />
            <CartDrawer />
            <div className="page-content">
              {children}
            </div>
            <footer className="site-footer">
              <div className="footer-inner">
                <div className="footer-brand">
                  <span className="footer-logo">✧ Threads & Ink</span>
                  <p className="footer-tagline">Ahol az editorial vizuál és a prémium nyomtatás találkozik.</p>
                </div>
                <div className="footer-links">
                  <div className="footer-col">
                    <h4>Vásárlás</h4>
                    <Link href="/shop">Prémium Kollekció</Link>
                    <Link href="/designer">Unikális AI Tervező</Link>
                    <Link href="/size-guide">Mérettáblázat</Link>
                  </div>
                  <div className="footer-col">
                    <h4>Információ</h4>
                    <Link href="/shipping">Szállítás & Fizetés</Link>
                    <Link href="/faq">Gyakori Kérdések</Link>
                    <Link href="/contact">Kapcsolat</Link>
                  </div>
                  <div className="footer-col">
                    <h4>Jogi Adatok</h4>
                    <Link href="/terms">Általános Szerződési Feltételek</Link>
                    <Link href="/privacy">Adatvédelmi Nyilatkozat</Link>
                    <Link href="/returns">Visszaküldési Garancia</Link>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Threads & Ink. Minden jog fenntartva.</p>
                <div className="footer-payments">
                  <span className="payment-badge">Bankkártya</span>
                  <span className="payment-badge">Apple Pay</span>
                  <span className="payment-badge">Utánvét</span>
                </div>
              </div>
            </footer>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
