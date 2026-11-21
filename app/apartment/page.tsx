import type { Metadata } from "next";
import Link from "next/link";
import BoostVideoPlayer from "@/components/BoostVideoPlayer";
import DesignPackagesSection from "@/components/DesignPackagesSection";
import LeadSection from "@/components/LeadSection";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL, buildBreadcrumbs, buildOg, buildTwitter } from "@/lib/seo";

const PAGE_TITLE = `Мебель во всю квартиру за месяц — видеообзор | ${SITE_CONFIG.name}`;
const PAGE_DESCRIPTION =
  "Купили квартиру или готовите её к сдаче? Изготовим и установим кухню, шкафы и всю корпусную мебель в квартире за месяц. Видеообзор готового проекта в СПб.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/apartment/",
  },
  openGraph: buildOg(PAGE_TITLE, PAGE_DESCRIPTION, "/apartment"),
  twitter: buildTwitter(PAGE_TITLE, PAGE_DESCRIPTION),
};

const BREADCRUMB_JSON_LD = buildBreadcrumbs([
  { name: "Мебель в квартиру за месяц", path: "/apartment" },
]);

const VIDEO_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Мебель в квартиру на заказ за месяц — до и после",
  description:
    "Короткий видеообзор меблировки квартиры под ключ от студии «ПитерМебель»: кухня, шкаф-купе, прихожая и системы хранения.",
  thumbnailUrl: [`${SITE_URL}/video/studio-apartment-poster.jpg`],
  uploadDate: "2026-04-18T12:00:00+03:00",
  duration: "PT11S",
  contentUrl: `${SITE_URL}/video/studio-apartment-720p.mp4`,
  embedUrl: "https://vk.ru/clip-215942650_456239099",
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
};

const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Комплексная меблировка квартиры на заказ за месяц в Санкт-Петербурге",
  serviceType: "Мебель во всю квартиру под ключ",
  description: PAGE_DESCRIPTION,
  url: `${SITE_URL}/apartment/`,
  areaServed: {
    "@type": "City",
    name: SITE_CONFIG.city,
  },
  provider: {
    "@id": `${SITE_URL}/#organization`,
  },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/calculator/?category=cabinet&layout=complex`,
    priceCurrency: "RUB",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: 160000,
      priceCurrency: "RUB",
    },
  },
};

export default function ApartmentPage() {
  return (
    <div className="boost-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(VIDEO_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
      />

      <section className="detail-page-header boost-hero-section" data-sticky-cta-suppress>
        <div className="container">
          <div className="detail-top-nav">
            <Link href="/" className="detail-top-link boost-back-btn">
              ← На главную
            </Link>
          </div>

          <div className="detail-split-hero boost-hero-grid">
            <div className="detail-info-col">
              <h1 className="detail-hero-title boost-main-title">
                <span className="boost-main-title-question">
                  Купили квартиру или готовите её к сдаче?
                </span>
                <span className="boost-main-title-accent">
                  Сделаем за месяц всю мебель в квартире
                </span>
              </h1>

              <p className="detail-hero-lead">
                Берём в работу кухни на заказ и квартиры целиком — для жизни
                или быстрой сдачи в аренду. На видео — готовая квартира, которую
                мы полностью укомплектовали мебелью по индивидуальному проекту.
              </p>

              <div className="detail-specs-table boost-specs-table" data-sticky-cta-suppress>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Что входит в заказ</span>
                  <span className="detail-spec-val">Кухня, шкафы-купе, гардеробная, прихожая, ванная, ТВ-зона и рабочее место</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Материалы и фурнитура</span>
                  <span className="detail-spec-val">ЛДСП Egger, МДФ в пластике AGT / ПВХ / эмали, шпон дуба, столешницы Slotex и HPL · Blum, Hettich, Boyard</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Срок и ориентир цены</span>
                  <span className="detail-spec-val">Около 1 месяца · кухни от 160 000 ₽, шкафы и корпусная мебель от 80 000 ₽ · скидка от 2 изделий</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Монтаж и условия</span>
                  <span className="detail-spec-val">Свой цех в СПб, доставка, чистовая сборка и подключение техники. Договор, оплата по счёту, СБП, картой или в рассрочку от банка</span>
                </div>
              </div>

              <div className="detail-actions-row boost-hero-actions" style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }} data-sticky-cta-suppress>
                <a href="#consult" className="btn btn-green">
                  Рассчитать стоимость →
                </a>
                <Link
                  href="/calculator/?category=cabinet&layout=complex"
                  className="btn btn-glass"
                >
                  Открыть калькулятор
                </Link>
              </div>
            </div>

            <div className="detail-gallery-col boost-media-col">
              <BoostVideoPlayer />
            </div>
          </div>
        </div>
      </section>

      <DesignPackagesSection ctaHref="#consult" showSectionHeading={true} />

      <LeadSection
        id="consult"
        initialCategory="Комплексный заказ"
        source="Страница /apartment — мебель в квартиру за месяц"
        showSketchLink={true}
      />
    </div>
  );
}
