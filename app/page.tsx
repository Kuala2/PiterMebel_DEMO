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
    const sliders = document.querySelectorAll('.carousel-viewport');
    
    sliders.forEach((slider) => {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;
      
      const onMouseDown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest(".photo-square-dot, .card-photo-arrow")) return;
        isDown = true;
        isDragging = false;
        slider.classList.add("is-dragging");
        startX = e.pageX - (slider as HTMLElement).offsetLeft;
        scrollLeft = slider.scrollLeft;
      };
      
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        e.preventDefault();
        isDragging = true;
        const x = e.pageX - (slider as HTMLElement).offsetLeft;
        const walk = (x - startX) * 1.5;
        slider.scrollLeft = scrollLeft - walk;
      };
      
      const onMouseUp = () => {
        isDown = false;
        slider.classList.remove("is-dragging");
      };
      
      const onMouseLeave = () => {
        isDown = false;
        slider.classList.remove("is-dragging");
      };

      const onClick = (e: MouseEvent) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
        }
      };
      
      slider.addEventListener("mousedown", onMouseDown as EventListener);
      slider.addEventListener("mousemove", onMouseMove as EventListener);
      slider.addEventListener("mouseup", onMouseUp as EventListener);
      slider.addEventListener("mouseleave", onMouseLeave as EventListener);
      slider.addEventListener("click", onClick as EventListener, true);
      
      (slider as any)._cleanup = () => {
        slider.removeEventListener("mousedown", onMouseDown as EventListener);
        slider.removeEventListener("mousemove", onMouseMove as EventListener);
        slider.removeEventListener("mouseup", onMouseUp as EventListener);
        slider.removeEventListener("mouseleave", onMouseLeave as EventListener);
        slider.removeEventListener("click", onClick as EventListener, true);
      };
    });

    return () => {
      sliders.forEach((slider) => {
        if ((slider as any)._cleanup) (slider as any)._cleanup();
      });
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

      {/* 2.5 REVIEWS (Отзывы) */}
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="section-header row-between" style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: "8px" }}>Отзывы наших клиентов</h2>
              <p className="section-desc" style={{ maxWidth: "500px", color: "var(--color-text-secondary)", margin: 0 }}>
                Мы дорожим репутацией и гордимся каждой реализованной кухней. Читайте отзывы реальных людей на Яндекс.Картах.
              </p>
            </div>
            <a href="https://yandex.ru/maps/org/pitermebel/245406542043/reviews/" target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Читать все на Яндексе
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="carousel-outer-wrapper">
            <div className="carousel-viewport reviews-viewport">
              <div className="carousel-track" style={{ display: "flex", gap: "24px", width: "max-content" }}>
                
                {/* Review 1 */}
                <div className="review-card">
                  <div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">марина краснова</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">16 мая 2024</div>
                  </div>
                  <p className="review-text">Выражаю огромную благодарность Елене за профессионализм и приятное общение, команда исполнила заказ во всю квартиру четко в срок, на каждом этапе поддержка и помощь! Ольга, спасибо за помощь в понимании технологии, Сергею - за сборку! Наилучшие рекомендации и удачи вашему производству ❤️</p>
                  <div className="review-footer">
                    <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=xx9a5e7bmfm58p93tr09f7uft0" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="review-card">
<div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">Иван Супронов</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">14 декабря 2023</div>
                  </div>
                  <p className="review-text">Большое спасибо за классную кухню. Хорошее отношение с первых минут. Отличный дизайн и исполнение в сроки. Отдельное благодарю установщика Сергея за скурпулезный подход к монтажу. Всех благ и процветания команде профессионалов ПитерМебель. Всем рекомендую.</p>
                  <div className="review-footer">
<a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=49qzx35vjrc7fc81b6nq5rkbr4" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
</div>
</div>

                {/* Review 3 */}
                <div className="review-card">
<div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">Ольга Шевченко</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">14 декабря 2023</div>
                  </div>
                  <p className="review-text">Семья Волковых - это команда мастеров своего дела. Лена и Дима настроили свое производство таким образом, что к ним хочется возвращаться. К клиенту относятся как к себе и делают мебель на совесть. Рекомендую.</p>
                  <div className="review-footer">
