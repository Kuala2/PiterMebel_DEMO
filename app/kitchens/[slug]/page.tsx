import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import LeadSection from "@/components/LeadSection";
import { KITCHENS, type KitchenFacadeTier } from "@/data/kitchens";
import { SITE_CONFIG } from "@/data/site";
import { buildOg, buildTwitter, buildBreadcrumbs, buildMetaDescription, SITE_URL } from "@/lib/seo";
import { getPublicImageMeta, getPublicImageRatios } from "@/lib/image-meta";

const FACADE_TIER_CONFIG: Record<
  KitchenFacadeTier,
  {
    calcMaterial: "plastic" | "pvc" | "enamel" | "veneer" | "unknown";
    leadTimeText: string;
    tierLowPrice: number;
    tierHighPrice: number;
    cornerRangeText?: string;
  }
> = {
  plastic: {
    calcMaterial: "plastic",
    leadTimeText: "3–4 недели · свой цех в СПб",
    tierLowPrice: 200000,
    tierHighPrice: 330000,
    cornerRangeText: "300–330\u00A0тыс.\u00A0₽",
  },
  pvc: {
    calcMaterial: "pvc",
    leadTimeText: "3–4 недели · свой цех в СПб",
    tierLowPrice: 180000,
    tierHighPrice: 300000,
    cornerRangeText: "280–300\u00A0тыс.\u00A0₽",
  },
  "plastic-egger": {
    calcMaterial: "plastic",
    leadTimeText: "3–4 недели · свой цех в СПб",
    tierLowPrice: 160000,
    tierHighPrice: 330000,
    cornerRangeText: "250–330\u00A0тыс.\u00A0₽",
  },
  "enamel-plastic": {
    calcMaterial: "enamel",
    leadTimeText: "4–5 недель · свой цех в СПб",
    tierLowPrice: 200000,
    tierHighPrice: 370000,
    cornerRangeText: "300–370\u00A0тыс.\u00A0₽",
  },
  enamel: {
    calcMaterial: "enamel",
    leadTimeText: "4–5 недель · свой цех в СПб",
    tierLowPrice: 220000,
    tierHighPrice: 370000,
    cornerRangeText: "340–370\u00A0тыс.\u00A0₽",
  },
  veneer: {
    calcMaterial: "veneer",
    leadTimeText: "4–6 недель · свой цех в СПб",
    tierLowPrice: 250000,
    tierHighPrice: 430000,
    cornerRangeText: "390–430\u00A0тыс.\u00A0₽",
  },
  custom: {
    calcMaterial: "unknown",
    leadTimeText: "3–5 недель · зависит от материала фасадов",
    tierLowPrice: 160000,
    tierHighPrice: 370000,
  },
};

