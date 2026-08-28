import { notFound } from "next/navigation";
import Link from "next/link";
import Gallery from "@/components/Gallery";
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

  const allPhotos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];

  return (
    <div>
      {/* 1. Compact Header: только название и подзаголовок */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "130px", paddingBottom: "44px" }}>
        <div className="container">
          <div style={{ marginBottom: "28px" }}>
            <Link href="/kitchens" className="detail-back-link">
              ← Назад в каталог кухонь
            </Link>
          </div>

          <h1 className="case-title">Кухня «{kitchen.title}»</h1>
          <p className="case-lead" style={{ marginBottom: 0 }}>{kitchen.feature}</p>
        </div>
      </section>

      {/* 2. Галерея — сразу за шапкой */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingBottom: "0" }}>
        <div className="container">
          <Gallery images={allPhotos} title={`Кухня ${kitchen.title}`} />
        </div>
      </section>

      {/* 3. Инфо-полоса под фото + кнопки */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingBottom: "72px" }}>
        <div className="container">
          <div className="case-info-strip">
            <div className="case-info-cell">
              <span className="spec-row-label">Тип</span>
              <span className="case-info-val">Кухня на заказ</span>
            </div>
            <div className="case-info-cell">
              <span className="spec-row-label">Фасады</span>
              <span className="case-info-val">{kitchen.facade}</span>
            </div>
            <div className="case-info-cell">
              <span className="spec-row-label">Особенность</span>
              <span className="case-info-val">{kitchen.feature}</span>
            </div>
          </div>

          <div className="detail-actions">
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
      </section>

      {/* 4. О проекте + Характеристики */}
      <section style={{ backgroundColor: "var(--bg-studio)", paddingTop: "72px", paddingBottom: "88px" }}>
        <div className="container case-solution-grid">
          <div>
            <h3 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", margin: "0 0 18px" }}>
              О проекте
            </h3>
            <div className="detail-story">
              <p>{kitchen.story[0]}</p>
              {kitchen.story[1] && <p>{kitchen.story[1]}</p>}
            </div>
          </div>
          <aside>
            <h3 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", margin: "0 0 10px" }}>
              Характеристики
            </h3>
            <div>
              <div className="spec-row">
                <span className="spec-row-label">Фасады</span>
                <span className="spec-row-val">{kitchen.facade}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Столешница</span>
                <span className="spec-row-val">{kitchen.worktop}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Особенность</span>
                <span className="spec-row-val">{kitchen.feature}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Фурнитура</span>
                <span className="spec-row-val">Скрытые доводчики плавного хода</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Производство</span>
                <span className="spec-row-val">{SITE_CONFIG.address}</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

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
