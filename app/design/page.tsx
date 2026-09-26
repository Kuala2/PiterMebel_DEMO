import type { Metadata } from "next";
import DesignPackagesSection, {
  STANDARD_DESIGN_ITEMS,
  PREMIUM_DESIGN_ITEMS,
} from "@/components/DesignPackagesSection";
import LeadSection from "@/components/LeadSection";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL, buildBreadcrumbs, buildOg } from "@/lib/seo";

const PAGE_TITLE = `Дизайн-проект квартиры в СПб — от 2 500 ₽/м² | ${SITE_CONFIG.name}`;
const PAGE_DESCRIPTION =
  "Услуги дизайнеров интерьера в Санкт-Петербурге: рабочий проект планировки и электрики (2 500 ₽/м²) и полный дизайн-проект с 3D-визуализацией (5 000 ₽/м²).";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/design/",
  },
  openGraph: buildOg(PAGE_TITLE, PAGE_DESCRIPTION, "/design"),
};

const BREADCRUMB_JSON_LD = buildBreadcrumbs([
  { name: "Услуги дизайнера", path: "/design/" },
]);

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Услуги дизайнеров интерьера и разработка дизайн-проекта в Санкт-Петербурге",
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/design/`,
  areaServed: {
    "@type": "City",
    name: SITE_CONFIG.city,
  },
  provider: {
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_URL,
    telephone: SITE_CONFIG.phone,
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Пакеты дизайн-проектирования интерьера",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Пакет Стандартный — рабочий дизайн-проект",
        description: STANDARD_DESIGN_ITEMS.map((i) => i.text).join(", "),
        price: "2500",
        priceCurrency: "RUB",
        unitText: "м²",
      },
      {
        "@type": "Offer",
        name: "Пакет Премиум — полный дизайн-проект с 3D-визуализацией и комплектацией",
        description: PREMIUM_DESIGN_ITEMS.map((i) => i.text).join(", "),
        price: "5000",
        priceCurrency: "RUB",
        unitText: "м²",
      },
    ],
  },
};

export default function DesignServicesPage() {
  return (
    <div className="design-services-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />

      {/* Header / Intro */}
      <section className="page-header design-hero-header">
        <div className="container">
          <div className="design-hero-inner">
            <h1 className="subpage-hero-title">Услуги наших дизайнеров</h1>
            <p className="design-hero-lead">
              Опытные специалисты проработают каждый миллиметр вашей площади,
              дадут ценные советы и рекомендации, что необходимо для наилучшего
              результата.
            </p>
          </div>
        </div>
      </section>

      <DesignPackagesSection
        ctaHref="#measure"
        showSectionHeading={false}
        packageHeadingTag="h2"
      />

      {/* Lead Form */}
      <LeadSection
        id="measure"
        initialCategory="Дизайн-проект"
        source="Страница: Услуги дизайнеров (/design)"
      />
    </div>
  );
}