function formatRub(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

function buildKitchenCoverAlt(kitchen: (typeof KITCHENS)[number]): string {
  const detailParts = kitchen.specs
    .slice(0, 2)
    .map((s) => `${s.label.toLowerCase()} ${s.value}`)
    .join(", ");
  const candidate = detailParts ? `${kitchen.title} — ${detailParts}` : kitchen.title;
  return candidate.length <= 125 ? candidate : kitchen.title;
}

interface KitchenPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return KITCHENS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({
  params,
}: KitchenPageProps): Promise<Metadata> {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);

  if (!kitchen) {
    return { title: "Кухня не найдена — ПитерМебель" };
  }

  const hasDuplicateTitle = KITCHENS.some(
    (k) => k.slug !== kitchen.slug && k.title === kitchen.title
  );
  const qualifierSpec =
    kitchen.specs.find((s) => s.label.toLowerCase().includes("столешниц"))?.value ||
    kitchen.specs[0]?.value;
  const distinctTitle =
    hasDuplicateTitle && qualifierSpec
      ? `${kitchen.title} (${qualifierSpec})`
      : kitchen.title;

  const geoBrandTitle = `${distinctTitle} на заказ в СПб | ПитерМебель`;
  const geoShortTitle = `${distinctTitle} в СПб | ПитерМебель`;
  const pageTitle =
    geoBrandTitle.length <= 70
      ? geoBrandTitle
      : geoShortTitle.length <= 70
        ? geoShortTitle
        : distinctTitle.length + 15 <= 70
          ? `${distinctTitle} — ПитерМебель`
          : distinctTitle;

  const { tierLowPrice } = FACADE_TIER_CONFIG[kitchen.facadeTier];
  const summaryDesc = buildMetaDescription(kitchen.summary);
  const fullSuffix = " Изготовление на заказ в СПб, договор и монтаж под ключ.";
  const compactSuffix = ` На заказ в СПб от ${formatRub(tierLowPrice)} ₽.`;
  const ogDescription =
    summaryDesc.length + fullSuffix.length <= 155
      ? `${summaryDesc}${fullSuffix}`
      : summaryDesc.length + compactSuffix.length <= 160
        ? `${summaryDesc}${compactSuffix}`
        : summaryDesc;

  const coverAlt = buildKitchenCoverAlt(kitchen);
  const ogUrl = `/img/og/kitchens/${kitchen.slug}.jpg`;
  const ogMeta = getPublicImageMeta(ogUrl);
  const coverMeta = getPublicImageMeta(kitchen.cover);
  const ogImage = ogMeta
    ? {
        url: ogUrl,
        width: ogMeta.width,
        height: ogMeta.height,
        type: ogMeta.type,
        alt: coverAlt,
      }
    : {
        url: kitchen.cover,
        alt: coverAlt,
        ...(coverMeta
          ? { width: coverMeta.width, height: coverMeta.height, type: coverMeta.type }
          : {}),
      };

  return {
    title: pageTitle,
    description: ogDescription,
    alternates: {
      canonical: `/kitchens/${kitchen.slug}/`,
    },
    openGraph: buildOg(pageTitle, ogDescription, `/kitchens/${kitchen.slug}`, ogImage),
    twitter: buildTwitter(pageTitle, ogDescription, ogImage),
  };
}

