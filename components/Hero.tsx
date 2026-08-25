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

      {/* Clean Stately Bottom Trust Bar (4 Solid Numeric Facts) */}
      <div className="hero-bottom-bar">
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
      </div>
    </section>
  );
}
