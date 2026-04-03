import type { Metadata } from "next";
import Script from "next/script";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
import { ThemeSync } from "@/components/ThemeSync";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

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
      <body className={plusJakarta.className}>
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function () {
              try {
                var hour = new Date().getHours();
                var theme = hour >= 7 && hour < 19 ? 'light' : 'dark';
                document.documentElement.dataset.theme = theme;
                document.documentElement.style.colorScheme = theme;
              } catch (e) {}
            })();
          `}
        </Script>
        <CartProvider>
          <ThemeSync />
          <Navbar />
          <CartDrawer />
          <div className="page-content">
            {children}
          </div>
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <span className="footer-logo">✧ Threads & Ink</span>
                <p className="footer-tagline">Ahol a művészet és a prémium minőség összeér.</p>
              </div>
              <div className="footer-links">
                <div className="footer-col">
                  <h4>Vásárlás</h4>
                  <a href="/shop">Kollekció</a>
                  <a href="/designer">Egyedi tervező</a>
                  <a href="/shipping">Szállítás & Infók</a>
                </div>
                <div className="footer-col">
                  <h4>Segítség</h4>
                  <a href="/faq">GYIK</a>
                  <a href="/contact">Kapcsolat</a>
                  <a href="/sizing">Mérettáblázat</a>
                </div>
                <div className="footer-col">
                  <h4>Jogi</h4>
                  <a href="/privacy">Adatvédelem</a>
                  <a href="/terms">ÁSZF</a>
                  <a href="/cookies">Cookie-k</a>
                </div>
              </div>
            </div>
            <div className="footer-bottom">
              <p>© 2026 Threads & Ink. Minden jog fenntartva. 🇭🇺 Made in Hungary</p>
              <div className="footer-payments">
                <span className="payment-badge">💳 Bankkártya</span>
                <span className="payment-badge">🏦 Átutalás</span>
                <span className="payment-badge">📦 UTM</span>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
