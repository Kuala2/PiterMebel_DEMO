"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import { PROJECTS, Project } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import PageHeader from "@/components/PageHeader";

export default function ProjectsPortfolioPage() {
  const [activeType, setActiveType] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  const filterTabs = [
    { key: "all", label: "Все проекты", count: PROJECTS.length },
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
      <PageHeader title="Реализованные проекты студии" backTo="/" />

      {/* 2. Filter Tabs Bar (Under the line) */}
      <section style={{ paddingTop: "28px", paddingBottom: "0px", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="catalog-tabs-bar">
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
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "28px", paddingBottom: "96px" }}>
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
                      className="card-img-slide is-active"
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

                    {/* Direct link on photo area */}
                    <Link
                      href={`/projects/${project.slug}`}
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                      aria-label={`Смотреть проект ${project.title}`}
                    />
                  </div>

                  <Link
                    href={`/projects/${project.slug}`}
                    className="card-body"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", cursor: "pointer" }}
                  >
                    <h2 className="card-title">{project.title}</h2>

                    <div className="card-specs-tags">
                      <span className="spec-tag">Индивидуальный размер</span>
                      {project.materials?.slice(0, 2).map((mat, mIdx) => (
                        <span key={mIdx} className="spec-tag">
                          {mat}
                        </span>
                      ))}
                    </div>

                    <div className="card-footer-row">
                      <span className="card-view-btn">Смотреть проект →</span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </SpotlightArea>
        </div>
      </section>

      {/* 4. Consultation Section */}
      <LeadSection
        id="consult"
        title="Рассчитаем индивидуальный проект"
        source="Портфолио проектов"
      />
    </div>
  );
}
