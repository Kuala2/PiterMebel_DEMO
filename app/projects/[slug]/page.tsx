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
    description: `${project.title}: индивидуальное изготовление мебели в Санкт-Петербурге. Собственное фабричное производство полного цикла.`,
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const allPhotos = project.gallery?.length ? project.gallery : [project.cover];

  const currentIndex = PROJECTS.findIndex((p) => p.slug === slug);
  const prevProject = PROJECTS[(currentIndex - 1 + PROJECTS.length) % PROJECTS.length];
  const nextProject = PROJECTS[(currentIndex + 1) % PROJECTS.length];
  const otherProjects = PROJECTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="project-detail-page">
      {/* 1. Above the fold: Split Layout (Desktop 38/62, Mobile order: Title -> Gallery -> Specs) */}
      <section className="detail-page-header">
        <div className="container">
          <div className="detail-top-nav" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
            <Link href="/projects" className="btn btn-glass" style={{ gap: "8px" }}>
              ← В каталог проектов
            </Link>
            <Link href={`/projects/${nextProject.slug}`} className="btn btn-glass" style={{ gap: "8px" }}>
              Следующий проект: «{nextProject.title}» →
            </Link>
          </div>

          <div className="detail-split-hero">
            {/* Info Column */}
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

              {/* On mobile, CSS reorders: Title -> Price -> Gallery -> Lead -> Specs -> Buttons */}
              <p className="detail-hero-lead">
                {project.task}. Проектирование с учетом архитектурных ниш, геометрии стен и скрытой проводки.
              </p>

              {/* Clean Specifications Table */}
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
                  <span className="detail-spec-val">от 25 рабочих дней (цех: Петергофское ш., 73)</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
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

            {/* Right Column: Photo Gallery */}
            <div className="detail-gallery-col">
              <Gallery images={allPhotos} title={project.title} aspectRatio="4 / 3" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Project Solution Narrative */}
      <section style={{ backgroundColor: "#0C0F15", paddingTop: "96px", paddingBottom: "96px", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="container" style={{ maxWidth: "860px" }}>
          <h2 className="detail-section-title" style={{ marginBottom: "20px", textAlign: "left" }}>
            Архитектурное решение и реализация
          </h2>
          <div style={{ fontSize: "16px", lineHeight: "1.75", color: "#C2C7D4" }}>
            <p>{project.solution}</p>
          </div>
          {project.relatedKitchenSlug && (
            <div style={{ marginTop: "24px" }}>
              <Link href={`/kitchens/${project.relatedKitchenSlug}`} className="btn btn-glass">
                Смотреть парный кухонный гарнитур →
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* 3. Project Navigator Ribbon */}
      <section className="detail-navigator-section">
        <div className="container">
          <div className="detail-nav-header">
            <h2 className="detail-nav-title">Другие реализованные проекты</h2>
            <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
              <Link href={`/projects/${prevProject.slug}`} style={{ color: "#B2B8C4", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}>
                ← Предыдущий: «{prevProject.title}»
              </Link>
              <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>|</span>
              <Link href={`/projects/${nextProject.slug}`} style={{ color: "var(--color-green-brand)", fontSize: "15px", fontWeight: 500, textDecoration: "none" }}>
                Следующий: «{nextProject.title}» →
              </Link>
            </div>
          </div>

          <div className="detail-nav-cards">
            {otherProjects.map((item) => (
              <Link key={item.slug} href={`/projects/${item.slug}`} className="detail-nav-card">
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
                  {item.price && (
                    <div className="detail-nav-card-price">
                      от {item.price.toLocaleString("ru-RU")} ₽
                    </div>
                  )}
                  <p className="detail-nav-card-desc">{item.materials.slice(0, 2).join(", ")}</p>
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
                  Заказать индивидуальный расчет проекта
                </h2>
                <p className="final-desc">
                  Приглашаем на консультацию в офис студии на площади Стачек, 9 (по записи). Вживую подберем материалы, согласуем эргономику и рассчитаем смету с точностью до рубля без салонных переплат.
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
                <MeasureForm initialCategory={project.title} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