<a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=8znemxc4vaz37k7ct4cmcjea8g" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
</div>
</div>

                {/* Review 4 */}
                <div className="review-card">
<div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">Ирина Артемьева</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">14 декабря 2023</div>
                  </div>
                  <p className="review-text">Огромное спасибо вам, прихожая идеальная. Сделано очень быстро и качественно. Цвет шикарный. Буду рекомендовать вас.</p>
                  <div className="review-footer">
<a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=0vv1p9m0kbeuk458y5hezfqp80" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
</div>
</div>

                {/* Review 5 */}
                <div className="review-card">
<div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">Янка Буртанька</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">14 декабря 2023</div>
                  </div>
                  <p className="review-text">Заказывали шкаф купе<br />Очень довольна работой этой компании.<br />Качественно, быстро и цена не космическая<br />Учли все мои пожелания)))</p>
                  <div className="review-footer">
<a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=6zwu69103x2akmtfbthxrzdqp0" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
</div>
</div>

                {/* Review 6 */}
                <div className="review-card">
<div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">Воркута АК111</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">25 декабря 2023</div>
                  </div>
                  <p className="review-text">Хорошая организация, все сделали супер. Сборщик Сергей человек с руками! Спасибо большое!!!</p>
                  <div className="review-footer">
<a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=ppck04ywejarcng3e6qyuwf4cm" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
</div>
</div>

                {/* Review 7 */}
                <div className="review-card">
<div className="review-header">
                    <div className="review-meta">
                      <div className="review-name">алексей ефимов</div>
                      <div className="review-stars">★★★★★</div>
                    </div>
                    <div className="review-date">14 декабря 2023</div>
                  </div>
                  <p className="review-text">Все очень понравилось. Сделали быстро и качественно.</p>
                  <div className="review-footer">
<a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=fm93xvxhk3qhw79pz91tmv0wn0" target="_blank" rel="noopener noreferrer" className="yandex-link">Читать на Яндекс.Картах →</a>
</div>
</div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKSHOP & PRODUCTION (Bespoke Studio Atelier Showcase) */}
      <section className="workshop-section" id="production">
        <div className="container">
          <div className="workshop-head-row">
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>
                Станочный цех на ул. Трефолева
              </h2>
            </div>
            <Link href="/production" className="btn btn-glass workshop-head-btn">
              Подробнее о цехе →
            </Link>
          </div>

          {/* Bento Grid */}
          <div className="workshop-bento-grid">
            
            {/* 1. Main Visual Showcase (2x2) */}
            <div className="bento-hero-cell">
              <Image
                src="/img/brand/workshop_new.jpg"
                alt="Современный станочный цех PiterMebel"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="workshop-banner-img"
                style={{ objectFit: "cover" }}
              />
              <div className="workshop-banner-overlay" />
              
              <div className="workshop-banner-tag">
                <span className="live-dot" />
                <span>Производство</span>
              </div>

              <div className="workshop-banner-hud-compact">
                <div className="hud-metric-item">
                  <span className="hud-metric-val">850 м²</span>
                  <span className="hud-metric-lbl">Площадь</span>
                </div>
                <div className="hud-metric-item">
                  <span className="hud-metric-val">0.1 мм</span>
                  <span className="hud-metric-lbl">Точность ЧПУ</span>
                </div>
              </div>
            </div>

            {/* 2. Card 01 (1x1) */}
            <div className="bento-card-cell">
              <div className="bento-card-content">
                <h3 className="adv-card-title">Прямая экономия</h3>
                <p className="adv-card-desc">Цены от фабрики без наценок и переплат.</p>
              </div>
            </div>

            {/* 3. Card 02 (1x1) */}
            <div className="bento-card-cell">
              <div className="bento-card-content">
                <h3 className="adv-card-title">Нулевой шов</h3>
                <p className="adv-card-desc">Абсолютная влагостойкость PUR-кромления.</p>
              </div>
            </div>

            {/* 4. Card 03 (Stacked) */}
            <div className="bento-card-cell">
              <div className="bento-card-content">
                <h3 className="adv-card-title">100% тестовая сборка</h3>
                <p className="adv-card-desc">
                  Полная проверка диагоналей и зазоров до отгрузки.
                </p>
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
