import Image from "next/image";
import { SITE_CONFIG } from "@/data/site";

export default function Hero() {
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
          style={{ objectFit: "cover", objectPosition: "center center" }}
        />
        <div className="hero-bg-overlay"></div>
      </div>

      {/* Grand Centered Slogan */}
      <div className="hero-center-wrapper">
        <div className="container">
          <div className="hero-center-content">
            <h1 className="hero-slogan-title">Вы мечтаете — мы воплощаем</h1>
          </div>
        </div>
      </div>

      {/* Clean Stately Bottom Trust Bar (Original Data only, Luxury finish) */}
      <div className="hero-bottom-bar">
        <div className="container">
          <div className="hero-stats-grid">
            <div className="hero-stat-item">
              <div className="stat-num">
                {SITE_CONFIG.foundedYear} <span className="stat-unit">год</span>
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
                Свой <span className="stat-unit">цех</span>
              </div>
              <div className="stat-text">
                Производство на ул. Трефолева
              </div>
            </div>

            <div className="hero-stat-item">
              <div className="stat-num">
                0 <span className="stat-unit">замер</span>
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
