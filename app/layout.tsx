import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import SmoothScroll from "@/components/SmoothScroll";
import AmbientFlowCanvas from "@/components/AmbientFlowCanvas";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL, OG_IMAGE, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

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

const SITE_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "FurnitureStore",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_CONFIG.name,
      legalName: SITE_CONFIG.legalEntity,
      url: SITE_URL,
      logo: `${SITE_URL}/img/brand/logo_bird.svg`,
      image: `${SITE_URL}${OG_IMAGE}`,
      telephone: SITE_CONFIG.phoneRaw,
      email: SITE_CONFIG.email,
      foundingDate: String(SITE_CONFIG.foundingYear),
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address,
        addressLocality: SITE_CONFIG.city,
        addressCountry: "RU",
      },
      geo: { "@type": "GeoCoordinates", latitude: 59.899907, longitude: 30.272883 },
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "18:00",
        },
      ],
      sameAs: [SITE_CONFIG.vkUrl, SITE_CONFIG.yandexMapsUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_CONFIG.name,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "ru-RU",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  keywords: [
    "ПитерМебель",
    "мебель на заказ СПб",
    "кухни на заказ Санкт-Петербург",
    "производство мебели Петергофское шоссе",
    "гардеробные",
    "шкафы",
    "площадь Стачек 9 офис 407"
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_CONFIG.name }],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" }
    ]
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_JSON_LD) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Onest:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap&subset=cyrillic"
          rel="stylesheet"
        />
      </head>
      <body>
        <AmbientFlowCanvas className="global-silk" />
        <Header />
        <main>{children}</main>
        <Footer />
        <StickyCTA />
        <SmoothScroll />
      </body>
    </html>
  );
}
