import type { Metadata } from "next";
import Link from "next/link";
import BoostVideoPlayer from "@/components/BoostVideoPlayer";
import CatalogEditorial from "@/components/CatalogEditorial";
import DesignPackagesSection from "@/components/DesignPackagesSection";
import LeadSection from "@/components/LeadSection";
import { SITE_CONFIG } from "@/data/site";
import { SITE_URL, OG_HOME_IMAGE, buildBreadcrumbs, buildOg, buildTwitter } from "@/lib/seo";

const PAGE_TITLE = `Мебель во всю квартиру за месяц — видеообзор | ${SITE_CONFIG.name}`;
const PAGE_DESCRIPTION =
  "Купили квартиру или готовите её к сдаче? Изготовим и установим кухню, шкафы и всю корпусную мебель в квартире за месяц. Видеообзор готового проекта в СПб.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: {
    canonical: "/apartment/",
  },
  openGraph: buildOg(PAGE_TITLE, PAGE_DESCRIPTION, "/apartment", OG_HOME_IMAGE),
  twitter: buildTwitter(PAGE_TITLE, PAGE_DESCRIPTION, OG_HOME_IMAGE),
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
  areaServed: [
    {
      "@type": "City",
      name: SITE_CONFIG.city,
    },
    {
      "@type": "AdministrativeArea",
      name: "Ленинградская область",
    },
  ],
  provider: {
    "@id": `${SITE_URL}/#organization`,
  },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/apartment/`,
    priceCurrency: "RUB",
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: 480000,
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
          <div className="detail-split-hero boost-hero-grid">
            <div className="detail-info-col">
              <nav className="service-breadcrumb" aria-label="Навигация">
                <Link href="/" className="boost-back-btn">
                  ← На главную
                </Link>
              </nav>

              <h1 className="detail-hero-title boost-main-title">
                <span className="boost-main-title-question">
                  Купили квартиру или готовите её к сдаче?
                </span>
                <span className="boost-main-title-accent">
                  Сделаем за месяц всю мебель в квартире
                </span>
              </h1>

              <p className="detail-hero-lead boost-hero-lead">
                Берём в работу кухни на заказ и квартиры целиком — для жизни или
                быстрой сдачи в аренду. На видео — готовая квартира после нашего
                монтажа.
              </p>

              <div className="service-hero-specs boost-specs" data-sticky-cta-suppress>
                <div className="service-spec-group">
                  <span className="service-spec-label">Что входит в заказ</span>
                  <ul className="service-make-list">
                    <li>Кухня и рабочая зона</li>
                    <li>Шкафы-купе и гардеробная</li>
                    <li>Прихожая и хранение</li>
                    <li>Ванная и ТВ-зона</li>
                  </ul>
                </div>

                <dl className="service-key-metrics">
                  <div className="service-metric">
                    <dt>Срок</dt>
                    <dd>~1 месяц</dd>
                  </div>
                  <div className="service-metric">
                    <dt>Стоимость</dt>
                    <dd>от 480 000 ₽</dd>
                  </div>
                  <div className="service-metric">
                    <dt>Выгода</dt>
                    <dd>скидка от 2 изделий</dd>
                  </div>
                </dl>
              </div>

              <div className="detail-actions-row boost-hero-actions" data-sticky-cta-suppress>
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

              <p className="service-hero-terms">
                Свой цех в СПб · договор, доставка, чистовая сборка и подключение техники · счёт, СБП, карта, рассрочка
              </p>
            </div>

            <div className="detail-gallery-col boost-media-col">
              <BoostVideoPlayer />
            </div>
          </div>
        </div>
      </section>

      <DesignPackagesSection ctaHref="#consult" showSectionHeading={true} />

      <CatalogEditorial
        title="Меблировка квартиры под ключ в Санкт-Петербурге"
        intro="Проектируем, изготавливаем на собственном производстве и монтируем всю встроенную и корпусную мебель в квартире — в едином цвете и за один заезд монтажников."
        items={[
          {
            title: "Единый стиль и одна партия плит",
            text: "Изготавливаем кухню, шкафы, прихожую, ванную и ТВ-зону из одной партии ЛДСП Egger, МДФ AGT/эмали или шпона — без разнотона между комнатами.",
          },
          {
            title: "Синхронное производство за месяц",
            text: "Запускаем все позиции в цеху на Петергофском шоссе, 73 параллельно, чтобы сдать квартиру целиком примерно за 4 недели.",
          },
          {
            title: "Один договор и скидка на объём",
            text: "От 2 изделий действует скидка. В работу включены замер, схема розеток, доставка, чистовая сборка и подключение встроенной техники.",
          },
        ]}
        materialsTitle="Ориентир по стоимости и срокам"
        materials={[
          { material: "Кухня на заказ", priceTier: "от 160\u00A0000\u00A0₽", leadTime: "3–5 нед." },
          { material: "Шкаф или гардеробная", priceTier: "от 80\u00A0000\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "Прихожая и хранение", priceTier: "от 80\u00A0000\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "Ванная и ТВ-зона", priceTier: "от 80\u00A0000\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "Комплекс во всю квартиру", priceTier: "от 480\u00A0000\u00A0₽", leadTime: "~1 мес." },
        ]}
        materialsNote="Точная смета фиксируется в договоре после замера и согласования материалов."
        calculatorHref="/calculator/?category=cabinet&layout=complex"
        calculatorLabel="Рассчитать комплексный заказ"
        linksTitle="Основные разделы для комплектации"
        links={[
          { href: "/kitchens/", label: "Кухни на заказ" },
          { href: "/wardrobes/walk-in/", label: "Гардеробные комнаты" },
          { href: "/wardrobes/hallway/", label: "Прихожие на заказ" },
          { href: "/custom-furniture/bathroom/", label: "Мебель для ванной" },
        ]}
        faq={[
          {
            question: "Можно ли обставить студию или квартиру под сдачу за месяц?",
            answer:
              "Да — для квартир под жизнь и аренду подбираем износостойкие материалы (ЛДСП Egger, МДФ-пластик) и запускаем кухню, шкафы и прихожую в производство одновременно. Средний срок комплексной меблировки — около 1 месяца.",
          },
          {
            question: "Обязательно ли заказывать дизайн-проект, чтобы сделать мебель во всю квартиру?",
            answer:
              "Нет — можно заказать только мебель, мы сами сделаем замер, 3D-проект расстановки и схему розеток. Дизайн-проект (пакеты «Стандартный» или «Премиум») подключается по желанию, если ремонт ещё не начат.",
          },
          {
            question: "Как формируется цена и когда действует скидка?",
            answer:
              "Кухни начинаются от 160\u00A0000\u00A0₽, шкафы и корпусная мебель — от 80\u00A0000\u00A0₽, а комплексная меблировка квартиры — от 480\u00A0000\u00A0₽. При заказе от 2 изделий в одном договоре действует скидка за объём, точная сумма фиксируется после замера.",
          },
          {
            question: "Входит ли доставка, монтаж и подключение техники?",
            answer:
              "Да — доставляем, поднимаем, собираем мебель своей штатной бригадой и подключаем встроенную технику. Оплата возможна по счёту, СБП, картой или в рассрочку от банка.",
          },
        ]}
      />

      <LeadSection
        id="consult"
        initialCategory="Комплексный заказ"
        source="Страница /apartment — мебель в квартиру за месяц"
        showSketchLink={true}
      />
    </div>
  );
}
