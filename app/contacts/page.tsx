import Link from "next/link";
import type { Metadata } from "next";
import MeasureForm from "@/components/MeasureForm";
import VkIcon from "@/components/VkIcon";
import { SITE_CONFIG } from "@/data/site";

export const metadata: Metadata = {
  title: `Контакты студии — ${SITE_CONFIG.name}`,
  description: `Контакты мебельной студии «ПитерМебель» в Санкт-Петербурге: ${SITE_CONFIG.address} (${SITE_CONFIG.metro}). Запись на бесплатный замер и консультацию.`,
};

export default function ContactsPage() {
  return (
    <div>
      {/* 1. Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="subpage-hero-title">Контакты студии «ПитерМебель»</h1>
          <p className="subpage-hero-caption">
            Производство и приём заказов · Пн–Пт с 10:00 до 20:00
          </p>
        </div>
      </section>

      {/* 2. Subtitle Intro Bar (Below Banner) */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc" style={{ marginBottom: 0 }}>
            Свяжитесь с нами удобным для вас способом: отправьте эскиз или проект в сообщество ВКонтакте, запишитесь на бесплатный выездной замер или согласуйте встречу в нашем офисе для выбора материалов.
          </p>
        </div>
      </section>

      {/* 2. Contact Editorial */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "88px", paddingBottom: "88px" }}>
        <div className="container">
          <h2 className="section-title" style={{ marginBottom: "48px" }}>Связаться со студией</h2>

          <div className="contacts-editorial">
            {/* Left: direct contact actions */}
            <div className="contacts-main">
              <div className="contact-block">
                <span className="spec-row-label">Телефон</span>
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="contacts-phone">
                  {SITE_CONFIG.phone}
                </a>
                <p className="contact-block-desc">
                  Елена Волкова — консультация, расчёт стоимости и вызов мастера на замер. Отвечаем с понедельника по пятницу с 10:00 до 20:00.
                </p>
                <a href={`tel:${SITE_CONFIG.phoneRaw}`} className="btn btn-green">
                  Позвонить сейчас
                </a>
              </div>

              <div className="contact-block">
                <h3 className="contact-block-title">Онлайн-оценка по эскизу</h3>
                <p className="contact-block-desc">
                  Пришлите фото понравившейся мебели, схему от руки или размеры стен в сообщество ВКонтакте — сориентируем по стоимости и срокам.
                </p>
                <a
                  href={SITE_CONFIG.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ gap: "10px" }}
                >
                  <VkIcon />
                  Написать в VK
                </a>
              </div>

              <div className="contact-block">
                <h3 className="contact-block-title">Замер с образцами — бесплатно</h3>
                <p className="contact-block-desc">
                  Инженер приедет в удобное время, выполнит лазерный замер стен и привезёт образцы материалов для выбора на месте.
                </p>
                <a href="#measure" className="btn btn-glass">
                  Вызвать мастера на замер
                </a>
              </div>
            </div>

            {/* Right: office & workshop distinction */}
            <aside className="contacts-aside">
              <h3 className="spec-row-label" style={{ marginBottom: "14px" }}>Офис и производство</h3>
              <div>
                <div className="spec-row">
                  <span className="spec-row-label">Офис студии</span>
                  <span className="spec-row-val">{SITE_CONFIG.address}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-row-label">Метро</span>
                  <span className="spec-row-val">{SITE_CONFIG.metro}</span>
                </div>
                <div className="spec-row">
                  <span className="spec-row-label">Производство</span>
                  <span className="spec-row-val">Собственный цех в СПб (закрытая площадка)</span>
                </div>
                <div className="spec-row">
                  <span className="spec-row-label">Режим</span>
                  <span className="spec-row-val">Пн–Пт · 10:00–20:00, по записи</span>
                </div>
              </div>
              <a
                href="https://yandex.ru/maps/?text=Санкт-Петербург+площадь+Стачек+9"
                target="_blank"
                rel="noopener noreferrer"
                className="card-open-link"
                style={{ display: "inline-block", marginTop: "20px" }}
              >
                Маршрут к офису на карте →
              </a>
            </aside>
          </div>
        </div>
      </section>

      {/* 3. Form Section */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <h2 className="final-headline">
                  Запишитесь на замер помещения
                </h2>
                <p className="final-desc">
                  Инженер студии приедет в удобное для вас время с чемоданом образцов материалов (Fenix, эмаль по RAL, шпон дуба, камень), выполнит лазерный замер и проконсультирует по нюансам монтажа.
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
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Запрос со страницы контактов" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
