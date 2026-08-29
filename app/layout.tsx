import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import SmoothScroll from "@/components/SmoothScroll";
import SilkCanvas from "@/components/SilkCanvas";
import GlobalSoftbox from "@/components/GlobalSoftbox";
import { SITE_CONFIG } from "@/data/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#22252A",
};

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cormorant",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-onest",
});

export const metadata: Metadata = {
  title: `${SITE_CONFIG.name} — Индивидуальные кухни и мебель на заказ в СПб | Производство на Трефолева 1П`,
  description: "Производство кухонь, гардеробных и корпусной мебели на заказ в Санкт-Петербурге. Собственный цех с 2005 года на ул. Трефолева, 1П. Бесплатный выезд мастера на замер.",
  keywords: [
    "ПитерМебель",
    "мебель на заказ СПб",
    "кухни на заказ Санкт-Петербург",
    "производство мебели",
    "гардеробные",
    "шкафы",
    "ул Трефолева 1П"
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    title: `${SITE_CONFIG.name} — Мебель на заказ в Санкт-Петербурге`,
    description: SITE_CONFIG.slogan,
    locale: "ru_RU",
    type: "website"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${onest.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Onest:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap&subset=cyrillic"
          rel="stylesheet"
        />
      </head>
      <body>
        <SilkCanvas className="global-silk" />
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
        <SmoothScroll />
        <GlobalSoftbox />
      </body>
    </html>
  );
}
