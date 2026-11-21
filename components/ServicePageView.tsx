import Link from "next/link";
import type { ServicePageData } from "@/data/services";
import { SITE_URL, buildBreadcrumbs } from "@/lib/seo";
import { getPublicImageRatios } from "@/lib/image-meta";
import Gallery from "@/components/Gallery";
import CatalogEditorial from "@/components/CatalogEditorial";
import LeadSection from "@/components/LeadSection";

interface ServicePageViewProps {
  service: ServicePageData;
}

export default function ServicePageView({ service }: ServicePageViewProps) {
  const parentLabel =
    service.branch === "wardrobes"
      ? "Шкафы и гардеробные"
      : "Корпусная мебель";
  const parentHref =
    service.branch === "wardrobes" ? "/wardrobes/" : "/custom-furniture/";

  const breadcrumbJsonLd = buildBreadcrumbs([
    { name: parentLabel, path: parentHref },
    { name: service.shortTitle },
  ]);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.editorialTitle,
    serviceType: service.shortTitle,
    description: service.seoDescription,
    url: `${SITE_URL}${service.href}`,
    areaServed: [
      {
        "@type": "City",
        name: "Санкт-Петербург",
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
      url: `${SITE_URL}${service.href}`,
      priceCurrency: "RUB",
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice: service.minPrice,
        priceCurrency: "RUB",
      },
    },
    ...(service.cover ? { image: `${SITE_URL}${service.cover}` } : {}),
  };

  const heroImages =
    service.gallery.length > 0
      ? service.gallery.slice(0, 5)
      : service.cover
        ? [service.cover]
        : [];
  const heroImageRatios = getPublicImageRatios(heroImages);

  return (
    <div className="service-direction-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />

      {/* 1. Minimalist Hero: concise human info / showcase gallery */}
      <section className="service-hero-section" data-sticky-cta-suppress>
        <div className="container">
          <div className="service-hero-grid">
            <div className="service-hero-info">
              <nav className="service-breadcrumb" aria-label="Навигация по разделу">
                <Link href={parentHref}>← {parentLabel}</Link>
              </nav>

              <h1 className="service-hero-title">{service.h1}</h1>
              <p className="service-hero-lead">{service.lead}</p>

              <div className="service-hero-specs">
                <div className="service-spec-group">
                  <span className="service-spec-label">Что делаем</span>
                  <ul className="service-make-list">
                    {service.whatWeMake.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="service-spec-group">
                  <span className="service-spec-label">Материалы на выбор</span>
                  <ul className="service-materials-chips">
                    {service.materialOptions.map((mat) => (
                      <li key={mat} className="service-material-chip">
                        {mat}
                      </li>
                    ))}
                  </ul>
                </div>

                <dl className="service-key-metrics">
                  <div className="service-metric">
                    <dt>Срок</dt>
                    <dd>{service.leadTime}</dd>
                  </div>
                  <div className="service-metric">
                    <dt>Стоимость</dt>
                    <dd>{service.priceFrom}</dd>
                  </div>
                </dl>
              </div>

              <div className="service-hero-actions">
                <a href="#consult" className="btn btn-green">
                  Рассчитать стоимость →
                </a>
                <Link href={service.calculatorHref} className="btn btn-glass">
                  Калькулятор
                </Link>
              </div>

              <p className="service-hero-terms">
                Договор с фиксированной сметой · доставка и монтаж · счёт, СБП, карта, рассрочка от банка
              </p>
            </div>

            <div className="service-hero-media">
              {heroImages.length > 0 ? (
                <Gallery
                  images={heroImages}
                  title={service.shortTitle}
                  coverAlt={service.coverAlt}
                  initialRatios={heroImageRatios}
                  aspectRatio="5 / 4"
                  showThumbs={false}
                />
              ) : (
                <div className="service-hero-placeholder">
                  <div className="service-hero-placeholder-head">
                    <span className="service-hero-placeholder-kicker">
                      Собственный цех · Санкт-Петербург
                    </span>
                    <h2 className="service-hero-placeholder-title">
                      Индивидуальное изготовление под ваши размеры
                    </h2>
                    <p className="service-hero-placeholder-text">
                      Готовим подборку фотографий свежих объектов для сайта.
                      Отправим реальные примеры в удобный мессенджер и
                      рассчитаем проект по вашим размерам.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Consultation & Quote Form */}
      <LeadSection
        id="consult"
        initialCategory={service.leadCategory}
        source={`Направление: ${service.shortTitle}`}
      />

      {/* 3. Compact Editorial, Pricing & FAQ */}
      <CatalogEditorial
        title={service.editorialTitle}
        intro={service.editorialIntro}
        materials={service.materials}
        materialsNote={service.materialsNote}
        calculatorHref={service.calculatorHref}
        calculatorLabel={service.calculatorLabel}
        items={service.editorialItems}
        links={service.relatedLinks}
        faq={service.faq}
      />
    </div>
  );
}
