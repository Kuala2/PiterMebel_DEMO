import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Gallery from "@/components/Gallery";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { PROJECTS } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    return { title: "Проект не найден — ПитерМебель" };
  }

  const priceText = project.price ? ` — от ${project.price.toLocaleString("ru-RU")} ₽` : "";

  return {
    title: `${project.title}${priceText} | ПитерМебель`,
    description: `${project.title}: индивидуальное изготовление мебели в Санкт-Петербурге. Собственное ЧПУ-производство полного цикла.`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const allPhotos = project.gallery?.length ? project.gallery : [project.cover];

  return (
    <div className="project-detail-page">
      {/* 1. Above the fold: 40/60 Split Layout (Specs & Price on left, Large Photo on right) */}
      <section className="detail-page-header">
        <div className="container">
          <div className="detail-top-nav">
            <Link href="/projects" className="detail-back-link">
              ← Назад в список объектов
            </Link>
          </div>

          <div className="detail-split-hero">
            {/* Left Column (38-40%): Title, Real Price, Compact Specs Table, CTAs */}
            <div className="detail-info-col">
              <h1 className="detail-hero-title">{project.title}</h1>

              {/* Commercial price hook */}
              {project.price && (
                <div className="detail-price-badge">
                  <span className="detail-price-val">
                    {project.price.toLocaleString("ru-RU")} ₽
                  </span>
                  {project.priceNote && (
                    <span className="detail-price-meter">
                      ({project.priceNote})
                    </span>
                  )}
                </div>
              )}

              <p className="detail-hero-lead">
                {project.task}. Проектирование с учетом архитектурных ниш, геометрии стен и скрытой проводки.
              </p>

              {/* Clean Tile-Free Specifications Table */}
              <div className="detail-specs-table">
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Тип изделия</span>
                  <span className="detail-spec-val">{project.type}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Материалы</span>
                  <span className="detail-spec-val">{project.materials.join(", ")}</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Фурнитура</span>
                  <span className="detail-spec-val">Скрытые направляющие плавного хода с доводчиками</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Монтаж</span>
                  <span className="detail-spec-val">Точная встройка от пола до потолка без щелей</span>
                </div>
                <div className="detail-spec-row">
                  <span className="detail-spec-name">Производство</span>
                  <span className="detail-spec-val">от 25 рабочих дней (собственный ЧПУ-цех в СПб)</span>
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

            {/* Right Column (60-62%): Generous, Adaptive Photo Gallery */}
            <div className="detail-gallery-col">
              <Gallery images={allPhotos} title={project.title} aspectRatio="4 / 3" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Solution Narrative (Clean, honest, no robotic kickers) */}
      <section style={{ backgroundColor: "#0C0F15", paddingTop: "60px", paddingBottom: "60px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="container" style={{ maxWidth: "880px" }}>
          <h2 className="detail-section-title" style={{ marginBottom: "20px" }}>
            Архитектурное решение и реализация
          </h2>
          <div style={{ fontSize: "16px", lineHeight: "1.75", color: "#C2C7D4" }}>
            <p>{project.solution}</p>
          </div>
          {project.relatedKitchenSlug && (
            <div style={{ marginTop: "28px" }}>
              <Link href={`/kitchens/${project.relatedKitchenSlug}`} className="btn btn-glass" style={{ gap: "8px" }}>
                Смотреть парный кухонный гарнитур →
              </Link>
            </div>
          )}
        </div>
      </section>



      {/* 4. Measurement & Booking Section */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <span className="section-kicker">Бесплатный выезд</span>
                <h2 className="final-headline">
                  Заказать индивидуальный расчет
                </h2>
                <p className="final-desc">
                  Инженер студии снимет точные размеры помещения в Санкт-Петербурге, привезет чемодан образцов материалов (Fenix, эмаль по RAL, шпон дуба, камень) и подготовит 3D-проект под ваши размеры.
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
                <MeasureForm initialCategory={project.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
