"use client";

import { useState, useRef, useEffect } from "react";
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

  const catalogItems = [
    {
      id: "mdf-plastik-gola",
      category: "kitchens",
      badge: "МДФ-пластик",
      title: "Кухня Fenix",
      desc: "Фасады из МДФ-пластика, корпус Egger, столешница и фартук из искусственного камня.",
      specLabel: "Фасады",
      specValue: "МДФ-пластик / Камень",
      photos: [
        "/img/kitchens/slavena/photo_1.jpg",
        "/img/kitchens/slavena/photo_2.jpg",
        "/img/kitchens/slavena/photo_3.jpg",
        "/img/kitchens/slavena/photo_4.jpg",
      ],
      link: "/kitchens/mdf-plastik-gola/",
    },
    {
      id: "light-wood-wardrobe",
      category: "wardrobes",
      badge: "Гардеробная",
      title: "Гардеробная с подсветкой и древесным декором",
      desc: "Открытая гардеробная система со встроенной светодиодной подсветкой полок и штанг.",
      specLabel: "Оснащение",
      specValue: "Древесный декор / LED",
      photos: [
        "/img/projects/light-wood-wardrobe/photo_1.jpg",
        "/img/projects/light-wood-wardrobe/photo_2.jpg",
        "/img/projects/light-wood-wardrobe/photo_3.jpg",
        "/img/projects/light-wood-wardrobe/photo_4.jpg",
      ],
      link: "/projects/light-wood-wardrobe/",
    },
    {
      id: "sliding-partition",
      category: "custom",
      badge: "Перегородки",
      title: "Раздвижная перегородка для зонирования",
      desc: "Раздвижная межкомнатная перегородка из алюминиевого профиля с безопасным остеклением.",
      specLabel: "Конструкция",
      specValue: "Алюминиевый профиль / Стекло",
      photos: [
        "/img/projects/sliding-partition/photo_1.jpg",
        "/img/projects/sliding-partition/photo_2.jpg",
        "/img/projects/sliding-partition/photo_3.jpg",
        "/img/projects/sliding-partition/photo_4.jpg",
      ],
      link: "/projects/sliding-partition/",
    },
    {
      id: "island-parquet",
      category: "kitchens",
      badge: "Эмаль и шпон",
      title: "Кухня эмаль и натуральный шпон",
      desc: "Фасады из МДФ в эмали с натуральным шпоном и столешницей из искусственного камня.",
      specLabel: "Материалы",
      specValue: "МДФ в эмали / Шпон",
      photos: [
        "/img/projects/island-parquet/photo_1.jpg",
        "/img/projects/island-parquet/photo_2.jpg",
        "/img/projects/island-parquet/photo_3.jpg",
        "/img/projects/island-parquet/photo_4.jpg",
      ],
      link: "/projects/island-parquet/",
    },
    {
      id: "glass-wardrobe",
      category: "wardrobes",
      badge: "Stopsol",
      title: "Гардеробная со стеклом Stopsol",
      desc: "При выключенной подсветке стекло выглядит как зеркало, при включённой становится прозрачным. Без нижней направляющей.",
      specLabel: "Стекло",
      specValue: "Stopsol",
      photos: [
        "/img/projects/glass-wardrobe/photo_1.jpg",
        "/img/projects/glass-wardrobe/photo_2.jpg",
        "/img/projects/glass-wardrobe/photo_3.jpg",
      ],
      link: "/projects/glass-wardrobe/",
    },
    {
      id: "oak-veneer-panel",
      category: "custom",
      badge: "ТВ-зона",
      title: "ТВ-зона с панелями из шпона дуба",
      desc: "Панели из натурального шпона дуба сочетаются с МДФ в эмали в составе комплексного проекта.",
      specLabel: "Материалы",
      specValue: "Шпон дуба / МДФ в эмали",
      photos: [
        "/img/projects/oak-veneer-panel/photo_1.jpg",
        "/img/projects/oak-veneer-panel/photo_2.jpg",
        "/img/projects/oak-veneer-panel/photo_3.jpg",
      ],
      link: "/projects/oak-veneer-panel/",
    },
    {
      id: "mdf-plastik-slotex",
      category: "kitchens",
      badge: "МДФ-пластик",
      title: "Кухня МДФ пластик",
      desc: "Фасады из суперматового МДФ-пластика, корпус Egger, влагостойкая столешница Slotex и фурнитура Blum.",
      specLabel: "Фасады",
      specValue: "Суперматовый МДФ",
      photos: [
        "/img/kitchens/aleksandra/photo_1.jpg",
        "/img/kitchens/aleksandra/photo_2.jpg",
        "/img/kitchens/aleksandra/photo_3.jpg",
        "/img/kitchens/aleksandra/photo_4.jpg",
      ],
      link: "/kitchens/mdf-plastik-slotex/",
    },
    {
      id: "mirror-hall",
      category: "wardrobes",
      badge: "Прихожая",
      title: "Зеркальный шкаф с нишей для обуви",
      desc: "Встроенный зеркальный шкаф с нишей для обуви и торцевыми ручками.",
      specLabel: "Конструкция",
      specValue: "Зеркало / Ниша для обуви",
      photos: [
        "/img/projects/mirror-hall/photo_1.jpg",
        "/img/projects/mirror-hall/photo_2.jpg",
      ],
      link: "/projects/mirror-hall/",
    },
    {
      id: "cascade-partitions",
      category: "custom",
      badge: "Перегородки",
      title: "Каскадные раздвижные перегородки",
      desc: "Система интерьерных раздвижных перегородок с каскадным открыванием и беспороговым монтажом.",
      specLabel: "Конструкция",
      specValue: "Каскадное открывание",
      photos: [
        "/img/projects/cascade-partitions/photo_1.jpg",
        "/img/projects/cascade-partitions/photo_2.jpg",
        "/img/projects/cascade-partitions/photo_3.jpg",
        "/img/projects/cascade-partitions/photo_4.jpg",
      ],
      link: "/projects/cascade-partitions/",
    },
    {
      id: "mdf-emal-vitrina",
      category: "kitchens",
      badge: "МДФ ПВХ",
      title: "Кухня МДФ ПВХ с фрезеровкой",
      desc: "Светлые фасады с витриной в узкой чёрной алюминиевой рамке, корпус и столешница Egger.",
      specLabel: "Оснащение",
      specValue: "Витрина / Корпус Egger",
      photos: [
        "/img/kitchens/valeria/photo_1.jpg",
        "/img/kitchens/valeria/photo_2.jpg",
        "/img/kitchens/valeria/photo_3.jpg",
        "/img/kitchens/valeria/photo_4.jpg",
      ],
      link: "/kitchens/mdf-emal-vitrina/",
    },
    {
      id: "brick-wardrobe",
      category: "wardrobes",
      badge: "П-образная",
      title: "П-образная гардеробная со скошенными полками",
      desc: "Гардеробная из ЛДСП Egger. Для стены со скосом полки изготовлены по шаблону.",
      specLabel: "Материал",
      specValue: "ЛДСП Egger H3170",
      photos: [
        "/img/projects/brick-wardrobe/photo_1.jpg",
        "/img/projects/brick-wardrobe/photo_2.jpg",
        "/img/projects/brick-wardrobe/photo_3.jpg",
      ],
      link: "/projects/brick-wardrobe/",
    },
    {
      id: "bathroom-vanity",
      category: "custom",
      badge: "Ванная",
      title: "Влагостойкая мебель для ванной комнаты",
      desc: "Мебель для санузлов и ванных комнат с повышенной защитой от влаги и бесшовной обработкой кромок.",
      specLabel: "Материалы",
      specValue: "МДФ в пластике / Влагостойкая кромка",
      photos: [
        "/img/projects/bathroom-vanity/photo_1.jpg",
        "/img/projects/bathroom-vanity/photo_2.jpg",
      ],
      link: "/projects/bathroom-vanity/",
    },
    {
      id: "oak-stone",
      category: "kitchens",
      badge: "Эмаль и дуб",
      title: "Кухня эмаль и массив дуба",
      desc: "Фасады из МДФ в эмали и массива дуба. Столешница из кварцевого агломерата.",
      specLabel: "Материалы",
      specValue: "Эмаль / Массив дуба",
      photos: [
        "/img/projects/oak-stone/photo_1.jpg",
        "/img/projects/oak-stone/photo_2.jpg",
        "/img/projects/oak-stone/photo_3.jpg",
        "/img/projects/oak-stone/photo_4.jpg",
      ],
      link: "/projects/oak-stone/",
    },
    {
      id: "wardrobe-inside",
      category: "wardrobes",
      badge: "Шкафы",
      title: "Шкафы для комнаты и прихожей",
      desc: "Комплект шкафов из ЛДСП Egger U705 «Ангора серая» для нескольких помещений квартиры.",
      specLabel: "Материал",
      specValue: "ЛДСП Egger U705",
      photos: [
        "/img/projects/wardrobe-inside/photo_1.jpg",
        "/img/projects/wardrobe-inside/photo_2.jpg",
        "/img/projects/wardrobe-inside/photo_3.jpg",
      ],
      link: "/projects/wardrobe-inside/",
    },
    {
      id: "office-reception",
      category: "custom",
      badge: "Коммерческий",
      title: "Стойка ресепшен для клиники",
      desc: "Акриловый искусственный камень, рейки из массива бука, МДФ в эмали и LED-подсветка.",
      specLabel: "Материалы",
      specValue: "Акриловый камень / Массив бука",
      photos: [
        "/img/projects/office-reception/photo_1.jpg",
        "/img/projects/office-reception/photo_2.jpg",
        "/img/projects/office-reception/photo_3.jpg",
      ],
      link: "/projects/office-reception/",
    },
    {
      id: "mdf-plastik-hettich",
      category: "kitchens",
      badge: "МДФ-пластик",
      title: "Кухня МДФ пластик",
      desc: "Фасады из МДФ-пластика, корпус и столешница Egger под дерево, фурнитура Hettich с доводчиками.",
      specLabel: "Фасады",
      specValue: "МДФ-пластик / Дерево",
      photos: [
        "/img/kitchens/timofey/photo_1.jpg",
        "/img/kitchens/timofey/photo_2.jpg",
        "/img/kitchens/timofey/photo_3.jpg",
      ],
      link: "/kitchens/mdf-plastik-hettich/",
    },
    {
      id: "bedroom-set",
      category: "wardrobes",
      badge: "Спальня",
      title: "Шкафы и мебель для спальни",
      desc: "Шкафы и тумбы выполнены в единой стилистике как часть комплексного заказа мебели для квартиры.",
      specLabel: "Проект",
      specValue: "Мебель для спальни",
      photos: [
        "/img/projects/bedroom-set/photo_1.jpg",
        "/img/projects/bedroom-set/photo_2.jpg",
        "/img/projects/bedroom-set/photo_3.jpg",
      ],
      link: "/projects/bedroom-set/",
    },
    {
      id: "curved-oak-facades",
      category: "custom",
      badge: "Фасады",
      title: "Радиусные фасады из шпона дуба",
      desc: "Гнутые мебельные фасады из натурального шпона дуба под защитным лаком.",
      specLabel: "Технология",
      specValue: "Шпон дуба / Радиусные фасады",
      photos: [
        "/img/projects/curved-oak-facades/photo_1.jpg",
        "/img/projects/curved-oak-facades/photo_2.jpg",
        "/img/projects/curved-oak-facades/photo_3.jpg",
      ],
      link: "/projects/curved-oak-facades/",
    },
    {
      id: "mdf-belyj-egger",
      category: "kitchens",
      badge: "Пластик + Egger",
      title: "Кухня МДФ пластик+Egger",
      desc: "Белые фасады из МДФ-пластика в сочетании с древесным декором Egger и стеновой панелью под мрамор.",
      specLabel: "Фасады",
      specValue: "Белый МДФ-пластик / Egger",
      photos: [
        "/img/kitchens/ulyana/photo_1.jpg",
        "/img/kitchens/ulyana/photo_2.jpg",
        "/img/kitchens/ulyana/photo_3.jpg",
      ],
      link: "/kitchens/mdf-belyj-egger/",
    },
    {
      id: "slat-panels",
      category: "custom",
      badge: "Комплексный проект",
      title: "Кухня, стеллаж и шкаф-купе",
      desc: "Стеллаж переходит в кухню, а кухня — в шкаф-купе, связывая несколько функциональных зон.",
      specLabel: "Формат",
      specValue: "Единая мебельная композиция",
      photos: [
        "/img/projects/slat-panels/photo_1.jpg",
        "/img/projects/slat-panels/photo_2.jpg",
        "/img/projects/slat-panels/photo_3.jpg",
      ],
      link: "/projects/slat-panels/",
    },
    {
      id: "mdf-grafit-gola",
      category: "kitchens",
      badge: "МДФ Графит",
      title: "Кухня МДФ Графит Gola",
      desc: "Фасады из МДФ-пластика с древесным декором столешницы Egger и профилем Gola на нижних секциях.",
      specLabel: "Фасады",
      specValue: "МДФ-пластик / Профиль Gola",
      photos: [
        "/img/kitchens/stefania/photo_1.jpg",
        "/img/kitchens/stefania/photo_2.jpg",
        "/img/kitchens/stefania/photo_3.jpg",
      ],
      link: "/kitchens/mdf-grafit-gola/",
    },
    {
      id: "emerald-enamel",
      category: "kitchens",
      badge: "МДФ Эмаль",
      title: "Кухня МДФ Эмаль",
      desc: "Выразительный цвет эмали сочетается с классической геометрией фасадов и светлыми верхними секциями.",
      specLabel: "Фасады",
      specValue: "МДФ в эмали",
      photos: [
        "/img/projects/emerald-enamel/photo_1.jpg",
        "/img/projects/emerald-enamel/photo_2.jpg",
        "/img/projects/emerald-enamel/photo_3.jpg",
        "/img/projects/emerald-enamel/photo_4.jpg",
      ],
      link: "/projects/emerald-enamel/",
    },
    {
      id: "velvet-matte",
      category: "kitchens",
      badge: "Пластик Velvet",
      title: "Кухня МДФ Velvet",
      desc: "Матовые фасады Velvet и лаконичная геометрия создают спокойный современный образ кухни.",
      specLabel: "Фасады",
      specValue: "МДФ-пластик Velvet",
      photos: [
        "/img/projects/velvet-matte/photo_1.jpg",
        "/img/projects/velvet-matte/photo_2.jpg",
      ],
      link: "/projects/velvet-matte/",
    },
    {
      id: "mdf-klassika-dub",
      category: "kitchens",
      badge: "МДФ Эмаль",
      title: "Кухня МДФ Эмаль матовая",
      desc: "Светлые молочные фасады в сочетании со столешницей с тёплым древесным декором.",
      specLabel: "Фасады",
      specValue: "МДФ Эмаль матовая / Дерево",
      photos: [
        "/img/kitchens/viktoria/photo_1.jpg",
        "/img/kitchens/viktoria/photo_2.jpg",
        "/img/kitchens/viktoria/photo_3.jpg",
      ],
      link: "/kitchens/mdf-klassika-dub/",
    },
    {
      id: "sherman-cognac",
      category: "kitchens",
      badge: "Глянец & Egger",
      title: "Кухня МДФ пластик+Egger",
      desc: "Глянцевые фасады из МДФ-пластика сочетаются с тёплым древесным декором Egger «Шерман коньяк коричневый».",
      specLabel: "Декор",
      specValue: "Egger Шерман / Пластик",
      photos: [
        "/img/projects/sherman-cognac/photo_1.jpg",
        "/img/projects/sherman-cognac/photo_2.jpg",
        "/img/projects/sherman-cognac/photo_3.jpg",
        "/img/projects/sherman-cognac/photo_4.jpg",
      ],
      link: "/projects/sherman-cognac/",
    },
  ];

  const firstFourIds = [
    "sherman-cognac",
    "glass-wardrobe",
    "mdf-plastik-hettich",
    "bedroom-set",
  ];

  const restOrderIds = [
    "sliding-partition",
    "mdf-plastik-gola",
    "light-wood-wardrobe",
    "oak-veneer-panel",
    "island-parquet",
    "mirror-hall",
    "cascade-partitions",
    "mdf-emal-vitrina",
    "bathroom-vanity",
    "velvet-matte",
    "brick-wardrobe",
    "office-reception",
    "emerald-enamel",
    "curved-oak-facades",
    "mdf-belyj-egger",
    "wardrobe-inside",
    "oak-stone",
    "slat-panels",
    "mdf-grafit-gola",
    "mdf-klassika-dub",
    "mdf-plastik-slotex",
  ];

  const itemOrder = [...firstFourIds, ...restOrderIds];
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
                          <div>
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
      <section className="reviews-section" id="reviews">
        <div className="container">
          <div className="section-header row-between" style={{ marginBottom: "32px", display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <h2 className="section-title" style={{ marginBottom: "8px" }}>Отзывы наших клиентов</h2>
            </div>
            <a href="https://yandex.ru/maps/org/pitermebel/245406542043/reviews/" target="_blank" rel="noopener noreferrer" className="btn btn-glass" style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
              Читать все на Яндексе
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <div className="reviews-marquee-viewport">
            <div className="reviews-marquee-track">
              {[false, true].map((isDuplicate) => (
                <div
                  key={isDuplicate ? "dup" : "main"}
                  className="reviews-marquee-group"
                  aria-hidden={isDuplicate ? "true" : undefined}
                >
                  {/* Review 0 (New) */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">Константин Александрович</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Широчайший выбор различных мебельных изделий на любой вкус и цвет, всё качественное и из экологически чистых материалов. Персонал добрый(не злой)). Ура товарищи!!!</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/pitermebel/245406542043/reviews/" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 1 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">марина краснова</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Выражаю огромную благодарность Елене за профессионализм и приятное общение, команда исполнила заказ во всю квартиру четко в срок, на каждом этапе поддержка и помощь! Ольга, спасибо за помощь в понимании технологии, Сергею - за сборку! Наилучшие рекомендации и удачи вашему производству ❤️</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=xx9a5e7bmfm58p93tr09f7uft0" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 2 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">Иван Супронов</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Большое спасибо за классную кухню. Хорошее отношение с первых минут. Отличный дизайн и исполнение в сроки. Отдельное благодарю установщика Сергея за скурпулезный подход к монтажу. Всех благ и процветания команде профессионалов ПитерМебель. Всем рекомендую.</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=49qzx35vjrc7fc81b6nq5rkbr4" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 3 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">Ольга Шевченко</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Семья Волковых - это команда мастеров своего дела. Лена и Дима настроили свое производство таким образом, что к ним хочется возвращаться. К клиенту относятся как к себе и делают мебель на совесть. Рекомендую.</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=8znemxc4vaz37k7ct4cmcjea8g" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 4 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">Ирина Артемьева</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Огромное спасибо вам, прихожая идеальная. Сделано очень быстро и качественно. Цвет шикарный. Буду рекомендовать вас.</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=0vv1p9m0kbeuk458y5hezfqp80" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 5 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">Янка Буртанька</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Заказывали шкаф купе<br />Очень довольна работой этой компании.<br />Качественно, быстро и цена не космическая<br />Учли все мои пожелания)))</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=6zwu69103x2akmtfbthxrzdqp0" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 6 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">Воркута АК111</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Хорошая организация, все сделали супер. Сборщик Сергей человек с руками! Спасибо большое!!!</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=ppck04ywejarcng3e6qyuwf4cm" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>

                  {/* Review 7 */}
                  <div className="review-card">
                    <div className="review-header">
                      <div className="review-meta">
                        <div className="review-name">алексей ефимов</div>
                        <div className="review-stars" aria-label="Оценка 5 из 5">★★★★★</div>
                      </div>
                    </div>
                    <p className="review-text">Все очень понравилось. Сделали быстро и качественно.</p>
                    <div className="review-footer">
                      <a href="https://yandex.ru/maps/org/245406542043/reviews?reviews%5BpublicId%5D=fm93xvxhk3qhw79pz91tmv0wn0" target="_blank" rel="noopener noreferrer" tabIndex={isDuplicate ? -1 : undefined} className="yandex-link">Читать на Яндекс.Картах →</a>
                    </div>
                  </div>
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
                  priority
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
                База знаний
              </h2>
              <p className="knowledge-home-sub">
                Практические материалы, которые помогают подготовиться к проекту и избежать переделок
              </p>
            </div>
          </div>

          <div className="knowledge-track-single">
            <Link
              href={`/knowledge/${KNOWLEDGE_ARTICLES[0].slug}`}
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
