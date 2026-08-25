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
      badge: "Кухня",
      title: "Кухня Шпон Дуба & Мраморный фартук",
      desc: "Фасады из натурального шпона дуба в сочетании с белой матовой эмалью и акриловым камнем с бесшовной склейкой.",
      specs: ["Шпон дуба", "МДФ эмаль", "Акриловый камень", "Трефолева 1П"],
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
      badge: "Смарт-гардеробная",
      title: "Гардеробная со стеклом STOPSOL",
      desc: "Смарт-стекло: зеркало при выключенном свете, прозрачная витрина при включении подсветки. Без нижней направляющей.",
      specs: ["Стекло Stopsol", "Подвесная система", "LED 4000K", "Трефолева 1П"],
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
      badge: "Кухня",
      title: "Кухня «Александра» Fenix NTM",
      desc: "Суперматовый нано-пластик Fenix NTM с защитой от отпечатков пальцев, встроенная техника, надежные механизмы.",
      specs: ["Fenix NTM", "Супермат", "Подсветка", "Трефолева 1П"],
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
      badge: "Кухня",
      title: "Кухня «Славена» Теплый Кашемир",
      desc: "Матовый пластик теплый кашемир, монолитная столешница и фартук из искусственного камня, скрытый профиль Gola.",
      specs: ["МДФ пластик", "Камень", "Gola", "Трефолева 1П"],
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
      badge: "Встроенный шкаф",
      title: "Встроенный шкаф в нишу прихожей",
      desc: "Монтаж точно в размер от пола до потолка, зеркальные полотна, интегрированная мягкая ниша для обуви.",
      specs: ["Зеркало", "Ниша под обувь", "Торцевой профиль", "Трефолева 1П"],
      photos: [
        "/img/projects/mirror-hall/photo_1.jpg",
        "/img/projects/mirror-hall/photo_2.jpg",
      ],
      link: "/projects/mirror-hall",
    },
    {
      id: "timofey",
      category: "kitchens",
      badge: "Кухня",
      title: "Кухня «Тимофей» Дуб & Белый глянец",
      desc: "Комбинация светлых фасадов МДФ пластик и древесной текстуры, петли и ящики с плавными доводчиками.",
      specs: ["Шпон дуба", "МДФ пластик", "Фурнитура плавного хода", "Трефолева 1П"],
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
      badge: "Гардеробная",
      title: "Гардеробная система со скошенными полками",
      desc: "П-образная планировка со скошенными полками по шаблону стен, глубокие выдвижные корзины и подсветка штанг.",
      specs: ["Индивидуальный раскрой", "П-образная", "LED подсветка", "Трефолева 1П"],
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
      {/* 1. HERO SECTION (1-in-1 from concept-1.html) */}
      <Hero />

      {/* 2. CATALOG SECTION (1-Line Horizontal Slider, Tone 1: Deep Dark Obsidian) */}
      <section className="catalog-section" id="catalog" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="catalog-head-row">
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Реализованные объекты студии</h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              <div style={{ display: "flex", gap: "6px" }}>
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

          {/* Filter Tabs Bar */}
          <div className="catalog-tabs-bar" role="tablist">
            <button
              type="button"
              className={`cat-tab ${activeTab === "all" ? "is-active" : ""}`}
              onClick={() => setActiveTab("all")}
            >
              Все проекты ({catalogItems.length})
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "kitchens" ? "is-active" : ""}`}
              onClick={() => setActiveTab("kitchens")}
            >
              Кухни ({catalogItems.filter((i) => i.category === "kitchens").length})
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "wardrobes" ? "is-active" : ""}`}
              onClick={() => setActiveTab("wardrobes")}
            >
              Гардеробные STOPSOL ({catalogItems.filter((i) => i.category === "wardrobes").length})
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "closets" ? "is-active" : ""}`}
              onClick={() => setActiveTab("closets")}
            >
              Встроенные шкафы ({catalogItems.filter((i) => i.category === "closets").length})
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
                            <div className="card-price-label">Производство</div>
                            <div className="card-price-val">Собственный цех</div>
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
      <section className="workshop-section" id="production" style={{ backgroundColor: "var(--bg-studio)" }}>
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
            {/* Left: Main Hero CNC Photo & Telemetry Box */}
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

      {/* 4. PROCESS BLUEPRINT TIMELINE (Dynamic Alternating Zigzag) */}
      <section className="steps-section" id="steps" style={{ backgroundColor: "var(--bg-dark)" }}>
        <div className="container">
          <div className="steps-header" style={{ marginBottom: "36px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Как создается ваша мебель</h2>
          </div>

          <div className="process-pipeline-wrap">
            {/* SVG Zigzag Neon Track */}
            <svg className="process-zigzag-svg" viewBox="0 0 1000 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="zigzagGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3E8E50" stopOpacity="0.35" />
                  <stop offset="50%" stopColor="#3E8E50" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#3E8E50" stopOpacity="0.35" />
                </linearGradient>
              </defs>
              <polyline
                points="125,27 375,82 625,27 875,82"
                fill="none"
                stroke="rgba(62, 142, 80, 0.18)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="125,27 375,82 625,27 875,82"
                fill="none"
                stroke="url(#zigzagGreenGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="6 4"
              />
            </svg>

            <div className="process-pipeline">
              {/* Step 1 - Top */}
              <div className="process-node-card node-top">
                <div className="process-node-circle">01</div>
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 3L3 21" /><path d="M14 3l7 7-4 4-7-7 4-4z" /><path d="M3 14l7 7 4-4-7-7-4 4z" />
                    </svg>
                  </div>
                  <h3 className="process-node-title">1 день • Выезд мастера</h3>
                  <p className="process-node-desc">
                    Инженер привозит образцы эмалей, шпона и сканирует геометрию стен.
                  </p>
                </div>
              </div>

              {/* Step 2 - Bottom */}
              <div className="process-node-card node-bottom">
                <div className="process-node-circle">02</div>
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" />
                    </svg>
                  </div>
                  <h3 className="process-node-title">2–3 дня • 3D-проект и смета</h3>
                  <p className="process-node-desc">
                    Эргономика, интеграция техники и фиксация стоимости в договоре.
                  </p>
                </div>
              </div>

              {/* Step 3 - Top */}
              <div className="process-node-card node-top">
                <div className="process-node-circle">03</div>
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 14 14" />
                    </svg>
                  </div>
                  <h3 className="process-node-title">14–21 день • Изготовление в цеху</h3>
                  <p className="process-node-desc">
                    Раскрой на ЧПУ, PUR-кромление и обязательная контрольная сборка.
                  </p>
                </div>
              </div>

              {/* Step 4 - Bottom */}
              <div className="process-node-card node-bottom">
                <div className="process-node-circle">04</div>
                <div className="process-node-body">
                  <div className="process-node-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>
                  <h3 className="process-node-title">1 день • Чистый монтаж</h3>
                  <p className="process-node-desc">
                    Штатная бригада устанавливает мебель, подключает технику и убирает мусор.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. MATERIALS & FINISHES (Tone 2: Studio Graphite) */}
      <section className="materials-section" id="materials" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
            <h2 className="section-title" style={{ marginBottom: 0 }}>Используемые материалы и покрытия</h2>
            <Link href="/calculator" className="btn btn-glass" style={{ padding: "10px 22px", fontSize: "14px" }}>
              Подобрать в калькуляторе →
            </Link>
          </div>

          <div className="materials-grid">
            {MATERIALS.map((mat) => (
              <Link key={mat.id} href="/calculator" className="mat-card" style={{ textDecoration: "none" }}>
                <div className="mat-photo-wrap">
                  <Image
                    src={mat.image}
                    alt={mat.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 260px"
                    style={{ objectFit: "cover" }}
                  />
                  <span className="mat-tag-pill">
                    {mat.tag}
                  </span>
                </div>
                <div className="mat-body" style={{ padding: "18px 20px" }}>
                  <h3 className="mat-title" style={{ marginBottom: "10px" }}>{mat.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px" }}>
                    <span style={{ fontSize: "13px", color: "var(--color-green-brand)", fontWeight: 600 }}>
                      Выбрать в проекте →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ (Tone 1: Deep Dark Obsidian) */}
      <Faq />

      {/* 7. FINAL CONSULTATION & CONTACTS (Tone 2: Studio Graphite) */}
      <section className="final-section" id="contacts" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Обсудите ваш проект со специалистами студии
                </h2>
                <p className="final-desc">
                  Отправьте эскиз от руки, размеры помещения или понравившееся фото в сообщество ВКонтакте. Технологи рассчитают смету и порекомендуют материалы под ваш бюджет.
                </p>
                <div className="final-buttons-row">
                  <a
                    href={SITE_CONFIG.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-green"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    Написать ВКонтакте
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
                        <span className="contact-label">Онлайн-консультация</span>
                        <strong className="contact-value">Официальное сообщество ВКонтакте</strong>
                        <span className="contact-sub">Консультация технолога и предварительный расчет</span>
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
