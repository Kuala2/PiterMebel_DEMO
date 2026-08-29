"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import SpotlightArea from "@/components/SpotlightArea";
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

  return (
    <div>
      {/* 1. Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="subpage-hero-title">Реализованные объекты студии</h1>
          <p className="subpage-hero-caption">
            {PROJECTS.length} объектов · всё изготовлено в нашем цеху на Трефолева
          </p>
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

      {/* 3. Projects 3-Column Portfolio Grid */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "50px", paddingBottom: "70px" }}>
        <div className="container">
          <SpotlightArea className="projects-grid" selector=".catalog-card">
            {filteredProjects.map((project) => {
              const currentIdx = cardPhoto[project.slug] ?? 0;
              const photos = project.gallery?.length ? project.gallery : [project.cover];

              return (
                <div
                  key={project.slug}
                  className="catalog-card project-card-item spotlight-target"
                >
                  <div className="card-gallery-wrap">
                    <Image
                      key={photos[currentIdx] || photos[0]}
                      src={photos[currentIdx] || photos[0]}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
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
                    {photos.length > 1 && (
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
                    )}
                  </div>

                  <div className="card-body">
                    <h2 className="card-title">{project.title}</h2>
                    <p className="card-desc">{project.task}</p>
                    <Link href={`/projects/${project.slug}`} className="card-open-link">
                      Смотреть проект →
                    </Link>
                  </div>
                </div>
              );
            })}
          </SpotlightArea>
        </div>
      </section>

      {/* 4. Consultation Section */}
      <section className="final-section" style={{ backgroundColor: "var(--bg-studio)" }}>
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
