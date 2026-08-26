"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Faq from "@/components/Faq";
import VkIcon from "@/components/VkIcon";
import { MATERIALS } from "@/data/materials";
import { SITE_CONFIG } from "@/data/site";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -460, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 460, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const slider = carouselRef.current;
    if (!slider) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("button, a")) return;
      isDown = true;
      slider.classList.add("is-dragging");
      startX = e.pageX - slider.offsetLeft;
      scrollLeft = slider.scrollLeft;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - slider.offsetLeft;
      const walk = (x - startX) * 1.5;
      slider.scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      if (isDown) {
        isDown = false;
        slider.classList.remove("is-dragging");
      }
    };

    slider.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      slider.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const catalogItems = [
    {
      id: "oak-stone",
      category: "kitchens",
      badge: "Шпон & Эмаль",
      title: "Кухня Шпон Дуба & Мраморный фартук",
      desc: "Фасады из натурального шпона дуба в сочетании с белой матовой эмалью и акриловым камнем с бесшовной склейкой.",
      specLabel: "Фасады",
      specValue: "Шпон дуба / Эмаль RAL",
      photos: [
        "/img/projects/oak-stone/photo_1.jpg",
        "/img/projects/oak-stone/photo_2.jpg",
        "/img/projects/oak-stone/photo_3.jpg",
        "/img/projects/oak-stone/photo_4.jpg",
      ],
      link: "/projects/oak-stone",
    },
    {
      id: "glass-wardrobe",
      category: "wardrobes",
      badge: "Stopsol",
      title: "Гардеробная со стеклом STOPSOL",
      desc: "Смарт-стекло: зеркало при выключенном свете, прозрачная витрина при включении подсветки. Без нижней направляющей.",
      specLabel: "Стекло",
      specValue: "Stopsol & LED 4000K",
      photos: [
        "/img/projects/glass-wardrobe/photo_1.jpg",
        "/img/projects/glass-wardrobe/photo_2.jpg",
        "/img/projects/glass-wardrobe/photo_3.jpg",
      ],
      link: "/projects/glass-wardrobe",
    },
    {
      id: "aleksandra",
      category: "kitchens",
      badge: "Fenix NTM",
      title: "Кухня «Александра» Fenix NTM",
      desc: "Суперматовый нано-пластик Fenix NTM с защитой от отпечатков пальцев, встроенная техника, надежные механизмы.",
      specLabel: "Материал",
      specValue: "Fenix NTM супермат",
      photos: [
        "/img/kitchens/aleksandra/photo_1.jpg",
        "/img/kitchens/aleksandra/photo_2.jpg",
        "/img/kitchens/aleksandra/photo_3.jpg",
        "/img/kitchens/aleksandra/photo_4.jpg",
      ],
      link: "/kitchens/aleksandra",
    },
    {
      id: "slavena",
      category: "kitchens",
      badge: "Кашемир",
      title: "Кухня «Славена» Теплый Кашемир",
      desc: "Матовый пластик теплый кашемир, монолитная столешница и фартук из искусственного камня, скрытый профиль Gola.",
      specLabel: "Профиль",
      specValue: "Скрытый Gola / Камень",
      photos: [
        "/img/kitchens/slavena/photo_1.jpg",
        "/img/kitchens/slavena/photo_2.jpg",
        "/img/kitchens/slavena/photo_3.jpg",
      ],
      link: "/kitchens/slavena",
    },
    {
      id: "mirror-hall",
      category: "closets",
      badge: "Встроенный",
      title: "Встроенный шкаф в нишу прихожей",
      desc: "Монтаж точно в размер от пола до потолка, зеркальные полотна, интегрированная мягкая ниша для обуви.",
      specLabel: "Монтаж",
      specValue: "Точно в нишу / Зеркало",
      photos: [
        "/img/projects/mirror-hall/photo_1.jpg",
        "/img/projects/mirror-hall/photo_2.jpg",
      ],
      link: "/projects/mirror-hall",
    },
    {
      id: "timofey",
      category: "kitchens",
      badge: "Дуб & Глянец",
      title: "Кухня «Тимофей» Дуб & Белый глянец",
      desc: "Комбинация светлых фасадов МДФ пластик и древесной текстуры, петли и ящики с плавными доводчиками.",
      specLabel: "Фасады",
      specValue: "Шпон дуба & Пластик",
      photos: [
        "/img/kitchens/timofey/photo_1.jpg",
        "/img/kitchens/timofey/photo_2.jpg",
        "/img/kitchens/timofey/photo_3.jpg",
      ],
      link: "/kitchens/timofey",
    },
    {
      id: "brick-wardrobe",
      category: "wardrobes",
      badge: "П-образная",
      title: "Гардеробная система со скошенными полками",
      desc: "П-образная планировка со скошенными полками по шаблону стен, глубокие выдвижные корзины и подсветка штанг.",
      specLabel: "Планировка",
      specValue: "П-образная система",
      photos: [
        "/img/projects/brick-wardrobe/photo_1.jpg",
        "/img/projects/brick-wardrobe/photo_2.jpg",
        "/img/projects/brick-wardrobe/photo_3.jpg",
      ],
      link: "/projects/brick-wardrobe",
    },
  ];

  const visibleItems =
    activeTab === "all"
      ? catalogItems
      : catalogItems.filter((i) => i.category === activeTab);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. CATALOG SECTION (1-Line Horizontal Slider) */}
      <section className="catalog-section" id="catalog">
        <div className="container">
          <div className="catalog-head-row">
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Реализованные объекты студии</h2>
            </div>
            <div className="catalog-head-controls">
              <div className="catalog-arrows-group">
                <button
                  type="button"
                  className="slider-nav-btn"
                  onClick={scrollLeft}
                  aria-label="Предыдущие проекты"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="slider-nav-btn"
                  onClick={scrollRight}
                  aria-label="Следующие проекты"
                >
                  →
                </button>
              </div>
              <Link href="/projects" className="btn btn-green btn-sm">
                Все объекты →
              </Link>
            </div>
          </div>

          {/* Filter Tabs Bar (No util counters) */}
          <div className="catalog-tabs-bar" role="tablist">
            <button
              type="button"
              className={`cat-tab ${activeTab === "all" ? "is-active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Все проекты
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "kitchens" ? "is-active" : ""}`}
              onClick={() => setActiveTab("kitchens")}
            >
              Кухни
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "wardrobes" ? "is-active" : ""}`}
              onClick={() => setActiveTab("wardrobes")}
            >
              Гардеробные STOPSOL
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "closets" ? "is-active" : ""}`}
              onClick={() => setActiveTab("closets")}
            >
              Встроенные шкафы
            </button>
          </div>

          {/* 1-Line Slider */}
          <div className="carousel-outer-wrapper">
            <div
              className="carousel-viewport"
              ref={carouselRef}
            >
              <div className="carousel-track">
                {visibleItems.map((item) => {
                  const currentIdx = cardPhoto[item.id] ?? 0;
                  const currentPhotoSrc = item.photos[currentIdx] || item.photos[0];

                  return (
                    <div
                      key={item.id}
                      className="catalog-card"
                    >
                      <div className="card-gallery-wrap">
                        <Image
                          key={currentPhotoSrc}
                          src={currentPhotoSrc}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 440px"
                          className="card-img-slide"
                          draggable={false}
                          style={{ pointerEvents: "none", userSelect: "none" }}
                        />
                        <span className="card-badge-top">{item.badge}</span>

                        {/* In-Card Left Arrow */}
                        {item.photos.length > 1 && (
                          <button
                            type="button"
                            className="card-photo-arrow arrow-prev"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardPhoto((prev) => ({
                                ...prev,
                                [item.id]: (currentIdx === 0 ? item.photos.length - 1 : currentIdx - 1),
                              }));
                            }}
                            aria-label="Предыдущее фото"
                          >
                            ←
                          </button>
                        )}

                        {/* In-Card Right Arrow */}
                        {item.photos.length > 1 && (
                          <button
                            type="button"
                            className="card-photo-arrow arrow-next"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCardPhoto((prev) => ({
                                ...prev,
                                [item.id]: (currentIdx + 1) % item.photos.length,
                              }));
                            }}
                            aria-label="Следующее фото"
                          >
                            →
                          </button>
                        )}

                        {/* In-Card Dots */}
                        <div className="card-photo-dots">
                          {item.photos.map((_, pIdx) => (
                            <button
                              key={pIdx}
                              type="button"
                              className={`photo-square-dot ${currentIdx === pIdx ? "is-active" : ""}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setCardPhoto((prev) => ({ ...prev, [item.id]: pIdx }));
                              }}
                              aria-label={`Фото ${pIdx + 1}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="card-body">
                        <h3 className="card-title">{item.title}</h3>
                        <div className="card-footer">
                          <div>
                            <div className="card-price-label">{item.specLabel}</div>
                            <div className="card-price-val">{item.specValue}</div>
                          </div>
                          <Link href={item.link} className="card-btn-action">
                            Подробнее →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP & PRODUCTION (Bespoke Studio Bento Showcase) */}
      <section className="workshop-section" id="production">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>
              Собственный цех на ул. Трефолева
            </h2>
            <Link href="/production" className="btn btn-glass" style={{ padding: "10px 22px", fontSize: "14px" }}>
              Подробнее о цехе →
            </Link>
          </div>

          <div className="workshop-bento-grid">
            {/* Left: Main Hero CNC Photo */}
            <div className="workshop-bento-hero">
              <div className="workshop-hero-photo-wrap">
                <Image
                  src="/img/brand/workshop_cnc.jpg"
                  alt="Фрезерный станочный центр ЧПУ Biesse Rover"
                  fill
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Right: 4 Precision Value Cards */}
            <div className="workshop-bento-specs">
              <div className="workshop-bento-card">
                <div className="bento-card-num">01</div>
                <div className="bento-card-content">
                  <h3 className="bento-card-title">Без наценок салонов</h3>
                  <p className="bento-card-desc">
                    Заказывайте мебель напрямую на производстве в СПб без переплат торговым посредникам и шоурумам.
                  </p>
                </div>
              </div>

              <div className="workshop-bento-card">
                <div className="bento-card-num">02</div>
                <div className="bento-card-content">
                  <h3 className="bento-card-title">Тестовая сборка в цеху</h3>
                  <p className="bento-card-desc">
                    Каждый гарнитур собирается на фабрике до отправки к вам для полной проверки геометрии и фурнитуры.
                  </p>
                </div>
              </div>

              <div className="workshop-bento-card">
                <div className="bento-card-num">03</div>
                <div className="bento-card-content">
                  <h3 className="bento-card-title">Влагостойкий PUR-шов</h3>
                  <p className="bento-card-desc">
                    Полиуретановое кромление образует прочный барьер, защищающий торцы плит от пара и расслоения.
                  </p>
                </div>
              </div>

              <div className="workshop-bento-card">
                <div className="bento-card-num">04</div>
                <div className="bento-card-content">
                  <h3 className="bento-card-title">Штатные мастера СПб</h3>
                  <p className="bento-card-desc">
                    Единая ответственность: свой инженерный замер, раскрой на станках и аккуратный монтаж под ключ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROCESS BLUEPRINT TIMELINE */}
      <section className="steps-section" id="steps">
        <div className="container">
          <div className="steps-header" style={{ marginBottom: "36px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Как создается ваша мебель</h2>
          </div>

          <div className="process-pipeline-wrap">
            <div className="process-pipeline">
              {/* Step 1 */}
              <div className="process-node-card">
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 3L3 21" /><path d="M14 3l7 7-4 4-7-7 4-4z" /><path d="M3 14l7 7 4-4-7-7-4 4z" />
                    </svg>
                  </div>
                  <span className="process-node-timing">1 день</span>
                  <h3 className="process-node-title">Выезд мастера и замер</h3>
                  <p className="process-node-desc">
                    Инженер привозит образцы эмалей, шпона и сканирует геометрию стен.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="process-node-card">
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" />
                    </svg>
                  </div>
                  <span className="process-node-timing">2–3 дня</span>
                  <h3 className="process-node-title">3D-проект и смета</h3>
                  <p className="process-node-desc">
                    Эргономика, интеграция техники и фиксация стоимости в договоре.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="process-node-card">
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 14 14" />
                    </svg>
                  </div>
                  <span className="process-node-timing">14–21 день</span>
                  <h3 className="process-node-title">Изготовление в цеху</h3>
                  <p className="process-node-desc">
                    Раскрой на ЧПУ, PUR-кромление и обязательная контрольная сборка.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="process-node-card">
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <span className="process-node-timing">1 день</span>
                  <h3 className="process-node-title">Чистый монтаж</h3>
                  <p className="process-node-desc">
                    Штатная бригада устанавливает мебель, подключает технику и убирает мусор.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MATERIALS & FINISHES (4 Columns) */}
      <section className="materials-section" id="materials">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Используемые материалы и покрытия</h2>
            <Link href="/calculator" className="btn btn-glass" style={{ padding: "10px 22px", fontSize: "14px" }}>
              Подобрать в калькуляторе →
            </Link>
          </div>

          <div className="materials-grid">
            {MATERIALS.slice(0, 4).map((mat) => (
              <Link key={mat.id} href="/calculator" className="mat-card" style={{ textDecoration: "none" }}>
                <div className="mat-photo-wrap">
                  <Image
                    src={mat.image}
                    alt={mat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="mat-tag-pill">
                    {mat.tag}
                  </span>
                </div>
                <div className="mat-body">
                  <div className="mat-subtitle">{mat.tag}</div>
                  <h3 className="mat-title">{mat.title}</h3>
                  <p className="mat-desc">{mat.description}</p>
                  <span className="mat-link-action">
                    Выбрать в проекте →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ */}
      <Faq />

      {/* 7. FINAL CONSULTATION & CONTACTS */}
      <section className="final-section" id="contacts">
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Обсудите ваш проект со специалистами студии
                </h2>
                <p className="final-desc">
                  Отправьте эскиз от руки, размеры помещения или понравившееся фото. Технологи рассчитают смету и порекомендуют материалы под ваш бюджет.
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
                  <Link href="/contacts#measure" className="btn btn-glass">
                    Записаться на замер
                  </Link>
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)" }}>
                  Бесплатный выезд мастера для лазерного замера помещения в Санкт-Петербурге.
                </div>
              </div>

              <div className="final-info-block">
                <div>
                  <h3 className="info-block-title">Производство на Трефолева</h3>
                  <div className="contact-items-list">
                    <div className="contact-item-row">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="contact-meta">
                        <span className="contact-label">Адрес цеха</span>
                        <strong className="contact-value">{SITE_CONFIG.address}</strong>
                        <span className="contact-sub">м. «Нарвская» / «Кировский завод»</span>
                      </div>
                    </div>

                    <div className="contact-item-row">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      </div>
                      <div className="contact-meta">
                        <span className="contact-label">Режим работы</span>
                        <strong className="contact-value">{SITE_CONFIG.workHours}</strong>
                        <span className="contact-sub">Посещение производства по предварительной записи</span>
                      </div>
                    </div>

                    <div className="contact-item-row">
                      <div className="contact-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                      </div>
                      <div className="contact-meta">
                        <span className="contact-label">Прямой телефон</span>
                        <a
                          href={`tel:${SITE_CONFIG.phoneRaw}`}
                          className="contact-value"
                          style={{ color: "#FFFFFF", textDecoration: "none" }}
                        >
                          {SITE_CONFIG.phone}
                        </a>
                        <span className="contact-sub">Елена Волкова • Консультация и вызов мастера</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "14px" }}>
                  Бесплатная парковка на закрытой территории для посетителей.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
