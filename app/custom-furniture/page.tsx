"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import SpotlightArea from "@/components/SpotlightArea";
import PageHeader from "@/components/PageHeader";
import { PROJECTS } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import ConsultationSection from "@/components/ConsultationSection";

export default function CustomFurniturePage() {
  const [activeSubtype, setActiveSubtype] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  // Фильтруем проекты прихожих, панелей, коммерческой мебели и прочих индивидуальных решений
  const customProjects = PROJECTS.filter(
    (p) =>
      p.type === "Прихожая" ||
      p.type === "Панели" ||
      p.type === "Коммерческий" ||
      p.title.toLowerCase().includes("прихож") ||
      p.title.toLowerCase().includes("панел")
  );

  const filterTabs = [
    { key: "all", label: "Вся корпусная мебель", count: customProjects.length },
    {
      key: "Прихожая",
      label: "Прихожие и входные зоны",
      count: customProjects.filter((p) => p.type === "Прихожая").length,
    },
    {
      key: "Панели",
      label: "Стеновые реечные панели",
      count: customProjects.filter((p) => p.type === "Панели").length,
    },
    {
      key: "Коммерческий",
      label: "Для бизнеса и офисов",
      count: customProjects.filter((p) => p.type === "Коммерческий").length,
    },
  ];

  const filteredItems =
    activeSubtype === "all"
      ? customProjects
      : customProjects.filter((p) => p.type === activeSubtype);

  return (
    <div>
      {/* 1. Page Header */}
      <PageHeader title="Корпусная мебель на заказ" />

      {/* 3. Filter Tabs Bar */}
      <section style={{ paddingTop: "28px", paddingBottom: "0px", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="catalog-tabs-bar">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`cat-tab ${activeSubtype === tab.key ? "is-active" : ""}`}
                onClick={() => setActiveSubtype(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Portfolio Grid */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "28px", paddingBottom: "96px" }}>
        <div className="container">
          <SpotlightArea className="projects-grid" selector=".catalog-card">
            {filteredItems.map((project) => {
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

      {/* 5. CANVAS CTA */}
      <ConsultationSection
        id="consult"
        title="Нужна мебель по индивидуальным размерам?"
        initialCategory="customFurniture"
        defaultFurnitureType="Прихожая"
        calculatorText="Калькулятор мебели"
      />
    </div>
  );
}
