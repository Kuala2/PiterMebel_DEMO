"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { KITCHENS } from "@/data/kitchens";
import { SITE_CONFIG } from "@/data/site";

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
      label: "Шпон дуба",
      count: KITCHENS.filter((k) => k.facadeMaterialCategory === "veneer").length,
    },
    {
      key: "fenix",
      label: "Fenix NTM",
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
      <section className="page-header">
        <div className="container">
          <h1 className="subpage-hero-title">Кухни студии «ПитерМебель»</h1>
          <p className="subpage-hero-caption">
            {KITCHENS.length} моделей · каждая изготавливается по индивидуальным размерам
          </p>
        </div>
      </section>

      {/* 2. Subtitle & Filter Tabs Bar (Below Banner) */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc">
            Авторские проекты кухонных гарнитуров, созданные для интерьеров Санкт-Петербурга. Каждая модель изготавливается по индивидуальным размерам на улице Трефолева.
          </p>

          <div className="catalog-tabs-bar" style={{ marginBottom: 0 }}>
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

        return (
          <section
            key={kitchen.slug}
            style={{
              backgroundColor: isDark ? "var(--bg-dark)" : "var(--bg-studio)",
              paddingTop: "70px",
              paddingBottom: "70px",
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
                  </div>
                </div>

                {/* Info Column */}
                <div className="ladder-info-col">
                  <div>
                    <h2 className="ladder-title">Кухня «{kitchen.title}»</h2>
                  </div>

                  <p className="ladder-story">{kitchen.story[0]}</p>

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
                      <span className="spec-row-val">Влагостойкий PUR-шов</span>
                    </div>
                  </div>

                  <div className="ladder-actions">
                    <Link
                      href="/contacts"
                      className="btn btn-green"
                    >
                      Рассчитать эту кухню
                    </Link>
                    <Link
                      href={`/kitchens/${kitchen.slug}`}
                      className="btn btn-glass"
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
      <section className="final-section" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Понравилась модель кухни?
                </h2>
                <p className="final-desc">
                  Отправьте название модели и примерные размеры вашего помещения. Технолог студии подготовит расчет сметы в нескольких вариантах фасадов и фурнитуры.
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
                <MeasureForm initialCategory="Кухни" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
