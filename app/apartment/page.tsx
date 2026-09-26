import type { Metadata } from "next";
import Link from "next/link";
import BoostVideoPlayer from "@/components/BoostVideoPlayer";
import LeadSection from "@/components/LeadSection";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL, buildBreadcrumbs, buildOg } from "@/lib/seo";

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
    "@type": "Organization",
    name: SITE_CONFIG.name,
    url: SITE_URL,
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

      <section className="detail-page-header boost-hero-section" data-sticky-cta-suppress>
        <div className="container">
          <div className="detail-top-nav">
            <Link href="/" className="btn btn-glass boost-back-btn" style={{ gap: "8px" }}>
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
                  <span className="detail-spec-val">Кухня, шкафы-купе, прихожая, стеллажи и рабочая зона</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Производство</span>
                  <span className="detail-spec-val">Собственный цех в Санкт-Петербурге · по точным размерам</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Монтаж под ключ</span>
                  <span className="detail-spec-val">Доставка, чистовая сборка и подключение техники</span>
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

      <LeadSection
        id="consult"
        initialCategory="Комплексный заказ"
        source="Страница /apartment — мебель в квартиру за месяц"
        showSketchLink={true}
      />
    </div>
  );
}
