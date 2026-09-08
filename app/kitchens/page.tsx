"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { KITCHENS } from "@/data/kitchens";
import { SITE_CONFIG } from "@/data/site";
import PageHeader from "@/components/PageHeader";
import ConsultationSection from "@/components/ConsultationSection";

export default function KitchensCatalogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});

  const filterTabs = [
    { key: "all", label: "Все кухни", count: KITCHENS.length },
    {
      key: "enamel",
      label: "Эмаль по RAL",
      count: KITCHENS.filter((k) => k.facadeMaterialCategory === "enamel").length,
    },
    {
      key: "veneer",
      label: "Шпон & Дерево",
      count: KITCHENS.filter((k) => k.facadeMaterialCategory === "veneer").length,
    },
    {
      key: "fenix",
      label: "Fenix & Velvet",
      count: KITCHENS.filter((k) => k.facadeMaterialCategory === "fenix").length,
    },
  ];

  const filteredKitchens =
    activeCategory === "all"
      ? KITCHENS
      : KITCHENS.filter((k) => k.facadeMaterialCategory === activeCategory);

  return (
    <div>
      {/* 1. Page Header */}
      <PageHeader title="Кухни студии «ПитерМебель»" />

      {/* 2. Filter Tabs Bar (Under the line) */}
      <section style={{ paddingTop: "28px", paddingBottom: "0px", backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="catalog-tabs-bar">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                className={`cat-tab ${activeCategory === tab.key ? "is-active" : ""}`}
                onClick={() => setActiveCategory(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Alternating Ladder Showcase */}
      {filteredKitchens.map((kitchen, idx) => {
        const isReversed = idx % 2 === 1;
        const currentIdx = cardPhoto[kitchen.slug] ?? 0;
        const photos = kitchen.gallery?.length ? kitchen.gallery : [kitchen.cover];
        const isDark = idx !== 1;
        const isFirst = idx === 0;

        return (
          <section
            key={kitchen.slug}
            className={`kitchen-ladder-section ${isFirst ? "kitchen-ladder-first" : ""}`}
            style={{
              backgroundColor: isDark ? "var(--bg-dark)" : "var(--bg-studio)",
              ...(isFirst ? { paddingTop: "28px" } : {}),
            }}
          >
            <div className="container">
              <div
                className={`kitchen-ladder-item spotlight-target ${isReversed ? "is-reversed" : ""}`}
                style={{ marginBottom: 0 }}
              >
                {/* Photo Column */}
                <div className="ladder-photo-col">
                  <div className="ladder-gallery-wrap">
                    <Image
                      key={photos[currentIdx] || photos[0]}
                      src={photos[currentIdx] || photos[0]}
                      alt={`Кухня ${kitchen.title}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="card-img-slide"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="card-badge-top">Модель на заказ</span>

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
                            [kitchen.slug]:
                              currentIdx === 0 ? photos.length - 1 : currentIdx - 1,
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
                            [kitchen.slug]: (currentIdx + 1) % photos.length,
                          }));
                        }}
                        aria-label="Следующее фото"
                      >
                        →
                      </button>
                    )}

                    {/* Photo Dots */}
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

                    {/* Direct link on photo area */}
                    <Link
                      href={`/kitchens/${kitchen.slug}`}
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                      aria-label={`Подробнее о кухне ${kitchen.title}`}
                    />
                  </div>
                </div>

                {/* Info Column (Весь блок кликабелен для перехода к модели) */}
                <div className="ladder-info-col">
                  <Link
                    href={`/kitchens/${kitchen.slug}`}
                    className="ladder-content-clickable"
                    style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", cursor: "pointer" }}
                  >
                    <div>
                      <h2 className="ladder-title" style={{ marginBottom: "20px" }}>Кухня «{kitchen.title}»</h2>
                    </div>

                    <div className="ladder-specs-rows">
                      <div className="spec-row">
                        <span className="spec-row-label">Фасады</span>
                        <span className="spec-row-val">{kitchen.facade}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-row-label">Столешница</span>
                        <span className="spec-row-val">{kitchen.worktop}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-row-label">Особенность</span>
                        <span className="spec-row-val">{kitchen.feature}</span>
                      </div>
                      <div className="spec-row">
                        <span className="spec-row-label">Кромление</span>
                        <span className="spec-row-val">Влагостойкая кромкооблицовка</span>
                      </div>
                    </div>
                  </Link>

                  <div className="ladder-actions" style={{ marginTop: "20px" }}>
                    <Link
                      href={`/kitchens/${kitchen.slug}`}
                      className="btn btn-green"
                    >
                      Подробнее о модели →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      {/* 3. Consultation Section */}
      <ConsultationSection
        id="consult"
        title="Понравилась модель кухни?"
        subtitle="Рассчитаем смету в 3 вариантах фасадов и фурнитуры или подготовим проект под ваше помещение"
        initialCategory="kitchens"
        defaultFurnitureType="Кухня"
        calculatorText="Калькулятор кухни"
      />
    </div>
  );
}
