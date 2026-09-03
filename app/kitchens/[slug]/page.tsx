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
    description: `Кухня «${kitchen.title}» на заказ по индивидуальным размерам в Санкт-Петербурге: ${kitchen.price.toLocaleString("ru-RU")} ₽ (${kitchen.pricePerMeter}). Собственное ЧПУ-производство полного цикла.`,
  };
}

export default async function KitchenDetailPage({ params }: KitchenPageProps) {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);

  if (!kitchen) {
    notFound();
  }

  const allPhotos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];

  return (
    <div className="kitchen-detail-page">
      {/* 1. Above the fold: 40/60 Split Layout (Specs & Price on left, Large Photo on right) */}
      <section className="detail-page-header">
        <div className="container">
          <div className="detail-top-nav">
            <Link href="/kitchens" className="detail-back-link">
              ← Назад в каталог кухонь
            </Link>
          </div>

          <div className="detail-split-hero">
            {/* Left Column (38-40%): Title, Real Price, Compact Specs Table, CTAs */}
            <div className="detail-info-col">
              <h1 className="detail-hero-title">
                Кухня «{kitchen.title}»
              </h1>

              {/* Clear commercial price hook */}
              <div className="detail-price-badge">
                <span className="detail-price-val">
                  {kitchen.price.toLocaleString("ru-RU")} ₽
                </span>
                <span className="detail-price-meter">
                  ({kitchen.pricePerMeter} под ключ)
                </span>
              </div>
              
              <p className="detail-hero-lead">
                {kitchen.feature}. Изготавливается по индивидуальным размерам помещения с подгонкой под потолок и встроенной техникой.
              </p>

              {/* Clean Tile-Free Specifications Table */}
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
                  <span className="detail-spec-val">Влагостойкий термошов PUR (не боится пара)</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Срок изготовления</span>
                  <span className="detail-spec-val">от 25 рабочих дней (собственный цех в СПб)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
                <Link
                  href="/calculator"
                  className="btn btn-green"
                  style={{ padding: "13px 22px" }}
                >
                  Рассчитать проект под размеры
                </Link>
                <a
                  href="#measure"
                  className="btn btn-glass"
                  style={{ padding: "13px 18px" }}
                >
                  Вызвать мастера на замер
                </a>
                <a
                  href={SITE_CONFIG.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ padding: "13px 16px", gap: "8px" }}
                >
                  <VkIcon />
                  ВКонтакте
                </a>
              </div>
            </div>

            {/* Right Column (60-62%): Generous, Adaptive Photo Gallery without black bars */}
            <div className="detail-gallery-col">
              <Gallery images={allPhotos} title={kitchen.title} aspectRatio="4 / 3" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Story & Planning Solution (Without fake duplicated kickers) */}
      <section style={{ backgroundColor: "#0C0F15", paddingTop: "60px", paddingBottom: "60px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="container" style={{ maxWidth: "880px" }}>
          <h2 className="detail-section-title" style={{ marginBottom: "20px" }}>
            Особенности проекта и планировки
          </h2>
          <div style={{ fontSize: "16px", lineHeight: "1.75", color: "#C2C7D4" }}>
            <p style={{ marginBottom: "16px" }}>{kitchen.story[0]}</p>
            {kitchen.story[1] && <p>{kitchen.story[1]}</p>}
          </div>
        </div>
      </section>



      {/* 4. Measurement & Booking Section */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <span className="section-kicker">Бесплатный выезд инженера</span>
                <h2 className="final-headline">
                  Хотите такую же кухню под размеры вашей квартиры?
                </h2>
                <p className="final-desc">
                  Ведущий инженер студии приедет в Санкт-Петербурге с чемоданом образцов материалов ({kitchen.facade}, эмали RAL, шпон, образцы камня), выполнит лазерный замер помещения и составит проект с точной сметой.
                </p>
                <div className="final-buttons-row">
                  <a
                    href={`tel:${SITE_CONFIG.phoneRaw}`}
                    className="btn btn-green"
                    style={{ gap: "8px" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {SITE_CONFIG.phone}
                  </a>
                  <a
                    href={SITE_CONFIG.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glass"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    ВКонтакте
                  </a>
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
