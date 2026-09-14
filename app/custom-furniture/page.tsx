"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import PageHeader from "@/components/PageHeader";
import { PROJECTS } from "@/data/projects";
import CatalogTabs from "@/components/CatalogTabs";
import CatalogEditorial from "@/components/CatalogEditorial";

export default function CustomFurniturePage() {
  const [activeSubtype, setActiveSubtype] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  // Фильтруем проекты прихожих, панелей, коммерческой мебели и прочих индивидуальных решений
  const customProjects = PROJECTS.filter(
    (p) =>
      p.type === "Прихожая" ||
      p.type === "Корпусная мебель" ||
      p.type === "Панели" ||
      p.type === "Коммерческий"
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
      label: "ТВ-зоны",
      count: customProjects.filter((p) => p.type === "Панели").length,
    },
    {
      key: "Корпусная мебель",
      label: "Комплексные проекты",
      count: customProjects.filter((p) => p.type === "Корпусная мебель").length,
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
          <CatalogTabs
            tabs={filterTabs}
            activeKey={activeSubtype}
            onChange={setActiveSubtype}
            label="Фильтр корпусной мебели"
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
        eyebrow="Индивидуальные решения"
        title="Корпусная мебель для жилых и коммерческих пространств"
        intro="Здесь собраны подтверждённые проекты прихожих, ТВ-зон, комплексной мебели и стойки ресепшен. Каталог показывает не абстрактные рендеры, а реализованные композиции."
        items={[
          { title: "Связь нескольких зон", text: "Комплексные проекты помогают выдержать единый материал и ритм в кухне, стеллаже, шкафах или мебели для разных комнат." },
          { title: "Подтверждённая отделка", text: "В карточках указаны натуральный шпон дуба, МДФ в эмали, акриловый камень, массив бука, зеркальные фасады и LED-подсветка — только когда эти данные есть в источнике." },
          { title: "Производственный цикл", text: "Конструкцию и комплектацию согласуют до передачи в цех; после изготовления проект проходит доставку и монтаж одной командой." },
        ]}
        links={[
          { href: "/projects/oak-veneer-panel", label: "ТВ-зона из шпона дуба" },
          { href: "/projects/office-reception", label: "Стойка ресепшен" },
          { href: "/production", label: "Этапы производства" },
        ]}
        faq={[
          { question: "Можно ли заказать только один предмет мебели?", answer: "На странице показаны и отдельные изделия, и комплексные решения. Состав проекта уточняют на консультации и фиксируют в спецификации." },
          { question: "Подходит ли жилой проект для коммерческого помещения?", answer: "Требования помещений отличаются, поэтому назначение, нагрузки, размеры и материалы проверяют отдельно. В портфолио есть подтверждённый пример стойки ресепшен для клиники." },
        ]}
      />

      {/* 5. CANVAS CTA */}
      <LeadSection
        id="consult"
        initialCategory="Корпусная мебель"
        source="Корпусная мебель"
      />
    </div>
  );
}
