"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import { SERVICE_PAGES } from "@/data/services";
import { KITCHENS } from "@/data/kitchens";
import PageHeader from "@/components/PageHeader";
import CatalogTabs from "@/components/CatalogTabs";
import CatalogEditorial from "@/components/CatalogEditorial";
import { SITE_URL } from "@/lib/seo";

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
  ...KITCHENS.map((k): PortfolioCardItem => ({
    slug: `kitchen-${k.slug}`,
    href: `/kitchens/${k.slug}/`,
    badge: "Кухня",
    category: "kitchens",
    title: k.title,
    cover: k.cover,
    gallery: k.gallery,
    materials: k.specs.slice(0, 3).map((s) => s.value),
  })),
  ...SERVICE_PAGES.map((s): PortfolioCardItem => {
    const isWardrobe = s.branch === "wardrobes";
    return {
      slug: `service-${s.slug}`,
      href: `/${s.branch}/${s.slug}/`,
      badge: isWardrobe ? "Шкафы" : "Корпусная мебель",
      category: isWardrobe ? "wardrobes" : "custom",
      title: s.shortTitle,
      cover: s.cover || s.gallery[0] || "",
      gallery: s.gallery.slice(0, 5),
      materials: s.materialOptions.slice(0, 3),
    };
  }),
];

const PORTFOLIO_ORDER = [
  "kitchen-sherman-cognac",
  "service-walk-in",
  "service-tv-zones",
  "kitchen-mdf-plastik-hettich",
  "service-swing",
  "service-bathroom",
  "kitchen-mdf-plastik-gola",
  "service-hallway",
  "service-partitions",
  "kitchen-island-parquet",
  "service-bedroom",
  "service-kids",
  "kitchen-mdf-emal-vitrina",
  "service-sliding",
  "service-office-home",
  "kitchen-velvet-matte",
  "service-veneer-wood",
  "service-dressers",
  "kitchen-emerald-enamel",
  "service-laundry",
  "service-business",
  "kitchen-mdf-belyj-egger",
  "service-balcony",
  "kitchen-oak-stone",
  "kitchen-mdf-grafit-gola",
  "kitchen-mdf-klassika-dub",
  "kitchen-mdf-plastik-slotex",
  "kitchen-white-showcase",
  "kitchen-marble-hood",
  "kitchen-narrow-kitchen",
];

const PORTFOLIO_ITEMS: PortfolioCardItem[] = [
  ...PORTFOLIO_ORDER.map((slug) =>
    RAW_PORTFOLIO_ITEMS.find((item) => item.slug === slug)
  ).filter((item): item is PortfolioCardItem => Boolean(item)),
  ...RAW_PORTFOLIO_ITEMS.filter((item) => !PORTFOLIO_ORDER.includes(item.slug)),
];

const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: PORTFOLIO_ITEMS.length,
  itemListElement: PORTFOLIO_ITEMS.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.title,
    url: `${SITE_URL}${item.href}`,
  })),
};

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ITEM_LIST_JSON_LD),
        }}
      />
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
        intro="Реальные проекты из цеха на Петергофском шоссе, 73 — любое решение адаптируем под вашу планировку."
        materialsTitle="Ориентир по срокам и цене"
        summaryFacts={[
          { label: "Шкафы и корпусная мебель", value: "от 80\u00A0000\u00A0₽" },
          { label: "Кухни на заказ", value: "от 160\u00A0000\u00A0₽" },
          { label: "Срок изготовления", value: "2–4 недели" },
          { label: "Вся мебель в квартиру", value: "около 1 месяца" },
        ]}
        materialsNote="Точная смета фиксируется в договоре после замера."
        calculatorHref="/calculator/"
        calculatorLabel="Открыть калькулятор →"
        items={[
          {
            title: "Адаптация под вашу планировку",
            text: "Пересчитываем любой проект из портфолио под ваши стены, выступы и состав техники.",
          },
          {
            title: "Прямое производство в СПб",
            text: "Раскрой, кромление с прифуговкой и присадку выполняем на собственных станках без посредников.",
          },
          {
            title: "Фиксированная смета по договору",
            text: "Спецификация материалов и сроки закрепляются в договоре без скрытых доплат.",
          },
        ]}
        links={[
          { href: "/apartment/", label: "Мебель во всю квартиру за месяц" },
          { href: "/kitchens/", label: "Каталог кухонь" },
          { href: "/wardrobes/", label: "Шкафы и гардеробные" },
          { href: "/calculator/", label: "Рассчитать свой проект" },
        ]}
        faq={[
          {
            question: "Можно ли рассчитать проект, похожий на работу из портфолио?",
            answer: "Да — выберите нужную категорию и примерные размеры в онлайн-калькуляторе, чтобы сразу увидеть ориентир стоимости.",
          },
          {
            question: "Где можно посмотреть образцы материалов из портфолио вживую?",
            answer: "Образцы фасадов, столешниц и фурнитуры представлены в офисе у метро «Нарвская» по предварительной записи.",
          },
          {
            question: "Есть ли скидка при заказе нескольких позиций сразу?",
            answer: "Да, при заказе от 2 изделий или полной меблировке квартиры действует скидка за объём.",
          },
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
