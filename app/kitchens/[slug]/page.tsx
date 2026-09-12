import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import LeadSection from "@/components/LeadSection";
import VkIcon from "@/components/VkIcon";
import { KITCHENS } from "@/data/kitchens";
import { SITE_CONFIG } from "@/data/site";
import { buildOg, buildBreadcrumbs, SITE_URL } from "@/lib/seo";

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

  const ogTitle = `Кухня «${kitchen.title}» на заказ в Санкт-Петербурге | ПитерМебель`;
  const ogDescription = `Кухня «${kitchen.title}» по индивидуальным размерам: ${kitchen.facade}, ${kitchen.feature.toLowerCase()}. Проектирование, изготовление и монтаж в Санкт-Петербурге.`;

  return {
    title: ogTitle,
    description: ogDescription,
    alternates: {
      canonical: `/kitchens/${kitchen.slug}`,
    },
    openGraph: {
      ...buildOg(ogTitle, ogDescription, `/kitchens/${kitchen.slug}`),
      images: [{ url: kitchen.cover, alt: `Кухня «${kitchen.title}»` }],
    },
  };
}

export default async function KitchenDetailPage({ params }: KitchenPageProps) {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);

  if (!kitchen) {
    notFound();
  }

  const allPhotos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Кухня «${kitchen.title}»`,
    image: allPhotos.map((photo) => `${SITE_URL}${photo}`),
    description: kitchen.story?.[0] || kitchen.feature,
    brand: { "@type": "Brand", name: SITE_CONFIG.name },
  };

  const currentIndex = KITCHENS.findIndex((k) => k.slug === slug);
  const prevKitchen = KITCHENS[(currentIndex - 1 + KITCHENS.length) % KITCHENS.length];
  const nextKitchen = KITCHENS[(currentIndex + 1) % KITCHENS.length];
  const otherKitchens = KITCHENS.filter((k) => k.slug !== slug).slice(0, 3);

  return (
    <div className="kitchen-detail-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBreadcrumbs([
          { name: "Кухни", path: "/kitchens" },
          { name: `Кухня «${kitchen.title}»` },
        ])) }}
      />
      {/* 1. Above the fold: Split Layout (Desktop 38/62, Mobile order: Title -> Gallery -> Specs) */}
      <section className="detail-page-header">
        <div className="container">
          <div className="detail-top-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
            <Link href="/kitchens" className="btn btn-glass" style={{ gap: "8px" }}>
              ← В каталог кухонь
            </Link>
            <Link href={`/kitchens/${nextKitchen.slug}`} className="btn btn-glass" style={{ gap: "8px" }}>
              Следующая кухня: «{nextKitchen.title}» →
            </Link>
          </div>

          <div className="detail-split-hero">
            {/* Info Column */}
            <div className="detail-info-col">
              <h1 className="detail-hero-title">
                Кухня «{kitchen.title}»
              </h1>

              {/* Стоимость рассчитывается по спецификации проекта */}
              <div className="detail-price-badge">
                <span className="detail-price-val">
                  Индивидуальный расчёт
                </span>
                <span className="detail-price-meter">
                  по материалам, наполнению и размерам
                </span>
              </div>

              {/* On mobile, CSS reorders: Title -> Price -> Gallery -> Lead -> Specs -> Buttons */}
              <p className="detail-hero-lead">
                {kitchen.feature}. Изготавливается по индивидуальным размерам помещения с подгонкой под потолок и встроенной техникой.
              </p>

              {/* Clean Specifications Table */}
              <div className="detail-specs-table">
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Материал фасадов</span>
                  <span className="detail-spec-val">{kitchen.facade}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Столешница</span>
                  <span className="detail-spec-val">{kitchen.worktop}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Корпус</span>
                  <span className="detail-spec-val">По спецификации проекта; среди используемых материалов — влагостойкая ЛДСП Egger класса E1</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Фурнитура</span>
                  <span className="detail-spec-val">По спецификации проекта: Blum, Boyard или DTC</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Кромление</span>
                  <span className="detail-spec-val">Технология подбирается по материалу и условиям эксплуатации</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Срок изготовления</span>
                  <span className="detail-spec-val">фиксируется в договоре после согласования проекта</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="detail-actions-row" style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <Link
                  href="/calculator"
                  className="btn btn-green"
                >
                  Рассчитать проект под размеры
                </Link>
                <a
                  href="#measure"
                  className="btn btn-glass"
                >
                  Записаться на консультацию
                </a>
                <a
                  href={SITE_CONFIG.vkImUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                >
                  <VkIcon />
                  ВКонтакте
                </a>
              </div>
            </div>

            {/* Right Column: Generous Photo Gallery */}
            <div className="detail-gallery-col">
              <Gallery images={allPhotos} title={kitchen.title} aspectRatio="4 / 3" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Story & Planning Solution */}
      <section style={{ backgroundColor: "#0C0F15", paddingTop: "96px", paddingBottom: "96px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <h2 className="detail-section-title" style={{ marginBottom: "20px", textAlign: "left" }}>
            Особенности проекта и планировки
          </h2>
          <div style={{ fontSize: "16px", lineHeight: "1.75", color: "#C2C7D4" }}>
            <p style={{ marginBottom: "16px" }}>{kitchen.story[0]}</p>
            {kitchen.story[1] && <p>{kitchen.story[1]}</p>}
          </div>
        </div>
      </section>

      {/* 3. Project Navigator Ribbon (No Dead-End!) */}
      <section className="detail-navigator-section">
        <div className="container">
          <div className="detail-nav-header">
            <h2 className="detail-nav-title">Другие кухни студии</h2>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link href={`/kitchens/${prevKitchen.slug}`} style={{ color: "#B2B8C4", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}>
                ← Предыдущая: «{prevKitchen.title}»
              </Link>
              <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
              <Link href={`/kitchens/${nextKitchen.slug}`} style={{ color: "var(--color-green-brand)", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}>
                Следующая: «{nextKitchen.title}» →
              </Link>
            </div>
          </div>

          <div className="detail-nav-cards">
            {otherKitchens.map((item) => (
              <Link key={item.slug} href={`/kitchens/${item.slug}`} className="detail-nav-card">
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
                  <h3 className="detail-nav-card-name">Кухня «{item.title}»</h3>
                  <div className="detail-nav-card-price">
                    Расчёт по спецификации
                  </div>
                  <p className="detail-nav-card-desc">{item.facade}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation Booking */}
      <LeadSection
        id="measure"
        initialCategory={`Кухня «${kitchen.title}»`}
        title="Рассчитаем эту кухню под ваши размеры"
        source={`Карточка кухни: ${kitchen.title}`}
      />
    </div>
  );
}
