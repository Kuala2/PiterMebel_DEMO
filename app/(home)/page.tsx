"use client";

import { Fragment, useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Hero from "@/components/Hero";
import Faq from "@/components/Faq";
import LeadSection from "@/components/LeadSection";
import SpotlightArea from "@/components/SpotlightArea";
import TurnkeyServiceSection from "@/components/TurnkeyServiceSection";
import HowItWorks09 from "@/components/ui/how-it-works-09";
import { SITE_CONFIG } from "@/data/site";
import { KNOWLEDGE_ARTICLES, getArticleReadTime } from "@/data/knowledge";
import { CLIENT_REVIEWS, YANDEX_REVIEWS_URL } from "@/data/reviews";
import { KITCHENS } from "@/data/kitchens";
import { SERVICE_PAGES } from "@/data/services";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("all");
  const [cardPhoto, setCardPhoto] = useState<Record<string, number>>({});
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const reviewFocusRafRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (reviewFocusRafRef.current !== null) {
        cancelAnimationFrame(reviewFocusRafRef.current);
      }
    };
  }, []);

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
    const sliders = document.querySelectorAll<HTMLElement>('.carousel-viewport');
    
    sliders.forEach((slider) => {
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;
      let isDragging = false;
      let dragTimer: ReturnType<typeof setTimeout> | null = null;
      
      const onMouseDown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest(".photo-square-dot, .card-photo-arrow, a, button")) {
          isDown = false;
          isDragging = false;
          return;
        }
        isDown = true;
        isDragging = false;
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
      };
      
      const onMouseMove = (e: MouseEvent) => {
        if (!isDown) return;
        const x = e.pageX - slider.offsetLeft;
        const walk = x - startX;
        if (Math.abs(walk) > 5) {
          isDragging = true;
          slider.classList.add("is-dragging");
          slider.scrollLeft = scrollLeft - walk * 1.3;
        }
      };
      
      const onMouseUp = () => {
        if (!isDown && !isDragging) return;
        isDown = false;
        slider.classList.remove("is-dragging");
        if (isDragging) {
          if (dragTimer) clearTimeout(dragTimer);
          dragTimer = setTimeout(() => {
            isDragging = false;
          }, 60);
        }
      };
      
      const onMouseLeave = () => {
        if (isDown) {
          isDown = false;
          slider.classList.remove("is-dragging");
          if (isDragging) {
            if (dragTimer) clearTimeout(dragTimer);
            dragTimer = setTimeout(() => {
              isDragging = false;
            }, 60);
          }
        }
      };

      const onClick = (e: MouseEvent) => {
        if (isDragging) {
          e.preventDefault();
          e.stopPropagation();
          isDragging = false;
        }
      };
      
      slider.addEventListener("mousedown", onMouseDown as EventListener);
      slider.addEventListener("mousemove", onMouseMove as EventListener);
      window.addEventListener("mouseup", onMouseUp as EventListener);
      slider.addEventListener("mouseleave", onMouseLeave as EventListener);
      slider.addEventListener("click", onClick as EventListener, true);
      
      (slider as any)._cleanup = () => {
        slider.removeEventListener("mousedown", onMouseDown as EventListener);
        slider.removeEventListener("mousemove", onMouseMove as EventListener);
        window.removeEventListener("mouseup", onMouseUp as EventListener);
        slider.removeEventListener("mouseleave", onMouseLeave as EventListener);
        slider.removeEventListener("click", onClick as EventListener, true);
        if (dragTimer) clearTimeout(dragTimer);
      };
    });

    return () => {
      sliders.forEach((slider) => {
        if ((slider as any)._cleanup) (slider as any)._cleanup();
      });
    };
  }, []);

  const kitchenCatalogItems = KITCHENS.map((k) => {
    const primarySpec = k.specs[0];
    return {
      id: k.slug,
      category: "kitchens" as const,
      badge: "Кухни",
      title: k.title,
      desc: k.summary,
      specLabel: primarySpec?.label || "Материалы",
      specValue: primarySpec?.value || "Индивидуальный проект",
      photos: (k.gallery.length ? k.gallery : [k.cover]).slice(0, 5),
      link: `/kitchens/${k.slug}/`,
    };
  });

  const serviceCatalogItems = SERVICE_PAGES.map((s) => ({
    id: s.slug,
    category: s.branch === "wardrobes" ? "wardrobes" : "custom",
    badge: s.branch === "wardrobes" ? "Шкафы" : "Корпусная мебель",
    title: s.shortTitle,
    desc: s.lead,
    specLabel: "Материалы",
    specValue: s.materialOptions.slice(0, 2).join(" / "),
    photos: s.gallery.slice(0, 5),
    link: s.href,
  }));

  const catalogItems = [...kitchenCatalogItems, ...serviceCatalogItems];

  const firstFourIds = [
    "sherman-cognac",
    "walk-in",
    "mdf-plastik-hettich",
    "bedroom",
  ];

  const restOrderIds = [
    "partitions",
    "mdf-plastik-gola",
    "kids",
    "tv-zones",
    "island-parquet",
    "hallway",
    "office-home",
    "mdf-emal-vitrina",
    "bathroom",
    "velvet-matte",
    "dressers",
    "business",
    "emerald-enamel",
    "veneer-wood",
    "mdf-belyj-egger",
    "swing",
    "oak-stone",
    "sliding",
    "mdf-grafit-gola",
    "laundry",
    "mdf-klassika-dub",
    "balcony",
    "mdf-plastik-slotex",
    "white-showcase",
    "marble-hood",
    "narrow-kitchen",
  ];

  const itemOrder = [...firstFourIds, ...restOrderIds];
  const orderedItems = [
    ...itemOrder
      .map((id) => catalogItems.find((item) => item.id === id))
      .filter((item): item is (typeof catalogItems)[number] => Boolean(item)),
    ...catalogItems.filter((item) => !itemOrder.includes(item.id)),
  ];

  const visibleItems =
    activeTab === "all"
      ? orderedItems
      : orderedItems.filter((i) => i.category === activeTab);

  // Автосмена фото: тик каждые 2.5с двигает ОДНУ карточку по кругу,
  // так каждая карточка обновляется примерно раз в 15с и на экране
  // никогда не мигает всё сразу. Наведённая карточка пропускается.
  const rotateCursor = useRef(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
              <h2 className="section-title" style={{ marginBottom: 0 }}>Реализованные проекты студии</h2>
            </div>
            <div className="catalog-head-controls">
              <Link href="/projects/" className="btn btn-green catalog-cta-btn">
                Все проекты мебели →
              </Link>
            </div>
          </div>

          {/* Filter Tabs Bar (3 основные категории как в шапке) */}
          <div className="catalog-tabs-bar" style={{ marginBottom: "28px" }}>
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
              Шкафы
            </button>
            <button
              type="button"
              className={`cat-tab ${activeTab === "custom" ? "is-active" : ""}`}
              onClick={() => setActiveTab("custom")}
            >
              Корпусная мебель
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
                          <div className="card-footer-meta">
                            <div className="card-price-label">{item.specLabel}</div>
                            <div className="card-price-val">{item.specValue}</div>
                          </div>
                          <Link href={item.link} className="card-btn-action catalog-card-btn">
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

      {/* 3. ALL-IN-ONE TURNKEY SERVICE: Всё под ключ от проекта розеток до подключения техники */}
      <TurnkeyServiceSection />

      {/* 4. REVIEWS (Отзывы) */}
      <section className="reviews-section" id="reviews" aria-labelledby="reviews-heading">
        <div className="container">
          <div className="section-header row-between" style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2 id="reviews-heading" className="section-title" style={{ marginBottom: "8px" }}>Отзывы наших клиентов</h2>
            </div>
            <a href={YANDEX_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Читать все на Яндексе
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div
            className="reviews-marquee-viewport"
            onFocus={(e) => {
              const viewport = e.currentTarget;
              const target = e.target;
              if (reviewFocusRafRef.current !== null) {
                cancelAnimationFrame(reviewFocusRafRef.current);
                reviewFocusRafRef.current = null;
              }
              if (target instanceof HTMLElement && target.matches(":focus-visible")) {
                reviewFocusRafRef.current = requestAnimationFrame(() => {
                  reviewFocusRafRef.current = null;
                  if (!viewport.contains(document.activeElement)) return;
                  const vpRect = viewport.getBoundingClientRect();
                  const cardRect = (target.closest(".review-card") ?? target).getBoundingClientRect();
                  if (cardRect.left < vpRect.left) {
                    viewport.scrollLeft += cardRect.left - vpRect.left - 16;
                  } else if (cardRect.right > vpRect.right) {
                    viewport.scrollLeft += cardRect.right - vpRect.right + 16;
                  }
                });
              }
            }}
            onBlur={(e) => {
              const viewport = e.currentTarget;
              const nextTarget = e.relatedTarget as Node | null;
              const resetIfLeft = () => {
                if (reviewFocusRafRef.current !== null) {
                  cancelAnimationFrame(reviewFocusRafRef.current);
                  reviewFocusRafRef.current = null;
                }
                viewport.scrollLeft = 0;
              };
              if (nextTarget) {
                if (!viewport.contains(nextTarget)) {
                  resetIfLeft();
                }
              } else if (!viewport.contains(document.activeElement)) {
                resetIfLeft();
              } else {
                queueMicrotask(() => {
                  if (!viewport.contains(document.activeElement)) {
                    resetIfLeft();
                  }
                });
              }
            }}
          >
            <div className="reviews-marquee-track">
              {[false, true].map((isDuplicate) => (
                <div
                  key={isDuplicate ? "dup" : "main"}
                  className="reviews-marquee-group"
                  aria-hidden={isDuplicate ? "true" : undefined}
                >
                  {CLIENT_REVIEWS.map((review) => {
                    const stars = "★".repeat(review.rating);
                    const textBody = review.lines.map((line, lineIdx) => (
                      <Fragment key={lineIdx}>
                        {lineIdx > 0 && <br />}
                        {line}
                      </Fragment>
                    ));

                    if (isDuplicate) {
                      return (
                        <div key={`${review.id}-dup`} className="review-card">
                          <div className="review-header">
                            <div className="review-meta">
                              <div className="review-name">{review.author}</div>
                              <div className="review-stars">{stars}</div>
                            </div>
                          </div>
                          <p className="review-text">{textBody}</p>
                          <div className="review-footer">
                            <a
                              href={review.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              tabIndex={-1}
                              className="yandex-link"
                            >
                              Читать на Яндекс Картах →
                            </a>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <article
                        key={review.id}
                        className="review-card"
                        aria-label={`Отзыв клиента: ${review.author}`}
                      >
                        <div className="review-header">
                          <div className="review-meta">
                            <div className="review-name">{review.author}</div>
                            <div
                              className="review-stars"
                              role="img"
                              aria-label={`Оценка ${review.rating} из 5`}
                            >
                              <span aria-hidden="true">{stars}</span>
                            </div>
                          </div>
                        </div>
                        <blockquote className="review-text" cite={review.sourceUrl}>
                          {textBody}
                        </blockquote>
                        <div className="review-footer">
                          <a
                            href={review.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Читать на Яндекс Картах — отзыв: ${review.author}`}
                            className="yandex-link"
                          >
                            Читать на Яндекс Картах →
                          </a>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3.1. COMPANY MANIFESTO: Честный подход с 2005 года */}
      <section className="manifesto-section" id="manifesto">
        <div className="container">
          <div className="manifesto-stage">
            {/* Наклейка 1: слева сверху */}
            <div className="manifesto-sticker manifesto-sticker--top-left">
              <span className="manifesto-spec-metric">С {SITE_CONFIG.foundingYear} года</span>
              <span className="manifesto-spec-desc">
                Проектируем и изготавливаем мебель в Санкт-Петербурге
              </span>
            </div>

            {/* Центральный блок: заголовок, текст и кнопка */}
            <div className="manifesto-centered">
              <h2 className="section-title">
                Честное производство с 2005 года
              </h2>

              <p className="manifesto-quote-text">
                «ПитерМебель» — семейное производство полного цикла. Мы проектируем мебель,
                готовим подробную смету, выполняем замер, изготовление и сборку собственной командой,
                а согласованную стоимость фиксируем в договоре без скрытых переплат.
              </p>

              <div className="manifesto-actions">
                <Link href="/contacts/" className="btn btn-green">
                  Обсудить проект →
                </Link>
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="manifesto-tel">
                  {SITE_CONFIG.phone}
                </a>
              </div>
            </div>

            {/* Наклейка 2: посередине справа */}
            <div className="manifesto-sticker manifesto-sticker--mid-right">
              <span className="manifesto-spec-metric">Подробная смета</span>
              <span className="manifesto-spec-desc">
                Материалы, фасады, фурнитура и работы — до подписания договора
              </span>
            </div>

            {/* Наклейка 3: слева чуть под левой частью текста */}
            <div className="manifesto-sticker manifesto-sticker--bottom-left">
              <span className="manifesto-spec-metric">Фиксация в договоре</span>
              <span className="manifesto-spec-desc">
                Согласованная смета неизменна, официальный договор и безналичный расчёт
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WORKSHOP & PRODUCTION ATELIER */}
      <section className="workshop-section" id="production">
        <div className="container">
          <div className="workshop-editorial-grid">
            {/* Left Column: Photo */}
            <div className="workshop-col-media">
              <div className="workshop-photo-frame">
                <Image
                  src="/img/production/line-boring.webp"
                  alt="Мастер студии «ПитерМебель» за присадочным станком в мебельном цеху"
                  fill
                  className="workshop-main-photo"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  style={{ objectFit: "cover" }}
                />
              </div>
            </div>

            {/* Right Column: Editorial Details */}
            <div className="workshop-col-content">
              <h2 className="section-title">
                Собственное производство в Санкт-Петербурге
              </h2>
              <p className="workshop-lead">
                Собственный цех на Петергофском шоссе, 73. Мы сами распиливаем плиты, кромим торцы с прифуговкой и делаем присадку по чертежам — без посредников и наценок за нестандарт.
              </p>

              <div className="workshop-points-list">
                <div className="workshop-point-item">
                  <span className="workshop-point-num">01</span>
                  <div className="workshop-point-body">
                    <h3 className="workshop-point-title">Собственные станки</h3>
                    <p className="workshop-point-desc">
                      Форматно-раскроечный станок, кромочник с узлом прифуговки и два присадочных станка Blum
                    </p>
                  </div>
                </div>

                <div className="workshop-point-item">
                  <span className="workshop-point-num">02</span>
                  <div className="workshop-point-body">
                    <h3 className="workshop-point-title">Раскрой под любой размер</h3>
                    <p className="workshop-point-desc">
                      Изготавливаем детали с точностью до миллиметра под вашу нишу, выступы стен и короба без доплат за нестандартный шаг
                    </p>
                  </div>
                </div>

                <div className="workshop-point-item">
                  <span className="workshop-point-num">03</span>
                  <div className="workshop-point-body">
                    <h3 className="workshop-point-title">Сборка своими мастерами</h3>
                    <p className="workshop-point-desc">
                      Мебель устанавливают постоянные монтажники студии с подключением бытовой техники
                    </p>
                  </div>
                </div>
              </div>

              <div className="workshop-action-wrap">
                <Link href="/production/" className="btn btn-green">
                  Подробнее о производстве →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PROCESS TIMELINE (HOW IT WORKS 09) */}
      <HowItWorks09 />

      {/* 6. KNOWLEDGE BASE: 1 VERTICAL OBJECT CARD (EDITORIAL CRAFT, NO TILES) */}
      <section className="knowledge-home-section" id="knowledge">
        <div className="container">
          <div className="knowledge-home-head">
            <div>
              <h2 className="section-title" style={{ marginBottom: "8px" }}>
                Наши статьи
              </h2>
              <p className="knowledge-home-sub">
                Практические советы и руководства перед заказом
              </p>
            </div>
          </div>

          <div className="knowledge-track-single">
            <Link
              href={`/knowledge/${KNOWLEDGE_ARTICLES[0].slug}/`}
              className="knowledge-object-card"
            >
              <div className="knowledge-object-media">
                <Image
                  src={KNOWLEDGE_ARTICLES[0].placeholderImage || "/img/knowledge/kitchen_sockets_plan.jpg"}
                  alt={KNOWLEDGE_ARTICLES[0].title}
                  fill
                  sizes="(max-width: 768px) 100vw, 460px"
                  style={{ objectFit: "cover" }}
                  className="knowledge-object-img"
                  priority={false}
                />
                <div className="knowledge-read-badge">
                  Статья · {getArticleReadTime(KNOWLEDGE_ARTICLES[0])} мин
                </div>
              </div>

              <div className="knowledge-object-body">
                <div className="knowledge-object-meta">
                  <span className="knowledge-object-cat">{KNOWLEDGE_ARTICLES[0].categoryLabel}</span>
                  <span className="knowledge-object-dot">·</span>
                  <span className="knowledge-object-date">{KNOWLEDGE_ARTICLES[0].publishedAt}</span>
                </div>
                <h3 className="knowledge-object-title">
                  {KNOWLEDGE_ARTICLES[0].title}
                </h3>
                <div className="knowledge-object-footer">
                  <span className="knowledge-object-link">
                    Читать статью →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <Faq />

      {/* 7. FINAL CONSULTATION & CONTACTS */}
      <LeadSection
        id="contacts"
        source="Главная страница"
      />
    </div>
  );
}
