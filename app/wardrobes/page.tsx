"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import { PROJECTS } from "@/data/projects";
import PageHeader from "@/components/PageHeader";
import CatalogTabs from "@/components/CatalogTabs";
import CatalogEditorial from "@/components/CatalogEditorial";

export default function WardrobesPage() {
  const [activeSubtype, setActiveSubtype] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  const wardrobeProjects = PROJECTS.filter(
    (p) =>
      p.type === "Гардеробная" ||
      p.type === "Спальня" ||
      p.title.toLowerCase().includes("шкаф") ||
      p.title.toLowerCase().includes("гардероб")
  );

  const filterTabs = [
    { key: "all", label: "Все шкафы и гардеробные", count: wardrobeProjects.length },
    {
      key: "Гардеробная",
      label: "Гардеробные комнаты",
      count: wardrobeProjects.filter((p) => p.type === "Гардеробная").length,
    },
    {
      key: "Спальня",
      label: "Шкафы в спальню",
      count: wardrobeProjects.filter((p) => p.type === "Спальня").length,
    },
  ];

  const filteredItems =
    activeSubtype === "all"
      ? wardrobeProjects
      : wardrobeProjects.filter((p) => p.type === activeSubtype);

  return (
    <div>
      {/* 1. Page Header */}
      <PageHeader title="Шкафы и гардеробные на заказ" />

      {/* 3. Filter Tabs Bar */}
      <section style={{ paddingTop: "28px", paddingBottom: "0px", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <CatalogTabs
            tabs={filterTabs}
            activeKey={activeSubtype}
            onChange={setActiveSubtype}
            label="Фильтр шкафов и гардеробных"
          />
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

      <CatalogEditorial
        eyebrow="Хранение под помещение"
        title="Шкафы и гардеробные: на что смотреть в проектах"
        intro="В подборке есть гардеробные комнаты, шкафы для спальни и прихожей. Описания фиксируют подтверждённую планировку, материалы и заметные конструктивные решения."
        items={[
          { title: "Особенности помещения", text: "В проектах встречаются П-образная планировка, скошенная стена, встроенные шкафы и комплекс мебели для нескольких комнат. Такие особенности учитывают при замере и разработке конструкции." },
          { title: "Материалы и механика", text: "В подтверждённых карточках указаны ЛДСП Egger, стекло Stopsol, зеркальные фасады, торцевые ручки и другие конкретные решения." },
          { title: "От проекта к монтажу", text: "После согласования размеров и наполнения формируют спецификацию, передают проект в цех и устанавливают готовую мебель на объекте." },
        ]}
        links={[
          { href: "/projects/glass-wardrobe", label: "Гардеробная со стеклом Stopsol" },
          { href: "/projects/brick-wardrobe", label: "П-образная гардеробная" },
          { href: "/calculator?category=wardrobe", label: "Рассчитать шкаф" },
        ]}
        faq={[
          { question: "Что нужно подготовить для первого расчёта?", answer: "Полезны примерные размеры, фотографии помещения и список вещей или функций, которые должно поддерживать хранение. Точную привязку делают после согласования проекта." },
          { question: "Можно ли определить материал только по фото?", answer: "Нет. Поэтому на сайте указаны только материалы, подтверждённые исходным описанием проекта; остальные характеристики уточняют при консультации." },
        ]}
      />

      {/* 5. CANVAS CTA */}
      <LeadSection
        id="consult"
        initialCategory="Шкаф или гардеробная"
        source="Шкафы и гардеробные"
      />
    </div>
  );
}
