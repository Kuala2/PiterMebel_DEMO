"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LeadSection from "@/components/LeadSection";
import { KITCHENS } from "@/data/kitchens";
import PageHeader from "@/components/PageHeader";
import CatalogTabs from "@/components/CatalogTabs";
import CatalogEditorial from "@/components/CatalogEditorial";

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
      {/* 1. Page Header */}
      <PageHeader title="Кухни на заказ" />

      {/* 2. Filter Tabs Bar (Under the line) */}
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
                      alt={kitchen.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="card-img-slide"
                      style={{ objectFit: "cover" }}
                    />

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
                      href={`/kitchens/${kitchen.slug}/`}
                      style={{ position: "absolute", inset: 0, zIndex: 2 }}
                      aria-label={`Подробнее: ${kitchen.title}`}
                    />
                  </div>
                </div>

                {/* Info Column (Весь блок кликабелен для перехода к модели) */}
                <div className="ladder-info-col">
                  <Link
                    href={`/kitchens/${kitchen.slug}/`}
                    className="ladder-content-clickable"
                    style={{ textDecoration: "none", color: "inherit", display: "flex", flexDirection: "column", cursor: "pointer" }}
                  >
                    <div>
                      <h2 className="ladder-title" style={{ marginBottom: "20px" }}>{kitchen.title}</h2>
                    </div>

                    <div className="ladder-specs-rows">
                      {kitchen.specs.slice(0, 3).map((spec) => (
                        <div className="spec-row" key={`${kitchen.slug}-${spec.label}`}>
                          <span className="spec-row-label">{spec.label}</span>
                          <span className="spec-row-val">{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </Link>

                  <div className="ladder-actions" style={{ marginTop: "20px" }}>
                    <Link
                      href={`/kitchens/${kitchen.slug}/`}
                      className="btn btn-green"
                    >
                      Смотреть проект →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}

      <CatalogEditorial
        title="Кухни на заказ по индивидуальным размерам"
        intro="Проектируем и изготавливаем кухни в собственном цеху на Петергофском шоссе, 73. Каждый гарнитур рассчитывается с точностью до миллиметра под планировку помещения, выступы, ниши и габариты встраиваемой техники."
        items={[
          { title: "Материалы и фурнитура", text: "Работаем с влагостойкими плитами Egger, фасадами МДФ в пластике AGT и Velvet, матовой эмалью, натуральным шпоном дуба, столешницами Slotex (38 мм) и компакт-плитами HPL. Комплектуем секции петлями и выдвижными ящиками Blum, Hettich и Boyard с плавным закрыванием." },
          { title: "Точный проект и схема электрики", text: "До запуска в производство выполняем точный замер и выдаём готовую схему расположения розеток и сантехнических выводов под вашу бытовую технику." },
          { title: "Установка и подключение под ключ", text: "Штатные мастера собирают гарнитур, врезают мойку и варочную панель, устанавливают подсветку рабочей зоны и подключают всю бытовую технику и сантехнику за 1–2 дня." },
        ]}
        faq={[
          { question: "Сколько времени занимает изготовление кухни на заказ?", answer: "Срок производства кухни зависит от выбранного материала фасадов и в среднем составляет от 3 до 4 недель. Точная дата доставки и сборки фиксируется в договоре." },
          { question: "Как рассчитывается стоимость кухни?", answer: "Цена зависит от габаритов гарнитура, материала фасадов, столешницы и выбранной фурнитуры. Предварительный расчёт можно выполнить в онлайн-калькуляторе или по вашим размерам." },
        ]}
      />

      {/* 3. Consultation Section */}
      <LeadSection
        id="consult"
        initialCategory="Кухня"
        source="Каталог кухонь"
      />
    </div>
  );
}
