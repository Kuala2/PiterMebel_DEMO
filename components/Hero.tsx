import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import CountUp from "@/components/CountUp";
import RotatingWord from "@/components/RotatingWord";
import { SITE_CONFIG } from "@/data/site";

export default function Hero() {
  const ctaRef = useRef<HTMLDivElement>(null);

  // Параллакс: фон героя уезжает медленнее контента при скролле
  useEffect(() => {
    const bg = document.querySelector(".hero-bg-container");
    if (!bg) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        (bg as HTMLElement).style.transform = `translateY(${window.scrollY * 0.22}px)`;
        raf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Magnet: кнопки притягиваются к курсору и отпружинивают назад
  useEffect(() => {
    const root = ctaRef.current;
    if (!root) return;
    const buttons = Array.from(root.querySelectorAll<HTMLElement>(".magnetic"));
    const cleanups: Array<() => void> = [];

    buttons.forEach((btn) => {
      const onMove = (e: MouseEvent) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const cap = (v: number) => Math.max(-10, Math.min(10, v));
        btn.style.transform = `translate(${cap(dx * 0.16)}px, ${cap(dy * 0.3)}px)`;
      };
      const onLeave = () => {
        btn.style.transform = "translate(0, 0)";
      };
      btn.addEventListener("mousemove", onMove);
      btn.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        btn.removeEventListener("mousemove", onMove);
        btn.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  const years = new Date().getFullYear() - SITE_CONFIG.foundedYear;
  const yearsWord =
    years % 10 === 1 && years % 100 !== 11
      ? "год"
      : [2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)
        ? "года"
        : "лет";

  return (
    <div className="hero-section-wrapper">
      {/* 1. Fullscreen Hero Viewport (Always 100vh / 100dvh) */}
      <section className="hero-fullscreen" id="hero">
        {/* Background Image Container */}
        <div className="hero-bg-container">
          <Image
            src="/img/hero/photo_hero_upscaled.jpg"
            alt="Кухни премум Velvet дерево на заказ СПб"
            fill
            priority
            sizes="100vw"
            className="hero-bg-img"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
          <div className="hero-bg-overlay"></div>
        </div>

        {/* Grand Centered Slogan & Action CTA */}
        <div className="hero-center-wrapper">
          <div className="container">
            <div className="hero-center-content">
              <h1 className="hero-slogan-title">Вы мечтаете — мы воплощаем</h1>
              <p className="hero-subtitle">
                Производим и реализуем{" "}
                <RotatingWord
                  words={[
                    "кухни на заказ",
                    "шкафы и гардеробные",
                    "корпусную мебель",
                    "мебель для бизнеса",
                  ]}
                />{" "}
                по индивидуальным размерам на собственном производстве
              </p>
              <div className="hero-cta-wrap" ref={ctaRef}>
                <Link href="/calculator" className="btn btn-green magnetic">
                  Рассчитать проект
                </Link>
                <Link href="/kitchens" className="btn btn-glass magnetic">
                  Смотреть каталог
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Clean Stately Numeric Facts Bar */}
      <section className="hero-stats-strip" id="stats">
        <div className="container">
          <div className="hero-stats-grid">
            <div className="hero-stat-item">
              <div className="stat-num">
                <CountUp to={years} /> <span className="stat-unit">{yearsWord}</span>
              </div>
              <div className="stat-text">
                Опыт работы на мебельном рынке Санкт-Петербурга
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                <CountUp to={1500} /> <span className="stat-unit">+</span>
              </div>
              <div className="stat-text">
                Реализованных проектов мебели под ключ
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                <CountUp to={100} /> <span className="stat-unit">%</span>
              </div>
              <div className="stat-text">
                Собственное производство в СПб (Петергофское ш., 73)
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                0 <span className="stat-unit">₽</span>
              </div>
              <div className="stat-text">
                Схема электрики и розеток в подарок при заказе кухни
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
