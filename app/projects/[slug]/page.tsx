import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
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

  const heroPhoto = project.gallery[0] || project.cover;
  const otherPhotos = project.gallery.slice(1);

  return (
    <div>
      {/* 1. Large 70vh Hero Banner with ONLY Title */}
      <section className="subpage-hero hero-detail">
        <div className="subpage-hero-bg">
          <Image
            src={heroPhoto}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
        </div>
        <div className="subpage-hero-overlay" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title" style={{ marginBottom: 0 }}>
            {project.title}
          </h1>
        </div>
      </section>

      {/* 2. Overview, Solution & Specs */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "40px", paddingBottom: "60px" }}>
        <div className="container">
          <div style={{ marginBottom: "24px" }}>
            <Link
              href="/projects"
              className="section-kicker"
              style={{
                color: "var(--color-green-brand)",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ← Назад в список объектов
            </Link>
          </div>
          {/* Overview Header */}
          <div
            style={{
              paddingBottom: "32px",
              marginBottom: "40px",
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
                  fontSize: "18px",
                  color: "var(--color-text-primary)",
                  fontWeight: 500,
                  marginBottom: "14px",
                  maxWidth: "720px",
                  lineHeight: "1.5",
                }}
              >
                {project.task}
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {project.materials.map((m) => (
                  <span key={m} className="spec-pill">{m}</span>
                ))}
                <span className="spec-pill">Цех на Трефолева 1П</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
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

          {/* Solution & Specs Row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr",
              gap: "40px",
              alignItems: "start",
            }}
          >
            {/* Solution Col */}
            <div>
              <span className="section-kicker">Решение студии</span>
              <h2 className="section-title" style={{ fontSize: "26px", marginBottom: "16px" }}>
                Как мы реализовали этот проект
              </h2>
              <div
                style={{
                  color: "var(--color-text-secondary)",
                  fontSize: "15px",
                  lineHeight: "1.7",
                }}
              >
                <p>{project.solution}</p>
              </div>
            </div>

            {/* Specs Col */}
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                padding: "26px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.35)",
              }}
            >
              <h3 style={{ fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-green-brand)", margin: "0 0 4px" }}>
                Параметры объекта
              </h3>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Тип мебели:</span>
                <strong style={{ color: "var(--color-text-primary)", textAlign: "right" }}>{project.type}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Материалы:</span>
                <strong style={{ color: "var(--color-text-primary)", textAlign: "right" }}>{project.materials.join(", ")}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "10px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Фурнитура:</span>
                <strong style={{ color: "var(--color-green-brand)", textAlign: "right" }}>Скрытые направляющие и доводчики</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Производство:</span>
                <strong style={{ color: "var(--color-text-primary)", textAlign: "right" }}>{SITE_CONFIG.address} ({SITE_CONFIG.metro})</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Remaining Photos Gallery */}
      {otherPhotos.length > 0 && (
        <section style={{ backgroundColor: "var(--bg-studio)", paddingTop: "60px", paddingBottom: "70px" }}>
          <div className="container">
            <div style={{ marginBottom: "28px" }}>
              <span className="section-kicker">Фотогалерея</span>
              <h2 className="section-title" style={{ fontSize: "26px", marginBottom: 0 }}>
                Ракурсы и фото монтажа
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
                    boxShadow: "0 4px 16px rgba(0, 0, 0, 0.35)",
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "16 / 11",
                      background: "var(--bg-dark)",
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${project.title} — ракурс ${idx + 2}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-text-secondary)", fontWeight: 500 }}>
                      {project.title} · Ракурс {idx + 2}
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

      {/* 4. Form Section */}
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
