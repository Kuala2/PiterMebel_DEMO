"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import { KITCHENS } from "@/data/kitchens";
import PageHeader from "@/components/PageHeader";
import CatalogTabs from "@/components/CatalogTabs";
import CatalogEditorial from "@/components/CatalogEditorial";
import { SITE_URL } from "@/lib/seo";

const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: KITCHENS.length,
  itemListElement: KITCHENS.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.title,
    url: `${SITE_URL}/kitchens/${item.slug}/`,
  })),
};

export default function KitchensCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  const filterTabs = [
    { key: "all", label: "Все кухни", count: KITCHENS.length },
    {
      key: "plastic",
      label: "Пластик",
      count: KITCHENS.filter((k) => k.materialGroup === "plastic").length,
    },
    {
      key: "enamel",
      label: "Эмаль",
      count: KITCHENS.filter((k) => k.materialGroup === "enamel").length,
    },
    {
      key: "combined",
      label: "Комбинированные",
      count: KITCHENS.filter((k) => k.materialGroup === "combined").length,
    },
  ];

  const filteredKitchens =
    activeCategory === "all"
      ? KITCHENS
      : KITCHENS.filter((k) => k.materialGroup === activeCategory);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ITEM_LIST_JSON_LD),
        }}
      />
      {/* 1. Page Header */}
      <PageHeader title="Кухни на заказ" />

      {/* 2. Filter Tabs Bar */}
      <section style={{ paddingTop: "28px", paddingBottom: "0px", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <CatalogTabs
            tabs={filterTabs}
            activeKey={activeCategory}
            onChange={setActiveCategory}
            label="Фильтр кухонь по материалу фасадов"
          />
        </div>
      </section>

      {/* 3. Kitchens 3-Column Portfolio Grid */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "28px", paddingBottom: "96px" }}>
        <div className="container">
          <SpotlightArea className="projects-grid" selector=".catalog-card">
            {filteredKitchens.map((kitchen, idx) => {
              const currentIdx = cardPhoto[kitchen.slug] ?? 0;
              const photos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];

              return (
                <div
                  key={kitchen.slug}
                  className="catalog-card project-card-item spotlight-target"
                >
                  <div className="card-gallery-wrap">
                    <Image
                      key={photos[currentIdx] || photos[0]}
                      src={photos[currentIdx] || photos[0]}
                      alt={kitchen.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                      className="card-img-slide is-active"
                      priority={idx < 3 && currentIdx === 0}
                    />

                    {photos.length > 1 && (
                      <button
                        type="button"
                        className="card-photo-arrow arrow-prev"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setCardPhoto((prev) => ({
                            ...prev,
                            [kitchen.slug]:
                              currentIdx === 0 ? photos.length - 1 : currentIdx - 1,
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
                            [kitchen.slug]: (currentIdx + 1) % photos.length,
                          }));
                        }}
                        aria-label="Следующее фото"
                      >
                        →
                      </button>
                    )}

                    {photos.length > 1 && (
                      <div className="card-photo-dots">
                        {photos.map((_, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            className={`photo-square-dot ${
                              currentIdx === pIdx ? "is-active" : ""
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardPhoto((prev) => ({ ...prev, [kitchen.slug]: pIdx }));
                            }}
                            aria-label={`Фото ${pIdx + 1}`}
                          />
                        ))}
                      </div>
                    )}

                    <Link
                      href={`/kitchens/${kitchen.slug}/`}
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                      aria-label={`Смотреть проект ${kitchen.title}`}
                    />
                  </div>

                  <Link
                    href={`/kitchens/${kitchen.slug}/`}
                    className="card-body"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", cursor: "pointer" }}
                  >
                    <h2 className="card-title">{kitchen.title}</h2>

                    <div className="card-specs-tags">
                      {kitchen.specs.length > 0 ? (
                        kitchen.specs.slice(0, 3).map((spec) => (
                          <span key={`${kitchen.slug}-${spec.label}`} className="spec-tag">
                            {spec.value}
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
        title="Кухни на заказ в Санкт-Петербурге: материалы, цены и сроки"
        intro="Проектируем и изготавливаем кухни в собственном цеху на Петергофском шоссе, 73 с уже включённой столешницей."
        materials={[
          { material: "ЛДСП Egger", priceTier: "250–280\u00A0тыс.\u00A0₽", leadTime: "3–4 нед." },
          { material: "МДФ в плёнке ПВХ", priceTier: "280–300\u00A0тыс.\u00A0₽", leadTime: "3–4 нед." },
          { material: "МДФ пластик AGT / Velvet", priceTier: "300–330\u00A0тыс.\u00A0₽", leadTime: "3–4 нед." },
          { material: "МДФ эмаль RAL / NCS", priceTier: "340–370\u00A0тыс.\u00A0₽", leadTime: "4–5 нед." },
          { material: "Шпон дуба", priceTier: "390–430\u00A0тыс.\u00A0₽", leadTime: "4–6 нед." },
        ]}
        materialsNote={"Ориентир за угловую кухню 3,5 м со столешницей Slotex 38 мм (прямая — от 160\u00A0000\u00A0₽)."}
        calculatorHref="/calculator/?category=kitchen&layout=corner&meters=3.5&material=plastic"
        calculatorLabel="Рассчитать кухню →"
        items={[
          {
            title: "Схема электрики в подарок",
            text: "При заказе кухни выдаём в подарок точный план розеток и воды под встраиваемую технику до начала ремонта.",
          },
          {
            title: "Цех без наценок салонов",
            text: "Кроим и присаживаем под Blum и Hettich на своих станках — нестандарт без доплат.",
          },
          {
            title: "Монтаж под ключ за 1–2 дня",
            text: "Штатные мастера собирают гарнитур, врезают мойку и подключают технику с сантехникой.",
          },
        ]}
        links={[
          { href: "/apartment/", label: "Мебель во всю квартиру за месяц" },
          { href: "/calculator/?category=kitchen&layout=corner&meters=3.5", label: "Рассчитать стоимость кухни" },
          { href: "/knowledge/rozetki-na-kuhne-shema-vysoty/", label: "Схема розеток и воды под кухню" },
          { href: "/projects/", label: "Смотреть всё портфолио" },
        ]}
        faq={[
          {
            question: "Сколько стоит кухня на заказ в Санкт-Петербурге?",
            answer: "Прямые кухни начинаются от 160\u00A0000\u00A0₽. Угловая кухня 3,5 м со столешницей Slotex 38 мм стоит 250–280\u00A0тыс.\u00A0₽ в Egger и 300–330\u00A0тыс.\u00A0₽ в AGT/Velvet.",
          },
          {
            question: "Сколько времени занимает изготовление кухни?",
            answer: "В Egger, ПВХ и AGT/Velvet — 3–4 недели, в матовой эмали и натуральном шпоне — 4–6 недель по договору.",
          },
          {
            question: "Что входит в базовый расчёт и стоимость монтажа?",
            answer: "В базовый расчёт уже включена влагостойкая столешница Slotex 38 мм. Доставку, сборку и нужные подключения техники и сантехники сразу прописываем в смете договора — без скрытых доплат при монтаже.",
          },
          {
            question: "Когда лучше проектировать кухню — до или после разводки электрики?",
            answer: "До разводки электрики и сантехники: мы выдаём схему розеток и воды до черновых работ.",
          },
        ]}
      />

      {/* 4. Consultation Section */}
      <LeadSection
        id="consult"
        initialCategory="Кухня"
        source="Каталог кухонь"
      />
    </div>
  );
}
