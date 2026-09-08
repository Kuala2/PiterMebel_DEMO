import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Cormorant_Garamond, Onest } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import SmoothScroll from "@/components/SmoothScroll";
import AmbientFlowCanvas from "@/components/AmbientFlowCanvas";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL, OG_IMAGE, HOME_TITLE, HOME_DESCRIPTION, METRIKA_ID } from "@/lib/seo";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#22252A",
};

const cormorant = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["500", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--font-cormorant",
});

const onest = Onest({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "600", "700"],
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
      alternateName: "Питер-Мебель",
      legalName: SITE_CONFIG.legalEntity,
      url: SITE_URL,
      logo: `${SITE_URL}/img/brand/logo_bird.svg`,
      image: `${SITE_URL}${OG_IMAGE}`,
      telephone: SITE_CONFIG.phoneRaw,
      email: SITE_CONFIG.email,
      priceRange: "₽₽",
      currenciesAccepted: "RUB",
      foundingDate: String(SITE_CONFIG.foundingYear),
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address,
        addressLocality: SITE_CONFIG.city,
        postalCode: "198095",
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
      sameAs: [SITE_CONFIG.vkUrl, SITE_CONFIG.yandexMapsUrl, "https://www.instagram.com/pitermebel/"],
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
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: SITE_CONFIG.name }],
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
        <Script id="yandex-metrika" strategy="lazyOnload">
          {`(function(m,e,t,r,i,k,a){
              m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)
          })(window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${METRIKA_ID}", "ym");

          ym(${METRIKA_ID}, "init", {
            ssr: true,
            webvisor: true,
            clickmap: true,
            ecommerce: "dataLayer",
            accurateTrackBounce: true,
            trackLinks: true,
          });`}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${METRIKA_ID}`}
              style={{ position: "absolute", left: "-9999px" }}
              alt=""
            />
          </div>
        </noscript>
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