export default async function KitchenDetailPage({ params }: KitchenPageProps) {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);

  if (!kitchen) {
    notFound();
  }

  const allPhotos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];
  const photoRatios = getPublicImageRatios(allPhotos);

  const currentIndex = KITCHENS.findIndex((k) => k.slug === slug);
  const prevKitchen = KITCHENS[(currentIndex - 1 + KITCHENS.length) % KITCHENS.length];
  const nextKitchen = KITCHENS[(currentIndex + 1) % KITCHENS.length];
  const otherKitchens = KITCHENS.filter((k) => k.slug !== slug).slice(0, 3);
  const { calcMaterial, leadTimeText, tierLowPrice, tierHighPrice, cornerRangeText } =
    FACADE_TIER_CONFIG[kitchen.facadeTier];
  const hasPremiumWorktop = kitchen.specs.some(
    (s) =>
      s.label.toLowerCase().includes("столешниц") &&
      /(камен|кварц|hpl)/i.test(s.value)
  );
  const priceAnchorText = cornerRangeText
    ? hasPremiumWorktop
      ? `от ${formatRub(tierLowPrice)}\u00A0₽ · 3,5 м (база Slotex): ${cornerRangeText}`
      : `от ${formatRub(tierLowPrice)}\u00A0₽ · угловая 3,5 м: ${cornerRangeText}`
    : `от ${formatRub(tierLowPrice)}\u00A0₽ · расчёт по фасадам и размерам`;
  const calculatorHref = `/calculator/?category=kitchen&layout=corner&meters=3.5&material=${calcMaterial}`;

  const displaySpecs = [
    ...kitchen.specs,
    { label: "Срок изготовления", value: leadTimeText },
    { label: "Ориентир по цене", value: priceAnchorText },
    {
      label: "Условия и монтаж",
      value: "Договор, схема розеток в подарок, доставка, сборка и подключение. Счёт, СБП, карта, рассрочка от банка",
    },
  ];

  const facadeMaterial = kitchen.specs.find((s) =>
    s.label.toLowerCase().includes("фасад")
  )?.value;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: kitchen.title,
    sku: kitchen.slug,
    category: "Кухни на заказ",
    ...(facadeMaterial ? { material: facadeMaterial } : {}),
    countryOfOrigin: { "@type": "Country", name: "Россия" },
    image: allPhotos.map((photo) => `${SITE_URL}${photo}`),
    description: kitchen.summary,
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
    manufacturer: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/kitchens/${kitchen.slug}/`,
    mainEntityOfPage: `${SITE_URL}/kitchens/${kitchen.slug}/`,
    offers: {
      "@type": "AggregateOffer",
      lowPrice: tierLowPrice,
      highPrice: tierHighPrice,
      offerCount: 1,
      priceCurrency: "RUB",
      availability: "https://schema.org/PreOrder",
      itemCondition: "https://schema.org/NewCondition",
      url: `${SITE_URL}/kitchens/${kitchen.slug}/`,
      seller: { "@id": `${SITE_URL}/#organization` },
    },
    additionalProperty: displaySpecs.map((spec) => ({
      "@type": "PropertyValue",
      name: spec.label,
      value: spec.value,
    })),
  };

  return (
    <div className="kitchen-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbs([
          { name: "Кухни", path: "/kitchens/" },
          { name: kitchen.title, path: `/kitchens/${kitchen.slug}/` },
        ])) }}
      />
      {/* 1. Above the fold: Split Layout (Desktop 40/60 centered, Mobile order: Breadcrumb -> Title -> Gallery -> Lead -> Specs -> Buttons) */}
      <section className="detail-page-header">
        <div className="container">
          <div className="detail-split-hero">
            {/* Info Column */}
            <div className="detail-info-col">
              <nav className="service-breadcrumb" aria-label="Навигация по каталогу кухонь">
                <Link href="/kitchens/">← В каталог кухонь</Link>
              </nav>

              <h1 className="detail-hero-title">
                {kitchen.title}
              </h1>

              {/* On mobile, CSS reorders: Title -> Gallery -> Lead -> Specs -> Buttons */}
              <p className="detail-hero-lead">
                {kitchen.summary}
              </p>

              {/* Clean Specifications Table */}
              <div className="detail-specs-table">
                {displaySpecs.map((spec) => (
                  <div className="detail-spec-row" key={`${kitchen.slug}-${spec.label}`}>
                    <span className="detail-spec-name">{spec.label}</span>
                    <span className="detail-spec-val">{spec.value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="detail-actions-row">
                <a
                  href="#measure"
                  className="btn btn-green"
                >
                  Записаться на консультацию
                </a>
                <Link
                  href={calculatorHref}
                  className="btn btn-glass"
                >
                  Рассчитать под себя
                </Link>
              </div>
            </div>

            {/* Right Column: Generous Photo Gallery */}
            <div className="detail-gallery-col">
              <Gallery
                images={allPhotos}
                title={kitchen.title}
                coverAlt={buildKitchenCoverAlt(kitchen)}
                initialRatios={photoRatios}
                aspectRatio="5 / 4"
                showThumbs={false}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Navigator Ribbon */}
      <section className="detail-navigator-section">
        <div className="container">
          <div className="detail-nav-header">
            <h2 className="detail-nav-title">Другие кухни студии</h2>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link href={`/kitchens/${prevKitchen.slug}/`} style={{ color: "var(--color-text-secondary)", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}>
                ← Предыдущая: {prevKitchen.title}
              </Link>
              <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
              <Link href={`/kitchens/${nextKitchen.slug}/`} style={{ color: "var(--color-green-brand)", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}>
                Следующая: {nextKitchen.title} →
              </Link>
            </div>
          </div>

          <div className="detail-nav-cards">
            {otherKitchens.map((item) => (
              <Link key={item.slug} href={`/kitchens/${item.slug}/`} className="detail-nav-card">
                <div className="detail-nav-card-img">
                  <Image
                    src={item.cover}
                    alt={item.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 400px"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="detail-nav-card-body">
                  <h3 className="detail-nav-card-name">{item.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation Booking */}
      <LeadSection
        id="measure"
        initialCategory={kitchen.title}
        source={`Карточка: ${kitchen.title}`}
      />
    </div>
  );
}
