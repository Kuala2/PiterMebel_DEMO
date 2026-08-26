import Image from "next/image";
import Link from "next/link";
import { SITE_CONFIG } from "@/data/site";

export default function Hero() {
  const years = new Date().getFullYear() - SITE_CONFIG.foundedYear;
  const yearsWord =
    years % 10 === 1 && years % 100 !== 11
      ? "год"
      : [2, 3, 4].includes(years % 10) && ![12, 13, 14].includes(years % 100)
        ? "года"
        : "лет";

  return (
    <>
      {/* 1. Fullscreen Hero Viewport (Always 100vh / 100dvh) */}
      <section className="hero-fullscreen" id="hero">
        {/* Background Image Container */}
        <div className="hero-bg-container">
          <Image
            src="/img/hero/photo_hero_upscaled.jpg"
            alt="Кухня матовый Velvet пластик на заказ в СПб"
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
                Проектирование и изготовление премиальных кухонь и корпусной мебели на собственном производстве в Санкт-Петербурге
              </p>
              <div className="hero-cta-wrap">
                <Link href="/calculator" className="btn btn-green">
                  Рассчитать проект
                </Link>
                <Link href="/projects" className="btn btn-glass">
                  Смотреть объекты
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <a href="#stats" className="hero-scroll-indicator" aria-label="Листать вниз">
          <span className="hero-scroll-text">Листайте вниз</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </a>
      </section>

      {/* 2. Clean Stately Numeric Facts Bar */}
      <section className="hero-stats-strip" id="stats">
        <div className="container">
          <div className="hero-stats-grid">
            <div className="hero-stat-item">
              <div className="stat-num">
                {years} <span className="stat-unit">{yearsWord}</span>
              </div>
              <div className="stat-text">
                Опыт работы на мебельном рынке Санкт-Петербурга
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                1 500 <span className="stat-unit">+</span>
              </div>
              <div className="stat-text">
                Реализованных проектов мебели под ключ
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                850 <span className="stat-unit">м²</span>
              </div>
              <div className="stat-text">
                Собственный станочный цех на ул. Трефолева
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                0 <span className="stat-unit">₽</span>
              </div>
              <div className="stat-text">
                Бесплатный выезд мастера с образцами по СПб
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
