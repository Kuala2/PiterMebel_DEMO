import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import ApartmentBoostPopup from "@/components/ApartmentBoostPopup";
import AmbientFlowCanvas from "@/components/AmbientFlowCanvas";
import { SITE_CONFIG } from "@/data/site";
import { LEGAL_DETAILS } from "@/data/legal";
import { SITE_URL, OG_IMAGE, OG_HOME_IMAGE, HOME_TITLE, HOME_DESCRIPTION } from "@/lib/seo";

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
      ...(LEGAL_DETAILS.legalStatus && LEGAL_DETAILS.operatorLegalName
        ? { legalName: `${LEGAL_DETAILS.legalStatus} ${LEGAL_DETAILS.operatorLegalName}` }
        : {}),
      ...(LEGAL_DETAILS.inn ? { taxID: LEGAL_DETAILS.inn } : {}),
      description: "Семейное производство кухонь, шкафов и корпусной мебели на заказ в Санкт-Петербурге. Встречи в студии образцов по предварительной записи.",
      alternateName: "Питер-Мебель",
      url: `${SITE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}${OG_IMAGE}`,
        width: 512,
        height: 512,
      },
      image: [
        `${SITE_URL}/img/hero/photo_hero_upscaled.webp`,
        `${SITE_URL}${OG_IMAGE}`,
      ],
      telephone: SITE_CONFIG.phoneRaw,
      email: SITE_CONFIG.email,
      priceRange: "от 80 000 ₽",
      currenciesAccepted: "RUB",
      paymentAccepted: "Безналичный расчёт, СБП, банковская карта, рассрочка",
      foundingDate: String(SITE_CONFIG.foundingYear),
      hasMap: SITE_CONFIG.yandexMapsUrl,
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address,
        addressLocality: SITE_CONFIG.city,
        addressRegion: SITE_CONFIG.city,
        addressCountry: "RU",
      },
      geo: { "@type": "GeoCoordinates", latitude: 59.899907, longitude: 30.272883 },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: SITE_CONFIG.phoneRaw,
        email: SITE_CONFIG.email,
        contactType: "customer service",
        areaServed: "RU",
        availableLanguage: "Russian",
      },
      areaServed: [
        { "@type": "City", name: SITE_CONFIG.city },
        { "@type": "AdministrativeArea", name: "Ленинградская область" },
      ],
      openingHoursSpecification: [
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          opens: "10:00",
          closes: "18:00",
        },
      ],
      department: {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#workshop`,
        name: `Производственный цех «${SITE_CONFIG.name}»`,
        description: "Собственный мебельный цех полного цикла: раскрой плит, кромление с прифуговкой и присадка под фурнитуру.",
        url: `${SITE_URL}/production/`,
        image: [
          `${SITE_URL}/img/production/panel-cutting.webp`,
          `${SITE_URL}/img/production/edge-banding.webp`,
          `${SITE_URL}/img/production/line-boring.webp`,
        ],
        telephone: SITE_CONFIG.phoneRaw,
        priceRange: "от 80 000 ₽",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Петергофское шоссе, 73",
          addressLocality: SITE_CONFIG.city,
          addressRegion: SITE_CONFIG.city,
          addressCountry: "RU",
        },
        parentOrganization: { "@id": `${SITE_URL}/#organization` },
      },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Направления производства мебели на заказ",
        itemListElement: [
          {
            "@type": "OfferCatalog",
            name: "Кухни на заказ",
            url: `${SITE_URL}/kitchens/`,
          },
          {
            "@type": "OfferCatalog",
            name: "Шкафы и гардеробные на заказ",
            url: `${SITE_URL}/wardrobes/`,
          },
          {
            "@type": "OfferCatalog",
            name: "Корпусная мебель на заказ",
            url: `${SITE_URL}/custom-furniture/`,
          },
          {
            "@type": "OfferCatalog",
            name: "Мебель во всю квартиру за месяц",
            url: `${SITE_URL}/apartment/`,
          },
          {
            "@type": "OfferCatalog",
            name: "Услуги дизайнеров интерьера",
            url: `${SITE_URL}/design/`,
          },
        ],
      },
      sameAs: [SITE_CONFIG.vkUrl, SITE_CONFIG.yandexMapsUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
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
  authors: [{ name: SITE_CONFIG.name }],
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    yandex: "2290ffc6c48b46ac",
    google: "u6GC5nx_1ELGUhayTou1Y6tglbuIYq3KU6GARkCGlig",
  },
  openGraph: {
    siteName: SITE_CONFIG.name,
    locale: "ru_RU",
    type: "website",
    images: [OG_HOME_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: OG_HOME_IMAGE.url,
        width: OG_HOME_IMAGE.width,
        height: OG_HOME_IMAGE.height,
        alt: OG_HOME_IMAGE.alt,
      },
    ],
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
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`База знаний «${SITE_CONFIG.name}»`}
          href="/feed.xml"
        />
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
      </body>
    </html>
  );
}
