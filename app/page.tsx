"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Faq from "@/components/Faq";
import VkIcon from "@/components/VkIcon";
import SpotlightArea from "@/components/SpotlightArea";
import { SITE_CONFIG } from "@/data/site";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
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

  // Порядок витрины на главной: Тимофей → гардеробная STOPSOL → Славена → остальное
  const itemOrder = ["timofey", "glass-wardrobe", "slavena", "oak-stone", "aleksandra", "mirror-hall", "brick-wardrobe"];
  const orderedItems = itemOrder
    .map((id) => catalogItems.find((item) => item.id === id))
    .filter((item): item is (typeof catalogItems)[number] => Boolean(item));

  const visibleItems =
    activeTab === "all"
      ? orderedItems
      : orderedItems.filter((i) => i.category === activeTab);

  // Автосмена фото: тик каждые 2.5с двигает ОДНУ карточку по кругу,
  // так каждая карточка обновляется примерно раз в 15с и на экране
  // никогда не мигает всё сразу. Наведённая карточка пропускается.
  const rotateCursor = useRef(0);
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.hidden) return;
      const ids = visibleItems.map((i) => i.id);
      if (!ids.length) return;
      for (let attempt = 0; attempt < ids.length; attempt++) {
        const id = ids[rotateCursor.current % ids.length];
        rotateCursor.current += 1;
        if (id === hoveredCard) continue;
        const item = visibleItems.find((i) => i.id === id);
        const count = item?.photos.length ?? 1;
        if (count < 2) continue;
        setCardPhoto((prev) => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % count }));
        return;
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [visibleItems, hoveredCard]);

  return (
    <div>
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. CATALOG SECTION (1-Line Horizontal Slider) */}
      <section className="catalog-section" id="catalog">
        <SpotlightArea className="container" selector=".catalog-card">
          <div className="catalog-head-row">
            <div>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Реализованные объекты студии</h2>
            </div>
            <div className="catalog-head-controls">
              <Link href="/projects" className="btn btn-green catalog-cta-btn">
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
            <button
              type="button"
              className="catalog-edge-nav prev"
              onClick={scrollLeft}
              aria-label="Прокрутить влево"
            >
              ←
            </button>
            <button
              type="button"
              className="catalog-edge-nav next"
              onClick={scrollRight}
              aria-label="Прокрутить вправо"
            >
              →
            </button>
            <div
              className="carousel-viewport"
              ref={carouselRef}
            >
              <div className="carousel-track">
                {visibleItems.map((item) => {
                  const currentIdx = cardPhoto[item.id] ?? 0;

                  return (
                    <div
                      key={item.id}
                      className="catalog-card spotlight-target"
                      onMouseEnter={() => setHoveredCard(item.id)}
                      onMouseLeave={() => setHoveredCard((cur) => (cur === item.id ? null : cur))}
                    >
                      <div className="card-gallery-wrap">
                        {/* все фото стопкой, активное проявляется кроссфейдом */}
                        {item.photos.map((src, pIdx) => (
                          <Image
                            key={src}
                            src={src}
                            alt={pIdx === currentIdx ? item.title : ""}
                            fill
                            sizes="(max-width: 768px) 100vw, 440px"
                            className={`card-img-slide ${currentIdx === pIdx ? "is-active" : ""}`}
                            draggable={false}
                            style={{ pointerEvents: "none", userSelect: "none" }}
                          />
                        ))}
                        {/* бейдж с материалом убран: он дублирует строку под фото */}

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
        </SpotlightArea>
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

      {/* 4. TEAM SECTION */}
      <section className="team-section" id="team">
        <div className="container">
          <div className="team-head-block">
            <h2 className="section-title">Кто делает вашу мебель</h2>
            <p className="team-lead-text">
              ПитерМебель — семейная студия. За каждым заказом от первого замера до монтажа следуют одни и те же люди.
            </p>
          </div>

          <div className="team-grid">
            {/* 1. Elena Volkova */}
            <div className="team-card">
              <div className="team-card-photo">
                {/* TODO: реальное вертикальное фото /img/team/elena.jpg */}
                <span className="team-monogram-placeholder">Е</span>
              </div>
              <div className="team-card-body">
                <h3 className="team-card-name">Елена Волкова</h3>
                <p className="team-card-role">Консультация, замер и ведение проекта</p>
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="team-card-tel">
                  +7 (921) 784-05-89 →
                </a>
              </div>
            </div>

            {/* 2. Dmitry */}
            <div className="team-card">
              <div className="team-card-photo">
                {/* TODO: реальное вертикальное фото /img/team/dmitry.jpg */}
                <span className="team-monogram-placeholder">Д</span>
              </div>
              <div className="team-card-body">
                <h3 className="team-card-name">Дмитрий</h3>
                <p className="team-card-role">Цех и производство</p>
              </div>
            </div>

            {/* 3. Sergey */}
            <div className="team-card">
              <div className="team-card-photo">
                {/* TODO: реальное вертикальное фото /img/team/sergey.jpg */}
                <span className="team-monogram-placeholder">С</span>
              </div>
              <div className="team-card-body">
                <h3 className="team-card-name">Сергей</h3>
                <p className="team-card-role">Сборка и монтаж</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKSHOP & PRODUCTION ATELIER */}
      <section className="workshop-section" id="production">
        <div className="container">
          <div className="workshop-editorial-grid">
            {/* Left Column: Photo & Area Badge */}
            <div className="workshop-col-media">
              <div className="workshop-photo-frame">
                <Image
                  src="/img/brand/ws_cnc_wood_1.jpg"
                  alt="Станочный цех PiterMebel — ЧПУ фрезеровка и раскрой"
                  fill
                  className="workshop-main-photo"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  style={{ objectFit: "cover" }}
                />
                <div className="workshop-area-badge">
                  <span className="workshop-area-val">850 м²</span>
                  <span className="workshop-area-lbl">площадь цеха</span>
                </div>
              </div>
              <div className="workshop-location-caption">
                Собственное производство в Санкт-Петербурге · 850 м²
              </div>
            </div>

            {/* Right Column: Editorial Details */}
            <div className="workshop-col-content">
              <h2 className="section-title">
                Собственное станочное производство
              </h2>
              <p className="workshop-lead">
                Производим сами — поэтому отвечаем за качество на каждом этапе, от раскроя плиты до сборки изделия.
              </p>

              <div className="workshop-points-list">
                <div className="workshop-point-item">
                  <span className="workshop-point-num">01</span>
                  <div className="workshop-point-body">
                    <h3 className="workshop-point-title">Цена от производителя</h3>
                    <p className="workshop-point-desc">
                      Заказ идёт напрямую в цех, без наценок салонов и посредников
                    </p>
                  </div>
                </div>

                <div className="workshop-point-item">
                  <span className="workshop-point-num">02</span>
                  <div className="workshop-point-body">
                    <h3 className="workshop-point-title">100% тестовая сборка</h3>
                    <p className="workshop-point-desc">
                      Каждое изделие собирается в цеху до отгрузки — на объекте всё встаёт точно
                    </p>
                  </div>
                </div>

                <div className="workshop-point-item">
                  <span className="workshop-point-num">03</span>
                  <div className="workshop-point-body">
                    <h3 className="workshop-point-title">Нестандарт — без ограничений</h3>
                    <p className="workshop-point-desc">
                      Размеры, материалы и решения не привязаны к готовым каталогам
                    </p>
                  </div>
                </div>
              </div>

              <div className="workshop-action-wrap">
                <Link href="/production" className="btn btn-glass">
                  Подробнее о цехе →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROCESS BLUEPRINT TIMELINE */}
      <section className="steps-section" id="steps">
        <div className="container">
          <h2 className="section-title steps-title">
            Как создается ваша мебель
          </h2>

          <div className="process-track">
            {/* Step 1 */}
            <div className="process-step">
              <span className="process-day">1 день</span>
              <h3 className="process-title">Выезд мастера и замер</h3>
              <p className="process-desc">
                Инженер привозит образцы эмалей, шпона и сканирует точную геометрию стен.
              </p>
            </div>

            {/* Step 2 */}
            <div className="process-step">
              <span className="process-day">2–3 дня</span>
              <h3 className="process-title">3D-проект и смета</h3>
              <p className="process-desc">
                Эргономика, интеграция техники и фиксация неизменной стоимости в договоре.
              </p>
            </div>

            {/* Step 3 */}
            <div className="process-step">
              <span className="process-day">14–21 день</span>
              <h3 className="process-title">Изготовление в цеху</h3>
              <p className="process-desc">
                Раскрой на ЧПУ, влагостойкое PUR-кромление и обязательная контрольная сборка.
              </p>
            </div>

            {/* Step 4 */}
            <div className="process-step">
              <span className="process-day">1 день</span>
              <h3 className="process-title">Чистый монтаж</h3>
              <p className="process-desc">
                Штатная бригада устанавливает мебель, подключает технику и убирает весь мусор.
              </p>
            </div>
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
                  <h3 className="info-block-title">Офис и собственное производство</h3>
                  <div className="contact-items-list">
                    <div className="contact-item-row">
                      <div className="contact-meta">
                        <span className="contact-label">Офис студии для встреч</span>
                        <strong className="contact-value">площадь Стачек, 9, этаж 4</strong>
                        <span className="contact-sub">{SITE_CONFIG.metro} · консультации и выбор образцов по записи</span>
                      </div>
                    </div>

                    <div className="contact-item-row">
                      <div className="contact-meta">
                        <span className="contact-label">Собственное производство</span>
                        <strong className="contact-value">Цех 850 м² в Санкт-Петербурге</strong>
                        <span className="contact-sub">Закрытая станочная площадка с ЧПУ</span>
                      </div>
                    </div>

                    <div className="contact-item-row">
                      <div className="contact-meta">
                        <span className="contact-label">Режим работы</span>
                        <strong className="contact-value">{SITE_CONFIG.workHours}</strong>
                        <span className="contact-sub">Бесплатный выезд инженера с чемоданом образцов</span>
                      </div>
                    </div>

                    <div className="contact-item-row">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
