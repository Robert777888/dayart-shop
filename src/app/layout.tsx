import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { Navbar } from "@/components/Navbar";
import { CartDrawer } from "@/components/CartDrawer";
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
                <p className="footer-tagline">Ahol az editorial vizuál és a prémium nyomtatás találkozik.</p>
              </div>
              <div className="footer-links">
                <div className="footer-col">
                  <h4>Vásárlás</h4>
                  <Link href="/shop">Kollekció</Link>
                  <Link href="/designer">Egyedi tervező</Link>
                  <Link href="/checkout">Kosár és fizetés</Link>
                </div>
                <div className="footer-col">
                  <h4>Támogatás</h4>
                  <Link href="/shipping">Szállítás & Infók</Link>
                  <a href="mailto:hello@threads-ink.hu">hello@threads-ink.hu</a>
                  <span className="footer-meta">Munkanapokon válaszolunk</span>
                </div>
                <div className="footer-col">
                  <h4>Bizalom</h4>
                  <span className="footer-meta">Prémium DTF nyomtatás</span>
                  <span className="footer-meta">20.000 Ft felett ingyen szállítás</span>
                  <span className="footer-meta">Magyar gyártás</span>
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
