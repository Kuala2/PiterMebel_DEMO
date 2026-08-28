import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { KITCHENS } from "@/data/kitchens";
import { SITE_CONFIG } from "@/data/site";

interface KitchenPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return KITCHENS.map((k) => ({
    slug: k.slug,
  }));
}

export async function generateMetadata({
  params,
}: KitchenPageProps): Promise<Metadata> {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);
  if (!kitchen) return { title: "Кухня не найдена" };

  return {
    title: `Кухня «${kitchen.title}» — ${SITE_CONFIG.name}`,
    description: `Кухня «${kitchen.title}» на заказ в Санкт-Петербурге. Фасады: ${kitchen.facade}. Собственное производство на Трефолева 1П.`,
  };
}

export default async function KitchenDetailPage({ params }: KitchenPageProps) {
  const { slug } = await params;
  const kitchen = KITCHENS.find((k) => k.slug === slug);

  if (!kitchen) {
    notFound();
  }

  const heroPhoto = kitchen.gallery[0] || kitchen.cover;
  const otherPhotos = kitchen.gallery.slice(1);

  return (
    <div>
      {/* 1. Large 70vh Hero Banner with ONLY Title on the picture */}
      <section className="subpage-hero hero-detail">
        <div className="subpage-hero-bg">
          <Image
            src={heroPhoto}
            alt={`Кухня ${kitchen.title}`}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 60%" }}
          />
        </div>
        <div className="subpage-hero-overlay" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title" style={{ marginBottom: "0" }}>
            Кухня «{kitchen.title}»
          </h1>
        </div>
      </section>

      {/* 2. Overview, Story & Specs (Tone 1: Dark #0A0C0E) */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "40px", paddingBottom: "60px" }}>
        <div className="container">
          <div style={{ marginBottom: "24px" }}>
            <Link
              href="/kitchens"
              className="section-kicker"
              style={{
                color: "var(--color-green-brand)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Назад в каталог кухонь
            </Link>
          </div>
          {/* Overview & Quick Actions Header */}
          <div
            style={{
              paddingBottom: "36px",
              marginBottom: "44px",
              borderBottom: "1px solid var(--border-subtle)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "19px",
                  color: "#FFFFFF",
                  fontWeight: 500,
                  marginBottom: "16px",
                  maxWidth: "740px",
                  lineHeight: "1.5",
                }}
              >
                {kitchen.feature}
              </p>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <span className="spec-pill">Фасад: {kitchen.facade}</span>
                <span className="spec-pill">Столешница: {kitchen.worktop}</span>
                <span className="spec-pill">Цех на Трефолева 1П</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="#measure" className="btn btn-green">
                Заказать расчет по размерам
              </Link>
              <a
                href={SITE_CONFIG.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass"
                style={{ gap: "8px" }}
              >
                <VkIcon />
                Консультация в VK
              </a>
            </div>
          </div>

          {/* Story & Specs Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* Story Col */}
            <div>
              <h2 className="section-title" style={{ fontSize: "28px", marginBottom: "18px" }}>
                О проекте «{kitchen.title}»
              </h2>
              <div
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "15px",
                  lineHeight: "1.75",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                <p>{kitchen.story[0]}</p>
                <p>{kitchen.story[1]}</p>
              </div>
            </div>

            {/* Specs Col */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h3 style={{ fontSize: "14px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-green-brand)", margin: "0 0 4px" }}>
                Характеристики
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Фасады:</span>
                <strong style={{ color: "#FFFFFF", textAlign: "right" }}>{kitchen.facade}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Столешница:</span>
                <strong style={{ color: "#FFFFFF", textAlign: "right" }}>{kitchen.worktop}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Особенность:</span>
                <strong style={{ color: "#FFFFFF", textAlign: "right" }}>{kitchen.feature}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Фурнитура:</span>
                <strong style={{ color: "var(--color-green-brand)", textAlign: "right" }}>Скрытые доводчики плавного хода</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Производство:</span>
                <strong style={{ color: "#FFFFFF", textAlign: "right" }}>{SITE_CONFIG.address} ({SITE_CONFIG.metro})</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Remaining Photos Gallery (Tone 2: Studio #101317) */}
      {otherPhotos.length > 0 && (
        <section style={{ backgroundColor: "var(--bg-studio)", paddingTop: "60px", paddingBottom: "70px" }}>
          <div className="container">
            <div style={{ marginBottom: "28px" }}>
              <h2 className="section-title" style={{ fontSize: "28px" }}>
                Ракурсы и детали гарнитура
              </h2>
            </div>

            <div className="detail-gallery-grid">
              {otherPhotos.map((img, idx) => (
                <div
                  key={img + idx}
                  style={{
                    background: "var(--bg-surface)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: "var(--radius-md)",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16 / 11",
                      background: "#0A0C0E",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`Кухня «${kitchen.title}» — ракурс ${idx + 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                      Кухня «{kitchen.title}» · Ракурс {idx + 2}
                    </span>
                    <span className="feature-tag" style={{ fontSize: "10px" }}>
                      Трефолева 1П
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Form Section */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Запись на замер кухни «{kitchen.title}»
                </h2>
                <p className="final-desc">
                  Инженер студии снимет точные размеры помещения в Санкт-Петербурге с учетом розеток и коммуникаций, привезет чемодан образцов материалов и подготовит 3D-проект под ваши размеры.
                </p>
                <div style={{ fontSize: "13px", color: "var(--color-text-muted)" }}>
                  {SITE_CONFIG.name} · {SITE_CONFIG.address} ({SITE_CONFIG.metro})
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
