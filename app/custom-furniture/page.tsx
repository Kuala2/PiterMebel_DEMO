"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import SpotlightArea from "@/components/SpotlightArea";
import PromoBanner from "@/components/PromoBanner";
import { PROJECTS } from "@/data/projects";
import { SITE_CONFIG } from "@/data/site";
import { PROMOS } from "@/data/promos";

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
      <section className="page-header" style={{ paddingBottom: "36px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div className="container">
          <h1 className="subpage-hero-title">Корпусная мебель на заказ</h1>
          <p className="subpage-hero-caption">
            Прихожие, реечные стеновые панели, ТВ-зоны и мебель для бизнеса по индивидуальным размерам в СПб
          </p>
        </div>
      </section>

      {/* 2. Special Offer Banner: Скидка за объем */}
      <PromoBanner offer={PROMOS.customFurniture} />

      {/* 3. Filter Tabs Bar */}
      <section style={{ paddingTop: "20px", paddingBottom: "20px", backgroundColor: "var(--bg-dark)" }}>
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
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "56px", paddingBottom: "112px" }}>
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
      <section className="final-section" id="consult" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Индивидуальная корпусная мебель без салонных наценок
                </h2>
                <p className="final-desc">
                  Изготавливаем прихожие, реечные стеновые панели, мебель для ванных комнат и коммерческих помещений на собственном производстве на Петергофском шоссе, 73. Приглашаем на консультацию в офис на площади Стачек, 9 (офис 407, по записи) для обсуждения чертежей и выбора материалов.
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
                    href={SITE_CONFIG.vkImUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glass"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    ВКонтакте
                  </a>
                  <Link href="/calculator" className="btn btn-glass">
                    Калькулятор мебели
                  </Link>
                </div>
                <div style={{ fontSize: "13.5px", color: "var(--color-text-muted)", marginTop: "18px" }}>
                  Офис: {SITE_CONFIG.officeAddress} ({SITE_CONFIG.metro}, по записи) · Производство: {SITE_CONFIG.productionAddress}
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Корпусная мебель на заказ" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
