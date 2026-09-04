import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { KITCHENS } from "@/data/kitchens";
import { SITE_CONFIG } from "@/data/site";

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

  return {
    title: `Кухня «${kitchen.title}» — цена ${kitchen.price.toLocaleString("ru-RU")} ₽ | ПитерМебель`,
    description: `Кухня «${kitchen.title}» на заказ по индивидуальным размерам в Санкт-Петербурге: ${kitchen.price.toLocaleString("ru-RU")} ₽ (${kitchen.pricePerMeter}). Собственное фабричное производство полного цикла.`,
  };
}

export default async function KitchenDetailPage({ params }: KitchenPageProps) {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);

  if (!kitchen) {
    notFound();
  }

  const allPhotos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];

  const currentIndex = KITCHENS.findIndex((k) => k.slug === slug);
  const prevKitchen = KITCHENS[(currentIndex - 1 + KITCHENS.length) % KITCHENS.length];
  const nextKitchen = KITCHENS[(currentIndex + 1) % KITCHENS.length];
  const otherKitchens = KITCHENS.filter((k) => k.slug !== slug).slice(0, 3);

  return (
    <div className="kitchen-detail-page">
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

              {/* Real Price Hook */}
              <div className="detail-price-badge">
                <span className="detail-price-val">
                  {kitchen.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="detail-price-meter">
                  ({kitchen.pricePerMeter} под ключ)
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
                  <span className="detail-spec-val">Влагостойкая плита Egger 18 мм (класс E1)</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Фурнитура</span>
                  <span className="detail-spec-val">Blum (Австрия) — петли и ящики с доводчиками</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Кромление</span>
                  <span className="detail-spec-val">Влагостойкая герметизация торцов</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Срок изготовления</span>
                  <span className="detail-spec-val">от 25 рабочих дней (цех: Петергофское ш., 73)</span>
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
                    {item.price.toLocaleString("ru-RU")} ₽
                  </div>
                  <p className="detail-nav-card-desc">{item.facade}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Consultation Booking */}
      <section className="final-section" id="measure">
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Хотите такую же кухню под размеры вашей квартиры?
                </h2>
                <p className="final-desc">
                  Приглашаем на консультацию в офис студии на площади Стачек, 9 (по записи). Вживую подберем материалы ({kitchen.facade}, эмали RAL, шпон, камень), рассчитаем предварительную смету и подарим инженерную схему электрики под технику.
                </p>
                <div className="final-buttons-row">
                  <a
                    href={`tel:${SITE_CONFIG.phoneRaw}`}
                    className="btn btn-green"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {SITE_CONFIG.phone}
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
                <div className="final-subtext-note">
                  Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}) · Производство: {SITE_CONFIG.productionAddress}
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory={`Кухня «${kitchen.title}»`} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
