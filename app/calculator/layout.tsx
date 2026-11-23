import type { Metadata } from "next";
import { buildOg, buildTwitter, OG_HOME_IMAGE, SITE_URL } from "@/lib/seo";

const TITLE = "Калькулятор стоимости кухни и мебели на заказ в СПб | ПитерМебель";
const DESCRIPTION =
  "Онлайн-калькулятор стоимости кухни, шкафа или корпусной мебели на заказ в СПб по длине, планировке, материалу фасадов и опциям.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/calculator/",
  },
  openGraph: buildOg(TITLE, DESCRIPTION, "/calculator", OG_HOME_IMAGE),
  twitter: buildTwitter(TITLE, DESCRIPTION, OG_HOME_IMAGE),
};

const CALCULATOR_APP_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Онлайн-калькулятор стоимости мебели на заказ — ПитерМебель",
  description: DESCRIPTION,
  url: `${SITE_URL}/calculator/`,
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript",
  inLanguage: "ru-RU",
  isAccessibleForFree: true,
  offers: {
    "@type": "Offer",
    price: 0,
    priceCurrency: "RUB",
  },
  provider: {
    "@id": `${SITE_URL}/#organization`,
  },
};

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(CALCULATOR_APP_JSON_LD) }}
      />
      {children}
    </>
  );
}
