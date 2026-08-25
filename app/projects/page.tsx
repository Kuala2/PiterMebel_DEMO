"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { PROJECTS, Project } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";

export default function ProjectsPortfolioPage() {
  const [activeType, setActiveType] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  const filterTabs = [
    { key: "all", label: "Все объекты", count: PROJECTS.length },
    {
      key: "Кухня",
      label: "Кухни",
      count: PROJECTS.filter((p) => p.type === "Кухня").length,
    },
    {
      key: "Гардеробная",
      label: "Гардеробные",
      count: PROJECTS.filter((p) => p.type === "Гардеробная").length,
    },
    {
      key: "Прихожая",
      label: "Прихожие",
      count: PROJECTS.filter((p) => p.type === "Прихожая").length,
    },
    {
      key: "Спальня",
      label: "Спальни",
      count: PROJECTS.filter((p) => p.type === "Спальня").length,
    },
    {
      key: "Панели",
      label: "Реечные панели",
      count: PROJECTS.filter((p) => p.type === "Панели").length,
    },
    {
      key: "Коммерческий",
      label: "Коммерческие",
      count: PROJECTS.filter((p) => p.type === "Коммерческий").length,
    },
  ];

  const filteredProjects =
    activeType === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.type === activeType);

  const featuredProject = PROJECTS[0]; // Island parquet flagship
  const regularProjects = activeType === "all" ? PROJECTS.slice(1) : filteredProjects;

  // Chunk regular projects into pairs of 2 for alternating 2-card zebra rows
  const projectPairs = useMemo(() => {
    const pairs: Project[][] = [];
    for (let i = 0; i < regularProjects.length; i += 2) {
      pairs.push(regularProjects.slice(i, i + 2));
    }
    return pairs;
  }, [regularProjects]);

  const lastPairIsDark =
    activeType === "all" && featuredProject
      ? (projectPairs.length - 1) % 2 === 1
      : (projectPairs.length - 1) % 2 === 0;
  const ctaIsDark = !lastPairIsDark;

  return (
    <div>
      {/* 1. Subpage Hero Banner (70vh, Stopsol glass wardrobe background) */}
      <section className="subpage-hero">
        <div className="subpage-hero-bg">
          <Image
            src="/img/projects/glass-wardrobe/photo_1.jpg"
            alt="Реализованные объекты ПитерМебель"
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 55%" }}
          />
        </div>
        <div className="subpage-hero-overlay" />
        <div className="container subpage-hero-content">
          <h1 className="subpage-hero-title">Реализованные объекты студии</h1>
        </div>
      </section>

      {/* 2. Subtitle & Filter Tabs Bar (Below Banner) */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc">
            Мебель, изготовленная по индивидуальным размерам на собственном производстве на улице Трефолева: кухни, гардеробные, зеркальные шкафы, стеновые панели и мебель для бизнеса.
          </p>

          <div className="catalog-tabs-bar" style={{ marginBottom: 0 }}>
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`cat-tab ${activeType === tab.key ? "is-active" : ""}`}
                onClick={() => setActiveType(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Flagship Spotlight Showcase (Первый объект — Dark: #0A0C0E) */}
      {activeType === "all" && featuredProject && (
        <section style={{ backgroundColor: "var(--bg-dark)", paddingBottom: "50px", paddingTop: "30px" }}>
          <div className="container">
            <div
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "var(--radius-md)",
                overflow: "hidden",
                display: "grid",
                gridTemplateColumns: "1.3fr 1fr",
                gap: "36px",
                padding: "36px",
                alignItems: "center",
              }}
            >
              {/* Photo Gallery with in-card arrows */}
              <div style={{ position: "relative", aspectRatio: "16 / 10", borderRadius: "var(--radius-sm)", overflow: "hidden", background: "#0A0C0E" }}>
                <Image
                  key={featuredProject.gallery[cardPhoto[featuredProject.slug] ?? 0] || featuredProject.cover}
                  src={featuredProject.gallery[cardPhoto[featuredProject.slug] ?? 0] || featuredProject.cover}
                  alt={featuredProject.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 800px"
                  className="card-img-slide"
                  style={{ objectFit: "cover" }}
                />
                <span className="card-badge-top" style={{ background: "var(--color-green-brand)", color: "#0D0F11", fontWeight: 700 }}>
                  Флагманский объект
                </span>

                {/* Left/Right Arrows */}
                <button
                  type="button"
                  className="card-photo-arrow arrow-prev"
                  onClick={(e) => {
                    e.preventDefault();
                    const cur = cardPhoto[featuredProject.slug] ?? 0;
                    setCardPhoto((prev) => ({
                      ...prev,
                      [featuredProject.slug]: cur === 0 ? featuredProject.gallery.length - 1 : cur - 1,
                    }));
                  }}
                  aria-label="Предыдущее фото"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="card-photo-arrow arrow-next"
                  onClick={(e) => {
                    e.preventDefault();
                    const cur = cardPhoto[featuredProject.slug] ?? 0;
                    setCardPhoto((prev) => ({
                      ...prev,
                      [featuredProject.slug]: (cur + 1) % featuredProject.gallery.length,
                    }));
                  }}
                  aria-label="Следующее фото"
                >
                  →
                </button>

                {/* Dots */}
                <div className="card-photo-dots">
                  {featuredProject.gallery.map((_, pIdx) => (
                    <button
                      key={pIdx}
                      type="button"
                      className={`photo-square-dot ${(cardPhoto[featuredProject.slug] ?? 0) === pIdx ? "is-active" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setCardPhoto((prev) => ({ ...prev, [featuredProject.slug]: pIdx }));
                      }}
                      aria-label={`Фото ${pIdx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Info Column */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div>
                  <h2 style={{ fontSize: "26px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1.25 }}>
                    {featuredProject.title}
                  </h2>
                </div>

                <p style={{ fontSize: "14px", color: "var(--color-text-secondary)", lineHeight: 1.65 }}>
                  {featuredProject.task}
                </p>

                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", margin: "4px 0" }}>
                  {featuredProject.materials.map((m) => (
                    <span key={m} className="spec-pill">{m}</span>
                  ))}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                  <Link href={`/projects/${featuredProject.slug}`} className="btn btn-green">
                    Смотреть проект →
                  </Link>
                  <Link href="/contacts" className="btn btn-glass">
                    Заказать аналогичный
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Paired Project Rows (Зебра для каждых двух объектов) */}
      {projectPairs.map((pair, pIdx) => {
        const isDark =
          activeType === "all" && featuredProject
            ? pIdx % 2 === 1
            : pIdx % 2 === 0;

        return (
          <section
            key={pIdx}
            style={{
              backgroundColor: isDark ? "var(--bg-dark)" : "var(--bg-studio)",
              paddingTop: "45px",
              paddingBottom: "45px",
            }}
          >
            <div className="container">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                  gap: "28px",
                }}
              >
                {pair.map((project) => {
                  const currentIdx = cardPhoto[project.slug] ?? 0;
                  const photos = project.gallery?.length ? project.gallery : [project.cover];

                  return (
                    <div
                      key={project.slug}
                      className="catalog-card"
                      style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}
                    >
                      <div className="card-gallery-wrap">
                        <Image
                          key={photos[currentIdx] || photos[0]}
                          src={photos[currentIdx] || photos[0]}
                          alt={project.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 540px"
                          className="card-img-slide"
                        />
                        <span className="card-badge-top">{project.type}</span>

                        {/* In-Card Left Arrow */}
                        {photos.length > 1 && (
                          <button
                            type="button"
                            className="card-photo-arrow arrow-prev"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardPhoto((prev) => ({
                                ...prev,
                                [project.slug]: currentIdx === 0 ? photos.length - 1 : currentIdx - 1,
                              }));
                            }}
                            aria-label="Предыдущее фото"
                          >
                            ←
                          </button>
                        )}

                        {/* In-Card Right Arrow */}
                        {photos.length > 1 && (
                          <button
                            type="button"
                            className="card-photo-arrow arrow-next"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardPhoto((prev) => ({
                                ...prev,
                                [project.slug]: (currentIdx + 1) % photos.length,
                              }));
                            }}
                            aria-label="Следующее фото"
                          >
                            →
                          </button>
                        )}

                        {/* In-Card Dots */}
                        <div className="card-photo-dots">
                          {photos.map((_, pIdxDot) => (
                            <button
                              key={pIdxDot}
                              type="button"
                              className={`photo-square-dot ${currentIdx === pIdxDot ? "is-active" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCardPhoto((prev) => ({ ...prev, [project.slug]: pIdxDot }));
                              }}
                              aria-label={`Фото ${pIdxDot + 1}`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="card-body">
                        <h2 className="card-title">{project.title}</h2>
                        <p className="card-desc">{project.task}</p>
                        <div className="card-specs-tags">
                          {project.materials.map((m) => (
                            <span key={m} className="spec-pill">{m}</span>
                          ))}
                        </div>
                        <div className="card-footer">
                          <div>
                            <div className="card-price-label">Спецификация</div>
                            <div className="card-price-val">Индивидуальный раскрой</div>
                          </div>
                          <Link href={`/projects/${project.slug}`} className="card-btn-action">
                            Смотреть проект →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {/* 4. Consultation Section */}
      <section className="final-section" style={{ backgroundColor: ctaIsDark ? "var(--bg-dark)" : "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Хотите реализовать похожий проект?
                </h2>
                <p className="final-desc">
                  Отправьте фото понравившегося объекта или план помещения. Технологи студии «ПитерМебель» рассчитают стоимость и проконсультируют по материалам.
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
                <MeasureForm initialCategory="Индивидуальный проект" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
