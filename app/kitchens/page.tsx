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
                    <span className="card-badge-top">Реализованный проект</span>

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
        eyebrow="Как пользоваться каталогом"
        title="Кухни с подтверждёнными материалами и деталями"
        intro="В каталоге собраны реализованные кухни. В описаниях указаны только те материалы, фурнитура и конструктивные детали, которые подтверждены исходными материалами проекта."
        items={[
          { title: "Сравнение решений", text: "Фильтр помогает отдельно посмотреть кухни с пластиком, эмалью и комбинированными фасадами. В карточке проекта перечислены подтверждённые корпус, столешница, фурнитура, подсветка или система открывания." },
          { title: "Адаптация под помещение", text: "Готовую композицию не копируют по фотографии. Для нового проекта уточняют размеры, технику, коммуникации, сценарии хранения и выбранные материалы, а затем составляют отдельную спецификацию." },
          { title: "Сервис «Всё под ключ»", text: "Вам не нужно искать сторонних специалистов: подбираем технику под габариты секций, за 1–2 дня до монтажа штробим стены и выводим розетки по проекту, чисто убираем мусор, а в день установки подключаем мойку, сантехнику и всю технику." },
        ]}
        links={[
          { href: "/calculator", label: "Рассчитать ориентир" },
          { href: "/#all-in-one", label: "Сервис всё под ключ" },
          { href: "/knowledge/rozetki-na-kuhne-shema-vysoty", label: "Подготовить электрику" },
          { href: "/production", label: "Посмотреть производство" },
        ]}
        faq={[
          { question: "Можно ли повторить кухню из каталога?", answer: "Её можно использовать как визуальный и технический ориентир. Размеры, наполнение и узлы всё равно пересчитывают под конкретное помещение и выбранную технику." },
          { question: "Почему на странице нет фиксированной цены?", answer: "Каждый показанный проект отличается размерами, материалами и наполнением. Предварительный диапазон можно получить в калькуляторе, а точную смету составляют по согласованной спецификации." },
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
