"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import { PROJECTS } from "@/data/projects";
import { KITCHENS } from "@/data/kitchens";
import PageHeader from "@/components/PageHeader";
import CatalogTabs from "@/components/CatalogTabs";
import CatalogEditorial from "@/components/CatalogEditorial";

type MainCategoryKey = "kitchens" | "wardrobes" | "custom";

interface PortfolioCardItem {
  slug: string;
  href: string;
  badge: string;
  category: MainCategoryKey;
  title: string;
  cover: string;
  gallery: string[];
  materials: string[];
}

const RAW_PORTFOLIO_ITEMS: PortfolioCardItem[] = [
  ...KITCHENS.filter(
    (k) => !PROJECTS.some((p) => p.relatedKitchenSlug === k.slug)
  ).map((k): PortfolioCardItem => ({
    slug: `kitchen-${k.slug}`,
    href: `/kitchens/${k.slug}/`,
    badge: "Кухня",
    category: "kitchens",
    title: k.title,
    cover: k.cover,
    gallery: k.gallery,
    materials: k.specs.slice(0, 3).map((s) => s.value),
  })),
  ...PROJECTS.map((p): PortfolioCardItem => {
    const category: MainCategoryKey =
      p.type === "Кухня"
        ? "kitchens"
        : p.type === "Гардеробная" || p.type === "Спальня" || p.type === "Прихожая"
          ? "wardrobes"
          : "custom";
    return {
      slug: p.slug,
      href: `/projects/${p.slug}/`,
      badge: p.type,
      category,
      title: p.title,
      cover: p.cover,
      gallery: p.gallery,
      materials: p.materials,
    };
  }),
];

const PORTFOLIO_ORDER = [
  "sherman-cognac",
  "glass-wardrobe",
  "kitchen-mdf-plastik-hettich",
  "bedroom-set",
  "sliding-partition",
  "kitchen-mdf-plastik-gola",
  "light-wood-wardrobe",
  "oak-veneer-panel",
  "island-parquet",
  "mirror-hall",
  "cascade-partitions",
  "kitchen-mdf-emal-vitrina",
  "bathroom-vanity",
  "velvet-matte",
  "brick-wardrobe",
  "office-reception",
  "emerald-enamel",
  "curved-oak-facades",
  "kitchen-mdf-belyj-egger",
  "wardrobe-inside",
  "oak-stone",
  "slat-panels",
  "kitchen-mdf-grafit-gola",
  "kitchen-mdf-klassika-dub",
  "kitchen-mdf-plastik-slotex",
];

const PORTFOLIO_ITEMS: PortfolioCardItem[] = [
  ...PORTFOLIO_ORDER.map((slug) =>
    RAW_PORTFOLIO_ITEMS.find((item) => item.slug === slug)
  ).filter((item): item is PortfolioCardItem => Boolean(item)),
  ...RAW_PORTFOLIO_ITEMS.filter((item) => !PORTFOLIO_ORDER.includes(item.slug)),
];

export default function ProjectsPortfolioPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  const filterTabs = [
    { key: "all", label: "Все проекты", count: PORTFOLIO_ITEMS.length },
    {
      key: "kitchens",
      label: "Кухни",
      count: PORTFOLIO_ITEMS.filter((p) => p.category === "kitchens").length,
    },
    {
      key: "wardrobes",
      label: "Шкафы",
      count: PORTFOLIO_ITEMS.filter((p) => p.category === "wardrobes").length,
    },
    {
      key: "custom",
      label: "Корпусная мебель",
      count: PORTFOLIO_ITEMS.filter((p) => p.category === "custom").length,
    },
  ];

  const filteredProjects =
    activeCategory === "all"
      ? PORTFOLIO_ITEMS
      : PORTFOLIO_ITEMS.filter((p) => p.category === activeCategory);

  return (
    <div>
      {/* 1. Page Header */}
      <PageHeader title="Реализованные проекты студии" backTo="/" />

      {/* 2. Filter Tabs Bar (Under the line) */}
      <section style={{ paddingTop: "28px", paddingBottom: "0px", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <CatalogTabs
            tabs={filterTabs}
            activeKey={activeCategory}
            onChange={setActiveCategory}
            label="Фильтр реализованных проектов"
          />
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
                    <span className="card-badge-top">{project.badge}</span>

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
                      href={project.href}
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                      aria-label={`Смотреть проект ${project.title}`}
                    />
                  </div>

                  <Link
                    href={project.href}
                    className="card-body"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", cursor: "pointer" }}
                  >
                    <h2 className="card-title">{project.title}</h2>

                    <div className="card-specs-tags">
                      {project.materials?.length ? (
                        project.materials.slice(0, 3).map((mat, mIdx) => (
                          <span key={mIdx} className="spec-tag">
                            {mat}
                          </span>
                        ))
                      ) : (
                        <span className="spec-tag">Индивидуальный проект</span>
                      )}
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
        title="Мебель, изготовленная и установленная нашей командой"
        intro="В портфолио собраны фотографии готовых кухонь, гардеробных, шкафов и комплексных проектов меблировки квартир, выполненных в нашем цеху на Петергофском шоссе, 73."
        items={[
          { title: "Индивидуальное проектирование", text: "Любой понравившийся проект из портфолио мы адаптируем под планировку вашей квартиры, размеры стен, расположение коммуникаций и нужный состав бытовой техники." },
          { title: "Прямое производство без посредников", text: "Раскрой плит, кромление с прифуговкой и сверловка под фурнитуру выполняются на собственных станках в Санкт-Петербурге с контролем качества каждого узла." },
          { title: "Фиксированная смета и гарантия", text: "Полная спецификация материалов, фурнитуры и сроков закрепляется в официальном договоре до начала работ. Доставка и сборка выполняются штатными мастерами." },
        ]}
        faq={[
          { question: "Можно ли рассчитать проект, похожий на работу из портфолио?", answer: "Да, выберите понравившийся проект или пришлите нам примерные размеры помещения — мы подготовим расчёт стоимости и подберём материалы под ваш бюджет." },
          { question: "Где можно посмотреть образцы материалов вживую?", answer: "Посмотреть и потрогать образцы фасадов, столешниц, плит и фурнитуры можно в нашем офисе у метро «Нарвская» (пл. Стачек, 9, БЦ «Кировский», оф. 407) по предварительной записи." },
        ]}
      />

      {/* 4. Consultation Section */}
      <LeadSection
        id="consult"
        source="Портфолио проектов"
      />
    </div>
  );
}
