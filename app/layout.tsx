import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import ApartmentBoostPopup from "@/components/ApartmentBoostPopup";
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
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_CONFIG.name,
      description: "Семейное производство кухонь, шкафов и корпусной мебели на заказ в Санкт-Петербурге. Встречи в студии образцов по предварительной записи.",
      alternateName: "Питер-Мебель",
      url: SITE_URL,
      logo: `${SITE_URL}/img/brand/logo_bird.svg`,
      image: `${SITE_URL}${OG_IMAGE}`,
      telephone: SITE_CONFIG.phoneRaw,
      email: SITE_CONFIG.email,
      currenciesAccepted: "RUB",
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
  verification: {
    yandex: "2290ffc6c48b46ac",
    google: "u6GC5nx_1ELGUhayTou1Y6tglbuIYq3KU6GARkCGlig",
  },
  openGraph: {
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website",
    images: [{ url: OG_IMAGE, width: 512, height: 512, alt: SITE_CONFIG.name, type: "image/png" }],
  },
  twitter: {
    card: "summary",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [{ url: OG_IMAGE, width: 512, height: 512, alt: SITE_CONFIG.name }],
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-120.png", type: "image/png", sizes: "120x120" },
      { url: "/icon-96.png", type: "image/png", sizes: "96x96" },
      { url: "/icon-48.png", type: "image/png", sizes: "48x48" },
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
      </head>
      <body>
        <AmbientFlowCanvas className="global-silk" />
        <a className="skip-link" href="#main-content">Перейти к содержимому</a>
        <Header />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <Footer />
        <ApartmentBoostPopup />
        <StickyCTA />
        <SmoothScroll />
      </body>
    </html>
  );
}
