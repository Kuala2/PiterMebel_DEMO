import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import Gallery from "@/components/Gallery";
import { PROJECTS } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return PROJECTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS.find((p) => p.slug === slug);
  if (!project) return { title: "Объект не найден" };

  return {
    title: `${project.title} — ${SITE_CONFIG.name}`,
    description: `${project.type}: ${project.title}. ${project.solution.slice(0, 140)}`,
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
    <div>
      {/* 1. Split: слева текст, справа фото */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "130px", paddingBottom: "88px" }}>
        <div className="container case-split">
          {/* Текстовая колонка */}
          <div className="case-split-text">
            <div style={{ marginBottom: "26px" }}>
              <Link href="/projects" className="detail-back-link">
                ← Назад в список объектов
              </Link>
            </div>

            <h1 className="case-title">{project.title}</h1>
            <p className="case-lead">{project.task}</p>

            <div className="detail-specs" style={{ marginBottom: "30px" }}>
              <div className="spec-row">
                <span className="spec-row-label">Тип</span>
                <span className="spec-row-val">{project.type}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Материалы</span>
                <span className="spec-row-val">{project.materials.join(", ")}</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Фурнитура</span>
                <span className="spec-row-val">Скрытые направляющие и доводчики</span>
              </div>
              <div className="spec-row">
                <span className="spec-row-label">Производство</span>
                <span className="spec-row-val">{SITE_CONFIG.address}</span>
              </div>
            </div>

            <div className="detail-actions">
              <Link href="#measure" className="btn btn-green">
                Заказать аналогичный проект
              </Link>
              <a
                href={SITE_CONFIG.vkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-glass"
                style={{ gap: "8px" }}
              >
                <VkIcon />
                Обсудить проект в VK
              </a>
            </div>
          </div>

          {/* Фото-колонка */}
          <div className="case-split-photo">
            <Gallery images={allPhotos} title={project.title} />
          </div>
        </div>
      </section>

      {/* 2. О проекте */}
      <section style={{ backgroundColor: "var(--bg-studio)", paddingTop: "72px", paddingBottom: "88px" }}>
        <div className="container">
          <h3 style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-text-muted)", margin: "0 0 18px" }}>
            О проекте
          </h3>
          <p className="detail-solution">{project.solution}</p>
        </div>
      </section>
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <span className="section-kicker">Бесплатный выезд</span>
                <h2 className="final-headline">
                  Запись на замер объекта
                </h2>
                <p className="final-desc">
                  Инженер студии снимет точные размеры помещения в Санкт-Петербурге, привезет чемодан образцов материалов (Fenix, эмаль по RAL, шпон дуба, камень) и подготовит 3D-проект под ваши размеры.
                </p>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  {SITE_CONFIG.name} · {SITE_CONFIG.address} ({SITE_CONFIG.metro})
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
