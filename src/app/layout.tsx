import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";

const plusJakarta = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400","500","600","700","800"] });

export const metadata: Metadata = {
  title: "DTFStudio – Egyedi Póló, DTF Nyomtatás | AI Design",
  description: "Tervezz egyedi pólót mesterséges intelligenciával. Prémium DTF nyomtatás, gyors szállítás, 100% organikus pamut. Magyar webshop.",
  keywords: "egyedi póló, DTF nyomtatás, AI design, ajándék póló, egyedi ajándék",
  openGraph: {
    title: "DTFStudio – Egyedi Póló Webshop",
    description: "AI-alapú egyedi pólótervező és webshop. Tervezd meg álmaid pólóját percek alatt!",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hu">
      <body className={plusJakarta.className}>
        <CartProvider>
          <Navbar />
          <CartDrawer />
          <div className="page-content">
            {children}
          </div>
          <footer className="site-footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <span className="footer-logo">✦ DTFStudio</span>
                <p className="footer-tagline">Prémium egyedi póló, AI erővel.</p>
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
              <p>© 2026 DTFStudio. Minden jog fenntartva. 🇭🇺 Made in Hungary</p>
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
